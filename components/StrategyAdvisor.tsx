
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Activity,
  AlertTriangle, 
  ClipboardCheck, 
  Zap,
  Coffee,
  Baby,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Droplets,
  FlaskConical,
  CheckCircle2,
  Info,
  Scale,
  CheckCircle,
  HeartPulse
} from 'lucide-react';
import { CONCENTRATIONS, CALORIES } from '../constants';

const StrategyAdvisor: React.FC = () => {
  const [dol, setDol] = useState<number>(1);
  const [bw, setBw] = useState<number>(1200);
  const [isTerm, setIsTerm] = useState<boolean>(false);
  
  const [targetLiquid, setTargetLiquid] = useState<number>(80);
  const [targetAA, setTargetAA] = useState<number>(2.0);
  const [targetFat, setTargetFat] = useState<number>(1.5);
  const [targetGIR, setTargetGIR] = useState<number>(6.0);
  const [targetNa, setTargetNa] = useState<number>(0);
  const [targetK, setTargetK] = useState<number>(0);

  const [milkVolume, setMilkVolume] = useState<number>(10);
  const [milkType, setMilkType] = useState<keyof typeof CALORIES.MILK>('standard');
  const [otherSubtraction, setOtherSubtraction] = useState<number>(0);

  useEffect(() => {
    if (bw >= 2500) setIsTerm(true);
    else setIsTerm(false);
  }, [bw]);

  // 根据表 4 动态获取推荐范围
  const consensusRanges = useMemo(() => {
    let liq = [60, 90]; 
    if (isTerm) {
      if (dol === 1) liq = [40, 60];
      else if (dol >= 6) liq = [140, 170];
    }

    // 钠、钾范围逻辑 (表 4)
    let na = [0, 3];
    let k = [0, 3];

    if (dol >= 7) { // 稳定生长期
      if (isTerm) { na = [2, 3]; k = [1.5, 3]; }
      else if (bw >= 1500) { na = [3, 5]; k = [1, 3]; }
      else { na = [3, 5]; k = [2, 5]; }
    } else if (dol >= 4) { // 恢复期/过渡期后期
      na = [2, 5]; k = [1, 3];
    } else { // 过渡期初期
      na = [0, 2]; k = [0, 3];
    }

    return { 
      liq, aa: [1.5, 2.5], fat: [1.0, 2.0], gir: [4.0, 12.0], na, k
    };
  }, [dol, bw, isTerm]);

  // 当范围改变时，自动重置电解质目标（可选，通常建议临床手动调节，此处设为范围下限）
  useEffect(() => {
    setTargetNa(prev => Math.max(consensusRanges.na[0], Math.min(consensusRanges.na[1], prev)));
    setTargetK(prev => Math.max(consensusRanges.k[0], Math.min(consensusRanges.k[1], prev)));
  }, [consensusRanges.na, consensusRanges.k]);

  const prescription = useMemo(() => {
    const wKg = bw / 1000;
    const totalVol = targetLiquid * wKg;
    const pnVol = Math.max(0, totalVol - milkVolume - otherSubtraction);
    
    const aaVol = (targetAA * wKg) / CONCENTRATIONS.AA_6_PERCENT;
    const fatVol = (targetFat * wKg) / CONCENTRATIONS.FAT_20_PERCENT;
    
    // 电解质体积自动计算
    const naVol = (targetNa * wKg) / CONCENTRATIONS.NACL_10_PERCENT;
    const kVol = (targetK * wKg) / CONCENTRATIONS.KCL_10_PERCENT; 

    const totalGlucoseGrams = targetGIR * wKg * 1.44;
    // 扣除固定容积 (AA, Fat, Na, K, 以及微量元素/维生素预留空间约 1-2ml/kg)
    const fixedVol = aaVol + fatVol + naVol + kVol + (wKg * 2.0);
    const remainingVol = Math.max(5, pnVol - fixedVol);

    let gs50 = (totalGlucoseGrams - 0.1 * remainingVol) / 0.4;
    let gs10 = remainingVol - gs50;
    if (gs50 < 0) { gs50 = 0; gs10 = remainingVol; }

    const actualGlucoseGrams = (gs10 * 0.1) + (gs50 * 0.5);
    const glucoseConc = (actualGlucoseGrams / pnVol) * 100;
    
    const glucoseOsm = (actualGlucoseGrams / pnVol) * 1000 * 5;
    const aaOsm = (targetAA * wKg / pnVol) * 1000 * 8;
    const electrolyteOsm = (targetNa * wKg + targetK * wKg) * 2 / (pnVol / 1000);
    const osmolarity = glucoseOsm + aaOsm + electrolyteOsm;

    const carbCal = actualGlucoseGrams * CALORIES.GLUCOSE;
    const proteinCal = (targetAA * wKg) * CALORIES.AA;
    const fatCal = (targetFat * wKg) * CALORIES.FAT;
    const enCal = milkVolume * CALORIES.MILK[milkType];
    const totalCalPerKg = (carbCal + proteinCal + fatCal + enCal) / wKg;
    const totalPnCal = carbCal + proteinCal + fatCal || 1;

    const nitrogen = (targetAA * wKg) / 6.25;
    const npc = carbCal + fatCal;
    const cnRatio = nitrogen > 0 ? npc / nitrogen : 0;
    const npcLipidRatio = npc > 0 ? (fatCal / npc) * 100 : 0;

    return {
      pnVol, osmolarity, glucoseConc, gs10, gs50, aaVol, fatVol, naVol, kVol, totalCalPerKg, cnRatio, npcLipidRatio,
      ratios: {
        carb: Math.round((carbCal / totalPnCal) * 100),
        protein: Math.round((proteinCal / totalPnCal) * 100),
        fat: Math.round((fatCal / totalPnCal) * 100)
      }
    };
  }, [bw, dol, targetLiquid, targetAA, targetFat, targetGIR, targetNa, targetK, milkVolume, milkType, otherSubtraction, isTerm]);

  const isHighOsm = prescription.osmolarity > 900;
  const isCnSafe = prescription.cnRatio >= 125 && prescription.cnRatio <= 187.5;
  const isLipidSafe = prescription.npcLipidRatio >= 25 && prescription.npcLipidRatio <= 40;

  const milkLabels = {
    standard: '母乳/标准配方',
    preterm68: '早产儿 68',
    preterm81: '早产儿 81'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20 max-w-7xl mx-auto">
      {/* 顶部决策中心 */}
      <div className={`rounded-[2.5rem] p-10 shadow-xl relative overflow-hidden transition-all duration-700 border border-white/60 ${isHighOsm ? 'bg-rose-50 ring-4 ring-rose-500/10' : 'bg-[#f0f9fa]'}`}>
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <HeartPulse className={`w-10 h-10 ${isHighOsm ? 'text-rose-600' : 'text-cyan-600'}`} />
                <h1 className={`text-4xl font-black tracking-tight ${isHighOsm ? 'text-rose-900' : 'text-slate-800'}`}>临床路径决策系统</h1>
              </div>
              <div className="flex gap-2">
                <span className="bg-white/80 backdrop-blur-md text-cyan-800 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest border border-cyan-200/50 shadow-sm">
                  DOL {dol} • {bw}G
                </span>
                <span className="bg-emerald-500/10 backdrop-blur-md text-emerald-700 text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                  2025 CONSENSUS VALIDATED
                </span>
              </div>
            </div>

            <div className="flex items-center gap-12">
               <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">热氮比 (NPC:N)</p>
                 <div className="flex items-baseline gap-2">
                   <span className={`text-4xl font-black ${isCnSafe ? 'text-slate-800' : 'text-rose-600'}`}>{prescription.cnRatio.toFixed(1)}</span>
                   <span className="text-sm font-medium text-slate-400">:1</span>
                 </div>
               </div>
               <div className="w-px h-12 bg-slate-300/40"></div>
               <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">总热卡供给</p>
                 <div className="flex items-baseline gap-2">
                   <span className="text-5xl font-black text-slate-800">{prescription.totalCalPerKg.toFixed(1)}</span>
                   <span className="text-sm font-medium text-slate-400">kcal/kg</span>
                 </div>
               </div>
               <div className="w-px h-12 bg-slate-300/40"></div>
               <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">建议输液量</p>
                 <div className="flex items-baseline gap-2">
                   <span className={`text-5xl font-black ${isHighOsm ? 'text-rose-600' : 'text-cyan-700'}`}>{prescription.pnVol.toFixed(1)}</span>
                   <span className="text-sm font-medium text-slate-400">ml</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
             <GlassInput label="日龄 (DOL)" value={dol} onChange={setDol} icon={<Calendar className="w-4 h-4" />} />
             <GlassInput label="体重 (BW G)" value={bw} onChange={setBw} icon={<Droplets className="w-4 h-4" />} step={50} />
             <GlassInput label="今日奶量 (ML)" value={milkVolume} onChange={setMilkVolume} icon={<Coffee className="w-4 h-4" />} />
             <GlassInput label="用药扣除 (ML)" value={otherSubtraction} onChange={setOtherSubtraction} icon={<FlaskConical className="w-4 h-4" />} />
             
             <div className="bg-white/90 rounded-2xl p-4 border border-white/80 flex flex-col justify-between shadow-sm">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center mb-2">
                  <Activity className="w-3.5 h-3.5 mr-1.5" />
                  模式/阶段
                </label>
                <div className="flex bg-slate-100 rounded-xl p-1">
                   <button 
                     onClick={() => setIsTerm(false)} 
                     className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all duration-300 ${!isTerm ? 'bg-white text-cyan-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     早产儿
                   </button>
                   <button 
                     onClick={() => setIsTerm(true)} 
                     className={`flex-1 text-[11px] font-bold py-2 rounded-lg transition-all duration-300 ${isTerm ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     足月儿
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-10">
            <div className="flex items-center text-cyan-500 gap-2 mb-2">
              <Zap className="w-5 h-5 fill-cyan-500" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">营养目标调节</h3>
            </div>
            <div className="space-y-10">
              <PathSlider label="液体总量 (ML/KG/D)" value={targetLiquid} onChange={setTargetLiquid} range={consensusRanges.liq} color="text-cyan-700" accent="accent-cyan-600" />
              <PathSlider label="氨基酸 (G/KG/D)" value={targetAA} onChange={setTargetAA} range={consensusRanges.aa} step={0.1} color="text-indigo-600" accent="accent-indigo-500" />
              <PathSlider label="脂肪乳 (G/KG/D)" value={targetFat} onChange={setTargetFat} range={consensusRanges.fat} step={0.1} color="text-emerald-600" accent="accent-emerald-500" />
              <PathSlider label="糖速 GIR (MG/KG/MIN)" value={targetGIR} onChange={setTargetGIR} range={consensusRanges.gir} step={0.1} color="text-amber-600" accent="accent-amber-500" />
              
              <div className="pt-6 border-t border-slate-50 space-y-10">
                 <PathSlider label="钠 (Na) 目标 (MMOL/KG)" value={targetNa} onChange={setTargetNa} range={consensusRanges.na} step={0.1} color="text-slate-600" accent="accent-slate-500" />
                 <PathSlider label="钾 (K) 目标 (MMOL/KG)" value={targetK} onChange={setTargetK} range={consensusRanges.k} step={0.1} color="text-slate-600" accent="accent-slate-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-400">肠内配置</h3>
              <span className="bg-slate-100 text-slate-500 text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">EN Profile</span>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-8 text-center transition-all hover:shadow-inner">
              <p className="text-xl font-black text-slate-800 tracking-tight">
                {milkLabels[milkType]} ({CALORIES.MILK[milkType]} kcal/ml)
              </p>
            </div>
            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">选择奶液类型</label>
               <select 
                value={milkType} 
                onChange={(e) => setMilkType(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-cyan-500 transition-all cursor-pointer shadow-sm"
               >
                 <option value="standard">母乳/标准配方</option>
                 <option value="preterm68">早产儿 68</option>
                 <option value="preterm81">早产儿 81</option>
               </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-10">
                 <h4 className="text-xs font-bold text-slate-400 tracking-widest uppercase">静脉热量构成</h4>
                 <div className="space-y-10">
                    <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
                      <div className="h-full bg-amber-400 transition-all duration-700" style={{ width: `${prescription.ratios.carb}%` }}></div>
                      <div className="h-full bg-cyan-600 transition-all duration-700" style={{ width: `${prescription.ratios.protein}%` }}></div>
                      <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${prescription.ratios.fat}%` }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                       <div className="space-y-2">
                          <div className="flex items-center gap-2">
                             <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                             <span className="text-[11px] font-bold text-slate-400">糖类</span>
                          </div>
                          <p className="text-2xl font-black text-slate-800">{prescription.ratios.carb}%</p>
                       </div>
                       <div className="space-y-2 text-center">
                          <div className="flex items-center gap-2 justify-center">
                             <div className="w-2.5 h-2.5 rounded-full bg-cyan-600"></div>
                             <span className="text-[11px] font-bold text-slate-400">蛋白</span>
                          </div>
                          <p className="text-2xl font-black text-slate-800">{prescription.ratios.protein}%</p>
                       </div>
                       <div className="space-y-2 text-right">
                          <div className="flex items-center gap-2 justify-end">
                             <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                             <span className="text-[11px] font-bold text-slate-400">脂肪</span>
                          </div>
                          <p className="text-2xl font-black text-slate-800">{prescription.ratios.fat}%</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className={`rounded-[2.5rem] p-8 shadow-xl flex items-center gap-8 relative overflow-hidden group border border-white/60 ${isHighOsm ? 'bg-rose-50 ring-4 ring-rose-500/10' : 'bg-[#f0f9fa]'}`}>
                 <div className={`p-5 rounded-[1.75rem] transition-all duration-700 flex-shrink-0 ${isHighOsm ? 'bg-rose-500 text-white shadow-lg' : 'bg-white shadow-md text-cyan-700'}`}>
                    {isHighOsm ? <AlertTriangle className="w-12 h-12" /> : <CheckCircle className="w-12 h-12" />}
                 </div>
                 <div className="space-y-2 relative z-10">
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">输注途径推荐</h4>
                    <p className={`text-4xl font-black tracking-tight ${isHighOsm ? 'text-rose-900' : 'text-slate-800'}`}>
                       {isHighOsm ? '中心静脉' : '外周静脉'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">基准 900 mOsm/L</p>
                 </div>
              </div>
           </div>

           <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
             <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-white">
               <div className="flex items-center gap-3">
                 <div className="bg-cyan-50 p-2.5 rounded-2xl text-cyan-600 shadow-sm"><ClipboardCheck className="w-6 h-6" /></div>
                 <h3 className="font-black text-slate-800 text-xl tracking-tight">配方执行细节 (含联动监测)</h3>
               </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm">
                 <thead>
                   <tr className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-50/50 border-b border-slate-50">
                     <th className="px-10 py-6 text-left font-medium">组分 Component</th>
                     <th className="px-10 py-6 text-center font-medium">目标/实测 Target/Actual</th>
                     <th className="px-10 py-6 text-right font-medium">建议用量 (ML) Volume</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-50">
                   <TableDetailRow label="10% 葡萄糖 (GS)" current={targetGIR} range={consensusRanges.gir} value={prescription.gs10} unit="mg/kg/min" />
                   <TableDetailRow label="50% 葡萄糖 (GS)" current={prescription.glucoseConc} range={[0, 12.5]} value={prescription.gs50} unit="%" />
                   <TableDetailRow label="6% 氨基酸 (AA)" current={targetAA} range={consensusRanges.aa} value={prescription.aaVol} unit="g/kg" />
                   <TableDetailRow label="20% 脂肪乳 (Lipid)" current={targetFat} range={consensusRanges.fat} value={prescription.fatVol} unit="g/kg" />
                   <TableDetailRow label="10% 氯化钠 (NaCl)" current={targetNa} range={consensusRanges.na} value={prescription.naVol} unit="mmol/kg" />
                   <TableDetailRow label="10% 氯化钾 (KCl)" current={targetK} range={consensusRanges.k} value={prescription.kVol} unit="mmol/kg" />
                 </tbody>
                 <tfoot>
                   <tr className="bg-slate-50/40">
                     <td className="px-10 py-10 font-black text-slate-800 text-2xl">静脉液量合计</td>
                     <td className="px-10 py-10 text-center text-[12px] font-bold text-slate-500 uppercase tracking-widest">目标: {targetLiquid} ml/kg/d</td>
                     <td className="px-10 py-10 text-right font-mono font-black text-cyan-700 text-3xl">
                       {prescription.pnVol.toFixed(1)} <span className="text-sm font-bold opacity-50">ml</span>
                     </td>
                   </tr>
                 </tfoot>
               </table>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const GlassInput: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon: React.ReactNode;
  step?: number;
}> = ({ label, value, onChange, icon, step = 1 }) => (
  <div className="bg-white rounded-2xl p-4 border border-slate-100 space-y-2 transition-all hover:bg-slate-50 group shadow-sm">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center transition-colors group-hover:text-slate-600">
      {icon}
      <span className="ml-2">{label}</span>
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      step={step}
      className="w-full bg-transparent border-none p-0 text-2xl font-black text-slate-800 outline-none focus:ring-0 placeholder-slate-300"
    />
  </div>
);

const PathSlider: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  range: number[];
  step?: number;
  color?: string;
  accent?: string;
}> = ({ label, value, onChange, range, step = 1, color = 'text-cyan-700', accent = 'accent-cyan-600' }) => (
  <div className="space-y-5">
    <div className="flex justify-between items-center">
      <label className="text-[11px] font-black text-slate-600 uppercase tracking-widest">{label}</label>
      <span className={`text-xl font-black ${color}`}>{value}</span>
    </div>
    <input
      type="range"
      min={range[0]}
      max={range[1]}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer transition-all ${accent}`}
    />
    <div className="flex justify-between text-[10px] font-bold text-slate-300 uppercase tracking-widest">
      <span>MIN {range[0]}</span>
      <span>MAX {range[1]}</span>
    </div>
  </div>
);

const TableDetailRow: React.FC<{
  label: string;
  current: number;
  range: number[];
  value: number;
  unit: string;
}> = ({ label, current, range, value, unit }) => {
  const isOutOfRange = current < range[0] || current > range[1];
  return (
    <tr className="group hover:bg-slate-50/80 transition-all">
      <td className="px-10 py-7">
        <p className="font-black text-slate-800 text-base">{label}</p>
        <p className={`text-[11px] font-bold mt-1 ${isOutOfRange ? 'text-rose-500' : 'text-slate-500'}`}>
          设定: {current.toFixed(1)} {unit}
        </p>
      </td>
      <td className="px-10 py-7 text-center">
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tight transition-all border ${isOutOfRange ? 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>
          建议: {range[0]} ~ {range[1]} {unit}
        </span>
      </td>
      <td className="px-10 py-7 text-right">
        <p className="font-mono font-black text-slate-800 text-xl tracking-tighter">{value.toFixed(1)}</p>
      </td>
    </tr>
  );
};

export default StrategyAdvisor;

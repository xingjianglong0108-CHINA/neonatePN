
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  ChevronRight, 
  AlertTriangle, 
  ClipboardCheck, 
  ArrowUpCircle,
  Clock,
  Droplets,
  Table as TableIcon,
  FlaskConical,
  Activity,
  AlertCircle,
  CheckCircle2,
  Zap,
  Coffee,
  Info
} from 'lucide-react';
import { CONCENTRATIONS, CALORIES } from '../constants';

const StrategyAdvisor: React.FC = () => {
  // Core Parameters
  const [dol, setDol] = useState<number>(1);
  const [bw, setBw] = useState<number>(1200);
  
  // Dynamic Targets (Adjustable Ranges)
  const [targetLiquid, setTargetLiquid] = useState<number>(80);
  const [targetAA, setTargetAA] = useState<number>(2.0);
  const [targetFat, setTargetFat] = useState<number>(1.5);
  const [targetGIR, setTargetGIR] = useState<number>(6.0);

  // EN & Subtractions
  const [milkVolume, setMilkVolume] = useState<number>(10);
  const [milkType, setMilkType] = useState<keyof typeof CALORIES.MILK>('standard');
  const [otherSubtraction, setOtherSubtraction] = useState<number>(0);

  // 1. Calculate Consensus Ranges based on BW and DOL
  const consensusRanges = useMemo(() => {
    // Liquid (Table 2)
    let liq = [60, 80];
    if (bw < 1000) {
      if (dol === 1) liq = [60, 100];
      else if (dol === 2) liq = [80, 120];
      else if (dol === 3) liq = [100, 140];
      else if (dol <= 5) liq = [120, 160];
      else liq = [140, 160];
    } else if (bw < 1500) {
      if (dol === 1) liq = [60, 90];
      else if (dol === 2) liq = [80, 110];
      else if (dol === 3) liq = [100, 130];
      else if (dol <= 5) liq = [120, 150];
      else liq = [140, 160];
    } else {
      if (dol === 1) liq = [60, 80];
      else if (dol === 2) liq = [80, 100];
      else if (dol === 3) liq = [100, 120];
      else if (dol <= 5) liq = [120, 140];
      else liq = [140, 160];
    }

    // AA (Table 5)
    const aaStart = [1.5, 2.5];
    const aaMax = [3.5, 4.0];
    const aaRange = [aaStart[0], Math.min(aaMax[1], aaStart[1] + (dol - 1) * 1.5)];

    // Fat (Table 6)
    const fatStart = [1.0, 2.0];
    const fatMax = [3.0, 4.0];
    const fatRange = [fatStart[0], Math.min(fatMax[1], fatStart[1] + (dol - 1) * 1.0)];

    // GIR (Table 4)
    const girRange = [4, 12];

    return { liq, aa: aaRange, fat: fatRange, gir: girRange };
  }, [dol, bw]);

  // Sync targets when ranges shift
  useEffect(() => {
    setTargetLiquid(prev => Math.max(consensusRanges.liq[0], Math.min(consensusRanges.liq[1], prev)));
    setTargetAA(prev => Math.max(consensusRanges.aa[0], Math.min(consensusRanges.aa[1], prev)));
    setTargetFat(prev => Math.max(consensusRanges.fat[0], Math.min(consensusRanges.fat[1], prev)));
  }, [consensusRanges]);

  // 2. Prescription Logic
  const prescription = useMemo(() => {
    const wKg = bw / 1000;
    const totalVol = targetLiquid * wKg;
    const pnVol = Math.max(0, totalVol - milkVolume - otherSubtraction);
    
    const aaVol = (targetAA * wKg) / CONCENTRATIONS.AA_6_PERCENT;
    const fatVol = (targetFat * wKg) / CONCENTRATIONS.FAT_20_PERCENT;
    const naMmol = 3 * wKg;
    const kMmol = dol > 2 ? 1.5 * wKg : 0;
    const naVol = naMmol / CONCENTRATIONS.NACL_10_PERCENT; 
    const kVol = kMmol / CONCENTRATIONS.KCL_10_PERCENT;
    const traceVol = 1.0 * wKg;
    const pediatricMultiVit = 1.0 * wKg;

    const fixedVol = aaVol + fatVol + naVol + kVol + traceVol + pediatricMultiVit;
    const remainingVol = pnVol - fixedVol;
    const totalGlucoseGrams = targetGIR * wKg * 1.44;

    let gs50 = (totalGlucoseGrams - 0.1 * remainingVol) / 0.4;
    let gs10 = remainingVol - gs50;

    if (gs50 < 0) { gs50 = 0; gs10 = Math.max(0, remainingVol); }
    if (gs10 < 0) { gs10 = 0; gs50 = Math.max(0, remainingVol); }

    const flowRate = pnVol / 24;
    const actualGlucoseGrams = (gs10 * 0.1) + (gs50 * 0.5);
    const glucoseConc = (actualGlucoseGrams / pnVol) * 100;

    const pnGlucoseCal = actualGlucoseGrams * CALORIES.GLUCOSE;
    const pnProteinCal = (targetAA * wKg) * CALORIES.AA;
    const pnFatCal = (targetFat * wKg) * CALORIES.FAT;
    const pnTotalCal = pnGlucoseCal + pnProteinCal + pnFatCal;
    const enCal = milkVolume * CALORIES.MILK[milkType];
    const totalCalPerKg = (pnTotalCal + enCal) / wKg;

    const glucoseContribution = (actualGlucoseGrams / pnVol) * 1000 * 5;
    const aaContribution = (targetAA * wKg / pnVol) * 1000 * 8;
    const electrolyteContribution = (naMmol + kMmol) * 2 / (pnVol / 1000);
    const osmolarity = glucoseContribution + aaContribution + electrolyteContribution;

    return {
      totalVol, pnVol, flowRate, glucoseConc, osmolarity,
      gs10, gs50, aaVol, fatVol, naVol, kVol, traceVol, pediatricMultiVit,
      totalCalPerKg,
      ratios: {
        glucose: (pnGlucoseCal / pnTotalCal) * 100,
        protein: (pnProteinCal / pnTotalCal) * 100,
        fat: (pnFatCal / pnTotalCal) * 100
      },
      safety: {
        isOsmHigh: osmolarity > 900,
        isConcHigh: glucoseConc > 12.5,
        totalLiqPerKg: totalVol / wKg
      }
    };
  }, [bw, dol, targetLiquid, targetAA, targetFat, targetGIR, milkVolume, milkType, otherSubtraction]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Header & Main Info */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Stethoscope className="w-64 h-64" />
        </div>
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
            <div>
              <h2 className="text-3xl font-black mb-2 flex items-center tracking-tight">
                <Activity className="w-8 h-8 mr-3 text-indigo-400" />
                临床路径决策系统
              </h2>
              <div className="flex flex-wrap gap-3">
                <span className="px-3 py-1 bg-indigo-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-300 border border-indigo-500/30">
                  DOL {dol} • {bw}g
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest text-emerald-300 border border-emerald-500/30">
                  2025 Consensus Validated
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">总热卡供给</p>
                <p className="text-4xl font-black text-white">{prescription.totalCalPerKg.toFixed(1)} <small className="text-sm font-normal opacity-50">kcal/kg</small></p>
              </div>
              <div className="w-px h-12 bg-white/10 hidden md:block mx-2"></div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">建议输液量</p>
                <p className="text-4xl font-black text-indigo-400">{prescription.pnVol.toFixed(1)} <small className="text-sm font-normal opacity-50 text-white">ml</small></p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <QuickInput label="日龄 (DOL)" value={dol} onChange={setDol} min={1} max={30} icon={<Calendar className="w-4 h-4"/>} />
            <QuickInput label="体重 (BW g)" value={bw} onChange={setBw} min={400} max={6000} step={50} icon={<Droplets className="w-4 h-4"/>} />
            <QuickInput label="今日奶量 (ml)" value={milkVolume} onChange={setMilkVolume} min={0} max={500} icon={<Coffee className="w-4 h-4"/>} />
            <QuickInput label="用药扣除 (ml)" value={otherSubtraction} onChange={setOtherSubtraction} min={0} max={200} icon={<FlaskConical className="w-4 h-4"/>} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Interactive Target Sliders */}
        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
              <Zap className="w-4 h-4 mr-2 text-indigo-500" />
              营养目标调节
            </h3>
            
            <div className="space-y-8">
              <RangeSlider label="液体总量 (ml/kg/d)" value={targetLiquid} onChange={setTargetLiquid} range={consensusRanges.liq} step={1} color="indigo" />
              <RangeSlider label="氨基酸 (g/kg/d)" value={targetAA} onChange={setTargetAA} range={consensusRanges.aa} step={0.1} color="blue" />
              <RangeSlider label="脂肪乳 (g/kg/d)" value={targetFat} onChange={setTargetFat} range={consensusRanges.fat} step={0.1} color="emerald" />
              <RangeSlider label="糖速 GIR (mg/kg/min)" value={targetGIR} onChange={setTargetGIR} range={consensusRanges.gir} step={0.1} color="amber" />
            </div>
          </section>

          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">肠内配置</h3>
              <Badge label={milkType === 'standard' ? '普通' : milkType === 'preterm68' ? '早产68' : '早产81'} color="bg-slate-100 text-slate-600" />
            </div>
            <select 
              value={milkType} 
              onChange={(e) => setMilkType(e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
            >
              <option value="standard">母乳/标准配方 (0.67 kcal/ml)</option>
              <option value="preterm68">早产儿配方 (0.68 kcal/ml)</option>
              <option value="preterm81">强化/高热卡配方 (0.81 kcal/ml)</option>
            </select>
          </div>
        </div>

        {/* Right: Results & Safety */}
        <div className="lg:col-span-7 space-y-6">
          {/* Safety Alerts */}
          {(prescription.safety.isOsmHigh || prescription.safety.isConcHigh) && (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex items-start space-x-4 animate-in slide-in-from-top-2">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h4 className="font-black text-rose-900 mb-1">临床安全警告</h4>
                <ul className="space-y-1">
                  {prescription.safety.isOsmHigh && <li className="text-xs text-rose-700 font-medium">• 渗透压 {prescription.osmolarity.toFixed(0)} mOsm/L &gt; 900：建议中心静脉通路。</li>}
                  {prescription.safety.isConcHigh && <li className="text-xs text-rose-700 font-medium">• 糖浓度 {prescription.glucoseConc.toFixed(1)}% &gt; 12.5%：禁止外周静脉输注。</li>}
                </ul>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-bold text-slate-700 flex items-center">
                <ClipboardCheck className="w-5 h-5 mr-2 text-indigo-600" />
                配方执行细节 (含剂量范围对比)
              </h4>
              <div className="flex gap-2">
                <Badge label={`液速: ${prescription.flowRate.toFixed(1)} ml/h`} color="bg-indigo-50 text-indigo-700" />
                <Badge label={`Osm: ${prescription.osmolarity.toFixed(0)}`} color={prescription.safety.isOsmHigh ? "bg-rose-100 text-rose-700" : "bg-emerald-50 text-emerald-700"} />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-100/30 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4 text-left">组分</th>
                    <th className="px-6 py-4 text-center">对应剂量范围</th>
                    <th className="px-6 py-4 text-right">建议用量 (ml)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  <ExecutionRow 
                    label="10% 葡萄糖 (GS)" 
                    value={prescription.gs10} 
                    currentDose={targetGIR} 
                    unit="mg/kg/min" 
                    range={consensusRanges.gir} 
                  />
                  <ExecutionRow 
                    label="50% 葡萄糖 (GS)" 
                    value={prescription.gs50} 
                    currentDose={prescription.glucoseConc} 
                    unit="%" 
                    range={[0, 12.5]} 
                    warning={prescription.safety.isConcHigh}
                  />
                  <ExecutionRow 
                    label="6% 氨基酸 (AA)" 
                    value={prescription.aaVol} 
                    currentDose={targetAA} 
                    unit="g/kg" 
                    range={consensusRanges.aa} 
                  />
                  <ExecutionRow 
                    label="20% 脂肪乳 (Lipid)" 
                    value={prescription.fatVol} 
                    currentDose={targetFat} 
                    unit="g/kg" 
                    range={consensusRanges.fat} 
                  />
                  <ExecutionRow label="10% 氯化钠 (NaCl)" value={prescription.naVol} currentDose={3.0} unit="mmol/kg" range={[2, 4]} />
                  <ExecutionRow label="10% 氯化钾 (KCl)" value={prescription.kVol} currentDose={dol > 2 ? 1.5 : 0} unit="mmol/kg" range={[0, 2]} />
                  <tr className="bg-slate-50/80 font-black">
                    <td className="px-6 py-5 text-slate-900">静脉液量合计</td>
                    <td className="px-6 py-5 text-center text-slate-400 text-[10px]">
                      目标: {targetLiquid} ml/kg (范围: {consensusRanges.liq[0]}-{consensusRanges.liq[1]})
                    </td>
                    <td className="px-6 py-5 text-right text-indigo-600 font-mono">{prescription.pnVol.toFixed(1)} ml</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">静脉热量构成</h4>
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex mb-4 shadow-inner">
                <div className="bg-amber-400 transition-all duration-500" style={{ width: `${prescription.ratios.glucose}%` }}></div>
                <div className="bg-blue-500 transition-all duration-500" style={{ width: `${prescription.ratios.protein}%` }}></div>
                <div className="bg-emerald-500 transition-all duration-500" style={{ width: `${prescription.ratios.fat}%` }}></div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <RatioLegend label="糖类" val={prescription.ratios.glucose} color="bg-amber-400" />
                <RatioLegend label="蛋白" val={prescription.ratios.protein} color="bg-blue-500" />
                <RatioLegend label="脂肪" val={prescription.ratios.fat} color="bg-emerald-500" />
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl flex flex-col justify-between">
              <div>
                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">输注途径推荐</h4>
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${prescription.safety.isOsmHigh ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {prescription.safety.isOsmHigh ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="text-xl font-black">{prescription.safety.isOsmHigh ? '中心静脉' : '外周/中心'}</p>
                    <p className="text-[10px] text-slate-500 font-medium">基准 900 mOsm/L</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-components ---

const QuickInput: React.FC<{ label: string, value: number, onChange: (n: number) => void, min: number, max: number, step?: number, icon: React.ReactNode }> = ({ label, value, onChange, min, max, step = 1, icon }) => (
  <div className="bg-white/10 rounded-2xl p-4 border border-white/10 shadow-sm transition-all hover:bg-white/15">
    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center mb-2">
      <span className="mr-1.5 opacity-60">{icon}</span>
      {label}
    </label>
    <input 
      type="number" 
      value={value === 0 ? '' : value}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
        onChange(Math.max(0, Math.min(max, val)));
      }}
      className="w-full bg-transparent border-none text-xl font-black focus:outline-none text-white selection:bg-indigo-500"
    />
  </div>
);

const RangeSlider: React.FC<{ label: string, value: number, onChange: (n: number) => void, range: number[], step: number, color: string }> = ({ label, value, onChange, range, step, color }) => {
  const isOutOfRange = value < range[0] || value > range[1];
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{label}</label>
          <div className="flex items-center mt-1 text-[10px] text-slate-400 font-medium">
            共识建议: <span className="text-slate-700 ml-1 font-bold">{range[0]} ~ {range[1]}</span>
          </div>
        </div>
        <div className="text-right">
          <span className={`text-lg font-black ${isOutOfRange ? 'text-rose-600 animate-pulse' : `text-${color}-600`}`}>{value}</span>
        </div>
      </div>
      <input 
        type="range" 
        min={Math.max(0, range[0] - (range[1]-range[0]))} 
        max={range[1] + (range[1]-range[0])} 
        step={step} 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
      />
    </div>
  );
};

const ExecutionRow: React.FC<{ 
  label: string, 
  value: number, 
  currentDose: number, 
  unit: string, 
  range: number[], 
  warning?: boolean 
}> = ({ label, value, currentDose, unit, range, warning }) => {
  const isOk = currentDose >= range[0] && currentDose <= range[1];
  const percent = Math.min(100, Math.max(0, ((currentDose - range[0]) / (range[1] - range[0])) * 100));

  return (
    <tr className={`${warning || !isOk ? 'bg-rose-50/30' : 'hover:bg-slate-50/50'} transition-all group`}>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          {(!isOk || warning) ? <AlertTriangle className="w-3 h-3 text-rose-500" /> : <CheckCircle2 className="w-3 h-3 text-emerald-400 opacity-0 group-hover:opacity-100" />}
          <span className={`font-bold ${warning || !isOk ? 'text-rose-700' : 'text-slate-700'}`}>{label}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-2 mb-1">
            <span className={`text-[11px] font-black ${isOk ? 'text-slate-600' : 'text-rose-600'}`}>{currentDose.toFixed(1)} <small className="font-normal opacity-60">{unit}</small></span>
            <span className="text-[10px] text-slate-300 font-medium italic">[{range[0]}-{range[1]}]</span>
          </div>
          <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden relative">
            <div 
              className={`h-full transition-all duration-700 ${isOk ? 'bg-indigo-400' : 'bg-rose-400'}`} 
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </td>
      <td className={`px-6 py-4 text-right font-mono font-bold ${warning || !isOk ? 'text-rose-600' : 'text-slate-800'}`}>
        {value.toFixed(1)} ml
      </td>
    </tr>
  );
};

const Badge: React.FC<{ label: string, color: string }> = ({ label, color }) => (
  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${color}`}>
    {label}
  </span>
);

const RatioLegend: React.FC<{ label: string, val: number, color: string }> = ({ label, val, color }) => (
  <div className="flex flex-col">
    <div className="flex items-center text-[10px] font-bold text-slate-400 mb-1 uppercase">
      <span className={`w-2 h-2 rounded-full mr-1.5 ${color}`}></span>
      {label}
    </div>
    <span className="text-sm font-black text-slate-700">{val.toFixed(0)}%</span>
  </div>
);

export default StrategyAdvisor;


import React, { useState, useEffect, useMemo } from 'react';
import { PNInputs } from '../types';
import { calculatePN, getConsensusRanges } from '../services/calculatorService';
import { CALORIES } from '../constants';
import { RefreshCw, LayoutGrid, List, Calendar, Droplets, Baby, Zap, Activity, AlertTriangle, Scale } from 'lucide-react';

const CalculatorAdvanced: React.FC = () => {
  const [dol, setDol] = useState<number>(1);
  const [birthWeight, setBirthWeight] = useState<number>(1200);
  const [weight, setWeight] = useState(1.23);
  const [liquidPerKg, setLiquidPerKg] = useState(75);
  const [gir, setGir] = useState(6);
  const [aaTarget, setAaTarget] = useState(2.0);
  const [fatTarget, setFatTarget] = useState(1.5);
  const [naTarget, setNaTarget] = useState(0);
  const [kTarget, setKTarget] = useState(0);

  const [milkVol, setMilkVol] = useState(10);
  const [milkType, setMilkType] = useState<keyof typeof CALORIES.MILK>('standard');
  const [dopamineLiquid, setDopamineLiquid] = useState(0);

  const isTerm = birthWeight >= 2500;
  const ranges = useMemo(() => getConsensusRanges(dol, birthWeight, isTerm), [dol, birthWeight, isTerm]);

  // 同步范围
  useEffect(() => {
    setLiquidPerKg(Math.max(ranges.liq[0], Math.min(ranges.liq[1], liquidPerKg)));
    setGir(ranges.gir[0]);
    if (dol > 2) { setNaTarget(ranges.na[0] || 2.0); setKTarget(ranges.k[0] || 1.5); }
    else { setNaTarget(0); setKTarget(0); }
  }, [ranges]);

  const results = useMemo(() => {
    const inputs: PNInputs = {
      dol, birthWeight, weight, totalLiquidTarget: liquidPerKg,
      gir, aaTarget, fatTarget, naTarget, kTarget,
      subtractionFluid: milkVol + dopamineLiquid
    };
    return calculatePN(inputs);
  }, [dol, birthWeight, weight, liquidPerKg, gir, aaTarget, fatTarget, naTarget, kTarget, milkVol, dopamineLiquid]);

  const enCal = milkVol * CALORIES.MILK[milkType];
  const totalCal = results ? (results.totalCalories * weight + enCal) / weight : 0;
  const isHighOsm = results.osmolarity > 900;
  const isCnRatioSafe = results.cnRatio >= 125 && results.cnRatio <= 187.5;
  const isLipidNpcSafe = results.npcLipidRatio >= 25 && results.npcLipidRatio <= 40;

  return (
    <div className="animate-in fade-in duration-700 pb-20">
      <header className="flex items-center justify-between mb-8 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center">
            <Activity className="w-8 h-8 mr-3 text-indigo-600" />
            精细评估与跨度核验
          </h2>
          <p className="text-slate-500 text-sm mt-1">深度支持肠内/肠外协同评估，实时监测共识符合度</p>
        </div>
        <button onClick={() => window.location.reload()} className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all hover:shadow-md">
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Inputs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
              <Baby className="w-4 h-4 mr-2 text-indigo-500" />
              患儿核心参数 ({isTerm ? '足月' : '早产'})
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputBox label="日龄 (DOL)" value={dol} onChange={setDol} icon={<Calendar className="w-3 h-3" />} />
              <InputBox label="出生体重 (g)" value={birthWeight} onChange={setBirthWeight} icon={<Droplets className="w-3 h-3" />} />
              <div className="col-span-2">
                <InputBox label="目前体重 (kg)" value={weight} onChange={setWeight} step={0.01} />
              </div>
            </div>
            
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <RangeInput label="总液体量目标" value={liquidPerKg} onChange={setLiquidPerKg} range={ranges.liq} limits={[40, 160]} unit="ml/kg" />
              <RangeInput label="氨基酸目标" value={aaTarget} onChange={setAaTarget} range={ranges.aa} unit="g/kg" step={0.1} />
              <RangeInput label="脂肪乳目标" value={fatTarget} onChange={setFatTarget} range={ranges.fat} unit="g/kg" step={0.1} />
              <RangeInput label="糖速 GIR" value={gir} onChange={setGir} range={ranges.gir} unit="mg/kg/min" step={0.1} />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center">
              <LayoutGrid className="w-4 h-4 mr-2 text-indigo-500" />
              肠内补充 & 泵入扣除
            </h3>
            <InputBox label="今日泵奶总量 (ml)" value={milkVol} onChange={setMilkVol} />
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase">奶液热卡密度</label>
              <select value={milkType} onChange={(e) => setMilkType(e.target.value as any)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="standard">母乳/标准 (0.67 kcal/ml)</option>
                <option value="preterm68">早产儿 68 (0.68 kcal/ml)</option>
                <option value="preterm81">早产儿 81 (0.81 kcal/ml)</option>
              </select>
            </div>
            <InputBox label="血管活性药等扣除 (ml)" value={dopamineLiquid} onChange={setDopamineLiquid} />
          </div>
        </div>

        {/* Main Display Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className={`p-10 transition-colors duration-700 ${isHighOsm ? 'bg-rose-50 border-b border-rose-100' : 'bg-gradient-to-br from-blue-50/80 to-indigo-100/80 border-b border-indigo-100'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <p className="text-slate-400 text-xs font-black mb-2 uppercase tracking-[0.2em]">综合热卡供给 (含 EN+PN)</p>
                  <h3 className="text-6xl font-black tracking-tight text-slate-800">{totalCal.toFixed(1)} <span className="text-2xl font-normal opacity-50 ml-1">kcal/kg</span></h3>
                </div>
                <div className={`p-4 rounded-3xl border backdrop-blur-md transition-all duration-500 ${isHighOsm ? 'bg-rose-500/10 border-rose-500 ring-4 ring-rose-500/10' : 'bg-white/60 border-indigo-200'}`}>
                  <p className={`text-[10px] font-black mb-1 uppercase tracking-widest ${isHighOsm ? 'text-rose-600' : 'text-slate-400'}`}>安全阈值监测</p>
                  <div className="flex gap-4">
                    <div>
                      <div className="flex items-center">
                        <span className="text-[10px] block opacity-60 text-slate-500">渗透压</span>
                        {isHighOsm && <AlertTriangle className="w-2.5 h-2.5 ml-1 text-rose-600" />}
                      </div>
                      <span className={`text-lg font-black ${isHighOsm ? 'text-rose-600' : 'text-emerald-600'}`}>{results.osmolarity.toFixed(0)}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-200"></div>
                    <div>
                      <span className="text-[10px] block opacity-60 text-slate-500">糖浓度</span>
                      <span className={`text-lg font-black ${results.glucoseConcentration > 12.5 ? 'text-amber-600' : 'text-emerald-600'}`}>{results.glucoseConcentration.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-10 grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-slate-100">
              <StatItem label="静脉液速" value={results?.flowRate.toFixed(1)} unit="ml/h" color="text-indigo-600" />
              <StatItem label="热氮比 (NPC:N)" value={results?.cnRatio.toFixed(1)} unit=":1" color={isCnRatioSafe ? "text-emerald-600" : "text-rose-600"} />
              <StatItem label="脂质占比 (NPC)" value={results?.npcLipidRatio.toFixed(0)} unit="%" color={isLipidNpcSafe ? "text-emerald-600" : "text-rose-600"} />
              <StatItem label="糖浓度" value={results?.glucoseConcentration.toFixed(1)} unit="%" color={results.glucoseConcentration > 12.5 ? "text-amber-600" : "text-slate-700"} />
            </div>

            <div className="p-10 grid grid-cols-2 md:grid-cols-3 gap-12 border-b border-slate-100 bg-slate-50/20">
              <StatItem label="10% GS" value={results?.gs10.toFixed(1)} unit="ml" color="text-amber-600" />
              <StatItem label="50% GS" value={results?.gs50.toFixed(1)} unit="ml" color="text-amber-700" />
              <StatItem label="6% 氨基酸" value={results?.aaVol.toFixed(1)} unit="ml" color="text-blue-600" />
              <StatItem label="20% 脂肪乳" value={results?.fatVol.toFixed(1)} unit="ml" color="text-emerald-600" />
              <StatItem label="钠/钾总量" value={`${results?.naVol.toFixed(1)}/${results?.kVol.toFixed(1)}`} unit="ml" color="text-slate-700" />
            </div>

            <div className="p-10 bg-slate-50/50 space-y-6">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">静脉能量构成</h4>
               <div className="h-6 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div className="h-full bg-amber-400 transition-all duration-700" style={{ width: `${results.calorieRatios.carb}%` }}></div>
                  <div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${results.calorieRatios.protein}%` }}></div>
                  <div className="h-full bg-emerald-500 transition-all duration-700" style={{ width: `${results.calorieRatios.fat}%` }}></div>
               </div>
               <div className="flex justify-between items-center pt-2">
                  <LegendItem color="bg-amber-400" label="糖类" val={results.calorieRatios.carb} />
                  <LegendItem color="bg-indigo-500" label="蛋白" val={results.calorieRatios.protein} />
                  <LegendItem color="bg-emerald-500" label="脂肪" val={results.calorieRatios.fat} />
               </div>
            </div>
          </div>
          <div className={`mt-8 border-t pt-8 flex items-start gap-4 ${isHighOsm ? 'text-rose-600' : 'text-slate-500'}`}>
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isHighOsm ? 'text-rose-600' : 'text-amber-500'}`} />
            <div className="text-xs leading-relaxed">
              <p className="font-bold mb-1">共识核验提醒：</p>
              <p>当前糖浓度 {results.glucoseConcentration.toFixed(1)}% ({results.glucoseConcentration > 12.5 ? '经中心静脉' : '可外周静脉'})。渗透压 {results.osmolarity.toFixed(0)} mOsm/L。</p>
              {isHighOsm && <p className="font-black mt-1 text-rose-600">警告：渗透压过高，请务必核对输注途径！</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBox: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  icon?: React.ReactNode;
  step?: number;
}> = ({ label, value, onChange, icon, step = 1 }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center">
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      step={step}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  </div>
);

const RangeInput: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  range: number[];
  limits?: number[];
  unit: string;
  step?: number;
}> = ({ label, value, onChange, range, limits, unit, step = 1 }) => {
  const minLimit = limits ? limits[0] : range[0];
  const maxLimit = limits ? limits[1] : range[1];
  
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-600">{label}</label>
          <span className="text-[9px] text-slate-400">推荐: {range[0]} - {range[1]}</span>
        </div>
        <span className="text-sm font-black text-indigo-600">{value} <small className="text-[10px] opacity-50">{unit}</small></span>
      </div>
      <input
        type="range"
        min={minLimit}
        max={maxLimit}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );
};

const StatItem: React.FC<{ label: string, value: string | number, unit: string, color: string }> = ({ label, value, unit, color }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-baseline gap-1">
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs font-bold text-slate-300">{unit}</p>
    </div>
  </div>
);

const LegendItem: React.FC<{ color: string, label: string, val: number }> = ({ color, label, val }) => (
  <div className="flex items-center gap-3">
    <div className={`w-4 h-4 rounded-lg ${color}`}></div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</p>
      <p className="text-sm font-black text-slate-700">{val}%</p>
    </div>
  </div>
);

export default CalculatorAdvanced;

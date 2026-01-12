
import React, { useState, useEffect, useMemo } from 'react';
import { PNInputs } from '../types';
import { calculatePN, getConsensusRanges } from '../services/calculatorService';
import { AlertCircle, Calendar, Droplets, Baby, Calculator as CalcIcon, Info, ChevronRight, AlertTriangle } from 'lucide-react';

const CalculatorBasic: React.FC = () => {
  const [inputs, setInputs] = useState<PNInputs>({
    dol: 1,
    weight: 1.2,
    birthWeight: 1200,
    totalLiquidTarget: 75,
    gir: 6.0,
    aaTarget: 2.0,
    fatTarget: 1.5,
    naTarget: 0,
    kTarget: 0,
    subtractionFluid: 0,
  });

  const [milkVolume, setMilkVolume] = useState<number>(0);
  const isTerm = inputs.birthWeight >= 2500;

  const ranges = useMemo(() => 
    getConsensusRanges(inputs.dol, inputs.birthWeight, isTerm),
    [inputs.dol, inputs.birthWeight, isTerm]
  );

  useEffect(() => {
    setInputs(prev => ({
      ...prev,
      totalLiquidTarget: Math.max(ranges.liq[0], Math.min(ranges.liq[1], prev.totalLiquidTarget)),
      gir: Math.max(ranges.gir[0], Math.min(ranges.gir[1], prev.gir)),
      naTarget: ranges.na[0],
      kTarget: ranges.k[0]
    }));
  }, [ranges]);

  const results = useMemo(() => calculatePN({ ...inputs, subtractionFluid: milkVolume }), [inputs, milkVolume]);

  const updateInput = (key: keyof PNInputs, val: number) => setInputs(prev => ({ ...prev, [key]: val }));

  const isHighOsm = results.osmolarity > 900;
  const isCnRatioSafe = results.cnRatio >= 125 && results.cnRatio <= 187.5;
  const isLipidNpcSafe = results.npcLipidRatio >= 25 && results.npcLipidRatio <= 40;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in zoom-in-95 duration-700 pb-20">
      {/* Input Side */}
      <div className="lg:col-span-5 space-y-8">
        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 px-5 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-bl-3xl tracking-widest">
            {isTerm ? '足月儿 TERM' : '早产儿 PRETERM'}
          </div>
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center">
            <Baby className="w-4 h-4 mr-2 text-indigo-400" />
            患儿档案 Patient Profile
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <InputField label="DOL (日龄)" value={inputs.dol} onChange={(v) => updateInput('dol', v)} icon={<Calendar className="w-4 h-4" />} />
            <InputField label="BW (出生体重 g)" value={inputs.birthWeight} onChange={(v) => updateInput('birthWeight', v)} icon={<Droplets className="w-4 h-4" />} />
            <InputField label="Weight (当前体重 kg)" value={inputs.weight} onChange={(v) => updateInput('weight', v)} step={0.01} />
            <InputField label="Enteral (肠内/奶量 ml)" value={milkVolume} onChange={setMilkVolume} icon={<Info className="w-4 h-4" />} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-10">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center">
            <CalcIcon className="w-4 h-4 mr-2 text-indigo-400" />
            营养目标指标 Nutrition Goals
          </h3>
          
          <SliderWithRange 
            label="Total Liquid (总液体量 ml/kg)" 
            value={inputs.totalLiquidTarget} 
            onChange={(v) => updateInput('totalLiquidTarget', v)} 
            range={ranges.liq} 
            color="indigo"
          />

          <SliderWithRange 
            label="GIR (糖速 mg/kg/min)" 
            value={inputs.gir} 
            onChange={(v) => updateInput('gir', v)} 
            range={ranges.gir} 
            step={0.1}
            color="amber"
          />

          <div className="grid grid-cols-2 gap-8">
            <InputFieldWithRange label="AA (氨基酸 g/kg)" value={inputs.aaTarget} onChange={(v) => updateInput('aaTarget', v)} range={ranges.aa} />
            <InputFieldWithRange label="Fat (脂肪乳 g/kg)" value={inputs.fatTarget} onChange={(v) => updateInput('fatTarget', v)} range={ranges.fat} />
          </div>

          <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
             <div className="flex justify-between items-center mb-4">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">电解质 Electrolytes</span>
                <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-tighter ${inputs.dol <= 2 ? 'bg-slate-200 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                  {inputs.dol <= 2 ? '过渡期 Transition' : '稳定期 Stable'}
                </span>
             </div>
             <div className="grid grid-cols-2 gap-6">
                <InputFieldWithRange label="Na (钠 mmol/kg)" value={inputs.naTarget} onChange={(v) => updateInput('naTarget', v)} range={ranges.na} disabled={inputs.dol <= 2} />
                <InputFieldWithRange label="K (钾 mmol/kg)" value={inputs.kTarget} onChange={(v) => updateInput('kTarget', v)} range={ranges.k} disabled={inputs.dol <= 2} />
             </div>
          </div>
        </div>
      </div>

      {/* Result Side - Light Blue Frosted Glass */}
      <div className="lg:col-span-7 space-y-8">
        <div className={`rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group transition-all duration-700 border border-white/60 ${isHighOsm ? 'bg-rose-50 ring-8 ring-rose-500/10' : 'bg-gradient-to-br from-blue-50/90 to-indigo-100/90 shadow-indigo-100'}`}>
          {/* Background Decor */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] transition-transform group-hover:scale-125 duration-1000">
            <CalcIcon className={`w-48 h-48 ${isHighOsm ? 'text-rose-900' : 'text-indigo-900'}`} />
          </div>
          
          <div className="relative z-10 space-y-8">
            <div className="flex justify-between items-center">
              <p className={`text-[11px] font-black uppercase tracking-[0.3em] ${isHighOsm ? 'text-rose-400' : 'text-indigo-400'}`}>执行建议方案 Execution Proposal</p>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black flex items-center backdrop-blur-md border shadow-sm ${isHighOsm ? 'bg-rose-500 text-white border-rose-400' : 'bg-white/60 border-indigo-200 text-indigo-700'}`}>
                {isHighOsm && <AlertTriangle className="w-3 h-3 mr-2" />}
                OSM (渗透压): {results.osmolarity.toFixed(0)} mOsm/L
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <h2 className={`text-8xl font-black tracking-tighter flex items-baseline ${isHighOsm ? 'text-rose-900' : 'text-slate-800'}`}>
                  {results.flowRate.toFixed(1)} <span className="text-3xl font-medium opacity-40 ml-4">ml/h</span>
                </h2>
                <div className="text-xs font-bold text-slate-400 leading-tight">
                  静脉<br/>液速
                </div>
              </div>
              {isHighOsm && <p className="text-rose-600 font-bold text-xs uppercase tracking-widest flex items-center"><AlertTriangle className="w-3.5 h-3.5 mr-2" /> 严重警告：渗透压超标，严禁外周输注</p>}
            </div>

            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 pt-10 border-t ${isHighOsm ? 'border-rose-200' : 'border-indigo-200/50'}`}>
              <ResultMetric label="G. Conc (糖浓度)" value={`${results.glucoseConcentration.toFixed(1)}%`} status={results.glucoseConcentration > 12.5 ? 'warn' : 'ok'} darkText />
              <ResultMetric label="Energy (热卡)" value={`${results.totalCalories.toFixed(0)} kcal`} darkText />
              <ResultMetric label="NPC:N (热氮比)" value={results.cnRatio.toFixed(1)} status={isCnRatioSafe ? 'ok' : 'warn'} darkText />
              <ResultMetric label="Lipid % (脂肪占比)" value={`${results.npcLipidRatio.toFixed(0)}%`} status={isLipidNpcSafe ? 'ok' : 'warn'} darkText />
            </div>
          </div>
        </div>

        {/* Energy Balance */}
        <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/40 space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
               <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest">能量构成分析 Energy Balance</h4>
               <p className="text-lg font-black text-slate-800">静脉能量构成比例</p>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${isCnRatioSafe ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                  <span className="text-[10px] font-bold text-slate-400 tracking-tighter">NPC:N {results.cnRatio.toFixed(1)}</span>
               </div>
            </div>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex shadow-inner">
            <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${results.calorieRatios.carb}%` }}></div>
            <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${results.calorieRatios.protein}%` }}></div>
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${results.calorieRatios.fat}%` }}></div>
          </div>
          <div className="flex justify-between px-2">
            <CalorieLegend color="bg-amber-400" label="糖类" val={results.calorieRatios.carb} />
            <CalorieLegend color="bg-indigo-500" label="蛋白" val={results.calorieRatios.protein} />
            <CalorieLegend color="bg-emerald-500" label="脂肪" val={results.calorieRatios.fat} />
          </div>
        </div>

        {/* Prescription Breakdown */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-100 px-10 py-6 flex justify-between items-center">
            <h4 className="font-black text-slate-800 tracking-tight">24h 溶液配置明细 Prescription Breakdown</h4>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Vol (总容积): {(results.gs10 + results.gs50 + results.aaVol + results.fatVol + results.naVol + results.kVol).toFixed(1)} ml</span>
          </div>
          <div className="p-10 grid grid-cols-2 md:grid-cols-3 gap-10">
            <ResultItem label="10% 葡萄糖 (GS)" value={results.gs10.toFixed(1)} unit="ml" color="text-amber-600" />
            <ResultItem label="50% 葡萄糖 (GS)" value={results.gs50.toFixed(1)} unit="ml" color="text-amber-700" />
            <ResultItem label="6% 氨基酸 (AA)" value={results.aaVol.toFixed(1)} unit="ml" color="text-indigo-600" />
            <ResultItem label="20% 脂肪乳 (Lipid)" value={results.fatVol.toFixed(1)} unit="ml" color="text-emerald-600" />
            <ResultItem label="10% NaCl (钠)" value={results.naVol.toFixed(1)} unit="ml" color="text-slate-600" />
            <ResultItem label="10% KCl (钾)" value={results.kVol.toFixed(1)} unit="ml" color="text-slate-600" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Polished Sub-components
const ResultMetric: React.FC<{ label: string, value: string | number, status?: 'ok' | 'warn', darkText?: boolean }> = ({ label, value, status, darkText }) => (
  <div className="space-y-1">
    <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${darkText ? 'text-slate-400' : 'text-white/30'}`}>{label}</p>
    <p className={`text-xl font-black ${status === 'warn' ? 'text-rose-600' : (darkText ? 'text-slate-800' : 'text-white')}`}>{value}</p>
  </div>
);

const InputField: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  icon?: React.ReactNode;
}> = ({ label, value, onChange, step = 1, icon }) => (
  <div className="space-y-2 group">
    <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest flex items-center group-focus-within:text-indigo-500 transition-colors">
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      step={step}
      className="w-full bg-[#f5f5f7] border border-transparent rounded-2xl px-5 py-3 text-sm font-bold outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all"
    />
  </div>
);

const SliderWithRange: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  range: number[];
  step?: number;
  color: string;
}> = ({ label, value, onChange, range, step = 1, color }) => (
  <div className="space-y-5">
    <div className="flex justify-between items-center">
      <label className="text-xs font-black text-slate-700 uppercase tracking-tight">{label}</label>
      <div className={`px-4 py-1 rounded-xl bg-${color}-50 text-${color}-600 font-black text-sm`}>{value}</div>
    </div>
    <input
      type="range"
      min={range[0]}
      max={range[1]}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className={`w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-${color}-500`}
    />
    <div className="flex justify-between text-[9px] text-slate-300 font-black uppercase tracking-widest">
      <span>{range[0]}</span>
      <span>推荐范围 Recommended Range</span>
      <span>{range[1]}</span>
    </div>
  </div>
);

const InputFieldWithRange: React.FC<{
  label: string;
  value: number;
  onChange: (v: number) => void;
  range: number[];
  step?: number;
  disabled?: boolean;
}> = ({ label, value, onChange, range, step = 0.1, disabled }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      <span className="text-[9px] text-slate-300 font-black tracking-tight">{range[0]}-{range[1]}</span>
    </div>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      step={step}
      disabled={disabled}
      className="w-full bg-[#f5f5f7] border border-transparent rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:bg-white focus:border-indigo-100 focus:ring-4 focus:ring-indigo-500/5 transition-all disabled:opacity-30 disabled:grayscale"
    />
  </div>
);

const CalorieLegend: React.FC<{ color: string, label: string, val: number }> = ({ color, label, val }) => (
  <div className="flex flex-col items-center gap-1">
    <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${color}`}></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{label}</span>
    </div>
    <span className="text-sm font-black text-slate-800">{val}%</span>
  </div>
);

const ResultItem: React.FC<{ label: string, value: string, unit: string, color: string }> = ({ label, value, unit, color }) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
    <div className="flex items-baseline gap-1">
        <p className={`text-2xl font-black ${color}`}>{value}</p>
        <p className="text-[10px] font-bold text-slate-400 uppercase">{unit}</p>
    </div>
  </div>
);

export default CalculatorBasic;

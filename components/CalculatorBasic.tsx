
import React, { useState, useEffect, useMemo } from 'react';
import { PNInputs, PNResults } from '../types';
import { calculatePN } from '../services/calculatorService';
import { AlertCircle, Calendar, Droplets, Baby, Calculator as CalcIcon } from 'lucide-react';

const CalculatorBasic: React.FC = () => {
  const [inputs, setInputs] = useState<PNInputs>({
    dol: 1,
    weight: 1.2,
    birthWeight: 1200,
    totalLiquidTarget: 75,
    gir: 5.0,
    aaTarget: 2.0,
    fatTarget: 1.0,
    naTarget: 3,
    kTarget: 0,
    subtractionFluid: 0,
  });

  const [milkVolume, setMilkVolume] = useState<number>(0);

  // Auto-suggest liquid volume based on 2025 Consensus Ladder
  useEffect(() => {
    const { dol, birthWeight } = inputs;
    let suggested = 70;
    if (birthWeight < 1000) {
      suggested = dol === 1 ? 80 : Math.min(160, 80 + (dol - 1) * 20);
    } else if (birthWeight < 1500) {
      suggested = dol === 1 ? 75 : Math.min(150, 75 + (dol - 1) * 20);
    } else {
      suggested = dol === 1 ? 70 : Math.min(140, 70 + (dol - 1) * 15);
    }
    setInputs(prev => ({ ...prev, totalLiquidTarget: suggested }));
  }, [inputs.dol, inputs.birthWeight]);

  const results = useMemo(() => {
    return calculatePN({
      ...inputs,
      subtractionFluid: milkVolume
    });
  }, [inputs, milkVolume]);

  const updateInput = (key: keyof PNInputs, val: number) => {
    setInputs(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in zoom-in-95 duration-500">
      {/* Input Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
            <Baby className="w-4 h-4 mr-2" />
            基础临床参数
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="出生日龄 (Day)" value={inputs.dol} onChange={(v) => updateInput('dol', v)} min={1} max={30} icon={<Calendar className="w-4 h-4" />} />
            <InputField label="出生体重 (g)" value={inputs.birthWeight} onChange={(v) => updateInput('birthWeight', v)} min={400} max={5000} icon={<Droplets className="w-4 h-4" />} />
            <InputField label="目前体重 (kg)" value={inputs.weight} onChange={(v) => updateInput('weight', v)} step={0.01} min={0.4} />
            <InputField label="今日奶量 (ml)" value={milkVolume} onChange={setMilkVolume} min={0} />
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center">
            <CalcIcon className="w-4 h-4 mr-2" />
            营养目标设定
          </h3>
          <div className="space-y-4">
            <SliderField label="总液体量目标 (ml/kg)" value={inputs.totalLiquidTarget} onChange={(v) => updateInput('totalLiquidTarget', v)} min={40} max={180} />
            <SliderField label="糖速 (GIR, mg/kg/min)" value={inputs.gir} onChange={(v) => updateInput('gir', v)} min={4} max={12} step={0.1} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="氨基酸 (g/kg)" value={inputs.aaTarget} onChange={(v) => updateInput('aaTarget', v)} step={0.1} />
              <InputField label="脂肪乳 (g/kg)" value={inputs.fatTarget} onChange={(v) => updateInput('fatTarget', v)} step={0.1} />
            </div>
          </div>
        </div>
      </div>

      {/* Result Side */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <CalcIcon className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-2">建议静脉液速</p>
            <h2 className="text-6xl font-black mb-6">
              {results.flowRate.toFixed(1)} <span className="text-2xl font-normal opacity-70 text-indigo-200 ml-1">ml/h</span>
            </h2>
            <div className="grid grid-cols-2 gap-8 border-t border-indigo-500/30 pt-6">
              <div>
                <p className="text-indigo-200 text-[10px] font-bold uppercase">实际糖浓度</p>
                <p className="text-2xl font-bold">{results.glucoseConcentration.toFixed(1)} %</p>
              </div>
              <div>
                <p className="text-indigo-200 text-[10px] font-bold uppercase">能量密度</p>
                <p className="text-2xl font-bold">{results.totalCalories.toFixed(1)} <small className="text-sm font-normal">kcal/kg</small></p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h4 className="font-bold text-slate-700">配方体积分解 (ml)</h4>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-6">
            <ResultItem label="10% 葡萄糖" value={results.gs10.toFixed(1)} />
            <ResultItem label="50% 葡萄糖" value={results.gs50.toFixed(1)} />
            <ResultItem label="6% 氨基酸" value={results.aaVol.toFixed(1)} />
            <ResultItem label="20% 脂肪乳" value={results.fatVol.toFixed(1)} />
            <ResultItem label="10% 氯化钠" value={results.naVol.toFixed(1)} />
            <ResultItem label="10% 氯化钾" value={results.kVol.toFixed(1)} />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            注意：当糖浓度高于 12.5% 或渗透压高于 900 mOsm/L 时，建议经中心静脉输注。当前计算渗透压约为 <strong>{results.osmolarity.toFixed(0)} mOsm/L</strong>。
          </p>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string, value: number, onChange: (v: number) => void, step?: number, min?: number, max?: number, icon?: React.ReactNode }> = ({ label, value, onChange, step = 1, min, max, icon }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center">
      {icon && <span className="mr-1 opacity-60">{icon}</span>}
      {label}
    </label>
    <input 
      type="number" 
      step={step} 
      value={value === 0 ? '' : value}
      onFocus={(e) => e.target.select()}
      onChange={(e) => {
        const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
        onChange(val);
      }}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
    />
  </div>
);

const SliderField: React.FC<{ label: string, value: number, onChange: (v: number) => void, min: number, max: number, step?: number }> = ({ label, value, onChange, min, max, step = 1 }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-bold text-slate-400 uppercase">{label}</label>
      <input 
        type="number"
        step={step}
        value={value === 0 ? '' : value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
          onChange(val);
        }}
        className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-black text-indigo-600 text-right focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner"
      />
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      step={step} 
      value={value} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

const ResultItem: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">{label}</p>
    <p className="text-lg font-mono font-bold text-slate-800">{value} <small className="text-[10px] font-normal text-slate-400">ml</small></p>
  </div>
);

export default CalculatorBasic;

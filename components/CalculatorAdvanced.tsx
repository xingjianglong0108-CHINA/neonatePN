
import React, { useState, useEffect, useMemo } from 'react';
import { PNInputs, PNResults } from '../types';
import { calculatePN } from '../services/calculatorService';
import { CONCENTRATIONS, CALORIES } from '../constants';
import { RefreshCw, LayoutGrid, List, Calendar, Droplets, Baby } from 'lucide-react';

const CalculatorAdvanced: React.FC = () => {
  const [dol, setDol] = useState<number>(1);
  const [birthWeight, setBirthWeight] = useState<number>(1200);
  const [weight, setWeight] = useState(1.23);
  const [liquidPerKg, setLiquidPerKg] = useState(75);
  const [gir, setGir] = useState(9);
  const [aaTarget, setAaTarget] = useState(3);
  const [fatTarget, setFatTarget] = useState(2);
  const [naTarget, setNaTarget] = useState(3);
  const [kTarget, setKTarget] = useState(2);

  const [milkVol, setMilkVol] = useState(0);
  const [milkType, setMilkType] = useState<keyof typeof CALORIES.MILK>('standard');
  const [dopamineLiquid, setDopamineLiquid] = useState(0);

  // Auto-suggest liquid volume ladder
  useEffect(() => {
    let suggested = 70;
    if (birthWeight < 1000) {
      suggested = dol === 1 ? 80 : Math.min(160, 80 + (dol - 1) * 20);
    } else if (birthWeight < 1500) {
      suggested = dol === 1 ? 75 : Math.min(150, 75 + (dol - 1) * 20);
    } else {
      suggested = dol === 1 ? 70 : Math.min(140, 70 + (dol - 1) * 15);
    }
    setLiquidPerKg(suggested);
  }, [dol, birthWeight]);

  const results = useMemo(() => {
    const inputs: PNInputs = {
      dol,
      birthWeight,
      weight,
      totalLiquidTarget: liquidPerKg,
      gir,
      aaTarget,
      fatTarget,
      naTarget,
      kTarget,
      subtractionFluid: milkVol + dopamineLiquid
    };
    return calculatePN(inputs);
  }, [dol, birthWeight, weight, liquidPerKg, gir, aaTarget, fatTarget, naTarget, kTarget, milkVol, dopamineLiquid]);

  const milkCalories = milkVol * CALORIES.MILK[milkType];
  const totalCal = results ? (results.totalCalories * weight + milkCalories) / weight : 0;

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">深度评估与多方案对比</h2>
          <p className="text-slate-500 text-sm">支持肠内/肠外协同评估与日龄动态阶梯推演</p>
        </div>
        <button onClick={() => window.location.reload()} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Inputs */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <Baby className="w-4 h-4 mr-2" />
              患儿核心参数
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <InputBox label="日龄 (DOL)" value={dol} onChange={setDol} icon={<Calendar className="w-3 h-3" />} />
              <InputBox label="出生体重 (g)" value={birthWeight} onChange={setBirthWeight} icon={<Droplets className="w-3 h-3" />} />
              <div className="col-span-2">
                <InputBox label="目前体重 (kg)" value={weight} onChange={setWeight} step={0.01} />
              </div>
            </div>
            <div className="mt-4 space-y-4 pt-4 border-t border-slate-100">
              <InputBox label="总液体量 (ml/kg/d)" value={liquidPerKg} onChange={setLiquidPerKg} />
              <InputBox label="氨基酸目标 (g/kg)" value={aaTarget} onChange={setAaTarget} step={0.1} />
              <InputBox label="脂肪乳目标 (g/kg)" value={fatTarget} onChange={setFatTarget} step={0.1} />
              <InputBox label="GIR 目标 (mg/kg/min)" value={gir} onChange={setGir} step={0.1} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center">
              <LayoutGrid className="w-4 h-4 mr-2" />
              肠内营养 & 扣除
            </h3>
            <div className="space-y-4">
              <InputBox label="今日奶量 (ml)" value={milkVol} onChange={setMilkVol} />
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">奶液类型</label>
                <select 
                  value={milkType} 
                  onChange={(e) => setMilkType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                >
                  <option value="standard">普通奶 (0.67kcal/ml)</option>
                  <option value="preterm68">早产儿奶 (0.68kcal/ml)</option>
                  <option value="preterm81">早产儿奶 (0.81kcal/ml)</option>
                </select>
              </div>
              <InputBox label="其他用药扣除 (ml)" value={dopamineLiquid} onChange={setDopamineLiquid} />
            </div>
          </div>
        </div>

        {/* Main Display Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-white p-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-widest">综合评估热卡 (含奶)</p>
                  <h3 className="text-4xl font-bold">{totalCal.toFixed(1)} <span className="text-lg font-normal opacity-60">kcal/kg</span></h3>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs font-medium mb-1 uppercase tracking-widest">渗透压指数</p>
                  <p className={`text-xl font-bold ${results && results.osmolarity > 900 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {results?.osmolarity.toFixed(0)} <span className="text-sm font-normal">mOsm/L</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <StatItem label="静脉液速" value={results?.flowRate.toFixed(1)} unit="ml/h" color="text-indigo-600" />
              <StatItem label="实际糖浓度" value={results?.glucoseConcentration.toFixed(1)} unit="%" color="text-amber-600" />
              <StatItem label="10%GS 体积" value={results?.gs10.toFixed(1)} unit="ml" />
              <StatItem label="50%GS 体积" value={results?.gs50.toFixed(1)} unit="ml" />
              <StatItem label="氨基酸体积" value={results?.aaVol.toFixed(1)} unit="ml" helper="6.5% 或 6%" />
              <StatItem label="脂肪乳体积" value={results?.fatVol.toFixed(1)} unit="ml" helper="20% 浓度" />
              <StatStatRow label="电解质 (Na/K)" v1={results?.naVol.toFixed(1)} v2={results?.kVol.toFixed(1)} unit="ml" />
            </div>

            <div className="px-8 pb-8">
              <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden flex">
                <div className="h-full bg-indigo-500" style={{ width: '45%' }}></div>
                <div className="h-full bg-emerald-500" style={{ width: '25%' }}></div>
                <div className="h-full bg-amber-500" style={{ width: '30%' }}></div>
              </div>
              <div className="flex justify-between mt-3 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-indigo-500 mr-1"></span> 糖类热量</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> 蛋白热量</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-1"></span> 脂肪热量</div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
            <h4 className="text-indigo-900 font-bold mb-3 flex items-center">
              <List className="w-4 h-4 mr-2" />
              临床建议 (依据 2025 共识)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-indigo-800 leading-relaxed">
              <p>• 当前糖浓度 {results?.glucoseConcentration.toFixed(1)}%，{results?.glucoseConcentration > 12.5 ? '超出外周限制，强制 PICC。' : '处于安全输注范围。'}</p>
              <p>• 当前热卡供给 {totalCal.toFixed(1)}kcal/kg，{totalCal < 80 ? '处于起步阶梯，建议逐步增加。' : '已达生长期维持目标。'}</p>
              <p>• 渗透压监测提示：{results?.osmolarity > 900 ? '由于渗透压过高，强烈建议中心静脉输注。' : '符合外周/中心输注条件。'}</p>
              <p>• 请密切关注患儿今日总液体负荷，目标液速：{results?.flowRate.toFixed(1)} ml/h。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputBox: React.FC<{ label: string, value: number, onChange: (n: number) => void, step?: number, icon?: React.ReactNode }> = ({ label, value, onChange, step = 1, icon }) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
      {icon && <span className="mr-1 opacity-50">{icon}</span>}
      {label}
    </label>
    <div className="relative">
      <input 
        type="number"
        step={step}
        value={value === 0 ? '' : value}
        onFocus={(e) => e.target.select()}
        onChange={(e) => {
          const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
          onChange(val);
        }}
        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-bold text-slate-700"
      />
    </div>
  </div>
);

const StatItem: React.FC<{ label: string, value?: string, unit: string, color?: string, helper?: string }> = ({ label, value, unit, color = 'text-slate-800', helper }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-baseline space-x-1">
      <span className={`text-2xl font-bold tracking-tight ${color}`}>{value || '0'}</span>
      <span className="text-xs text-slate-400 font-medium">{unit}</span>
    </div>
    {helper && <p className="text-[10px] text-slate-300 italic">{helper}</p>}
  </div>
);

const StatStatRow: React.FC<{ label: string, v1?: string, v2?: string, unit: string }> = ({ label, v1, v2, unit }) => (
  <div className="space-y-1">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
    <div className="flex items-baseline space-x-1">
      <span className="text-xl font-bold text-slate-800">{v1 || '0'}</span>
      <span className="text-slate-300">/</span>
      <span className="text-xl font-bold text-slate-800">{v2 || '0'}</span>
      <span className="text-xs text-slate-400 font-medium">{unit}</span>
    </div>
  </div>
);

export default CalculatorAdvanced;

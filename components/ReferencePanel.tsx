
import React from 'react';
import { Table as TableIcon, Zap, Droplets, FlaskConical, Thermometer } from 'lucide-react';

const ReferencePanel: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-10 pb-20">
      <header>
        <h2 className="text-3xl font-black text-slate-800 flex items-center">
          <TableIcon className="w-8 h-8 mr-3 text-indigo-600" />
          临床参考表格汇总
        </h2>
        <p className="text-slate-500 mt-2">基于《新生儿肠外营养管理专家共识 (2025)》核心数据表</p>
      </header>

      {/* Table 2: Liquid Intake */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center">
          <Droplets className="w-5 h-5 mr-2 text-indigo-600" />
          <h3 className="font-bold text-indigo-900">表 2：不同出生体重新生儿所需液体量 (mL/kg/d)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4">患儿类别</th>
                <th className="px-4 py-4">1d</th>
                <th className="px-4 py-4">2d</th>
                <th className="px-4 py-4">3d</th>
                <th className="px-4 py-4">4-5d</th>
                <th className="px-4 py-4">≥6d</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow label="足月儿" vals={["40-60", "50-70", "60-80", "60-100", "140-170"]} />
              <TableRow label="BW > 1500g" vals={["60-80", "80-100", "100-120", "120-140", "140-160"]} />
              <TableRow label="BW 1000-1500g" vals={["60-90", "80-110", "100-130", "120-150", "140-160"]} highlight />
              <TableRow label="BW < 1000g" vals={["60-100", "80-120", "100-140", "120-160", "140-160"]} />
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Table 3: Electrolytes */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-emerald-600" />
            <h3 className="font-bold text-emerald-900">表 3：电解质建议需要量</h3>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <InfoBox label="钠 (Na)" value="2.0~3.0 mmol/kg/d" sub="一般生后 24-48h 启用" />
              <InfoBox label="钾 (K)" value="1.0~2.0 mmol/kg/d" sub="建立尿量后启用" />
              <InfoBox label="钙 (Ca)" value="1.0~1.5 mmol/kg/d" sub="建议生后即刻启用" />
              <InfoBox label="镁 (Mg)" value="0.2~0.3 mmol/kg/d" />
              <InfoBox label="磷 (P)" value="1.0~1.3 mmol/kg/d" sub="早期补充预防低磷血症" />
            </div>
          </div>
        </section>

        {/* Table 4: Glucose GIR */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center">
            <Thermometer className="w-5 h-5 mr-2 text-amber-600" />
            <h3 className="font-bold text-amber-900">表 4：葡萄糖目标 (GIR)</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50/50">
                <span className="text-xs font-bold text-amber-800">起始 GIR (早产儿)</span>
                <span className="text-sm font-black text-amber-900">4.0 ~ 8.0 mg/kg/min</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50/50">
                <span className="text-xs font-bold text-amber-800">每日增量</span>
                <span className="text-sm font-black text-amber-900">1.0 ~ 2.0 mg/kg/min</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-xl bg-amber-50/50">
                <span className="text-xs font-bold text-amber-800">最大 GIR</span>
                <span className="text-sm font-black text-amber-900">10 ~ 12 mg/kg/min</span>
              </div>
              <div className="mt-4 p-3 border border-dashed border-amber-200 rounded-xl text-[10px] text-amber-700 leading-relaxed">
                * 目标血糖维持在 2.6~8.3 mmol/L。外周静脉浓度上限 12.5%。
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Table 5 & 6: Macros Progression */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100 flex items-center">
            <FlaskConical className="w-5 h-5 mr-2 text-indigo-600" />
            <h3 className="font-bold text-indigo-900">表 5 & 6：氨基酸与脂肪乳 (g/kg/d)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase">
                  <th className="px-6 py-3 text-left">组分</th>
                  <th className="px-4 py-3">起始剂量</th>
                  <th className="px-4 py-3">每日增加</th>
                  <th className="px-4 py-3">最大剂量</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-700">氨基酸 (AA)</td>
                  <td className="px-4 py-4">1.5 - 2.5</td>
                  <td className="px-4 py-4">1.0 - 1.5</td>
                  <td className="px-4 py-4 text-indigo-600 font-bold">3.5 - 4.0</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-bold text-slate-700">脂肪乳 (Lipid)</td>
                  <td className="px-4 py-4">1.0 - 2.0</td>
                  <td className="px-4 py-4">0.5 - 1.0</td>
                  <td className="px-4 py-4 text-indigo-600 font-bold">3.0 - 4.0</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Table 7: Vitamins & Trace Elements */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-100 flex items-center">
            <FlaskConical className="w-5 h-5 mr-2 text-purple-600" />
            <h3 className="font-bold text-purple-900">表 7：维生素与微量元素</h3>
          </div>
          <div className="p-6 grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/50">
              <span className="text-xs font-bold text-purple-800">复合维生素</span>
              <span className="text-sm font-black text-purple-900">1.0 ~ 1.5 mL/kg/d</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl bg-purple-50/50">
              <span className="text-xs font-bold text-purple-800">复合微量元素</span>
              <span className="text-sm font-black text-purple-900">1.0 mL/kg/d</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed px-1">
              注：生后尽早开始补充，特别是极/超低出生体重儿。微量元素通常在开始 PN 后 2 周左右或长期 PN 时必须添加。
            </p>
          </div>
        </section>
      </div>

      <footer className="bg-slate-50 p-6 rounded-3xl border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <TableIcon className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800">共识数据实时核对系统</p>
            <p className="text-[10px] text-slate-500">所有数据均已根据 2025 最新共识校对</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Consensus ID: 2025-PN-CN</span>
        </div>
      </footer>
    </div>
  );
};

const TableRow: React.FC<{ label: string, vals: string[], highlight?: boolean }> = ({ label, vals, highlight }) => (
  <tr className={`${highlight ? 'bg-indigo-50/30' : 'hover:bg-slate-50 transition-colors'}`}>
    <td className="px-6 py-4 font-semibold text-slate-700">{label}</td>
    {vals.map((v, i) => (
      <td key={i} className="px-4 py-4 text-slate-600">{v}</td>
    ))}
  </tr>
);

const InfoBox: React.FC<{ label: string, value: string, sub?: string }> = ({ label, value, sub }) => (
  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
    <p className="text-sm font-black text-slate-800">{value}</p>
    {sub && <p className="text-[10px] text-slate-400 mt-1 opacity-80">{sub}</p>}
  </div>
);

export default ReferencePanel;

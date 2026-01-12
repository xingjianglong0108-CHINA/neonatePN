import React from 'react';
import { Table as TableIcon, Droplets, Zap, FlaskConical, Thermometer, Info, Baby, Beaker } from 'lucide-react';

const TableRow: React.FC<{ label: string, vals: string[], highlight?: boolean }> = ({ label, vals, highlight }) => (
  <tr className={`${highlight ? 'bg-indigo-50/30' : 'hover:bg-slate-50 transition-colors'}`}>
    <td className="px-6 py-4 font-bold text-slate-700 border-r border-slate-100">{label}</td>
    {vals.map((v, i) => (
      <td key={i} className="px-4 py-4 text-slate-600 font-medium text-center whitespace-nowrap">{v}</td>
    ))}
  </tr>
);

const SectionHeader: React.FC<{ icon: React.ReactNode, title: string, color: string }> = ({ icon, title, color }) => (
  <div className={`${color} px-6 py-4 border-b flex items-center`}>
    <span className="mr-2">{icon}</span>
    <h3 className="font-bold text-slate-800">{title}</h3>
  </div>
);

const ReferencePanel: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 space-y-12 pb-20">
      <header className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-black text-slate-800 flex items-center">
          <TableIcon className="w-8 h-8 mr-3 text-indigo-600" />
          临床参考表格汇总 (2025 共识)
        </h2>
        <p className="text-slate-500 mt-2">基于《新生儿肠外营养管理专家共识》最新细分标准</p>
      </header>

      {/* 表 2：所需液体量 */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <SectionHeader icon={<Droplets className="w-5 h-5 text-indigo-600" />} title="表 2：不同出生体重新生儿所需液体量 (mL/kg/d)" color="bg-indigo-50 border-indigo-100" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4 border-r border-slate-100">患儿类别</th>
                <th className="px-4 py-4 text-center">1d</th>
                <th className="px-4 py-4 text-center">2d</th>
                <th className="px-4 py-4 text-center">3d</th>
                <th className="px-4 py-4 text-center">4-5d</th>
                <th className="px-4 py-4 text-center">≥6d</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow label="足月儿" vals={["40-60", "50-70", "60-80", "60-100", "140-170"]} />
              <TableRow label="BW > 1500g" vals={["60-80", "80-100", "100-120", "120-140", "140-160"]} />
              <TableRow label="BW 1000-1500g" vals={["60-90", "80-110", "100-130", "120-150", "140-160"]} />
              <TableRow label="BW < 1000g" vals={["60-100", "80-120", "100-140", "120-160", "140-160"]} />
            </tbody>
          </table>
        </div>
      </section>

      {/* 表 3：葡萄糖推荐量 */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <SectionHeader icon={<Thermometer className="w-5 h-5 text-amber-600" />} title="表 3：新生儿 PN 溶液葡萄糖推荐量 (GIR, mg/kg/min)" color="bg-amber-50 border-amber-100" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4 border-r border-slate-100">患儿类别</th>
                <th className="px-4 py-4 text-center">起始剂量</th>
                <th className="px-4 py-4 text-center">每日增量</th>
                <th className="px-4 py-4 text-center">最大剂量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow label="早产儿" vals={["4.0 ~ 8.0", "1.0 ~ 2.0", "12.0"]} />
              <TableRow label="足月儿" vals={["3.0 ~ 5.0", "1.0 ~ 2.0", "10.0"]} />
            </tbody>
          </table>
        </div>
      </section>

      {/* 表 4：钠、钾、氯推荐量 */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <SectionHeader icon={<Zap className="w-5 h-5 text-emerald-600" />} title="表 4：PN 溶液中钠、钾、氯推荐量 (mmol/kg/d)" color="bg-emerald-50 border-emerald-100" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4 border-r border-slate-100">电解质</th>
                <th className="px-4 py-4 text-center">患儿类别</th>
                <th className="px-4 py-4 text-center">过渡期 (1-2d)</th>
                <th className="px-4 py-4 text-center font-bold">稳定期 (3d-2w)</th>
                <th className="px-4 py-4 text-center">长期 PN (>2w)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td rowSpan={3} className="px-6 py-4 font-bold text-slate-700 border-r border-slate-100 bg-slate-50/30">钠 (Na)</td>
                <td className="px-4 py-4 text-slate-600 font-bold text-center">早产儿 BW &lt; 1500g</td>
                <td className="px-4 py-4 text-slate-400 italic text-center">通常不补充</td>
                <td className="px-4 py-4 text-slate-600 text-center font-bold">2.0 ~ 3.0</td>
                <td className="px-4 py-4 text-slate-600 text-center">2.0 ~ 4.0</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-slate-600 font-bold text-center border-t border-slate-100">早产儿 BW &ge; 1500g</td>
                <td className="px-4 py-4 text-slate-400 italic text-center border-t border-slate-100">通常不补充</td>
                <td className="px-4 py-4 text-slate-600 text-center font-bold border-t border-slate-100">2.0 ~ 3.0</td>
                <td className="px-4 py-4 text-slate-600 text-center border-t border-slate-100">2.0 ~ 3.0</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-slate-600 font-bold text-center border-t border-slate-100">足月儿</td>
                <td className="px-4 py-4 text-slate-400 italic text-center border-t border-slate-100">通常不补充</td>
                <td className="px-4 py-4 text-slate-600 text-center font-bold border-t border-slate-100">2.0 ~ 3.0</td>
                <td className="px-4 py-4 text-slate-600 text-center border-t border-slate-100">2.0 ~ 3.0</td>
              </tr>
              <tr className="border-t-2 border-slate-200">
                <td rowSpan={2} className="px-6 py-4 font-bold text-slate-700 border-r border-slate-100 bg-slate-50/30">钾 (K)</td>
                <td className="px-4 py-4 text-slate-600 font-bold text-center">早产儿</td>
                <td className="px-4 py-4 text-slate-400 italic text-center">有尿后补充</td>
                <td className="px-4 py-4 text-slate-600 text-center font-bold">1.0 ~ 2.0</td>
                <td className="px-4 py-4 text-slate-600 text-center">2.0 ~ 3.0</td>
              </tr>
              <tr>
                <td className="px-4 py-4 text-slate-600 font-bold text-center border-t border-slate-100">足月儿</td>
                <td className="px-4 py-4 text-slate-400 italic text-center border-t border-slate-100">有尿后补充</td>
                <td className="px-4 py-4 text-slate-600 text-center font-bold border-t border-slate-100">1.0 ~ 2.0</td>
                <td className="px-4 py-4 text-slate-600 text-center border-t border-slate-100">2.0 ~ 3.0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 表 5：钙、磷、镁 */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <SectionHeader icon={<Beaker className="w-5 h-5 text-blue-600" />} title="表 5：钙、磷、镁推荐量 (mmol/kg/d)" color="bg-blue-50 border-blue-100" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-4 border-r border-slate-100">组分</th>
                  <th className="px-4 py-4 text-center">早产儿</th>
                  <th className="px-4 py-4 text-center">足月儿</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableRow label="钙 (Ca)" vals={["1.5 ~ 2.0", "1.0 ~ 1.5"]} />
                <TableRow label="磷 (P)" vals={["1.3 ~ 1.7", "1.0 ~ 1.3"]} />
                <TableRow label="镁 (Mg)" vals={["0.2 ~ 0.3", "0.2 ~ 0.3"]} />
              </tbody>
            </table>
          </div>
        </section>

        {/* 表 6 & 7：微量元素与维生素 */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <SectionHeader icon={<FlaskConical className="w-5 h-5 text-purple-600" />} title="表 6 & 7：微量元素与维生素" color="bg-purple-50 border-purple-100" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-4 border-r border-slate-100">组分</th>
                  <th className="px-4 py-4 text-center">早产儿</th>
                  <th className="px-4 py-4 text-center">足月儿</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableRow label="复合微量元素" vals={["1.0 mL/kg/d", "1.0 mL/kg/d"]} />
                <TableRow label="复合维生素" vals={["1.0 ~ 1.5 mL/kg/d", "10 mL/d"]} />
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 氨基酸与脂肪乳阶梯 */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <SectionHeader icon={<FlaskConical className="w-5 h-5 text-indigo-600" />} title="氨基酸与脂肪乳剂量阶梯 (g/kg/d)" color="bg-slate-50 border-slate-200" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <th className="px-6 py-4 border-r border-slate-100">组分</th>
                <th className="px-4 py-4 text-center">起始剂量</th>
                <th className="px-4 py-4 text-center">每日增加量</th>
                <th className="px-4 py-4 text-center font-bold">最大推荐量</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow label="氨基酸 (AA)" vals={["1.5 ~ 2.5", "1.0 ~ 1.5", "3.0 ~ 3.5"]} />
              <TableRow label="脂肪乳 (Lipid)" vals={["1.0 ~ 2.0", "0.5 ~ 1.0", "3.0 ~ 3.5"]} />
            </tbody>
          </table>
        </div>
      </section>

      <footer className="bg-indigo-900 p-8 rounded-3xl text-indigo-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Baby className="w-48 h-48 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-800 p-3 rounded-2xl flex-shrink-0">
              <Info className="w-6 h-6 text-indigo-300" />
            </div>
            <div>
              <p className="font-bold text-white">共识核对完成</p>
              <p className="text-sm opacity-80 leading-relaxed max-w-xl">
                以上数据已按 2025 共识完成足月儿与早产儿区分。早产儿及极低出生体重儿应尽早启动氨基酸及脂肪乳。
              </p>
            </div>
          </div>
          <div className="bg-white/10 px-6 py-3 rounded-full border border-white/10 text-xs font-bold whitespace-nowrap">
            数据标准：2025 专家共识
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReferencePanel;
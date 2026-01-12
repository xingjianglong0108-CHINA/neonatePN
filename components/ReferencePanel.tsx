
import React from 'react';
import { Table as TableIcon, Droplets, Zap, FlaskConical, Thermometer, Info, Baby, Beaker, Apple, Microscope } from 'lucide-react';

const TableRow: React.FC<{ label: string, vals: string[], highlight?: boolean }> = ({ label, vals, highlight }) => (
  <tr className={`${highlight ? 'bg-indigo-50/40' : 'hover:bg-slate-50/80 transition-colors'}`}>
    <td className="px-6 py-4 font-bold text-slate-700 border-r border-slate-100">{label}</td>
    {vals.map((v, i) => (
      <td key={i} className="px-4 py-4 text-slate-600 font-medium text-center whitespace-pre-line leading-relaxed">{v}</td>
    ))}
  </tr>
);

const SectionHeader: React.FC<{ icon: React.ReactNode, title: string, color: string }> = ({ icon, title, color }) => (
  <div className={`${color} px-6 py-5 border-b flex items-center shadow-sm`}>
    <div className="bg-white/60 p-2 rounded-lg mr-3 shadow-inner">
      {icon}
    </div>
    <h3 className="font-black text-slate-800 tracking-tight">{title}</h3>
  </div>
);

const ReferencePanel: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-12 pb-20">
      <header className="border-b border-slate-200 pb-8">
        <h2 className="text-4xl font-black text-slate-800 flex items-center tracking-tighter">
          <TableIcon className="w-10 h-10 mr-4 text-indigo-600" />
          临床参考表格汇总 (2025 共识)
        </h2>
        <p className="text-slate-500 mt-2 text-lg">基于《新生儿肠外营养管理专家共识》最新细分标准，提供实时查阅支持</p>
      </header>

      {/* 不同出生体重新生儿所需液体量 */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <SectionHeader icon={<Droplets className="w-5 h-5 text-indigo-600" />} title="不同出生体重新生儿所需液体量 (mL/kg/d)" color="bg-gradient-to-r from-blue-50 to-indigo-50" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black border-b border-slate-100 uppercase text-[10px] tracking-[0.2em]">
                <th className="px-6 py-5 border-r border-slate-100">患儿类别 Patient Category</th>
                <th className="px-4 py-5 text-center">1d</th>
                <th className="px-4 py-5 text-center">2d</th>
                <th className="px-4 py-5 text-center">3d</th>
                <th className="px-4 py-5 text-center">4-5d</th>
                <th className="px-4 py-5 text-center">≥6d</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow label="足月儿 Term" vals={["40-60", "50-70", "60-80", "60-100", "140-170"]} />
              <TableRow label="BW > 1500g" vals={["60-80", "80-100", "100-120", "120-140", "140-160"]} />
              <TableRow label="BW 1000-1500g" vals={["60-90", "80-110", "100-130", "120-150", "140-160"]} />
              <TableRow label="BW < 1000g" vals={["60-100", "80-120", "100-140", "120-160", "140-160"]} />
            </tbody>
          </table>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 葡萄糖推荐量 */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <SectionHeader icon={<Thermometer className="w-5 h-5 text-amber-600" />} title="葡萄糖推荐量 (GIR, mg/kg/min)" color="bg-gradient-to-r from-amber-50 to-orange-50" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 font-black border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-5 border-r border-slate-100">患儿类别</th>
                  <th className="px-4 py-5 text-center">起始 Start</th>
                  <th className="px-4 py-5 text-center">增量 Inc</th>
                  <th className="px-4 py-5 text-center">最大 Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableRow label="早产儿 Preterm" vals={["4.0 ~ 8.0", "1.0 ~ 2.0", "12.0"]} />
                <TableRow label="足月儿 Term" vals={["3.0 ~ 5.0", "1.0 ~ 2.0", "10.0"]} />
              </tbody>
            </table>
          </div>
        </section>

        {/* 氨基酸与脂肪乳阶梯 */}
        <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
          <SectionHeader icon={<FlaskConical className="w-5 h-5 text-indigo-600" />} title="AA & Lipid 剂量阶梯 (g/kg/d)" color="bg-gradient-to-r from-blue-50 to-indigo-50" />
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 font-black border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <th className="px-6 py-5 border-r border-slate-100">组分 Item</th>
                  <th className="px-4 py-5 text-center">起始 Start</th>
                  <th className="px-4 py-5 text-center">增量 Inc</th>
                  <th className="px-4 py-5 text-center font-bold">最大 Max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <TableRow label="氨基酸 (AA)" vals={["1.5 ~ 2.5", "1.0 ~ 1.5", "3.0 ~ 3.5"]} />
                <TableRow label="脂肪乳 (Lipid)" vals={["1.0 ~ 2.0", "0.5 ~ 1.0", "3.0 ~ 3.5"]} />
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 钠、钾、氯推荐量 */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <SectionHeader icon={<Zap className="w-5 h-5 text-emerald-600" />} title="PN 溶液中钠、钾、氯推荐量 [mmol/(kg·d)]" color="bg-gradient-to-r from-emerald-50 to-blue-50" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black border-b border-slate-100 uppercase text-[10px] tracking-[0.2em]">
                <th className="px-10 py-5 border-r border-slate-100">阶段 Phase</th>
                <th className="px-4 py-5 text-center">钠 (Na)</th>
                <th className="px-4 py-5 text-center">钾 (K)</th>
                <th className="px-4 py-5 text-center">氯 (Cl)</th>
              </tr>
            </thead>
            <tbody className="text-slate-600 font-medium">
              {/* 过渡期 */}
              <tr className="bg-slate-50/30">
                <td colSpan={4} className="px-10 py-3 font-black text-slate-800 border-b border-slate-100 bg-emerald-50/20">过渡期 (Transition)</td>
              </tr>
              <TableRow label="足月儿第 1~3 天" vals={["0 ~ 2", "0 ~ 3", "0 ~ 3"]} />
              <TableRow label="足月儿第 4~5 天" vals={["1 ~ 3", "2 ~ 3", "2 ~ 5"]} />
              <TableRow label="BW ≥ 1500g 早产儿第 1~2 天" vals={["0 ~ 2", "0 ~ 3", "0 ~ 3"]} />
              <TableRow label="BW ≥ 1500g 早产儿第 3 天" vals={["0 ~ 3", "0 ~ 3", "0 ~ 3"]} />
              <TableRow label="BW ≥ 1500g 早产儿第 4~5 天" vals={["2 ~ 5", "2 ~ 3", "2 ~ 5"]} />
              <TableRow label="BW < 1500g 早产儿第 1~2 天" vals={["0 ~ 2", "0 ~ 3", "0 ~ 3"]} />
              <TableRow label="BW < 1500g 早产儿第 3 天" vals={["0 ~ 5", "0 ~ 3", "0 ~ 3"]} />
              <TableRow label="BW < 1500g 早产儿第 4~5 天" vals={["2 ~ 5", "2 ~ 3", "2 ~ 5"]} />

              {/* 恢复期 */}
              <tr className="bg-slate-50/30">
                <td colSpan={4} className="px-10 py-3 font-black text-slate-800 border-b border-slate-100 border-t bg-emerald-50/20">恢复期 (Recovery)</td>
              </tr>
              <TableRow label="足月儿" vals={["2 ~ 3", "1 ~ 3", "2 ~ 3"]} />
              <TableRow label="BW ≥ 1500g 早产儿" vals={["2 ~ 5", "1 ~ 3", "2 ~ 5"]} />
              <TableRow label="BW < 1500g 早产儿" vals={["2 ~ 5", "1 ~ 3", "2 ~ 5"]} />

              {/* 稳定生长期 */}
              <tr className="bg-slate-50/30">
                <td colSpan={4} className="px-10 py-3 font-black text-slate-800 border-b border-slate-100 border-t bg-emerald-50/20">稳定生长期 (Stable Growth)</td>
              </tr>
              <TableRow label="足月儿" vals={["2 ~ 3", "1.5 ~ 3", "2 ~ 3"]} />
              <TableRow label="BW ≥ 1500g 早产儿" vals={["3 ~ 5", "1 ~ 3", "3 ~ 5"]} />
              <TableRow label="BW < 1500g 早产儿" vals={["3 ~ 5", "2 ~ 5", "3 ~ 5"]} />
            </tbody>
          </table>
        </div>
        <div className="px-10 py-6 bg-slate-50 space-y-2 border-t border-slate-100">
           <div className="flex gap-2 items-start text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
             <span className="flex-shrink-0 text-indigo-500">注：</span>
             <div className="space-y-1">
               <p>过渡期通常指生后 7d 以内；</p>
               <p>稳定生长期指生理病理状态基本稳定，体重开始稳步增长至出院时；</p>
               <p>恢复期是过渡期和稳定生长期之间的阶段，通常指恢复出生体重并开始体重增长的阶段。</p>
               <p>[BW] 出生体重。</p>
             </div>
           </div>
        </div>
      </section>

      {/* PN 溶液中钙、磷、镁推荐量 */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <SectionHeader icon={<Beaker className="w-5 h-5 text-indigo-500" />} title="PN 溶液中钙、磷、镁推荐量 [mmol/(kg·d)]" color="bg-gradient-to-r from-indigo-50 to-blue-50" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black border-b border-slate-100 uppercase text-[10px] tracking-[0.2em]">
                <th className="px-6 py-5 border-r border-slate-100">常量元素 Macro Element</th>
                <th className="px-4 py-5 text-center">足月儿 Term</th>
                <th className="px-4 py-5 text-center">早产儿 Preterm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow label="钙 (Calcium)" vals={["0.8 ~ 1.5", "生后早期 0.8 ~ 2\n生长期 1.6 ~ 3.5"]} />
              <TableRow label="磷 (Phosphorus)" vals={["0.7 ~ 1.3", "生后早期 1 ~ 2\n生长期 1.6 ~ 3.5"]} />
              <TableRow label="镁 (Magnesium)" vals={["0.1 ~ 0.2", "生后早期 0.1 ~ 0.2\n生长期 0.2 ~ 0.3"]} />
            </tbody>
          </table>
        </div>
        <div className="px-10 py-6 bg-slate-50 space-y-2 border-t border-slate-100">
           <div className="flex gap-2 items-start text-[10px] text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
             <span className="flex-shrink-0 text-indigo-500">注：</span>
             <div className="space-y-1">
               <p>生后早期一般指生后 7d 内；</p>
               <p>生长期指生理病理状态基本稳定，体重开始稳步增长至出院时。</p>
             </div>
           </div>
        </div>
      </section>

      {/* PN 溶液中微量元素推荐量 */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <SectionHeader icon={<Microscope className="w-5 h-5 text-cyan-600" />} title="PN 溶液中微量元素推荐量 [μg/(kg·d)]" color="bg-gradient-to-r from-cyan-50 to-blue-50" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black border-b border-slate-100 uppercase text-[10px] tracking-[0.2em]">
                <th className="px-6 py-5 border-r border-slate-100">微量元素 Trace Element</th>
                <th className="px-4 py-5 text-center">足月儿 Term</th>
                <th className="px-4 py-5 text-center">早产儿 Preterm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow label="铁 (Iron)" vals={["50 ~ 100", "200 ~ 250"]} />
              <TableRow label="锌 (Zinc)" vals={["250", "400 ~ 500"]} />
              <TableRow label="铜 (Copper)" vals={["20", "40"]} />
              <TableRow label="硒 (Selenium)" vals={["2 ~ 3", "7"]} />
              <TableRow label="铬 (Chromium)" vals={["0", "0"]} />
              <TableRow label="钼 (Molybdenum)" vals={["0.25", "1"]} />
              <TableRow label="锰 (Manganese)" vals={["≤ 1", "≤ 1"]} />
              <TableRow label="碘 (Iodine)" vals={["1", "1 ~ 10"]} />
            </tbody>
          </table>
        </div>
      </section>

      {/* PN 溶液中维生素推荐量 */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
        <SectionHeader icon={<Apple className="w-5 h-5 text-rose-500" />} title="PN 溶液中维生素推荐量" color="bg-gradient-to-r from-rose-50 to-orange-50" />
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black border-b border-slate-100 uppercase text-[10px] tracking-[0.2em]">
                <th className="px-6 py-5 border-r border-slate-100">维生素种类 Vitamin</th>
                <th className="px-4 py-5 text-center">足月儿 Term [73, 75]</th>
                <th className="px-4 py-5 text-center">早产儿 Preterm [75]</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TableRow label="维生素 A [IU/(kg·d)]" vals={["500 ~ 1000#", "700 ~ 1500"]} />
              <TableRow label="维生素 D [IU/(kg·d)]" vals={["40 ~ 150&", "80 ~ 400*"]} />
              <TableRow label="维生素 E [IU/(kg·d)]" vals={["2.8 ~ 3.5", "2.8 ~ 3.5"]} />
              <TableRow label="维生素 K [μg/(kg·d)]" vals={["10", "10"]} />
              <TableRow label="维生素 B1 [μg/(kg·d)]" vals={["350 ~ 500", "350 ~ 500"]} />
              <TableRow label="维生素 B2 [μg/(kg·d)]" vals={["150 ~ 200", "150 ~ 200"]} />
              <TableRow label="烟酸 [mg/(kg·d)]" vals={["4.0 ~ 6.8", "4.0 ~ 6.8"]} />
              <TableRow label="维生素 B6 [μg/(kg·d)]" vals={["150 ~ 200", "150 ~ 200"]} />
              <TableRow label="叶酸 [μg/(kg·d)]" vals={["56", "56"]} />
              <TableRow label="维生素 B12 [μg/(kg·d)]" vals={["0.3", "0.3"]} />
              <TableRow label="泛酸 (B5) [mg/(kg·d)]" vals={["1 ~ 2", "2.5"]} />
              <TableRow label="生物素 [μg/(kg·d)]" vals={["5 ~ 8", "5 ~ 8"]} />
              <TableRow label="维生素 C [mg/(kg·d)]" vals={["15 ~ 25", "15 ~ 25"]} />
            </tbody>
          </table>
        </div>
        <div className="px-8 py-4 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-tight flex flex-wrap gap-x-6">
           <span># 或 2300 IU/d</span>
           <span>& 或 400 IU/d</span>
           <span>* 或 200~1000 IU/d</span>
        </div>
      </section>

      <footer className="bg-gradient-to-br from-indigo-500 to-indigo-700 p-10 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-indigo-200/50">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
          <Baby className="w-56 h-56 text-white" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-start space-x-5">
            <div className="bg-white/20 p-4 rounded-2xl flex-shrink-0 backdrop-blur-md border border-white/20 shadow-lg">
              <Info className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-xl font-black text-white mb-2 tracking-tight">临床共识权威解读</p>
              <p className="text-sm opacity-90 leading-relaxed max-w-2xl font-medium">
                以上数据基于 2025 年最新修订共识。对于超低出生体重儿 (ELBW)，应强调个体化液体管理，并在 PN 启动 24-48h 内完成电解质首次评估。脂肪乳输注速度不建议超过 0.15 g/(kg·h)。
              </p>
            </div>
          </div>
          <div className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-black text-sm shadow-xl flex flex-col items-center">
             <span className="text-[10px] opacity-60">数据版本</span>
             LATEST 2025
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ReferencePanel;

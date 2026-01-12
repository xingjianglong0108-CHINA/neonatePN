
import React from 'react';
import { 
  ShieldAlert, 
  Stethoscope, 
  Thermometer, 
  Microscope, 
  AlertTriangle, 
  Activity, 
  ClipboardList, 
  Clock, 
  Flame, 
  Zap, 
  Droplet 
} from 'lucide-react';

const ComplicationsPanel: React.FC = () => {
  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-20">
      <header className="border-b border-slate-200 pb-6">
        <h2 className="text-3xl font-black text-slate-800 flex items-center">
          <ShieldAlert className="w-8 h-8 mr-3 text-rose-600" />
          PN 常见并发症及临床监测
        </h2>
        <p className="text-slate-500 mt-2">基于 2025 共识：早期发现、规范监测、预防为主</p>
      </header>

      {/* 常见并发症分类 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ComplicationCard 
          title="代谢性并发症" 
          icon={<Zap className="w-5 h-5" />} 
          color="bg-amber-500"
          items={[
            { name: "糖代谢紊乱", detail: "高血糖 (血糖 > 8.3 mmol/L) 或低血糖 (< 2.6 mmol/L)。需调整 GIR 或加用胰岛素。" },
            { name: "电解质失衡", detail: "高/低钠、高/低钾。与肾功能、液体流失、药物相关。" },
            { name: "高甘油三酯血症", detail: "TG > 2.26 mmol/L (200 mg/dl) 应减慢或暂停脂肪乳输注。" },
            { name: "代谢性骨病", detail: "长期 PN 导致钙磷流失。需监测碱性磷酸酶 (ALP) 及血钙磷。" }
          ]}
        />
        <ComplicationCard 
          title="感染性并发症" 
          icon={<Flame className="w-5 h-5" />} 
          color="bg-rose-500"
          items={[
            { name: "导管相关性血流感染 (CRBSI)", detail: "最严重并发症。表现为发热、精神萎靡、血糖波动。" },
            { name: "预防措施", detail: "严格无菌操作、最大化无菌屏障、导管专口专用。" },
            { name: "处置原则", detail: "怀疑 CRBSI 时需抽外周及导管血培养。必要时拔管。" }
          ]}
        />
        <ComplicationCard 
          title="肝胆系统并发症" 
          icon={<Activity className="w-5 h-5" />} 
          color="bg-emerald-500"
          items={[
            { name: "PN 相关肝病 (PNALD)", detail: "胆汁淤积 (DB > 17.1-34.2 μmol/L)。长期 PN 风险高。" },
            { name: "干预方案", detail: "尽早开始肠内营养 (EN)、减少非蛋白热卡、应用鱼油脂肪乳。" },
            { name: "监测指标", detail: "总胆红素、直接胆红素、转氨酶、GGT。" }
          ]}
        />
        <ComplicationCard 
          title="机械性并发症" 
          icon={<AlertTriangle className="w-5 h-5" />} 
          color="bg-slate-500"
          items={[
            { name: "导管置入损伤", detail: "气胸、血管损伤、心律失常。" },
            { name: "血栓与栓塞", detail: "中心静脉导管相关血栓。表现为肢体肿胀、侧支循环建立。" },
            { name: "渗漏与外渗", detail: "高渗液外渗可致组织坏死。外周静脉输注需严格控制渗透压。" }
          ]}
        />
      </div>

      {/* 临床监测计划表格 */}
      <section className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-indigo-900 px-8 py-6 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-indigo-300" />
            <h3 className="text-xl font-bold">肠外营养临床监测时间表</h3>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-white/10">
            <Clock className="w-4 h-4" /> 实验室核心监测
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <th className="px-8 py-5 text-left">监测项目</th>
                <th className="px-8 py-5 text-center">PN 初期 / 不稳定期</th>
                <th className="px-8 py-5 text-center">PN 稳定期</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <MonitoringRow label="临床体征" sub="神志、肤色、腹部、导管处" init="每班 / 每日" stable="每日" />
              <MonitoringRow label="体重" sub="营养评估基础" init="每日" stable="每周 3 次" />
              <MonitoringRow label="出入水量 / 尿量" sub="评估液体平衡" init="每日" stable="每日" />
              <MonitoringRow label="血常规 / 血糖" sub="基础监测" init="每日或隔日" stable="每周 1-2 次" />
              <MonitoringRow label="电解质 / 血气" sub="酸碱及离子平衡" init="每日" stable="每周 1 次" />
              <MonitoringRow label="肝功能 / 胆红素" sub="肝损害监测" init="每周 1-2 次" stable="每周 1 次" />
              <MonitoringRow label="血甘油三酯 (TG)" sub="脂肪代谢" init="增加脂肪乳剂量后" stable="每周 1 次" />
              <MonitoringRow label="肾功能 / 血尿素氮" sub="蛋白负荷评价" init="每周 1 次" stable="每 2 周 1 次" />
            </tbody>
          </table>
        </div>
      </section>

      {/* 底部专家提醒 */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-[2rem] p-8 flex items-start gap-6">
        <div className="bg-white p-4 rounded-2xl shadow-sm">
          <Stethoscope className="w-8 h-8 text-indigo-600" />
        </div>
        <div>
          <h4 className="font-bold text-indigo-900 text-lg mb-2">专家组预防策略建议</h4>
          <p className="text-sm text-indigo-700 leading-relaxed">
            2025 共识强调：肠外营养仅仅是过渡。<strong>尽早开始肠内微量喂养</strong>是预防 PNALD 及胃肠道萎缩最有效的手段。
            在 PN 过程中，应定期评估实验室指标，当患儿肠内热卡供给达到总目标的 75% 时，应考虑停止 PN。
          </p>
        </div>
      </div>
    </div>
  );
};

const ComplicationCard: React.FC<{ title: string, icon: React.ReactNode, color: string, items: { name: string, detail: string }[] }> = ({ title, icon, color, items }) => (
  <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col">
    <div className={`${color} px-6 py-4 flex items-center gap-3 text-white`}>
      {icon}
      <h3 className="font-bold tracking-tight">{title}</h3>
    </div>
    <div className="p-6 space-y-4 flex-grow">
      {items.map((item, idx) => (
        <div key={idx} className="group border-b border-slate-50 last:border-0 pb-3 last:pb-0">
          <p className="font-black text-slate-800 text-sm mb-1 flex items-center">
            <div className={`w-1.5 h-1.5 rounded-full ${color} mr-2`} />
            {item.name}
          </p>
          <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">{item.detail}</p>
        </div>
      ))}
    </div>
  </div>
);

const MonitoringRow: React.FC<{ label: string, sub: string, init: string, stable: string }> = ({ label, sub, init, stable }) => (
  <tr className="hover:bg-slate-50 transition-colors">
    <td className="px-8 py-6">
      <p className="font-black text-slate-800 text-sm">{label}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5 italic">{sub}</p>
    </td>
    <td className="px-8 py-6 text-center text-sm font-bold text-indigo-600 bg-indigo-50/20">{init}</td>
    <td className="px-8 py-6 text-center text-sm font-medium text-slate-600">{stable}</td>
  </tr>
);

export default ComplicationsPanel;

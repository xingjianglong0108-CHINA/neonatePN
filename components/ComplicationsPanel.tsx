
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
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000 space-y-10 pb-20">
      <header className="border-b border-slate-200 pb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 flex items-center tracking-tighter">
            <ShieldAlert className="w-10 h-10 mr-4 text-rose-500" />
            PN 常见并发症及临床监测
          </h2>
          <p className="text-slate-500 mt-2 text-lg font-medium">早期发现、规范监测、预防为主：基于 2025 专家共识标准</p>
        </div>
        <div className="bg-rose-50 border border-rose-100 px-4 py-2 rounded-xl flex items-center gap-2">
           <AlertTriangle className="w-4 h-4 text-rose-500" />
           <span className="text-xs font-black text-rose-600 uppercase tracking-widest">High Vigilance Required</span>
        </div>
      </header>

      {/* 常见并发症分类 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ComplicationCard 
          title="代谢性并发症 Metabolic" 
          icon={<Zap className="w-5 h-5" />} 
          color="bg-amber-500"
          accentColor="text-amber-600"
          bgColor="bg-amber-50"
          items={[
            { name: "糖代谢紊乱", detail: "高血糖 (> 8.3 mmol/L) 或低血糖 (< 2.6 mmol/L)。需动态调整 GIR 或按需加用胰岛素。" },
            { name: "电解质失衡", detail: "高/低钠、高/低钾。常与肾功能成熟度、非显性失水、药物协同相关。" },
            { name: "高甘油三酯血症", detail: "TG > 2.26 mmol/L 应减慢输注速度。若 > 4.52 mmol/L 需暂停脂肪乳。" },
            { name: "代谢性骨病", detail: "长期 PN (>4w) 易发。需监测 ALP、Ca/P 比例，确保足够的钙磷摄入。" }
          ]}
        />
        <ComplicationCard 
          title="感染性并发症 Infectious" 
          icon={<Flame className="w-5 h-5" />} 
          color="bg-rose-500"
          accentColor="text-rose-600"
          bgColor="bg-rose-50"
          items={[
            { name: "导管相关性血流感染 (CRBSI)", detail: "最严重并发症。表现为体温波动、反应差、血糖骤变、导管处红肿。" },
            { name: "关键预防手段", detail: "严格手卫生、最大化无菌屏障、导管专口专用、含氯己定敷料应用。" },
            { name: "诊疗原则", detail: "怀疑感染需同时抽导管与外周血培养。根据结果决定是否封管或拔管。" }
          ]}
        />
        <ComplicationCard 
          title="肝胆系统并发症 Hepatobiliary" 
          icon={<Activity className="w-5 h-5" />} 
          color="bg-indigo-500"
          accentColor="text-indigo-600"
          bgColor="bg-indigo-50"
          items={[
            { name: "PN 相关肝病 (PNALD)", detail: "胆汁淤积 (DB > 34.2 μmol/L)。风险与 PN 持续时间成正比。" },
            { name: "干预黄金法则", detail: "尽早启动 EN (微量喂养)、减少糖脂比例、考虑含有鱼油的复合脂肪乳。" },
            { name: "核心监测指标", detail: "TB/DB 分类胆红素、GGT 碱性磷酸酶、血清转氨酶 (ALT/AST)。" }
          ]}
        />
        <ComplicationCard 
          title="机械性并发症 Mechanical" 
          icon={<AlertTriangle className="w-5 h-5" />} 
          color="bg-slate-600"
          accentColor="text-slate-700"
          bgColor="bg-slate-50"
          items={[
            { name: "置管损伤", detail: "包括误入动脉、气胸、心律失常。置管后必须影像学定位确认。" },
            { name: "血栓形成", detail: "PICC/CVC 常见并发症。表现为单侧肢体肿胀。需监测 D-二聚体及超声检查。" },
            { name: "渗漏外渗", detail: "高渗液外渗可致组织坏死。外周输注严格限 900 mOsm/L 渗透压。" }
          ]}
        />
      </div>

      {/* 临床监测计划表格 */}
      <section className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/40 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-10 py-8 flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-lg border border-white/20">
              <ClipboardList className="w-7 h-7" />
            </div>
            <div>
               <h3 className="text-2xl font-black tracking-tight">临床监测建议方案</h3>
               <p className="text-white/70 text-xs font-bold uppercase tracking-widest mt-0.5">Clinical Monitoring Schedule</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/10 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 shadow-inner">
            <Clock className="w-4 h-4" /> 实验室核心监测指南
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black uppercase text-[10px] tracking-widest border-b border-slate-50">
                <th className="px-10 py-6 text-left">监测项目 Item</th>
                <th className="px-10 py-6 text-center bg-blue-50/30">PN 初期 / 不稳定期 (Init)</th>
                <th className="px-10 py-6 text-center">PN 稳定期 (Stable)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              <MonitoringRow label="临床体征" sub="神志、肤色、腹部、导管完整性" init="每班 (Q8H) / 每日" stable="每日" />
              <MonitoringRow label="体重" sub="生长潜力及入水量评价" init="每日 (QD)" stable="每周 3 次" />
              <MonitoringRow label="出入水量 / 尿量" sub="评估体液平衡" init="每班记录" stable="每日统计" />
              <MonitoringRow label="血常规 / 血糖" sub="基础状态与耐受度" init="每日或隔日" stable="每周 1-2 次" />
              <MonitoringRow label="电解质 / 血气" sub="稳态调节与代谢平衡" init="每日" stable="每周 1 次" />
              <MonitoringRow label="肝功能 / 胆红素" sub="器官受损早期监测" init="每周 1-2 次" stable="每周 1 次" />
              <MonitoringRow label="血甘油三酯 (TG)" sub="脂代谢安全评估" init="调整剂量 24h 后" stable="每周 1 次" />
              <MonitoringRow label="肾功能 / BUN" sub="溶质负荷评估" init="每周 1 次" stable="每 2 周 1 次" />
            </tbody>
          </table>
        </div>
      </section>

      {/* 底部专家提醒 - 淡蓝色风格 */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100/50 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-8 shadow-inner shadow-blue-200/20">
        <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-100/50 flex-shrink-0 group transition-transform hover:scale-105">
          <Stethoscope className="w-12 h-12 text-indigo-500" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
             <h4 className="font-black text-slate-800 text-2xl tracking-tight uppercase">专家组核心预防建议</h4>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            2025 共识郑重强调：<strong>肠外营养仅仅是过渡阶段。</strong> 
            一旦胃肠道耐受，应尽可能加快肠内营养进度。 
            当患儿能够通过肠内喂养满足总热卡的 <strong>75% 以上</strong>时，
            应按计划逐步减量并最终停止静脉营养，以降低长期并发症风险。
          </p>
        </div>
        <div className="flex-shrink-0 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/80 text-center">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Goal Point</p>
           <p className="text-2xl font-black text-indigo-600">75% EN</p>
        </div>
      </div>
    </div>
  );
};

const ComplicationCard: React.FC<{ 
  title: string, 
  icon: React.ReactNode, 
  color: string, 
  accentColor: string, 
  bgColor: string,
  items: { name: string, detail: string }[] 
}> = ({ title, icon, color, accentColor, bgColor, items }) => (
  <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden flex flex-col hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 group">
    <div className={`${color} px-8 py-6 flex items-center gap-4 text-white relative`}>
      <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shadow-inner">
        {icon}
      </div>
      <h3 className="font-black tracking-tight text-lg">{title}</h3>
      {/* 装饰性背景 */}
      <div className="absolute top-0 right-0 p-4 opacity-10">
         {icon}
      </div>
    </div>
    <div className="p-8 space-y-6 flex-grow">
      {items.map((item, idx) => (
        <div key={idx} className="group-hover:translate-x-1 transition-transform">
          <div className="flex items-center gap-3 mb-1.5">
            <div className={`w-2 h-2 rounded-full ${color}`} />
            <p className={`font-black ${accentColor} text-sm`}>
              {item.name}
            </p>
          </div>
          <div className={`${bgColor} rounded-2xl p-4 border border-white`}>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MonitoringRow: React.FC<{ label: string, sub: string, init: string, stable: string }> = ({ label, sub, init, stable }) => (
  <tr className="hover:bg-slate-50 transition-colors group">
    <td className="px-10 py-7">
      <p className="font-black text-slate-800 text-base">{label}</p>
      <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tight mt-1 transition-colors group-hover:text-indigo-400">{sub}</p>
    </td>
    <td className="px-10 py-7 text-center font-black text-indigo-600 bg-blue-50/20">{init}</td>
    <td className="px-10 py-7 text-center text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{stable}</td>
  </tr>
);

export default ComplicationsPanel;


import React, { useState } from 'react';
import { Calculator, BookOpen, Activity, Info, ListChecks, TrendingUp, ShieldAlert } from 'lucide-react';
import CalculatorBasic from './components/CalculatorBasic';
import CalculatorAdvanced from './components/CalculatorAdvanced';
import ReferencePanel from './components/ReferencePanel';
import StrategyAdvisor from './components/StrategyAdvisor';
import ComplicationsPanel from './components/ComplicationsPanel';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'strategy' | 'ref' | 'comp'>('basic');

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      {/* Premium Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-2xl border-b border-slate-200/60">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200/50 transition-transform hover:scale-105 cursor-pointer">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-800">新生儿肠外营养 (PN) 系统</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500">
                  LZRYEK DESIGN
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Ver 2025.03</span>
              </div>
            </div>
          </div>
          
          {/* Segmented Control Style Navigation */}
          <nav className="flex bg-slate-200/50 p-1.5 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar shadow-inner border border-white/40">
            <NavButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} icon={<Calculator className="w-4 h-4" />} label="基础" />
            <NavButton active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')} icon={<TrendingUp className="w-4 h-4" />} label="精细" />
            <NavButton active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} icon={<ListChecks className="w-4 h-4" />} label="路径" />
            <NavButton active={activeTab === 'comp'} onClick={() => setActiveTab('comp')} icon={<ShieldAlert className="w-4 h-4" />} label="监测" />
            <NavButton active={activeTab === 'ref'} onClick={() => setActiveTab('ref')} icon={<BookOpen className="w-4 h-4" />} label="资料" />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'basic' && <CalculatorBasic />}
          {activeTab === 'advanced' && <CalculatorAdvanced />}
          {activeTab === 'strategy' && <StrategyAdvisor />}
          {activeTab === 'comp' && <ComplicationsPanel />}
          {activeTab === 'ref' && <ReferencePanel />}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white/50 backdrop-blur-md">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center space-x-2 text-slate-400 mb-3">
            <Info className="w-4 h-4" />
            <span className="text-xs font-medium">临床辅助工具，最终医疗决策请咨询执业医师判断。</span>
          </div>
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">&copy; 2025 NEONATAL NUTRITION SUITE</p>
            <div className="flex gap-4">
               <span className="text-[9px] font-bold text-slate-300">BASED ON ESPGHAN/CSPEN GUIDELINES</span>
               <span className="text-[9px] font-bold text-slate-300">PRIVACY PROTECTED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${active ? 'bg-white text-indigo-600 shadow-md border border-indigo-100/50' : 'text-slate-500 hover:text-indigo-500 hover:bg-white/40'}`}
  >
    <span className={`${active ? 'scale-110' : 'scale-100'} transition-transform`}>{icon}</span>
    <span>{label}</span>
  </button>
);

export default App;

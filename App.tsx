
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900">新生儿肠外营养 (PN) 系统</h1>
              <p className="text-sm font-black tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                LZRYEK
              </p>
            </div>
          </div>
          
          {/* Segmented Control Style Navigation */}
          <nav className="flex bg-slate-100 p-1 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
            <NavButton active={activeTab === 'basic'} onClick={() => setActiveTab('basic')} icon={<Calculator className="w-4 h-4" />} label="基础" />
            <NavButton active={activeTab === 'advanced'} onClick={() => setActiveTab('advanced')} icon={<TrendingUp className="w-4 h-4" />} label="精细" />
            <NavButton active={activeTab === 'strategy'} onClick={() => setActiveTab('strategy')} icon={<ListChecks className="w-4 h-4" />} label="路径" />
            <NavButton active={activeTab === 'comp'} onClick={() => setActiveTab('comp')} icon={<ShieldAlert className="w-4 h-4" />} label="监测" />
            <NavButton active={activeTab === 'ref'} onClick={() => setActiveTab('ref')} icon={<BookOpen className="w-4 h-4" />} label="资料" />
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'basic' && <CalculatorBasic />}
          {activeTab === 'advanced' && <CalculatorAdvanced />}
          {activeTab === 'strategy' && <StrategyAdvisor />}
          {activeTab === 'comp' && <ComplicationsPanel />}
          {activeTab === 'ref' && <ReferencePanel />}
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="py-10 border-t border-slate-200 bg-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center items-center space-x-2 text-slate-400 mb-2">
            <Info className="w-4 h-4" />
            <span className="text-[11px] font-medium">所有治疗决策应遵循执业医师临床判断。</span>
          </div>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">&copy; 2025 NEONATAL NUTRITION SUITE • LZRYEK DESIGN</p>
        </div>
      </footer>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 whitespace-nowrap ${active ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

export default App;

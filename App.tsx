
import React, { useState } from 'react';
import { Calculator, BookOpen, Activity, Info, ListChecks, TrendingUp } from 'lucide-react';
import CalculatorBasic from './components/CalculatorBasic';
import CalculatorAdvanced from './components/CalculatorAdvanced';
import ReferencePanel from './components/ReferencePanel';
import StrategyAdvisor from './components/StrategyAdvisor';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'strategy' | 'ref'>('basic');

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-indigo-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-3 mb-4 md:mb-0">
            <Activity className="w-8 h-8 text-indigo-200" />
            <div>
              <h1 className="text-xl font-bold tracking-tight">新生儿肠外营养 (PN) 计算系统</h1>
              <p className="text-xs text-indigo-100 opacity-80">参考《新生儿肠外营养管理专家共识 (2025)》</p>
            </div>
          </div>
          
          <nav className="flex bg-indigo-800/50 rounded-lg p-1 overflow-x-auto">
            <button 
              onClick={() => setActiveTab('basic')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'basic' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:bg-indigo-700 text-indigo-100'}`}
            >
              <Calculator className="w-4 h-4" />
              <span>基础计算器</span>
            </button>
            <button 
              onClick={() => setActiveTab('advanced')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'advanced' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:bg-indigo-700 text-indigo-100'}`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>精细评估</span>
            </button>
            <button 
              onClick={() => setActiveTab('strategy')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'strategy' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:bg-indigo-700 text-indigo-100'}`}
            >
              <ListChecks className="w-4 h-4" />
              <span>临床路径</span>
            </button>
            <button 
              onClick={() => setActiveTab('ref')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all flex items-center space-x-2 whitespace-nowrap ${activeTab === 'ref' ? 'bg-white text-indigo-700 shadow-sm' : 'hover:bg-indigo-700 text-indigo-100'}`}
            >
              <BookOpen className="w-4 h-4" />
              <span>参考表格</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'basic' && <CalculatorBasic />}
          {activeTab === 'advanced' && <CalculatorAdvanced />}
          {activeTab === 'strategy' && <StrategyAdvisor />}
          {activeTab === 'ref' && <ReferencePanel />}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center space-x-2 text-slate-500 mb-2">
            <Info className="w-4 h-4" />
            <span className="text-xs">本工具仅供临床辅助参考，具体用药方案需由主治医师根据患儿实际病情调整。</span>
          </div>
          <p className="text-xs text-slate-400">&copy; 2025 新生儿营养管理工具集 - 基于专家共识构建</p>
        </div>
      </footer>
    </div>
  );
};

export default App;

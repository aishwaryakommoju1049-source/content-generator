import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  FlaskConical,
  BookOpen,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export type NavTab = 'studio' | 'evaluator' | 'failed-cases' | 'regression' | 'knowledge-base';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  unresolvedCount: number;
  hasGeminiKey: boolean;
  totalChunks: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unresolvedCount,
  hasGeminiKey,
  totalChunks,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
              <Cpu className="w-5 h-5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">CognitiveForge</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  RAG Studio
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">AI Learning Content Generator & Quality Pipeline</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('evaluator')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'evaluator'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Evaluator & Rubric</span>
            </button>

            <button
              onClick={() => setActiveTab('failed-cases')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 relative ${
                activeTab === 'failed-cases'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Review Queue</span>
              {unresolvedCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                  {unresolvedCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('regression')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'regression'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FlaskConical className="w-4 h-4" />
              <span>Regression Bench</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge-base')}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'knowledge-base'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Corpus ({totalChunks})</span>
            </button>
          </nav>

          {/* System Status Indicators */}
          <div className="hidden lg:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className={`w-2 h-2 rounded-full ${hasGeminiKey ? 'bg-emerald-400 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="font-mono text-[11px] text-slate-400">
                {hasGeminiKey ? 'Gemini 3.8 Flash' : 'Simulated LLM Engine'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

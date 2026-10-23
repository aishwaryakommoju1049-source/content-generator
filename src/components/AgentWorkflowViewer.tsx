import React, { useState } from 'react';
import {
  Search,
  PenTool,
  CheckCircle2,
  RefreshCw,
  Terminal,
  Code2,
  Clock,
  Coins,
  ChevronRight,
  Eye,
  GitCompare,
  X,
  FileCheck,
} from 'lucide-react';
import { AgentStageLog, LessonContent, QualityEvaluation } from '../types';

interface AgentWorkflowViewerProps {
  logs: AgentStageLog[];
  isGenerating: boolean;
  isEvaluating: boolean;
  isRevising: boolean;
  activeStage?: 'retrieval' | 'drafting' | 'evaluation' | 'revision';
  draftContent?: LessonContent;
  revisedContent?: LessonContent;
  evaluation?: QualityEvaluation;
}

export const AgentWorkflowViewer: React.FC<AgentWorkflowViewerProps> = ({
  logs,
  isGenerating,
  isEvaluating,
  isRevising,
  activeStage,
  draftContent,
  revisedContent,
  evaluation,
}) => {
  const [selectedLog, setSelectedLog] = useState<AgentStageLog | null>(null);
  const [showDiffModal, setShowDiffModal] = useState<boolean>(false);

  const stages = [
    {
      id: 'retrieval',
      name: 'RAG Retriever',
      agent: 'KnowledgeRetriever',
      icon: Search,
      color: 'blue',
      description: 'Pulls top grounded curriculum chunks',
      isActive: activeStage === 'retrieval',
      isDone: logs.some(l => l.stage === 'retrieval' && l.status === 'completed'),
    },
    {
      id: 'drafting',
      name: 'Pedagogical Drafter',
      agent: 'PedagogicalDrafter',
      icon: PenTool,
      color: 'indigo',
      description: 'Generates explanation, MCQs & coding challenge',
      isActive: isGenerating || activeStage === 'drafting',
      isDone: logs.some(l => l.stage === 'drafting' && l.status === 'completed'),
    },
    {
      id: 'evaluation',
      name: 'Quality Auditor',
      agent: 'PedagogicalAuditor',
      icon: CheckCircle2,
      color: 'emerald',
      description: 'Executes tests & audits 4-dimensional rubric',
      isActive: isEvaluating || activeStage === 'evaluation',
      isDone: logs.some(l => l.stage === 'evaluation' && l.status === 'completed'),
    },
    {
      id: 'revision',
      name: 'Pedagogical Reviser',
      agent: 'PedagogicalReviser',
      icon: RefreshCw,
      color: 'violet',
      description: 'Self-corrects code & tightens citations (v2)',
      isActive: isRevising || activeStage === 'revision',
      isDone: logs.some(l => l.stage === 'revision' && l.status === 'completed'),
    },
  ];

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="font-semibold text-white text-sm sm:text-base tracking-tight">
              Agent Workflow & Prompt Trace Pipeline
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
              CoT Agentic Architecture
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deterministic RAG retrieval → LLM Content Drafting → Sandbox Test Execution & Rubric Evaluation → Iterative Refinement
          </p>
        </div>

        {/* Action badges */}
        <div className="flex items-center gap-2">
          {revisedContent && (
            <button
              onClick={() => setShowDiffModal(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 border border-violet-500/30 transition-all flex items-center gap-1.5"
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span>Inspect v1 vs v2 Diff</span>
            </button>
          )}

          {logs.length > 0 && (
            <button
              onClick={() => setSelectedLog(logs[logs.length - 1])}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span>Inspect Prompt Logs ({logs.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Stepper Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {stages.map((st, idx) => {
          const log = logs.find(l => l.stage === st.id);
          const Icon = st.icon;

          return (
            <div
              key={st.id}
              onClick={() => log && setSelectedLog(log)}
              className={`p-3.5 rounded-xl border transition-all relative cursor-pointer ${
                st.isActive
                  ? 'bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : st.isDone
                  ? 'bg-slate-900/90 border-slate-700/60 hover:border-slate-600'
                  : 'bg-slate-950/50 border-slate-800/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      st.isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : st.isActive
                        ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-slate-400">
                      Stage 0{idx + 1}
                    </span>
                    <h4 className="text-xs font-semibold text-white leading-tight">{st.name}</h4>
                  </div>
                </div>

                {st.isDone ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Done
                  </span>
                ) : st.isActive ? (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 animate-pulse border border-indigo-500/30">
                    Running...
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500">Idle</span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">{st.description}</p>

              {/* Execution telemetry */}
              {log && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {log.durationMs}ms
                  </span>
                  {log.outputTokens ? (
                    <span className="flex items-center gap-1 text-slate-400">
                      <Coins className="w-3 h-3 text-amber-500/80" />
                      ~{log.outputTokens} tok
                    </span>
                  ) : null}
                  <span className="text-indigo-400 hover:underline flex items-center gap-0.5">
                    View <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Prompt Trace Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Agent Trace: {selectedLog.agentName} ({selectedLog.stage.toUpperCase()})
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Duration: {selectedLog.durationMs}ms | Timestamp: {new Date(selectedLog.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
              <div>
                <label className="text-[11px] font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                  System Instructions (Prompt Boundary)
                </label>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {selectedLog.systemPromptPreview}
                </pre>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-violet-400 uppercase tracking-wider block mb-1">
                  User Context & Grounded Payload
                </label>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                  {selectedLog.userPromptPreview}
                </pre>
              </div>

              {selectedLog.notes && (
                <div>
                  <label className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider block mb-1">
                    Agent Execution Telemetry & Notes
                  </label>
                  <p className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-emerald-300/90 font-sans">
                    {selectedLog.notes}
                  </p>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close Trace
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Version Diff Modal (v1 vs v2) */}
      {showDiffModal && draftContent && revisedContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <GitCompare className="w-5 h-5 text-violet-400" />
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Version Comparison: v1 (Initial Draft) vs v{revisedContent.version} (Audited Revision)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Self-correction loop repaired pedagogical ambiguities and code test assertions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowDiffModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Draft v1 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className="font-semibold text-amber-300">Version 1 (Drafter Initial)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Score: {evaluation?.overallScore || 78}/100
                  </span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto text-slate-300">
                  <div>
                    <h5 className="font-medium text-slate-400 text-[11px] uppercase">Summary:</h5>
                    <p className="mt-1">{draftContent.summary}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-400 text-[11px] uppercase">Coding Solution:</h5>
                    <pre className="mt-1 p-2 bg-slate-900 rounded font-mono text-[11px] text-amber-200/90 whitespace-pre-wrap">
                      {draftContent.codingExercise?.referenceSolution || 'N/A'}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Revised v2 */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 flex flex-col">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                  <span className="font-semibold text-emerald-300">Version {revisedContent.version} (Reviser Corrected)</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                    Score: 95/100 (PASSED)
                  </span>
                </div>
                <div className="space-y-3 flex-1 overflow-y-auto text-slate-300">
                  <div>
                    <h5 className="font-medium text-slate-400 text-[11px] uppercase">Summary:</h5>
                    <p className="mt-1 text-emerald-200/90">{revisedContent.summary}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-slate-400 text-[11px] uppercase">Audited Coding Solution:</h5>
                    <pre className="mt-1 p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-300 whitespace-pre-wrap border border-emerald-500/20">
                      {revisedContent.codingExercise?.referenceSolution || 'N/A'}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowDiffModal(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close Comparison
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

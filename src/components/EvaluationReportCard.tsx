import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Terminal,
  RefreshCw,
  Sparkles,
  BookCheck,
  Compass,
  FileCheck2,
  Activity,
  ArrowRight,
  Info,
} from 'lucide-react';
import { QualityEvaluation, LessonContent } from '../types';

interface EvaluationReportCardProps {
  evaluation: QualityEvaluation;
  content: LessonContent;
  onTriggerRevise?: () => void;
  isRevising?: boolean;
}

export const EvaluationReportCard: React.FC<EvaluationReportCardProps> = ({
  evaluation,
  content,
  onTriggerRevise,
  isRevising = false,
}) => {
  const getStatusBadge = () => {
    switch (evaluation.status) {
      case 'passed':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            QUALITY GATE: PASSED (≥80)
          </span>
        );
      case 'needs_revision':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <AlertTriangle className="w-3.5 h-3.5" />
            QUALITY GATE: NEEDS REVISION
          </span>
        );
      case 'critical_fail':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 shadow-sm">
            <XCircle className="w-3.5 h-3.5" />
            QUALITY GATE: CRITICAL REJECT
          </span>
        );
    }
  };

  const getMetricColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 bg-emerald-500';
    if (score >= 80) return 'text-indigo-400 bg-indigo-500';
    if (score >= 65) return 'text-amber-400 bg-amber-500';
    return 'text-rose-400 bg-rose-500';
  };

  const metricsList = [
    {
      id: 'correctness',
      name: 'Correctness',
      subtitle: 'Technical accuracy & test assertions',
      metric: evaluation.metrics.correctness,
      icon: CheckCircle2,
    },
    {
      id: 'clarity',
      name: 'Clarity & Pedagogy',
      subtitle: 'Cognitive scaffolding & mental models',
      metric: evaluation.metrics.clarity,
      icon: Compass,
    },
    {
      id: 'relevance',
      name: 'Relevance',
      subtitle: 'Target skill tier & topic alignment',
      metric: evaluation.metrics.relevance,
      icon: FileCheck2,
    },
    {
      id: 'grounding',
      name: 'Source Grounding',
      subtitle: 'Faithfulness to approved chunks',
      metric: evaluation.metrics.sourceGrounding,
      icon: BookCheck,
    },
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Top Banner & Overall Score */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Automated Pedagogical Quality Report
            </h2>
            <span className="text-xs text-slate-400 font-mono">ID: {evaluation.id.slice(0, 14)}</span>
          </div>
          <p className="text-xs text-slate-400">
            Multi-dimensional evaluation against syllabus ground truth and sandboxed code execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {getStatusBadge()}
          <div className="flex items-baseline gap-1 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800">
            <span className="text-xl sm:text-2xl font-black text-white">{evaluation.overallScore}</span>
            <span className="text-xs font-medium text-slate-400">/ 100</span>
          </div>
        </div>
      </div>

      {/* 4-Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricsList.map(item => {
          const Icon = item.icon;
          const { score, rating, rationale, flaggedIssues } = item.metric;
          const colorClass = getMetricColor(score);

          return (
            <div
              key={item.id}
              className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                    {item.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-white">{score}%</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-1.5 mb-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClass.split(' ')[1]}`}
                    style={{ width: `${score}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="text-slate-400">{item.subtitle}</span>
                  <span
                    className={`font-semibold ${
                      rating === 'Exemplary'
                        ? 'text-emerald-400'
                        : rating === 'Proficient'
                        ? 'text-indigo-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {rating}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3 mb-2">{rationale}</p>
              </div>

              {flaggedIssues && flaggedIssues.length > 0 && (
                <div className="mt-2 pt-2 border-t border-slate-800/60">
                  <span className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider block mb-1">
                    Flagged ({flaggedIssues.length})
                  </span>
                  <ul className="text-[10px] text-rose-300/80 space-y-0.5">
                    {flaggedIssues.slice(0, 2).map((issue, idx) => (
                      <li key={idx} className="line-clamp-1">
                        • {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Code Sandbox Test Runner Results */}
      {evaluation.codeExecutionDetails && (
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs sm:text-sm font-semibold text-white">
                Sandboxed Code Test Suite Execution
              </h4>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">
                {evaluation.codeExecutionDetails.passed} / {evaluation.codeExecutionDetails.totalTests} Passed
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  evaluation.codeExecutionPassed
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                }`}
              >
                {evaluation.codeExecutionPassed ? 'ALL ASSERTIONS PASSED' : 'TESTS FAILED'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {evaluation.codeExecutionDetails.testResults.map((tr, idx) => (
              <div
                key={idx}
                className={`p-2.5 rounded-lg border flex items-center justify-between text-xs font-mono ${
                  tr.passed
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    : 'bg-rose-950/20 border-rose-800/40 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {tr.passed ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )}
                  <span className="font-semibold text-white">{tr.testName}</span>
                  {tr.errorMessage && (
                    <span className="text-rose-400 text-[11px] truncate">({tr.errorMessage})</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 shrink-0">
                  {tr.output && <span>out: {tr.output}</span>}
                  <span>{tr.executionTimeMs}ms</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hallucination Risk & Recommendations Footer */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Hallucination Risk:
            </span>
            <span
              className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                evaluation.hallucinationRisk === 'low'
                  ? 'bg-emerald-500/10 text-emerald-400'
                  : evaluation.hallucinationRisk === 'moderate'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-rose-500/10 text-rose-400'
              }`}
            >
              {evaluation.hallucinationRisk}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {evaluation.recommendedActions[0] || 'Module meets pedagogical standards.'}
          </p>
        </div>

        {/* Trigger revision button if needed */}
        {evaluation.status !== 'passed' && onTriggerRevise && (
          <button
            onClick={onTriggerRevise}
            disabled={isRevising}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isRevising ? 'animate-spin' : ''}`} />
            <span>{isRevising ? 'Reviser Agent in Progress...' : 'Trigger Agent Auto-Revision Loop'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

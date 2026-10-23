import React, { useState } from 'react';
import {
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Filter,
  Eye,
  RefreshCw,
  Check,
  X,
  FileCode,
  ShieldAlert,
  ArrowRight,
  Terminal,
} from 'lucide-react';
import { FailedCaseItem } from '../types';
import { api } from '../services/api';

interface FailedCasesQueueProps {
  failedCases: FailedCaseItem[];
  onRefresh: () => void;
  onSelectCaseForRevision?: (item: FailedCaseItem) => void;
}

export const FailedCasesQueue: React.FC<FailedCasesQueueProps> = ({
  failedCases,
  onRefresh,
  onSelectCaseForRevision,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'unresolved' | 'in_review' | 'fixed'>('all');
  const [selectedCase, setSelectedCase] = useState<FailedCaseItem | null>(null);
  const [reviewerNoteInput, setReviewerNoteInput] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const filteredCases = failedCases.filter(c => {
    if (filterStatus === 'all') return true;
    return c.status === filterStatus;
  });

  const handleAction = async (id: string, action: 'approve_override' | 'dismiss' | 'mark_in_review') => {
    setIsUpdating(true);
    try {
      await api.actOnFailedCase(id, action, reviewerNoteInput);
      onRefresh();
      if (selectedCase?.id === id) {
        setSelectedCase(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Quality Gate Audit & Failed Cases Queue
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              {failedCases.filter(c => c.status === 'unresolved').length} Unresolved
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Human-in-the-loop triaging for hallucination risks, broken code test suites, or rubric deficiencies.
          </p>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto">
          {(['all', 'unresolved', 'in_review', 'fixed'] as const).map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Table / Cards */}
      {filteredCases.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-white">Review Queue is Clear!</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            All generated modules have satisfied the automated quality rubric standards and passed their unit test suites.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filteredCases.map(item => {
            const isHigh = item.severity === 'high';
            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-4.5 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isHigh
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {item.severity} Severity
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        item.status === 'fixed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : item.status === 'in_review'
                          ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono text-slate-500">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white truncate">{item.topic}</h3>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                    <span className="text-rose-400 font-medium">Issue: {item.primaryIssue}</span>
                    {item.failedCodeTestsCount > 0 && (
                      <span className="flex items-center gap-1 text-rose-300 font-mono">
                        <Terminal className="w-3.5 h-3.5" />
                        {item.failedCodeTestsCount} code test assertion(s) failed
                      </span>
                    )}
                  </div>

                  {/* Rubric scores chip row */}
                  <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-slate-400">
                    <span>Corr: {item.metrics.correctness}%</span>
                    <span>•</span>
                    <span>Grounding: {item.metrics.grounding}%</span>
                    <span>•</span>
                    <span>Clarity: {item.metrics.clarity}%</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setSelectedCase(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>

                  {item.status !== 'fixed' && onSelectCaseForRevision && (
                    <button
                      onClick={() => onSelectCaseForRevision(item)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 flex items-center gap-1.5 transition-all"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-Run Agent</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Audit Triage: {selectedCase.topic}</h3>
                  <p className="text-xs text-slate-400 font-mono">Case ID: {selectedCase.id}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCase(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Flagged reasons */}
              <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-800/40">
                <h4 className="font-semibold text-rose-300 uppercase tracking-wider text-[11px] mb-1.5">
                  Flagged Auditor Violations
                </h4>
                <ul className="space-y-1 text-slate-300">
                  {selectedCase.flaggedReasons.map((reason, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Failing test details */}
              {selectedCase.sessionData.evaluation.codeExecutionDetails && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
                    Unit Test Execution Output
                  </h4>
                  {selectedCase.sessionData.evaluation.codeExecutionDetails.testResults.map((t, idx) => (
                    <div
                      key={idx}
                      className={`p-2 rounded font-mono text-[11px] ${
                        t.passed ? 'text-emerald-400 bg-emerald-950/20' : 'text-rose-400 bg-rose-950/30'
                      }`}
                    >
                      {t.passed ? '✓' : '✗'} {t.testName}: {t.errorMessage || 'PASSED'}
                    </div>
                  ))}
                </div>
              )}

              {/* Reviewer Note Input */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block">
                  Human Auditor Override / Triage Annotation
                </label>
                <textarea
                  value={reviewerNoteInput}
                  onChange={e => setReviewerNoteInput(e.target.value)}
                  placeholder="e.g. Approved edge case behavior after reviewing course curriculum syllabus standard..."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                Cancel
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleAction(selectedCase.id, 'dismiss')}
                  disabled={isUpdating}
                  className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Dismiss Case
                </button>
                <button
                  onClick={() => handleAction(selectedCase.id, 'approve_override')}
                  disabled={isUpdating}
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                >
                  Approve Human Override
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

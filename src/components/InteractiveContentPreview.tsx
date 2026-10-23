import React, { useState } from 'react';
import {
  BookOpen,
  HelpCircle,
  Code2,
  Quote,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Sparkles,
  Lightbulb,
  Check,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { LessonContent, CodeTestCase } from '../types';
import { api, CodeRunResponse } from '../services/api';

interface InteractiveContentPreviewProps {
  content: LessonContent;
  revisedContent?: LessonContent;
  currentVersion: number;
  onVersionChange: (v: number) => void;
}

export const InteractiveContentPreview: React.FC<InteractiveContentPreviewProps> = ({
  content,
  revisedContent,
  currentVersion,
  onVersionChange,
}) => {
  const activeContent = currentVersion === 2 && revisedContent ? revisedContent : content;
  const [activeTab, setActiveTab] = useState<'lesson' | 'mcqs' | 'coding' | 'citations'>('lesson');

  // MCQ state: selected option per question ID
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [showMCQExplanations, setShowMCQExplanations] = useState<Record<string, boolean>>({});

  // Coding sandbox state
  const [userCode, setUserCode] = useState<string>(activeContent.codingExercise?.starterCode || '');
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [codeRunResult, setCodeRunResult] = useState<CodeRunResponse | null>(null);
  const [showHints, setShowHints] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Sync userCode when active content changes
  React.useEffect(() => {
    if (activeContent.codingExercise?.starterCode) {
      setUserCode(activeContent.codingExercise.starterCode);
      setCodeRunResult(null);
    }
  }, [activeContent]);

  const handleOptionSelect = (qId: string, optId: string) => {
    setSelectedOptions(prev => ({ ...prev, [qId]: optId }));
    setShowMCQExplanations(prev => ({ ...prev, [qId]: true }));
  };

  const handleRunCodeTests = async () => {
    if (!activeContent.codingExercise) return;
    setIsRunningCode(true);
    try {
      const res = await api.runCode(
        userCode,
        activeContent.codingExercise.testCases,
        activeContent.codingExercise.language || 'python'
      );
      setCodeRunResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunningCode(false);
    }
  };

  const handleLoadSolution = () => {
    if (activeContent.codingExercise?.referenceSolution) {
      setUserCode(activeContent.codingExercise.referenceSolution);
    }
  };

  const handleResetStarter = () => {
    if (activeContent.codingExercise?.starterCode) {
      setUserCode(activeContent.codingExercise.starterCode);
      setCodeRunResult(null);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(userCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
      {/* Top Header & Version Bar */}
      <div className="p-5 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              {activeContent.difficulty}
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-400 font-mono">Module #{activeContent.id.slice(0, 10)}</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-white">{activeContent.topic}</h2>
        </div>

        {/* Version Switcher if revised content exists */}
        {revisedContent && (
          <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onVersionChange(1)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                currentVersion === 1
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              v1 (Draft)
            </button>
            <button
              onClick={() => onVersionChange(2)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                currentVersion === 2
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              v2 (Audited & Revised)
            </button>
          </div>
        )}
      </div>

      {/* Internal Subtabs */}
      <div className="flex items-center px-5 border-b border-slate-800 bg-slate-950/40 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('lesson')}
          className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'lesson'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Lesson Explanation</span>
        </button>

        <button
          onClick={() => setActiveTab('mcqs')}
          className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'mcqs'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>MCQ Assessment ({activeContent.mcqs.length})</span>
        </button>

        {activeContent.codingExercise && (
          <button
            onClick={() => setActiveTab('coding')}
            className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'coding'
                ? 'border-indigo-500 text-indigo-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>Coding Sandbox</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('citations')}
          className={`py-3 px-3 text-xs sm:text-sm font-medium border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'citations'
              ? 'border-indigo-500 text-indigo-400 font-semibold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Quote className="w-4 h-4" />
          <span>Source Grounding ({activeContent.sourceCitations.length})</span>
        </button>
      </div>

      {/* Tab 1: Lesson Explanation */}
      {activeTab === 'lesson' && (
        <div className="p-6 space-y-6 text-slate-300">
          {/* Summary & Learning Objectives */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h3 className="text-sm font-semibold text-white mb-2">Executive Summary</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">{activeContent.summary}</p>

            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Learning Objectives
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {activeContent.learningObjectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mental Model Analogy Callout */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/40 to-violet-950/40 border border-indigo-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h4 className="text-xs sm:text-sm font-bold text-indigo-200">
                Intuitive Mental Model & Real-World Analogy
              </h4>
            </div>
            <p className="text-xs text-indigo-100/90 leading-relaxed italic">
              "{activeContent.mentalModelAnalogy}"
            </p>
          </div>

          {/* Main Lesson Content */}
          <div className="space-y-4 text-xs sm:text-sm leading-relaxed prose prose-invert max-w-none">
            <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 whitespace-pre-wrap font-sans text-slate-200">
              {activeContent.explanationMarkdown}
            </div>
          </div>

          {/* Key Takeaways */}
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Key Engineering Takeaways
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {activeContent.keyTakeaways.map((takeaway, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex gap-2">
                  <span className="font-mono text-indigo-400 font-bold">0{idx + 1}.</span>
                  <p className="text-slate-300">{takeaway}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: MCQ Assessment */}
      {activeTab === 'mcqs' && (
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Formative Concept Checks</h3>
              <p className="text-xs text-slate-400">
                Questions engineered with distractors targeting common learner misconceptions.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              {Object.keys(selectedOptions).length} / {activeContent.mcqs.length} answered
            </span>
          </div>

          <div className="space-y-6">
            {activeContent.mcqs.map((mcq, qIdx) => {
              const selectedOptId = selectedOptions[mcq.id];
              const isAnswered = Boolean(selectedOptId);

              return (
                <div
                  key={mcq.id}
                  className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-sm font-semibold text-white leading-snug">
                        {mcq.question}
                      </h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                        Bloom: {mcq.bloomsLevel}
                      </span>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="grid grid-cols-1 gap-2.5">
                    {mcq.options.map(opt => {
                      const isSelected = selectedOptId === opt.id;
                      let optionClasses = 'p-3 rounded-lg border text-xs text-left transition-all ';

                      if (isAnswered) {
                        if (opt.isCorrect) {
                          optionClasses += 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 ';
                        } else if (isSelected && !opt.isCorrect) {
                          optionClasses += 'bg-rose-950/40 border-rose-500/60 text-rose-200 ';
                        } else {
                          optionClasses += 'bg-slate-900/50 border-slate-800/80 text-slate-400 opacity-60 ';
                        }
                      } else {
                        optionClasses += 'bg-slate-900 border-slate-800 text-slate-200 hover:border-indigo-500/60 hover:bg-slate-800/60 cursor-pointer ';
                      }

                      return (
                        <button
                          key={opt.id}
                          onClick={() => !isAnswered && handleOptionSelect(mcq.id, opt.id)}
                          disabled={isAnswered}
                          className={optionClasses}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{opt.text}</span>
                            {isAnswered && opt.isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                            )}
                            {isAnswered && isSelected && !opt.isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0 ml-2" />
                            )}
                          </div>

                          {/* Distractor rationale disclosure */}
                          {isAnswered && (
                            <p className="mt-2 pt-2 border-t border-slate-800/60 text-[11px] leading-relaxed text-slate-300">
                              <span className="font-semibold text-slate-400">Analysis: </span>
                              {opt.explanation}
                            </p>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Source chunk anchor */}
                  {mcq.sourceChunkIds.length > 0 && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-900 text-[11px] text-slate-500 font-mono">
                      <span>Source Grounding:</span>
                      {mcq.sourceChunkIds.map(cid => (
                        <span key={cid} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                          {cid}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Coding Sandbox */}
      {activeTab === 'coding' && activeContent.codingExercise && (
        <div className="p-6 space-y-5">
          {/* Problem Statement Header */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                {activeContent.codingExercise.title}
              </h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                {activeContent.codingExercise.language.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {activeContent.codingExercise.problemStatement}
            </p>

            {/* Constraints */}
            <div className="flex flex-wrap gap-2 pt-1">
              {activeContent.codingExercise.constraints.map((c, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 border border-slate-800"
                >
                  Constraint: {c}
                </span>
              ))}
            </div>
          </div>

          {/* Interactive Code Editor Bar */}
          <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
            <div className="p-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-slate-300">solution.py</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLoadSolution}
                  className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  title="Load reference solution for testing"
                >
                  Load Reference Solution
                </button>
                <button
                  onClick={handleResetStarter}
                  className="px-2 py-1 rounded text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  onClick={handleCopyCode}
                  className="p-1 rounded text-slate-400 hover:text-white transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRunCodeTests}
                  disabled={isRunningCode}
                  className="px-3.5 py-1 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Play className={`w-3.5 h-3.5 ${isRunningCode ? 'animate-spin' : ''}`} />
                  <span>{isRunningCode ? 'Running...' : 'Run Test Suite'}</span>
                </button>
              </div>
            </div>

            {/* Code text area */}
            <textarea
              value={userCode}
              onChange={e => setUserCode(e.target.value)}
              rows={9}
              className="w-full p-4 bg-slate-950 font-mono text-xs text-indigo-100/90 leading-relaxed focus:outline-none resize-y selection:bg-indigo-500/30"
              spellCheck={false}
            />
          </div>

          {/* Test Runner Results Panel */}
          {codeRunResult && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      codeRunResult.allPassed ? 'bg-emerald-400' : 'bg-rose-400'
                    }`}
                  />
                  <h4 className="text-xs font-bold text-white">
                    Test Execution: {codeRunResult.passed} / {codeRunResult.totalTests} passed
                  </h4>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {codeRunResult.totalDurationMs}ms execution
                </span>
              </div>

              <div className="space-y-1.5">
                {codeRunResult.testResults.map((t, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg border text-xs font-mono flex items-center justify-between ${
                      t.passed
                        ? 'bg-emerald-950/20 border-emerald-900/40 text-emerald-300'
                        : 'bg-rose-950/20 border-rose-900/40 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {t.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span>{t.testName}</span>
                      {t.errorMessage && (
                        <span className="text-[11px] text-rose-400 truncate">({t.errorMessage})</span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0">{t.executionTimeMs}ms</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progressive Hints Accordion */}
          {activeContent.codingExercise.hints.length > 0 && (
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
              <button
                onClick={() => setShowHints(!showHints)}
                className="w-full p-3 flex items-center justify-between text-xs font-semibold text-slate-300 hover:text-white"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                  Hints & Architectural Guidance ({activeContent.codingExercise.hints.length})
                </span>
                {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showHints && (
                <div className="p-3 pt-0 border-t border-slate-800/60 space-y-2 text-xs text-slate-400">
                  {activeContent.codingExercise.hints.map((hint, idx) => (
                    <p key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{hint}</span>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Ground Truth Citations */}
      {activeTab === 'citations' && (
        <div className="p-6 space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white">Retrieved Source Grounding Audit</h3>
            <p className="text-xs text-slate-400">
              Exhaustive verification of factual claims anchored back to approved curriculum source chunks.
            </p>
          </div>

          <div className="space-y-4">
            {activeContent.sourceCitations.map((cite, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 hover:border-slate-700 transition-all"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-indigo-300">{cite.docTitle}</span>
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-slate-900 text-slate-400 border border-slate-800">
                    Chunk: {cite.chunkId} | {cite.section}
                  </span>
                </div>

                <blockquote className="p-3 rounded-lg bg-slate-900/60 border-l-2 border-indigo-500 text-xs italic text-slate-300">
                  "{cite.quotedText}"
                </blockquote>

                <p className="text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">Pedagogical Justification: </span>
                  {cite.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

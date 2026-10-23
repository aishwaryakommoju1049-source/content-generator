/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { ContentGenerator } from './components/ContentGenerator';
import { AgentWorkflowViewer } from './components/AgentWorkflowViewer';
import { EvaluationReportCard } from './components/EvaluationReportCard';
import { InteractiveContentPreview } from './components/InteractiveContentPreview';
import { FailedCasesQueue } from './components/FailedCasesQueue';
import { RegressionBench } from './components/RegressionBench';
import { KnowledgeBaseManager } from './components/KnowledgeBaseManager';
import {
  ApprovedDocument,
  LessonContent,
  QualityEvaluation,
  AgentStageLog,
  FailedCaseItem,
  RegressionBenchmarkItem,
  BenchmarkRunResult,
  KnowledgeChunk,
  DifficultyLevel,
} from './types';
import { api } from './services/api';
import { AlertCircle, CheckCircle2, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('studio');

  // Server state
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);
  const [documents, setDocuments] = useState<ApprovedDocument[]>([]);
  const [failedCases, setFailedCases] = useState<FailedCaseItem[]>([]);
  const [benchmarkItems, setBenchmarkItems] = useState<RegressionBenchmarkItem[]>([]);
  const [benchmarkHistory, setBenchmarkHistory] = useState<BenchmarkRunResult[]>([]);

  // Generation & Agent Loop state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [isRevising, setIsRevising] = useState<boolean>(false);
  const [activeStage, setActiveStage] = useState<'retrieval' | 'drafting' | 'evaluation' | 'revision' | undefined>(undefined);

  const [logs, setLogs] = useState<AgentStageLog[]>([]);
  const [retrievedChunks, setRetrievedChunks] = useState<KnowledgeChunk[]>([]);
  const [draftContent, setDraftContent] = useState<LessonContent | null>(null);
  const [revisedContent, setRevisedContent] = useState<LessonContent | null>(null);
  const [evaluation, setEvaluation] = useState<QualityEvaluation | null>(null);
  const [revisionEvaluation, setRevisionEvaluation] = useState<QualityEvaluation | null>(null);
  const [currentVersion, setCurrentVersion] = useState<number>(1);

  // Status toast
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Initial Data Fetch
  const loadInitialData = async () => {
    try {
      const [health, docsRes, casesRes, regRes] = await Promise.all([
        api.getHealth(),
        api.getDocuments(),
        api.getFailedCases(),
        api.getRegressionData(),
      ]);

      setHasGeminiKey(health.hasGeminiKey);
      setDocuments(docsRes.documents);
      setFailedCases(casesRes.failedCases);
      setBenchmarkItems(regRes.benchmarkItems);
      setBenchmarkHistory(regRes.history);

      // Auto-generate an initial demo module on first boot if no content exists yet
      if (!draftContent) {
        handleGenerate(
          'FastAPI Yield Dependencies & DB Cleanup',
          'intermediate',
          [],
          'Ensure strong transactional cleanup and app.dependency_overrides test coverage.'
        );
      }
    } catch (err: any) {
      console.error('Error bootstrapping application:', err);
      showNotification('Failed to connect to backend server. Running in fallback mode.', 'error');
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Multi-Agent Pipeline Execution Handler (Drafter -> Auditor)
  const handleGenerate = async (
    topic: string,
    difficulty: DifficultyLevel,
    docIds: string[],
    customInstructions: string
  ) => {
    setIsGenerating(true);
    setActiveStage('retrieval');
    setRevisedContent(null);
    setRevisionEvaluation(null);
    setCurrentVersion(1);

    try {
      showNotification(`Retrieving approved syllabus chunks for "${topic}"...`, 'info');
      setActiveStage('drafting');

      // 1. Drafter Agent Call
      const draftRes = await api.generateContent(topic, difficulty, docIds, customInstructions);
      setDraftContent(draftRes.draftContent);
      setRetrievedChunks(draftRes.retrievedChunks);
      setLogs(draftRes.logs);
      setIsGenerating(false);

      // 2. Chained Quality Auditor Agent Call
      setIsEvaluating(true);
      setActiveStage('evaluation');
      showNotification('Drafter finished! Quality Auditor evaluating rubric & running test sandbox...', 'info');

      const evalRes = await api.evaluateContent(draftRes.draftContent, draftRes.retrievedChunks);
      setEvaluation(evalRes.evaluation);
      setLogs(prev => [...prev, evalRes.evalLog]);

      // Refresh failed cases queue in background
      const updatedCases = await api.getFailedCases();
      setFailedCases(updatedCases.failedCases);

      if (evalRes.evaluation.status === 'passed') {
        showNotification(`Module verified: Score ${evalRes.evaluation.overallScore}/100 (PASSED)`, 'success');
      } else {
        showNotification(
          `Quality Gate: Score ${evalRes.evaluation.overallScore}/100. Logged to Review Queue. Click "Trigger Auto-Revision" to self-correct.`,
          'info'
        );
      }
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Error executing agent pipeline', 'error');
    } finally {
      setIsGenerating(false);
      setIsEvaluating(false);
      setActiveStage(undefined);
    }
  };

  // Agent Auto-Revision Loop (Stage 4)
  const handleTriggerRevise = async () => {
    if (!draftContent || !evaluation) return;
    setIsRevising(true);
    setActiveStage('revision');
    showNotification('Pedagogical Reviser Agent in progress: patching flaws and re-testing...', 'info');

    try {
      const reviseRes = await api.reviseContent(draftContent, evaluation, retrievedChunks);
      setRevisedContent(reviseRes.revisedContent);
      setRevisionEvaluation(reviseRes.revisionEvaluation);
      setLogs(prev => [...prev, reviseRes.reviseLog]);
      setCurrentVersion(reviseRes.revisedContent.version);

      // Refresh cases queue
      const updatedCases = await api.getFailedCases();
      setFailedCases(updatedCases.failedCases);

      showNotification(
        `Revision v${reviseRes.revisedContent.version} successfully passed! Score upgraded to ${reviseRes.revisionEvaluation.overallScore}/100.`,
        'success'
      );
    } catch (err: any) {
      console.error(err);
      showNotification(err.message || 'Revision loop error', 'error');
    } finally {
      setIsRevising(false);
      setActiveStage(undefined);
    }
  };

  // Triaging action from Failed Cases Queue
  const handleSelectCaseForRevision = (item: FailedCaseItem) => {
    setDraftContent(item.sessionData.draftContent);
    setEvaluation(item.sessionData.evaluation);
    setRetrievedChunks(item.sessionData.retrievedChunks);
    setActiveTab('studio');
    handleTriggerRevise();
  };

  const totalChunks = documents.reduce((sum, d) => sum + d.chunks.length, 0);
  const unresolvedCount = failedCases.filter(c => c.status === 'unresolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-600/30 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unresolvedCount={unresolvedCount}
        hasGeminiKey={hasGeminiKey}
        totalChunks={totalChunks}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Floating Notification */}
        {notification && (
          <div
            className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 ${
              notification.type === 'success'
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-950 border-rose-500 text-rose-200'
                : 'bg-indigo-950 border-indigo-500 text-indigo-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Tab 1: Studio & Content Generator */}
        {activeTab === 'studio' && (
          <div className="space-y-6">
            {/* Input Generator */}
            <ContentGenerator
              documents={documents}
              onGenerate={handleGenerate}
              isProcessing={isGenerating || isEvaluating}
            />

            {/* Agent Workflow Timeline */}
            <AgentWorkflowViewer
              logs={logs}
              isGenerating={isGenerating}
              isEvaluating={isEvaluating}
              isRevising={isRevising}
              activeStage={activeStage}
              draftContent={draftContent || undefined}
              revisedContent={revisedContent || undefined}
              evaluation={evaluation || undefined}
            />

            {/* Quality Report Card (if evaluation ready) */}
            {(revisionEvaluation || evaluation) && draftContent && (
              <EvaluationReportCard
                evaluation={currentVersion === 2 && revisionEvaluation ? revisionEvaluation : evaluation!}
                content={currentVersion === 2 && revisedContent ? revisedContent : draftContent}
                onTriggerRevise={handleTriggerRevise}
                isRevising={isRevising}
              />
            )}

            {/* Interactive Module Viewer */}
            {draftContent && (
              <InteractiveContentPreview
                content={draftContent}
                revisedContent={revisedContent || undefined}
                currentVersion={currentVersion}
                onVersionChange={v => setCurrentVersion(v)}
              />
            )}
          </div>
        )}

        {/* Tab 2: Quality Evaluator & Rubric Deep-Dive */}
        {activeTab === 'evaluator' && (
          <div className="space-y-6">
            {evaluation && draftContent ? (
              <div className="space-y-6">
                <EvaluationReportCard
                  evaluation={currentVersion === 2 && revisionEvaluation ? revisionEvaluation : evaluation}
                  content={currentVersion === 2 && revisedContent ? revisedContent : draftContent}
                  onTriggerRevise={handleTriggerRevise}
                  isRevising={isRevising}
                />
                <InteractiveContentPreview
                  content={draftContent}
                  revisedContent={revisedContent || undefined}
                  currentVersion={currentVersion}
                  onVersionChange={v => setCurrentVersion(v)}
                />
              </div>
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto" />
                <h3 className="text-base font-bold text-white">No Evaluation Loaded</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Generate content in the Studio to view the live 4-dimensional pedagogical rubric analysis and code test execution results.
                </p>
                <button
                  onClick={() => setActiveTab('studio')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white"
                >
                  Go to Studio
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Failed Cases Review Queue */}
        {activeTab === 'failed-cases' && (
          <FailedCasesQueue
            failedCases={failedCases}
            onRefresh={async () => {
              const res = await api.getFailedCases();
              setFailedCases(res.failedCases);
            }}
            onSelectCaseForRevision={handleSelectCaseForRevision}
          />
        )}

        {/* Tab 4: Regression Evaluation Bench */}
        {activeTab === 'regression' && (
          <RegressionBench
            benchmarkItems={benchmarkItems}
            history={benchmarkHistory}
            onRefresh={async () => {
              const res = await api.getRegressionData();
              setBenchmarkHistory(res.history);
            }}
          />
        )}

        {/* Tab 5: Approved Knowledge Base */}
        {activeTab === 'knowledge-base' && (
          <KnowledgeBaseManager
            documents={documents}
            onRefresh={async () => {
              const res = await api.getDocuments();
              setDocuments(res.documents);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CognitiveForge AI Learning Content Generator & Evaluator</span>
          <span className="font-mono text-[11px] text-slate-600">
            Powered by RAG • Gemini 3.8 Flash • Sandboxed Unit Testing • Self-Correction Agent Loop
          </span>
        </div>
      </footer>
    </div>
  );
}

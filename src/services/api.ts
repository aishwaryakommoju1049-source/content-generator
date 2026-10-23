import {
  ApprovedDocument,
  LessonContent,
  QualityEvaluation,
  AgentStageLog,
  FailedCaseItem,
  RegressionBenchmarkItem,
  BenchmarkRunResult,
  KnowledgeChunk,
} from '../types';

export interface HealthResponse {
  status: string;
  hasGeminiKey: boolean;
  documentsCount: number;
  totalChunks: number;
  unresolvedFailedCases: number;
  benchmarksCount: number;
}

export interface GenerateContentResponse {
  draftContent: LessonContent;
  retrievedChunks: KnowledgeChunk[];
  logs: AgentStageLog[];
  totalDurationMs: number;
}

export interface EvaluateContentResponse {
  evaluation: QualityEvaluation;
  evalLog: AgentStageLog;
  totalDurationMs: number;
}

export interface ReviseContentResponse {
  revisedContent: LessonContent;
  revisionEvaluation: QualityEvaluation;
  reviseLog: AgentStageLog;
  totalDurationMs: number;
}

export interface CodeRunResponse {
  totalTests: number;
  passed: number;
  failed: number;
  allPassed: boolean;
  totalDurationMs: number;
  testResults: {
    testName: string;
    passed: boolean;
    output?: string;
    errorMessage?: string;
    executionTimeMs: number;
  }[];
}

export const api = {
  async getHealth(): Promise<HealthResponse> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  async getDocuments(): Promise<{ documents: ApprovedDocument[] }> {
    const res = await fetch('/api/documents');
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async uploadDocument(data: {
    title: string;
    domain: string;
    description: string;
    content: string;
    approvedBy: string;
  }): Promise<{ document: ApprovedDocument; message: string }> {
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to upload document');
    }
    return res.json();
  },

  async searchRetrieval(query: string, docIds?: string[]): Promise<{
    results: { chunk: KnowledgeChunk; score: number; matchReasons: string[] }[];
  }> {
    const res = await fetch('/api/retrieval/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, docIds }),
    });
    if (!res.ok) throw new Error('Failed to search retrieval chunks');
    return res.json();
  },

  async generateContent(
    topic: string,
    difficulty: string,
    docIds?: string[],
    customInstructions?: string
  ): Promise<GenerateContentResponse> {
    const res = await fetch('/api/generate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, difficulty, docIds, customInstructions }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Content generation failed');
    }
    return res.json();
  },

  async evaluateContent(
    content: LessonContent,
    retrievedChunks: KnowledgeChunk[]
  ): Promise<EvaluateContentResponse> {
    const res = await fetch('/api/evaluate-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, retrievedChunks }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Content evaluation failed');
    }
    return res.json();
  },

  async reviseContent(
    originalContent: LessonContent,
    evaluation: QualityEvaluation,
    retrievedChunks: KnowledgeChunk[]
  ): Promise<ReviseContentResponse> {
    const res = await fetch('/api/revise-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalContent, evaluation, retrievedChunks }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Content revision failed');
    }
    return res.json();
  },

  async runCode(
    code: string,
    testCases: any[],
    language: 'python' | 'javascript' = 'python'
  ): Promise<CodeRunResponse> {
    const res = await fetch('/api/run-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, testCases, language }),
    });
    if (!res.ok) throw new Error('Failed to execute code sandbox');
    return res.json();
  },

  async getFailedCases(): Promise<{ failedCases: FailedCaseItem[] }> {
    const res = await fetch('/api/failed-cases');
    if (!res.ok) throw new Error('Failed to fetch review queue');
    return res.json();
  },

  async actOnFailedCase(
    id: string,
    action: 'approve_override' | 'dismiss' | 'mark_in_review',
    reviewerNotes?: string,
    assignedTo?: string
  ): Promise<{ updatedCase: FailedCaseItem; message: string }> {
    const res = await fetch(`/api/failed-cases/${id}/action`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, reviewerNotes, assignedTo }),
    });
    if (!res.ok) throw new Error('Failed to update case');
    return res.json();
  },

  async getRegressionData(): Promise<{
    benchmarkItems: RegressionBenchmarkItem[];
    history: BenchmarkRunResult[];
  }> {
    const res = await fetch('/api/regression');
    if (!res.ok) throw new Error('Failed to fetch regression benchmark data');
    return res.json();
  },

  async runRegressionBenchmark(
    pipelineVersion?: string
  ): Promise<{ runResult: BenchmarkRunResult; message: string }> {
    const res = await fetch('/api/regression/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pipelineVersion }),
    });
    if (!res.ok) throw new Error('Failed to run regression suite');
    return res.json();
  },
};

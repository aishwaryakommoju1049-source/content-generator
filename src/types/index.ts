export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface KnowledgeChunk {
  id: string;
  docId: string;
  docTitle: string;
  topic: string;
  content: string;
  section: string;
  tokenCount: number;
  approvedBy: string;
  version: string;
}

export interface ApprovedDocument {
  id: string;
  title: string;
  domain: string;
  description: string;
  totalTokens: number;
  chunkCount: number;
  lastUpdated: string;
  chunks: KnowledgeChunk[];
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  bloomsLevel: 'Remember' | 'Understand' | 'Apply' | 'Analyze' | 'Evaluate';
  sourceChunkIds: string[];
  keyConcept: string;
}

export interface CodeTestCase {
  id: string;
  name: string;
  inputDescription: string;
  testCode: string; // assertion or call
  expectedOutput: string;
  isHidden?: boolean;
}

export interface CodingExercise {
  id: string;
  title: string;
  difficulty: DifficultyLevel;
  problemStatement: string;
  constraints: string[];
  starterCode: string;
  referenceSolution: string;
  hints: string[];
  testCases: CodeTestCase[];
  language: 'python' | 'javascript';
}

export interface LessonContent {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  summary: string;
  learningObjectives: string[];
  explanationMarkdown: string;
  mentalModelAnalogy: string;
  keyTakeaways: string[];
  mcqs: MultipleChoiceQuestion[];
  codingExercise?: CodingExercise;
  sourceCitations: {
    chunkId: string;
    docTitle: string;
    section: string;
    quotedText: string;
    explanation: string;
  }[];
  version: number;
}

export interface MetricScore {
  score: number; // 0 - 100
  rating: 'Exemplary' | 'Proficient' | 'Needs Improvement' | 'Unacceptable';
  rationale: string;
  flaggedIssues: string[];
}

export interface QualityEvaluation {
  id: string;
  contentId: string;
  timestamp: string;
  overallScore: number; // 0 - 100
  status: 'passed' | 'needs_revision' | 'critical_fail';
  metrics: {
    correctness: MetricScore;
    clarity: MetricScore;
    relevance: MetricScore;
    sourceGrounding: MetricScore;
  };
  hallucinationRisk: 'low' | 'moderate' | 'high';
  codeExecutionPassed?: boolean;
  codeExecutionDetails?: {
    totalTests: number;
    passed: number;
    failed: number;
    testResults: {
      testName: string;
      passed: boolean;
      output?: string;
      errorMessage?: string;
      executionTimeMs: number;
    }[];
  };
  recommendedActions: string[];
  evaluatorNotes: string;
}

export interface AgentStageLog {
  stage: 'retrieval' | 'drafting' | 'evaluation' | 'revision';
  agentName: string;
  timestamp: string;
  durationMs: number;
  inputTokens?: number;
  outputTokens?: number;
  systemPromptPreview: string;
  userPromptPreview: string;
  rawResponsePreview?: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  notes?: string;
}

export interface GenerationSession {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  selectedDocIds: string[];
  retrievedChunks: KnowledgeChunk[];
  draftContent: LessonContent;
  evaluation: QualityEvaluation;
  revisedContent?: LessonContent;
  revisionEvaluation?: QualityEvaluation;
  logs: AgentStageLog[];
  currentVersion: number;
  createdAt: string;
}

export interface FailedCaseItem {
  id: string;
  contentId: string;
  topic: string;
  severity: 'low' | 'medium' | 'high';
  primaryIssue: string;
  metrics: {
    correctness: number;
    clarity: number;
    relevance: number;
    grounding: number;
  };
  flaggedReasons: string[];
  failedCodeTestsCount: number;
  status: 'unresolved' | 'in_review' | 'fixed' | 'dismissed';
  assignedTo?: string;
  reviewerNotes?: string;
  timestamp: string;
  sessionData: GenerationSession;
}

export interface RegressionBenchmarkItem {
  id: string;
  topic: string;
  difficulty: DifficultyLevel;
  requiredConcepts: string[];
  groundTruthChunks: string[];
  baselineQualityScore: number;
  baselinePassRate: number;
  codeTestCount: number;
}

export interface BenchmarkRunResult {
  runId: string;
  timestamp: string;
  pipelineVersion: string;
  totalCases: number;
  passCount: number;
  averageQualityScore: number;
  averageGroundingScore: number;
  codeSuccessRate: number;
  averageLatencyMs: number;
  regressionsDetected: number;
  itemResults: {
    itemId: string;
    topic: string;
    qualityScore: number;
    groundingScore: number;
    testsPassed: boolean;
    status: 'pass' | 'fail' | 'regressed';
    diffFromBaseline: number;
  }[];
}

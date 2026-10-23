import { RegressionBenchmarkItem, BenchmarkRunResult } from '../types';

export const REGRESSION_BENCHMARK_ITEMS: RegressionBenchmarkItem[] = [
  {
    id: 'bench-01',
    topic: 'Asyncio TaskGroup vs Gather in Python 3.12',
    difficulty: 'intermediate',
    requiredConcepts: ['ExceptionGroup', 'Structured concurrency', 'Cancellation propagation', 'No orphan tasks'],
    groundTruthChunks: ['chunk-py-async-01'],
    baselineQualityScore: 92,
    baselinePassRate: 100,
    codeTestCount: 4
  },
  {
    id: 'bench-02',
    topic: 'FastAPI Yield Dependencies and Resource Cleanup',
    difficulty: 'intermediate',
    requiredConcepts: ['Depends()', 'yield generator', 'finally block guarantee', 'app.dependency_overrides'],
    groundTruthChunks: ['chunk-fastapi-01'],
    baselineQualityScore: 89,
    baselinePassRate: 100,
    codeTestCount: 3
  },
  {
    id: 'bench-03',
    topic: 'Binary Search Tree Validation with Low/High Bounds',
    difficulty: 'intermediate',
    requiredConcepts: ['BST invariant', 'Ancestral bounds propagation', 'In-order traversal monotonicity'],
    groundTruthChunks: ['chunk-dsa-01'],
    baselineQualityScore: 94,
    baselinePassRate: 100,
    codeTestCount: 5
  },
  {
    id: 'bench-04',
    topic: 'Python Decorators with Arguments (3-tier Factory)',
    difficulty: 'advanced',
    requiredConcepts: ['functools.wraps', 'factory closure', '__wrapped__ attribute', 'lexical scope'],
    groundTruthChunks: ['chunk-decor-01', 'chunk-decor-02'],
    baselineQualityScore: 90,
    baselinePassRate: 100,
    codeTestCount: 4
  },
  {
    id: 'bench-05',
    topic: 'Pydantic v2 Field Validators vs Model Validators',
    difficulty: 'intermediate',
    requiredConcepts: ['@field_validator', '@model_validator', 'mode="before" vs mode="after"', 'model_dump()'],
    groundTruthChunks: ['chunk-fastapi-02'],
    baselineQualityScore: 88,
    baselinePassRate: 100,
    codeTestCount: 3
  },
  {
    id: 'bench-06',
    topic: 'Event Loop Non-blocking with asyncio.to_thread',
    difficulty: 'advanced',
    requiredConcepts: ['Cooperative multitasking', 'Single-threaded event loop', 'ThreadPoolExecutor offload', 'CPU-bound stalls'],
    groundTruthChunks: ['chunk-py-async-03'],
    baselineQualityScore: 91,
    baselinePassRate: 100,
    codeTestCount: 3
  },
  {
    id: 'bench-07',
    topic: 'Two Pointers Monotonic Search on Sorted Arrays',
    difficulty: 'beginner',
    requiredConcepts: ['O(N) time complexity', 'O(1) space', 'Left/Right pointer convergence'],
    groundTruthChunks: ['chunk-dsa-02'],
    baselineQualityScore: 95,
    baselinePassRate: 100,
    codeTestCount: 4
  },
  {
    id: 'bench-08',
    topic: 'Directed Graph Cycle Detection with Kahn Algorithm',
    difficulty: 'advanced',
    requiredConcepts: ['DAG condition', 'In-degree array', 'Deque BFS', 'Unprocessed vertices count'],
    groundTruthChunks: ['chunk-dsa-03'],
    baselineQualityScore: 87,
    baselinePassRate: 100,
    codeTestCount: 4
  }
];

export const INITIAL_BENCHMARK_HISTORY: BenchmarkRunResult[] = [
  {
    runId: 'run-v1.0-baseline',
    timestamp: '2026-10-18T14:30:00Z',
    pipelineVersion: 'v1.0.0 (Baseline Zero-Shot Prompting)',
    totalCases: 8,
    passCount: 6,
    averageQualityScore: 82.5,
    averageGroundingScore: 78.4,
    codeSuccessRate: 75.0,
    averageLatencyMs: 3820,
    regressionsDetected: 2,
    itemResults: [
      { itemId: 'bench-01', topic: 'Asyncio TaskGroup vs Gather', qualityScore: 85, groundingScore: 82, testsPassed: true, status: 'pass', diffFromBaseline: 0 },
      { itemId: 'bench-02', topic: 'FastAPI Yield Dependencies', qualityScore: 79, groundingScore: 74, testsPassed: true, status: 'fail', diffFromBaseline: -10 },
      { itemId: 'bench-03', topic: 'BST Validation with Bounds', qualityScore: 90, groundingScore: 88, testsPassed: true, status: 'pass', diffFromBaseline: 0 },
      { itemId: 'bench-04', topic: 'Decorators with Arguments', qualityScore: 76, groundingScore: 70, testsPassed: false, status: 'fail', diffFromBaseline: -14 },
      { itemId: 'bench-05', topic: 'Pydantic v2 Validators', qualityScore: 84, groundingScore: 81, testsPassed: true, status: 'pass', diffFromBaseline: 0 },
      { itemId: 'bench-06', topic: 'Event Loop Non-blocking', qualityScore: 88, groundingScore: 85, testsPassed: true, status: 'pass', diffFromBaseline: 0 },
      { itemId: 'bench-07', topic: 'Two Pointers Search', qualityScore: 92, groundingScore: 90, testsPassed: true, status: 'pass', diffFromBaseline: 0 },
      { itemId: 'bench-08', topic: 'Directed Graph Cycle Detection', qualityScore: 81, groundingScore: 76, testsPassed: false, status: 'pass', diffFromBaseline: -6 }
    ]
  },
  {
    runId: 'run-v2.1-agentic',
    timestamp: '2026-10-22T09:15:00Z',
    pipelineVersion: 'v2.1.0 (Agentic RAG + CoT Evaluator + Self-Correction Loop)',
    totalCases: 8,
    passCount: 8,
    averageQualityScore: 91.8,
    averageGroundingScore: 93.4,
    codeSuccessRate: 100.0,
    averageLatencyMs: 4450,
    regressionsDetected: 0,
    itemResults: [
      { itemId: 'bench-01', topic: 'Asyncio TaskGroup vs Gather', qualityScore: 93, groundingScore: 95, testsPassed: true, status: 'pass', diffFromBaseline: +1 },
      { itemId: 'bench-02', topic: 'FastAPI Yield Dependencies', qualityScore: 91, groundingScore: 92, testsPassed: true, status: 'pass', diffFromBaseline: +2 },
      { itemId: 'bench-03', topic: 'BST Validation with Bounds', qualityScore: 95, groundingScore: 96, testsPassed: true, status: 'pass', diffFromBaseline: +1 },
      { itemId: 'bench-04', topic: 'Decorators with Arguments', qualityScore: 92, groundingScore: 91, testsPassed: true, status: 'pass', diffFromBaseline: +2 },
      { itemId: 'bench-05', topic: 'Pydantic v2 Validators', qualityScore: 90, groundingScore: 94, testsPassed: true, status: 'pass', diffFromBaseline: +2 },
      { itemId: 'bench-06', topic: 'Event Loop Non-blocking', qualityScore: 92, groundingScore: 93, testsPassed: true, status: 'pass', diffFromBaseline: +1 },
      { itemId: 'bench-07', topic: 'Two Pointers Search', qualityScore: 96, groundingScore: 97, testsPassed: true, status: 'pass', diffFromBaseline: +1 },
      { itemId: 'bench-08', topic: 'Directed Graph Cycle Detection', qualityScore: 89, groundingScore: 90, testsPassed: true, status: 'pass', diffFromBaseline: +2 }
    ]
  }
];

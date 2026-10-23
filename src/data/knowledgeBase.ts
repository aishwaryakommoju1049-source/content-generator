import { ApprovedDocument, KnowledgeChunk } from '../types';

export const INITIAL_APPROVED_DOCUMENTS: ApprovedDocument[] = [
  {
    id: 'doc-py-async',
    title: 'Python 3.12 Asynchronous Architecture & Event Loops',
    domain: 'Python Core',
    description: 'Deep dive into asyncio event loop internals, coroutines, TaskGroups, async context managers, and non-blocking IO.',
    totalTokens: 1420,
    chunkCount: 3,
    lastUpdated: '2025-10-10',
    chunks: [
      {
        id: 'chunk-py-async-01',
        docId: 'doc-py-async',
        docTitle: 'Python 3.12 Asynchronous Architecture & Event Loops',
        topic: 'Asyncio TaskGroup & Structured Concurrency',
        section: 'Section 4.1: Structured Concurrency with TaskGroup',
        tokenCount: 480,
        approvedBy: 'Staff Python Curriculum Architect',
        version: 'v2.1',
        content: `Python 3.11 introduced asyncio.TaskGroup, which provides structured concurrency akin to nurseries in Trio. When using 'async with asyncio.TaskGroup() as tg:', tasks created via tg.create_task() are strictly bound to the context manager's scope. If any child task raises an exception, the remaining active tasks in the group are immediately cancelled, and an ExceptionGroup is raised upon exiting the block. This eliminates orphan tasks and task leakage common with legacy asyncio.gather(return_exceptions=False). Key rule: Never instantiate tasks inside a loop without joining or using TaskGroup in production microservices.`
      },
      {
        id: 'chunk-py-async-02',
        docId: 'doc-py-async',
        docTitle: 'Python 3.12 Asynchronous Architecture & Event Loops',
        topic: 'Async Context Managers & Generators',
        section: 'Section 4.2: Asynchronous Resource Cleanup',
        tokenCount: 460,
        approvedBy: 'Staff Python Curriculum Architect',
        version: 'v2.1',
        content: `Asynchronous context managers require defining '__aenter__' and '__aexit__' methods, both decorated or declared as async def. Alternatively, contextlib.asynccontextmanager decorator allows converting an async generator into an async context manager. Unlike synchronous context managers, exceptions inside the block are awaited in __aexit__. If an unexpected disconnect occurs in network sockets or database connection pools (such as asyncpg), a robust __aexit__ must guarantee connection return even when cancelled: 'if exc_type is not None: await conn.rollback() else: await conn.commit()'.`
      },
      {
        id: 'chunk-py-async-03',
        docId: 'doc-py-async',
        docTitle: 'Python 3.12 Asynchronous Architecture & Event Loops',
        topic: 'Event Loop Blocking & run_in_executor',
        section: 'Section 4.3: CPU-bound vs IO-bound Operations',
        tokenCount: 480,
        approvedBy: 'Staff Python Curriculum Architect',
        version: 'v2.1',
        content: `Asyncio uses a single-threaded cooperative multitasking event loop. Executing CPU-heavy computation or synchronous blocking calls (e.g. time.sleep, requests.get, or heavy cryptographic hashing) directly inside an async coroutine stalls the entire event loop, delaying heartbeats and socket responses. Developers must offload CPU-bound or legacy synchronous IO using 'await asyncio.to_thread(sync_func, *args)' (or loop.run_in_executor(None, sync_func)). asyncio.to_thread runs the synchronous callable in a separate ThreadPoolExecutor thread, releasing the event loop to service concurrent HTTP requests.`
      }
    ]
  },
  {
    id: 'doc-fastapi-di',
    title: 'FastAPI High-Performance API Patterns & Dependency Injection',
    domain: 'FastAPI & Modern Web',
    description: 'Comprehensive specifications for FastAPI dependency injection, lifecycle events, Pydantic v2 validation, and async background workers.',
    totalTokens: 1530,
    chunkCount: 3,
    lastUpdated: '2025-11-15',
    chunks: [
      {
        id: 'chunk-fastapi-01',
        docId: 'doc-fastapi-di',
        docTitle: 'FastAPI High-Performance API Patterns & Dependency Injection',
        topic: 'Dependency Injection System & Yield Dependencies',
        section: 'Section 2.1: Hierarchical Dependency Graph and Cleanup',
        tokenCount: 520,
        approvedBy: 'Lead API Infrastructure Architect',
        version: 'v3.0',
        content: `FastAPI resolves dependencies recursively using Depends(). Dependencies can be standard callables or generators with 'yield'. When a dependency uses 'yield', code before yield runs before handling the request route, and code after yield runs after the response has been sent to the client (even if exceptions were raised during request execution). This makes yield dependencies ideal for database sessions:
async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()
Dependencies can be parameterized, nested hierarchically, and overridden in test suites via 'app.dependency_overrides[get_db] = override_db'.`
      },
      {
        id: 'chunk-fastapi-02',
        docId: 'doc-fastapi-di',
        docTitle: 'FastAPI High-Performance API Patterns & Dependency Injection',
        topic: 'Pydantic v2 Performance & Validation Decorators',
        section: 'Section 2.2: Pydantic v2 Strict Mode and Field Constraints',
        tokenCount: 500,
        approvedBy: 'Lead API Infrastructure Architect',
        version: 'v3.0',
        content: `Pydantic v2 core is compiled in Rust, offering 5x-20x faster data validation than v1. Models declare strict type hints with annotated constraints: Field(gt=0, le=100, pattern=r'^[a-zA-Z0-9_-]+$'). Field validators are declared with @field_validator('attribute', mode='before' | 'after'). In 'mode=before', raw inputs can be sanitised prior to type coercion; in 'mode=after', validated typed objects are inspected. Model-level validation spanning multiple interdependent attributes uses @model_validator(mode='after'). For payload serialization, model.model_dump() and model.model_dump_json() replace v1's deprecated .dict() and .json().`
      },
      {
        id: 'chunk-fastapi-03',
        docId: 'doc-fastapi-di',
        docTitle: 'FastAPI High-Performance API Patterns & Dependency Injection',
        topic: 'BackgroundTasks vs Celery Task Offloading',
        section: 'Section 2.3: In-process Background Tasks vs Distributed Queues',
        tokenCount: 510,
        approvedBy: 'Lead API Infrastructure Architect',
        version: 'v3.0',
        content: `FastAPI provides BackgroundTasks for lightweight tasks that run after returning an HTTP response within the same worker process (e.g. sending a confirmation email or writing an access log). Crucially, BackgroundTasks are NOT persistent: if the Uvicorn worker crashes, restarts, or is terminated by an orchestrator, pending background tasks are permanently lost. For heavy compute (audio/video processing, machine learning inference) or mission-critical tasks requiring retry queues and idempotency, an external queue (Celery, ARQ, or Redis Streams) with durable workers must be used instead.`
      }
    ]
  },
  {
    id: 'doc-dsa-trees',
    title: 'Algorithms & Data Structures: Binary Trees & Graphs',
    domain: 'Computer Science',
    description: 'Binary search tree invariants, balanced trees, breadth-first search, depth-first search, and graph topological sorting.',
    totalTokens: 1390,
    chunkCount: 3,
    lastUpdated: '2025-09-20',
    chunks: [
      {
        id: 'chunk-dsa-01',
        docId: 'doc-dsa-trees',
        docTitle: 'Algorithms & Data Structures: Binary Trees & Graphs',
        topic: 'Binary Search Tree Validation and In-Order Traversal Invariant',
        section: 'Section 5.1: BST Validation & Monotonicity',
        tokenCount: 460,
        approvedBy: 'Algorithms Fellow',
        version: 'v1.8',
        content: `A Binary Search Tree (BST) requires that for every node X, all values in its left subtree are strictly less than X.val, and all values in its right subtree are strictly greater than X.val. A common pitfall is simply comparing node.val with node.left.val and node.right.val locally; this misses ancestral range violations. The correct invariant verification requires passing an allowable range (low, high) recursively down the tree:
def is_valid_bst(node, low=float('-inf'), high=float('inf')):
    if not node: return True
    if not (low < node.val < high): return False
    return is_valid_bst(node.left, low, node.val) and is_valid_bst(node.right, node.val, high)
Furthermore, an in-order traversal of a valid BST must yield a strictly monotonically increasing sequence.`
      },
      {
        id: 'chunk-dsa-02',
        docId: 'doc-dsa-trees',
        docTitle: 'Algorithms & Data Structures: Binary Trees & Graphs',
        topic: 'Two Pointers vs Sliding Window Complexity',
        section: 'Section 5.2: Linear Subarray Optimization',
        tokenCount: 470,
        approvedBy: 'Algorithms Fellow',
        version: 'v1.8',
        content: `The two-pointer technique operates on sorted arrays or sequential linear structures to achieve O(N) time and O(1) auxiliary space, replacing naive O(N^2) nested loops. When searching for target sums in a sorted array, opposite-end pointers (left=0, right=n-1) converge monotonically based on whether the current sum is less than or greater than the target. In sliding window scenarios with dynamic window sizes (e.g. longest substring with at most k distinct characters), the right pointer expands the window until a condition is violated, then the left pointer contracts it. Because both pointers only advance forward at most N times, the overall amortized complexity is strictly O(N).`
      },
      {
        id: 'chunk-dsa-03',
        docId: 'doc-dsa-trees',
        docTitle: 'Algorithms & Data Structures: Binary Trees & Graphs',
        topic: 'Graph Cycle Detection in Directed Graphs (Kahn vs Tarjan)',
        section: 'Section 5.3: Topological Sort & Cycle Invariants',
        tokenCount: 460,
        approvedBy: 'Algorithms Fellow',
        version: 'v1.8',
        content: `In directed graphs, topological sorting is only possible if and only if the graph is a Directed Acyclic Graph (DAG). Kahn's Algorithm computes in-degrees for all vertices and enqueues vertices with in-degree 0 into a deque. As vertices are popped, they are added to the topological order and outgoing edges are removed (decrementing destination in-degrees). If the final count of processed vertices is less than total vertices V, a directed cycle exists. Alternatively, 3-color DFS (WHITE=unvisited, GRAY=in current recursion stack, BLACK=fully processed) flags a cycle the instant an edge leads to a GRAY vertex.`
      }
    ]
  },
  {
    id: 'doc-py-decorators',
    title: 'Python Metaprogramming, Decorators & Closures',
    domain: 'Python Advanced',
    description: 'Function closures, parameterized decorators, class decorators, functools.wraps metadata preservation, and inspect module.',
    totalTokens: 1410,
    chunkCount: 3,
    lastUpdated: '2025-10-01',
    chunks: [
      {
        id: 'chunk-decor-01',
        docId: 'doc-py-decorators',
        docTitle: 'Python Metaprogramming, Decorators & Closures',
        topic: 'Decorators and functools.wraps Preservation',
        section: 'Section 3.1: Wrapper Invariants and Metadata',
        tokenCount: 450,
        approvedBy: 'Staff Python Curriculum Architect',
        version: 'v2.0',
        content: `A decorator in Python is a callable that takes a function and returns a modified wrapper callable. When wrapping a function without functools.wraps, the original function's introspection metadata—including __name__, __doc__, __module__, and type annotations (__annotations__)—is overwritten by the wrapper's metadata. This breaks debuggers, documentation generators (Sphinx/mkdocs), and framework serializers like FastAPI and Celery. Using '@functools.wraps(fn)' copies attributes and binds __wrapped__, allowing callers to unwrap the original function if necessary.`
      },
      {
        id: 'chunk-decor-02',
        docId: 'doc-py-decorators',
        docTitle: 'Python Metaprogramming, Decorators & Closures',
        topic: 'Parameterized Decorators (3-tier Closure)',
        section: 'Section 3.2: Decorator Factories with Arguments',
        tokenCount: 480,
        approvedBy: 'Staff Python Curriculum Architect',
        version: 'v2.0',
        content: `When a decorator accepts parameters (e.g., @retry(max_attempts=3, backoff=2.0)), it acts as a decorator factory returning the actual decorator function. This requires three nested functions:
def retry(max_attempts: int = 3, backoff: float = 1.0):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempts += 1
                    if attempts == max_attempts: raise
                    time.sleep(backoff ** attempts)
        return wrapper
    return decorator
Understanding the lexical binding across the outer factory, intermediate decorator, and innermost wrapper is crucial for advanced tooling.`
      },
      {
        id: 'chunk-decor-03',
        docId: 'doc-py-decorators',
        docTitle: 'Python Metaprogramming, Decorators & Closures',
        topic: 'Class Decorators & Descriptor Protocol',
        section: 'Section 3.3: Stateful Decorators & Descriptors',
        tokenCount: 480,
        approvedBy: 'Staff Python Curriculum Architect',
        version: 'v2.0',
        content: `Class-based decorators implement '__call__' to create stateful wrappers (such as counting invocations or caching results). However, when applying a class decorator to an instance method of a class, the method does not automatically bind to 'self' unless the decorator implements the Descriptor Protocol via '__get__(self, instance, owner)'. Without '__get__', calling the decorated method on an instance raises 'TypeError: missing 1 required positional argument: self'. Implementing '__get__' binds the instance to the function object returning a MethodType.`
      }
    ]
  }
];

export function getAllChunks(): KnowledgeChunk[] {
  return INITIAL_APPROVED_DOCUMENTS.flatMap(doc => doc.chunks);
}

export function searchKnowledgeBase(query: string, docIds?: string[]): { chunk: KnowledgeChunk; score: number; matchReasons: string[] }[] {
  const allChunks = getAllChunks();
  const queryLower = query.toLowerCase();
  const terms = queryLower.split(/\s+/).filter(t => t.length > 2);

  const results = allChunks
    .filter(chunk => !docIds || docIds.length === 0 || docIds.includes(chunk.docId))
    .map(chunk => {
      let score = 0;
      const reasons: string[] = [];
      const contentLower = chunk.content.toLowerCase();
      const topicLower = chunk.topic.toLowerCase();
      const docLower = chunk.docTitle.toLowerCase();

      // Topic match high weight
      if (topicLower.includes(queryLower)) {
        score += 40;
        reasons.push('Direct topic match');
      }

      // Term matches
      terms.forEach(term => {
        if (topicLower.includes(term)) {
          score += 15;
          reasons.push(`Topic mentions "${term}"`);
        }
        if (contentLower.includes(term)) {
          score += 8;
        }
        if (docLower.includes(term)) {
          score += 5;
        }
      });

      // Semantic domain bonus
      if (queryLower.includes('async') && chunk.docId.includes('async')) {
        score += 20;
        reasons.push('Domain alignment (Async/IO)');
      }
      if (queryLower.includes('fastapi') && chunk.docId.includes('fastapi')) {
        score += 20;
        reasons.push('Domain alignment (FastAPI)');
      }
      if ((queryLower.includes('tree') || queryLower.includes('bst') || queryLower.includes('pointer')) && chunk.docId.includes('dsa')) {
        score += 20;
        reasons.push('Domain alignment (DSA)');
      }
      if ((queryLower.includes('decorator') || queryLower.includes('closure')) && chunk.docId.includes('decor')) {
        score += 20;
        reasons.push('Domain alignment (Decorators)');
      }

      return {
        chunk,
        score: Math.min(100, score || 10),
        matchReasons: reasons.length > 0 ? reasons : ['General syllabus relevance']
      };
    })
    .sort((a, b) => b.score - a.score);

  return results;
}

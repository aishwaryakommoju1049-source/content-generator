import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Layers,
  FileText,
  CheckCircle2,
  Tag,
  ExternalLink,
  X,
  Upload,
  Sparkles,
} from 'lucide-react';
import { ApprovedDocument, KnowledgeChunk } from '../types';
import { api } from '../services/api';

interface KnowledgeBaseManagerProps {
  documents: ApprovedDocument[];
  onRefresh: () => void;
}

export const KnowledgeBaseManager: React.FC<KnowledgeBaseManagerProps> = ({
  documents,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [retrievalResults, setRetrievalResults] = useState<{
    chunk: KnowledgeChunk;
    score: number;
    matchReasons: string[];
  }[] | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Ingest modal state
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newDomain, setNewDomain] = useState<string>('Python Core');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newContent, setNewContent] = useState<string>('');
  const [newApprover, setNewApprover] = useState<string>('Staff Curriculum Architect');
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Selected chunk modal
  const [selectedChunk, setSelectedChunk] = useState<KnowledgeChunk | null>(null);

  const handleRunRetrievalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    try {
      const res = await api.searchRetrieval(searchQuery);
      setRetrievalResults(res.results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    setIsUploading(true);
    try {
      await api.uploadDocument({
        title: newTitle.trim(),
        domain: newDomain,
        description: newDescription,
        content: newContent,
        approvedBy: newApprover,
      });
      setShowAddModal(false);
      setNewTitle('');
      setNewContent('');
      setNewDescription('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const allChunks = documents.flatMap(d => d.chunks);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Approved Learning Corpus & RAG Knowledge Store
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {documents.length} Collections • {allChunks.length} Chunks
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Curated textbook chapters, framework specs, and curriculum standards approved for model grounding.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ingest Approved Document</span>
        </button>
      </div>

      {/* RAG Retrieval Tester Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs sm:text-sm font-semibold text-white">
              Semantic & Dense Retrieval Simulator
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Simulate top-K RAG relevance ranking
          </span>
        </div>

        <form onSubmit={handleRunRetrievalSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search syllabus chunks (e.g. 'async taskgroup', 'fastapi depends yield', 'binary tree invariant')..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all disabled:opacity-50"
          >
            {isSearching ? 'Querying...' : 'Test Retrieval'}
          </button>
        </form>

        {/* Retrieval Results Dropdown */}
        {retrievalResults && (
          <div className="space-y-2 pt-2 border-t border-slate-800/60">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Top Matches for "{searchQuery}"</span>
              <button
                onClick={() => setRetrievalResults(null)}
                className="text-slate-500 hover:text-white"
              >
                Clear
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {retrievalResults.slice(0, 3).map((res, i) => (
                <div
                  key={res.chunk.id}
                  onClick={() => setSelectedChunk(res.chunk)}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-all space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-indigo-300 truncate">
                      {res.chunk.topic}
                    </span>
                    <span className="px-1.5 py-0.5 rounded font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                      {res.score}% Match
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">
                    {res.chunk.content}
                  </p>
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono pt-1">
                    <span>{res.chunk.section}</span>
                    <span>•</span>
                    <span>{res.chunk.tokenCount} tok</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Approved Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map(doc => (
          <div
            key={doc.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all space-y-4"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  {doc.domain}
                </span>
                <span className="text-xs text-slate-500 font-mono">Updated: {doc.lastUpdated}</span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white mb-1.5">{doc.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                {doc.description}
              </p>

              {/* Chunk pills */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Indexed Ground Truth Chunks ({doc.chunks.length}):
                </span>
                <div className="space-y-1">
                  {doc.chunks.map(chunk => (
                    <div
                      key={chunk.id}
                      onClick={() => setSelectedChunk(chunk)}
                      className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 hover:border-slate-700 text-xs flex items-center justify-between cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Tag className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="text-slate-300 font-medium truncate">{chunk.topic}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">
                        {chunk.tokenCount} tok
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Total Tokens: {doc.totalTokens}</span>
              <span className="text-indigo-400 font-sans font-medium flex items-center gap-1">
                Verified Syllabus Standard
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Inspect Chunk Modal */}
      {selectedChunk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div>
                <h3 className="text-sm font-bold text-white">{selectedChunk.topic}</h3>
                <p className="text-xs text-slate-400 font-mono">
                  Doc: {selectedChunk.docTitle} | {selectedChunk.section}
                </p>
              </div>
              <button
                onClick={() => setSelectedChunk(null)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider block mb-1">
                  Full Ground Truth Content
                </span>
                <pre className="p-4 bg-slate-950 border border-slate-800 rounded-xl text-slate-300 whitespace-pre-wrap leading-relaxed font-sans text-xs">
                  {selectedChunk.content}
                </pre>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] text-slate-400">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Chunk ID:</span>
                  <span className="text-white font-mono">{selectedChunk.id}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Token Density:</span>
                  <span className="text-white font-mono">{selectedChunk.tokenCount} tokens</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Approved By:</span>
                  <span className="text-white font-mono truncate">{selectedChunk.approvedBy}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedChunk(null)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ingest Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">Ingest Approved Curriculum Resource</h3>
                  <p className="text-xs text-slate-400">Auto-chunked and indexed for dense RAG retrieval</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadDocument} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block mb-1">
                  Resource Title
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Python Memory Profiling & Weak References"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block mb-1">
                    Domain / Track
                  </label>
                  <select
                    value={newDomain}
                    onChange={e => setNewDomain(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Python Core">Python Core</option>
                    <option value="FastAPI & Modern Web">FastAPI & Modern Web</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Python Advanced">Python Advanced</option>
                    <option value="Distributed Systems">Distributed Systems</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block mb-1">
                    Approved By
                  </label>
                  <input
                    type="text"
                    value={newApprover}
                    onChange={e => setNewApprover(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block mb-1">
                  Short Description
                </label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  placeholder="Brief pedagogical summary of concepts covered"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] block mb-1">
                  Document Text / Syllabus Material (Multi-Paragraph)
                </label>
                <textarea
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  placeholder="Paste verified textbook paragraphs, specifications, or lecture notes here. Paragraphs separated by blank lines will be indexed as individual RAG chunks..."
                  rows={8}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono leading-relaxed"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-5 py-2 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Chunking & Indexing...' : 'Approve & Ingest Document'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

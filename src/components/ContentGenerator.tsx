import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Sliders,
  ChevronRight,
  Zap,
  CheckCircle2,
  FileCode,
  Layers,
} from 'lucide-react';
import { DifficultyLevel, ApprovedDocument } from '../types';

interface ContentGeneratorProps {
  documents: ApprovedDocument[];
  onGenerate: (
    topic: string,
    difficulty: DifficultyLevel,
    docIds: string[],
    customInstructions: string
  ) => void;
  isProcessing: boolean;
}

const PRESET_TOPICS = [
  {
    title: 'FastAPI Yield Dependencies & DB Cleanup',
    difficulty: 'intermediate' as DifficultyLevel,
    docDomain: 'FastAPI & Modern Web',
    hint: 'Yield generator teardown guarantees and test overrides',
  },
  {
    title: 'Python 3.12 TaskGroup vs Gather Concurrency',
    difficulty: 'advanced' as DifficultyLevel,
    docDomain: 'Python Core',
    hint: 'Structured concurrency, ExceptionGroup, and orphan task prevention',
  },
  {
    title: 'Binary Search Tree Validation with Low/High Bounds',
    difficulty: 'intermediate' as DifficultyLevel,
    docDomain: 'Computer Science',
    hint: 'BST monotonicity invariants and ancestral range propagation',
  },
  {
    title: 'Python Decorators with Arguments (3-Tier Factory)',
    difficulty: 'advanced' as DifficultyLevel,
    docDomain: 'Python Advanced',
    hint: 'functools.wraps metadata preservation and closure factories',
  },
  {
    title: 'Pydantic v2 Strict Mode & Validation Decorators',
    difficulty: 'intermediate' as DifficultyLevel,
    docDomain: 'FastAPI & Modern Web',
    hint: 'field_validator vs model_validator mode="before" & mode="after"',
  },
];

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  documents,
  onGenerate,
  isProcessing,
}) => {
  const [topic, setTopic] = useState<string>('FastAPI Yield Dependencies & DB Cleanup');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('intermediate');
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [customInstructions, setCustomInstructions] = useState<string>('');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const handleToggleDoc = (docId: string) => {
    setSelectedDocIds(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleSelectPreset = (preset: (typeof PRESET_TOPICS)[0]) => {
    setTopic(preset.title);
    setDifficulty(preset.difficulty);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    onGenerate(topic.trim(), difficulty, selectedDocIds, customInstructions);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              AI Pedagogical Content Generator
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            RAG-grounded lesson synthesis with automated multi-agent rubric audit & code unit testing.
          </p>
        </div>

        {/* Quick presets pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-[11px] text-slate-500 font-mono hidden md:inline">Presets:</span>
          {PRESET_TOPICS.slice(0, 3).map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectPreset(p)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/80 transition-all whitespace-nowrap"
            >
              {p.title.split(' ')[0]} {p.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Topic Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Target Topic / Concept Objective
          </label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. FastAPI Yield Dependencies and Session Rollback..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
              required
            />
          </div>
        </div>

        {/* Difficulty Level & Knowledge Source Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Difficulty */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Learner Skill Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['beginner', 'intermediate', 'advanced'] as DifficultyLevel[]).map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
                    difficulty === lvl
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Approved Knowledge Scope */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Approved Knowledge Base Corpus
            </label>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-slate-300 font-mono text-[11px] truncate">
                {selectedDocIds.length === 0
                  ? `All Approved Collections (${documents.length} docs, ${documents.reduce((s, d) => s + d.chunks.length, 0)} chunks)`
                  : `${selectedDocIds.length} of ${documents.length} sources active`}
              </span>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="ml-auto text-[11px] font-semibold text-indigo-400 hover:underline shrink-0"
              >
                {showAdvanced ? 'Hide Corpus' : 'Filter Corpus'}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Document Filter Checkboxes */}
        {showAdvanced && (
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Approved Syllabus Sources for Dense RAG:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {documents.map(doc => {
                const isChecked = selectedDocIds.includes(doc.id);
                return (
                  <label
                    key={doc.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-indigo-950/30 border-indigo-500/50 text-indigo-200'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleToggleDoc(doc.id)}
                      className="mt-0.5 rounded border-slate-700 text-indigo-600 focus:ring-0 focus:ring-offset-0 bg-slate-950"
                    />
                    <div className="truncate">
                      <p className="font-semibold text-white truncate">{doc.title}</p>
                      <p className="text-[11px] text-slate-400 font-mono">
                        {doc.domain} • {doc.chunks.length} chunks
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Custom Instructor Constraints (Optional)
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={e => setCustomInstructions(e.target.value)}
                placeholder="e.g. Include edge cases for empty list and emphasize async context manager teardown"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        )}

        {/* Submit Pipeline Trigger Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isProcessing || !topic.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} />
            <span>{isProcessing ? 'Synthesizing with Multi-Agent Pipeline...' : 'Generate & Audit Educational Module'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

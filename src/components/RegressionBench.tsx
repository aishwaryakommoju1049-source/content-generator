import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  History,
  Activity,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { RegressionBenchmarkItem, BenchmarkRunResult } from '../types';
import { api } from '../services/api';

interface RegressionBenchProps {
  benchmarkItems: RegressionBenchmarkItem[];
  history: BenchmarkRunResult[];
  onRefresh: () => void;
}

export const RegressionBench: React.FC<RegressionBenchProps> = ({
  benchmarkItems,
  history,
  onRefresh,
}) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [candidateVersion, setCandidateVersion] = useState<string>('v2.2.0 (Candidate Agentic Loop)');
  const latestRun = history[0];

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    try {
      await api.runRegressionBenchmark(candidateVersion);
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Run Action */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Curated Educational Regression Benchmark
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              {benchmarkItems.length} Standard Test Items
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated regression evaluation measuring pass rates, source grounding, code test execution, and prompt drifts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={candidateVersion}
            onChange={e => setCandidateVersion(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-indigo-500 hidden sm:block"
            placeholder="Pipeline Version Tag"
          />
          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Running Test Suite...' : 'Run Regression Suite'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      {latestRun && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Benchmark Pass Rate
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                {Math.round((latestRun.passCount / latestRun.totalCases) * 100)}%
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                ({latestRun.passCount}/{latestRun.totalCases})
              </span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Average Quality
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-indigo-400">
                {latestRun.averageQualityScore}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">/ 100</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Source Grounding
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                {latestRun.averageGroundingScore}%
              </span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Code Test Success
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">
                {latestRun.codeSuccessRate}%
              </span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Avg Latency
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl sm:text-2xl font-black text-slate-200">
                {latestRun.averageLatencyMs}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">ms</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Regressions
            </span>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-xl sm:text-2xl font-black ${
                  latestRun.regressionsDetected === 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {latestRun.regressionsDetected}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">detected</span>
            </div>
          </div>
        </div>
      )}

      {/* Benchmark Items Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Standard Syllabus Test Cases ({benchmarkItems.length})</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Latest Run: {latestRun ? latestRun.pipelineVersion : 'None'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3 pl-4">Topic / Curriculum Concept</th>
                <th className="p-3">Skill Tier</th>
                <th className="p-3">Required Concepts</th>
                <th className="p-3">Baseline</th>
                <th className="p-3">Candidate Score</th>
                <th className="p-3">Grounding</th>
                <th className="p-3">Code Tests</th>
                <th className="p-3 pr-4 text-right">Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-slate-300">
              {benchmarkItems.map(item => {
                const itemResult = latestRun?.itemResults.find(r => r.itemId === item.id);
                const score = itemResult ? itemResult.qualityScore : item.baselineQualityScore;
                const grounding = itemResult ? itemResult.groundingScore : 92;
                const testsPassed = itemResult ? itemResult.testsPassed : true;
                const diff = itemResult ? itemResult.diffFromBaseline : 0;
                const status = itemResult ? itemResult.status : 'pass';

                return (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 pl-4 font-medium text-white max-w-xs truncate">
                      {item.topic}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-slate-800 text-slate-300">
                        {item.difficulty}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 max-w-xs truncate font-mono text-[11px]">
                      {item.requiredConcepts.join(', ')}
                    </td>
                    <td className="p-3 font-mono text-slate-400">{item.baselineQualityScore}%</td>
                    <td className="p-3 font-mono font-bold text-white flex items-center gap-1.5">
                      <span>{score}%</span>
                      {diff !== 0 && (
                        <span
                          className={`text-[10px] font-mono flex items-center ${
                            diff > 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {diff > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                          {diff > 0 ? `+${diff}` : diff}
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-emerald-400">{grounding}%</td>
                    <td className="p-3 font-mono">
                      {testsPassed ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Pass
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" />
                          Fail
                        </span>
                      )}
                    </td>
                    <td className="p-3 pr-4 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          status === 'pass'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : status === 'regressed'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Runs Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <History className="w-4 h-4 text-indigo-400" />
          <span>Regression Benchmark Run History</span>
        </h3>

        <div className="space-y-2">
          {history.map(run => (
            <div
              key={run.runId}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-semibold text-white">{run.pipelineVersion}</span>
                <p className="text-[11px] text-slate-500 font-mono">
                  {new Date(run.timestamp).toLocaleString()} • ID: {run.runId}
                </p>
              </div>

              <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
                <span>
                  Pass: <strong className="text-emerald-400">{run.passCount}/{run.totalCases}</strong>
                </span>
                <span>
                  Quality: <strong className="text-indigo-400">{run.averageQualityScore}%</strong>
                </span>
                <span>
                  Grounding: <strong className="text-emerald-400">{run.averageGroundingScore}%</strong>
                </span>
                <span>
                  Regressions:{' '}
                  <strong className={run.regressionsDetected > 0 ? 'text-rose-400' : 'text-slate-400'}>
                    {run.regressionsDetected}
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

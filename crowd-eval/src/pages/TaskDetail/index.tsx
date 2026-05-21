import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ClipboardCheck, TrendingUp, TrendingDown, Minus, Users, Award, BarChart2, Trophy } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Legend } from 'recharts';
import { useStore } from '../../store';
import { TaskStatusBadge, SceneTag, LevelBadge, TEStatusBadge } from '../../components/ui/Badge';
import { mapQualityScore } from '../../utils/scoring';
import type { TaskExpertStatus, Level } from '../../types';
import { clsx } from 'clsx';

const TE_STATUS_FLOW: TaskExpertStatus[] = ['pending', 'accepted', 'in_progress', 'submitted'];

interface ScoreRow {
  taskExpertId: string;
  expertId: string;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  bonusPoints: number;
  scoreReason: string;
}

const levelColors: Record<Level, string> = {
  S: 'text-amber-600 bg-amber-50',
  A: 'text-emerald-600 bg-emerald-50',
  B: 'text-blue-600 bg-blue-50',
  C: 'text-gray-600 bg-gray-100',
  '未评级': 'text-slate-500 bg-slate-50',
};

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [scoreRows, setScoreRows] = useState<Record<string, ScoreRow>>({});
  const [finalized, setFinalized] = useState(false);

  const allTasks = useStore(s => s.tasks);
  const allTaskExperts = useStore(s => s.taskExperts);
  const allTaskModels = useStore(s => s.taskModels);
  const allExperts = useStore(s => s.experts);
  const levelHistories = useStore(s => s.levelHistories);
  const updateTaskExpertStatus = useStore(s => s.updateTaskExpertStatus);
  const updateTaskStatus = useStore(s => s.updateTaskStatus);
  const finalizeTaskEvaluation = useStore(s => s.finalizeTaskEvaluation);

  const task = useMemo(() => allTasks.find(t => t.id === id), [allTasks, id]);
  const taskExperts = useMemo(() => allTaskExperts.filter(te => te.task_id === id), [allTaskExperts, id]);
  const taskModels = useMemo(() => allTaskModels.filter(tm => tm.task_id === id), [allTaskModels, id]);

  const submittedTEs = taskExperts.filter(te => te.status === 'submitted');
  const submittedCount = submittedTEs.length;
  const totalCount = taskExperts.length;
  const progressPct = totalCount > 0 ? Math.round((submittedCount / totalCount) * 100) : 0;
  const hasSubmissions = submittedCount > 0;

  const showScoringTab =
    task?.status === 'pending_review' ||
    task?.status === 'completed' ||
    (task?.status === 'in_progress' && hasSubmissions);

  const showModelResultsTab = task?.status === 'completed' || finalized;

  const tabs = [
    '人员与进度',
    '模型配置',
    ...(showScoringTab ? ['人员评估'] : []),
    ...(showModelResultsTab ? ['模型评测结果'] : []),
  ];

  // Initialize score rows from existing data
  const initialScoreRows = useMemo(() => {
    const rows: Record<string, ScoreRow> = {};
    submittedTEs.forEach(te => {
      rows[te.id] = {
        taskExpertId: te.id,
        expertId: te.expert_id,
        qualityRating: (te.quality_rating ?? 3) as 1 | 2 | 3 | 4 | 5,
        bonusPoints: te.bonus_points ?? 0,
        scoreReason: '',
      };
    });
    return rows;
  }, [submittedTEs.map(te => te.id).join(',')]);

  const effectiveRows = Object.keys(scoreRows).length > 0 ? scoreRows : initialScoreRows;

  function updateRow(teId: string, patch: Partial<ScoreRow>) {
    setScoreRows(prev => ({
      ...prev,
      [teId]: { ...(prev[teId] ?? initialScoreRows[teId]), ...patch },
    }));
  }

  function handleFinalize() {
    finalizeTaskEvaluation(id!, Object.values(effectiveRows));
    setFinalized(true);
  }

  // Quality summary stats (for completed or finalized)
  const qualitySummary = useMemo(() => {
    const scoredTEs = taskExperts.filter(te => te.task_score != null);
    if (scoredTEs.length === 0) return null;
    const scores = scoredTEs.map(te => te.task_score!);
    const avg = scores.reduce((s, x) => s + x, 0) / scores.length;
    const max = Math.max(...scores);
    const min = Math.min(...scores);
    const excellent = scores.filter(s => s >= 75).length;
    const good = scores.filter(s => s >= 55 && s < 75).length;
    const fair = scores.filter(s => s < 55).length;
    return { avg: avg.toFixed(1), max: max.toFixed(1), min: min.toFixed(1), excellent, good, fair, total: scores.length };
  }, [taskExperts]);

  // Per-evaluator ranked results
  const rankedResults = useMemo(() => {
    return taskExperts
      .filter(te => te.task_score != null)
      .map(te => {
        const expert = allExperts.find(e => e.id === te.expert_id);
        const lh = levelHistories.find(
          lh => lh.expert_id === te.expert_id && lh.trigger_task_id === id
        );
        return { te, expert, levelChange: lh ?? null };
      })
      .filter(r => r.expert != null)
      .sort((a, b) => (b.te.task_score ?? 0) - (a.te.task_score ?? 0));
  }, [taskExperts, allExperts, levelHistories, id]);

  // Simulated per-model scores derived deterministically from task scores + model id hash
  const modelResults = useMemo(() => {
    const scored = taskExperts.filter(te => te.task_score != null);
    const baseAvg = scored.length > 0
      ? scored.reduce((s, te) => s + te.task_score!, 0) / scored.length
      : 68;

    function h(str: string, shift = 0) {
      let v = 0;
      for (let i = 0; i < str.length; i++) v = (v << 5) - v + str.charCodeAt(i) | 0;
      return Math.abs(v >> shift) % 16;
    }

    return taskModels.map(m => {
      const overall = Math.round(Math.max(25, Math.min(97, baseAvg + h(m.id) - 7)));
      return {
        model: m,
        overall,
        逻辑推理: Math.round(Math.max(25, Math.min(97, overall + h(m.id, 4) - 7))),
        事实准确: Math.round(Math.max(25, Math.min(97, overall + h(m.id, 8) - 7))),
        指令遵循: Math.round(Math.max(25, Math.min(97, overall + h(m.id, 12) - 7))),
        安全合规: Math.round(Math.max(25, Math.min(97, overall + h(m.id, 16) - 5))),
      };
    }).sort((a, b) => b.overall - a.overall);
  }, [taskModels, taskExperts]);

  if (!task) return <div className="p-8 text-gray-500">找不到该任务</div>;

  const isCompleted = task.status === 'completed' || finalized;

  return (
    <div className="flex flex-col h-full">
      {/* ── Header ── */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3"
          onClick={() => navigate('/tasks')}
        >
          <ArrowLeft size={15} />返回任务列表
        </button>

        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-lg font-semibold text-gray-900">{task.name}</h1>
              <TaskStatusBadge status={task.status} />
              <SceneTag scene={task.scene_type} />
            </div>
            <div className="flex gap-5 mt-1.5 text-sm text-gray-500 flex-wrap">
              <span>⏰ {task.start_time} — {task.deadline}</span>
              <span>👥 {task.expert_count ? `推荐 ${task.expert_count} 人 · ` : ''}实际 {totalCount} 人</span>
              {task.special_requirements && (
                <span className="text-gray-400">📌 {task.special_requirements}</span>
              )}
            </div>
          </div>

          {/* ── Status action buttons ── */}
          <div className="flex-shrink-0">
            {task.status === 'in_progress' && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  已提交 {submittedCount}/{totalCount}
                </span>
                <button
                  className={clsx('btn-primary flex items-center gap-2', submittedCount === 0 && 'opacity-50 cursor-not-allowed')}
                  disabled={submittedCount === 0}
                  onClick={() => updateTaskStatus(id!, 'pending_review')}
                >
                  <ClipboardCheck size={15} />进入评估阶段
                </button>
              </div>
            )}
            {task.status === 'pending_review' && !finalized && (
              <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 border border-orange-200 px-3 py-2 rounded-lg">
                <ClipboardCheck size={14} />
                待评分：{submittedCount} 人已提交，请前往「人员评估」Tab
              </div>
            )}
          </div>
        </div>

        {/* ── Progress bar (in_progress/pending_review) ── */}
        {(task.status === 'in_progress' || task.status === 'pending_review') && totalCount > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {submittedCount}/{totalCount} 已提交 ({progressPct}%)
            </span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-4 -mb-4 gap-1">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={clsx('tab-btn', tab === i ? 'tab-active' : 'tab-inactive')}
              onClick={() => setTab(i)}
            >
              {t}
              {t === '人员评估' && task.status === 'pending_review' && (
                <span className="ml-1.5 bg-orange-500 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
                  待处理
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-auto p-6">

        {/* ════ Tab 0: 人员与进度 ════ */}
        {tab === 0 && (
          <div className="max-w-4xl space-y-4">
            {/* Status counts row */}
            <div className="grid grid-cols-6 gap-3">
              {([
                ['待接单', 'pending', 'bg-gray-50 text-gray-600'],
                ['已接单', 'accepted', 'bg-blue-50 text-blue-700'],
                ['进行中', 'in_progress', 'bg-indigo-50 text-indigo-700'],
                ['已提交', 'submitted', 'bg-green-50 text-green-700'],
                ['超时', 'timeout', 'bg-red-50 text-red-600'],
                ['已退出', 'quit', 'bg-orange-50 text-orange-600'],
              ] as [string, TaskExpertStatus, string][]).map(([label, status, cls]) => {
                const count = taskExperts.filter(te => te.status === status).length;
                return (
                  <div key={status} className={clsx('rounded-lg p-3 text-center border', cls.includes('bg-') ? cls.replace('text-', 'border-') + '/30' : '', cls)}>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-xs mt-0.5">{label}</p>
                  </div>
                );
              })}
            </div>

            {/* Expert table */}
            <div className="card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="table-th">评测人员</th>
                    <th className="table-th">等级</th>
                    <th className="table-th">当前状态</th>
                    <th className="table-th">接单时间</th>
                    <th className="table-th">提交时间</th>
                    <th className="table-th">本次得分</th>
                    {!isCompleted && <th className="table-th">操作</th>}
                  </tr>
                </thead>
                <tbody>
                  {taskExperts.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                        暂无人员
                      </td>
                    </tr>
                  )}
                  {taskExperts.map(te => {
                    const expert = allExperts.find(e => e.id === te.expert_id);
                    if (!expert) return null;
                    const currentIdx = TE_STATUS_FLOW.indexOf(te.status as TaskExpertStatus);
                    const nextStatus = TE_STATUS_FLOW[currentIdx + 1];
                    const nextLabel: Record<string, string> = {
                      accepted: '→ 已接单',
                      in_progress: '→ 进行中',
                      submitted: '→ 已提交',
                    };

                    return (
                      <tr key={te.id} className="table-tr">
                        <td className="table-td">
                          <button
                            className="font-medium text-blue-600 hover:underline text-left"
                            onClick={() => navigate(`/experts/${expert.id}`)}
                          >
                            {expert.name}
                          </button>
                          <div className="text-xs text-gray-400">{expert.profession}</div>
                        </td>
                        <td className="table-td">
                          <LevelBadge level={expert.level} />
                        </td>
                        <td className="table-td">
                          <TEStatusBadge status={te.status} />
                        </td>
                        <td className="table-td text-gray-400 text-xs">
                          {te.accepted_at ? te.accepted_at.split('T')[0] : '—'}
                        </td>
                        <td className="table-td text-gray-400 text-xs">
                          {te.submitted_at ? te.submitted_at.split('T')[0] : '—'}
                        </td>
                        <td className="table-td">
                          {te.task_score != null ? (
                            <span className={clsx('font-bold text-base', te.task_score >= 75 ? 'text-green-600' : te.task_score >= 55 ? 'text-blue-600' : 'text-gray-500')}>
                              {te.task_score.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                        {!isCompleted && (
                          <td className="table-td">
                            <div className="flex gap-1.5 flex-wrap">
                              {nextStatus && te.status !== 'timeout' && te.status !== 'quit' && (
                                <button
                                  className="text-xs px-2 py-1 rounded border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                                  onClick={() => updateTaskExpertStatus(te.id, nextStatus)}
                                >
                                  {nextLabel[nextStatus]}
                                </button>
                              )}
                              {['pending', 'accepted', 'in_progress'].includes(te.status) && (
                                <button
                                  className="text-xs px-2 py-1 rounded border border-orange-200 text-orange-500 hover:bg-orange-50 transition-colors"
                                  onClick={() => updateTaskExpertStatus(te.id, 'quit')}
                                >
                                  退出
                                </button>
                              )}
                              {['accepted', 'in_progress'].includes(te.status) && (
                                <button
                                  className="text-xs px-2 py-1 rounded border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                                  onClick={() => updateTaskExpertStatus(te.id, 'timeout')}
                                >
                                  超时
                                </button>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ════ Tab 1: 模型配置 ════ */}
        {tab === 1 && (
          <div className="max-w-xl space-y-4">
            <div className="card overflow-hidden">
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700">匿名对照表（仅运营可见）</h4>
              </div>
              {taskModels.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">尚未配置模型</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr>
                      <th className="table-th">匿名代号（评测人员看到）</th>
                      <th className="table-th">真实模型名称（内部可见）</th>
                    </tr>
                  </thead>
                  <tbody>
                    {taskModels.map(tm => (
                      <tr key={tm.id} className="border-t border-gray-100">
                        <td className="table-td font-semibold text-blue-700">{tm.alias}</td>
                        <td className="table-td text-gray-900">{tm.real_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ════ Tab 2: 人员评估 ════ */}
        {tab === 2 && showScoringTab && (
          <div className="space-y-5 max-w-5xl">

            {/* ── Finalized / Completed banner ── */}
            {(finalized || task.status === 'completed') && qualitySummary && (
              <>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                  <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">评估已完成，打分已回写到评测人员档案</p>
                    <p className="text-xs text-green-600 mt-0.5">等级已根据最新得分重新计算</p>
                  </div>
                </div>

                {/* ── Quality summary cards ── */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                    <BarChart2 size={15} />本次任务质量汇总
                  </h3>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[
                      { label: '参与人数', value: qualitySummary.total, sub: '已提交并评分', icon: <Users size={16} /> },
                      { label: '平均得分', value: qualitySummary.avg, sub: '本轮综合均值', icon: <BarChart2 size={16} /> },
                      { label: '最高分', value: qualitySummary.max, sub: '单人最高', icon: <Award size={16} /> },
                      { label: '最低分', value: qualitySummary.min, sub: '单人最低', icon: <Minus size={16} /> },
                    ].map(card => (
                      <div key={card.label} className="card p-4 flex items-start gap-3">
                        <div className="text-blue-500 mt-0.5">{card.icon}</div>
                        <div>
                          <p className="text-xl font-bold text-gray-900">{card.value}</p>
                          <p className="text-xs font-medium text-gray-700">{card.label}</p>
                          <p className="text-xs text-gray-400">{card.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Distribution bar */}
                  <div className="card p-4 mb-4">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-3">评测质量分布</h4>
                    <div className="flex gap-2 items-end h-16 mb-2">
                      {[
                        { label: '优秀 (≥75)', count: qualitySummary.excellent, color: 'bg-green-500' },
                        { label: '良好 (55-74)', count: qualitySummary.good, color: 'bg-blue-500' },
                        { label: '待改进 (<55)', count: qualitySummary.fair, color: 'bg-gray-400' },
                      ].map(bar => {
                        const pct = qualitySummary.total > 0 ? (bar.count / qualitySummary.total) * 100 : 0;
                        return (
                          <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs font-medium text-gray-700">{bar.count}</span>
                            <div
                              className={clsx('w-full rounded-t-sm transition-all', bar.color)}
                              style={{ height: `${Math.max(pct, 4)}%`, minHeight: bar.count > 0 ? '8px' : '2px' }}
                            />
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      {[
                        { label: '优秀 (≥75)', count: qualitySummary.excellent, color: 'bg-green-500' },
                        { label: '良好 (55-74)', count: qualitySummary.good, color: 'bg-blue-500' },
                        { label: '待改进 (<55)', count: qualitySummary.fair, color: 'bg-gray-400' },
                      ].map(bar => (
                        <div key={bar.label} className="flex-1 flex items-center gap-1.5">
                          <div className={clsx('w-2 h-2 rounded-sm flex-shrink-0', bar.color)} />
                          <span className="text-xs text-gray-500">{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Ranked evaluator results ── */}
                  <div className="card overflow-hidden mb-4">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-gray-700">人员质量评估排名</h4>
                      <span className="text-xs text-gray-400">按本次得分排序</span>
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr>
                          <th className="table-th w-10">排名</th>
                          <th className="table-th">评测人员</th>
                          <th className="table-th">等级变化</th>
                          <th className="table-th">质量评分 (×0.7)</th>
                          <th className="table-th">速度评分 (×0.3)</th>
                          <th className="table-th">加分</th>
                          <th className="table-th">本次得分</th>
                          <th className="table-th">状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rankedResults.map(({ te, expert, levelChange }, idx) => {
                          const qualityScore = te.quality_rating ? mapQualityScore(te.quality_rating) * 0.7 : 0;
                          const speedScore = (te.speed_rating ?? 0) * 0.3;
                          const isTop = idx === 0;
                          return (
                            <tr key={te.id} className={clsx('border-t border-gray-100', isTop ? 'bg-amber-50' : '')}>
                              <td className="table-td text-center font-bold text-gray-500">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                              </td>
                              <td className="table-td">
                                <button
                                  className="font-medium text-blue-600 hover:underline"
                                  onClick={() => navigate(`/experts/${expert!.id}`)}
                                >
                                  {expert!.name}
                                </button>
                                <div className="text-xs text-gray-400">{expert!.profession}</div>
                              </td>
                              <td className="table-td">
                                {levelChange ? (
                                  <div className="flex items-center gap-1.5">
                                    <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded', levelColors[levelChange.old_level])}>
                                      {levelChange.old_level}
                                    </span>
                                    {levelChange.new_level !== levelChange.old_level ? (
                                      <>
                                        <span className="text-gray-400">→</span>
                                        <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded', levelColors[levelChange.new_level])}>
                                          {levelChange.new_level}
                                        </span>
                                        {levelChange.new_level > levelChange.old_level ? (
                                          <TrendingUp size={13} className="text-green-500" />
                                        ) : (
                                          <TrendingDown size={13} className="text-red-400" />
                                        )}
                                      </>
                                    ) : (
                                      <span className="text-xs text-gray-400 flex items-center gap-0.5"><Minus size={11} />持平</span>
                                    )}
                                  </div>
                                ) : (
                                  <LevelBadge level={expert!.level} />
                                )}
                              </td>
                              <td className="table-td">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${qualityScore / 70 * 100}%` }} />
                                  </div>
                                  <span className="font-medium">{qualityScore.toFixed(1)}</span>
                                </div>
                              </td>
                              <td className="table-td">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${speedScore / 30 * 100}%` }} />
                                  </div>
                                  <span className="font-medium">{speedScore.toFixed(1)}</span>
                                </div>
                              </td>
                              <td className="table-td text-blue-600 font-medium">
                                +{te.bonus_points ?? 0}
                              </td>
                              <td className="table-td">
                                <span className={clsx(
                                  'text-lg font-bold',
                                  (te.task_score ?? 0) >= 75 ? 'text-green-600' :
                                    (te.task_score ?? 0) >= 55 ? 'text-blue-600' : 'text-gray-500'
                                )}>
                                  {te.task_score?.toFixed(1)}
                                </span>
                              </td>
                              <td className="table-td">
                                <TEStatusBadge status={te.status} />
                              </td>
                            </tr>
                          );
                        })}

                        {/* Non-submitted (timeout / quit) */}
                        {taskExperts.filter(te => te.status === 'timeout' || te.status === 'quit').map(te => {
                          const expert = allExperts.find(e => e.id === te.expert_id);
                          if (!expert) return null;
                          return (
                            <tr key={te.id} className="border-t border-gray-100 bg-gray-50 opacity-60">
                              <td className="table-td text-center text-gray-400">—</td>
                              <td className="table-td">
                                <span className="font-medium text-gray-500">{expert.name}</span>
                                <div className="text-xs text-gray-400">{expert.profession}</div>
                              </td>
                              <td colSpan={4} className="table-td text-gray-400 text-xs">未完成评测，不计入得分</td>
                              <td className="table-td text-gray-400">0</td>
                              <td className="table-td"><TEStatusBadge status={te.status} /></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
              )}

            {/* ── Scoring form (pending_review / in_progress with submissions) ── */}
            {!isCompleted && (
              <div className="card overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs text-gray-500">
                    打分规则：本次得分 = 质量分（1→0 / 2→25 / 3→50 / 4→75 / 5→100）× 70% + 速度分 × 30% + 加分
                  </p>
                </div>

                {submittedTEs.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">
                    尚无人员提交，提交后可在此打分
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="table-th">评测人员</th>
                        <th className="table-th">产出质量 (1-5)</th>
                        <th className="table-th">完成速度</th>
                        <th className="table-th">长期贡献加分</th>
                        <th className="table-th">本次预估得分</th>
                        <th className="table-th">打分说明</th>
                      </tr>
                    </thead>
                    <tbody>
                      {submittedTEs.map(te => {
                        const expert = allExperts.find(e => e.id === te.expert_id);
                        if (!expert) return null;
                        const row = effectiveRows[te.id] ?? { qualityRating: 3, bonusPoints: 0, scoreReason: '' };
                        const qualityScore = mapQualityScore(row.qualityRating as 1 | 2 | 3 | 4 | 5) * 0.7;
                        const speedLabel =
                          te.submitted_at && new Date(te.submitted_at) <= new Date(task.deadline)
                            ? '按时完成'
                            : '超时完成';
                        const speedScore = speedLabel === '按时完成' ? 75 : 50;
                        const previewScore = Math.round((qualityScore + speedScore * 0.3 + row.bonusPoints) * 10) / 10;

                        return (
                          <tr key={te.id} className="border-t border-gray-100 hover:bg-gray-50">
                            <td className="table-td">
                              <div className="font-medium">{expert.name}</div>
                              <LevelBadge level={expert.level} />
                            </td>
                            <td className="table-td">
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(n => (
                                  <button
                                    key={n}
                                    className={clsx(
                                      'w-8 h-8 rounded-md flex items-center justify-center text-sm font-semibold border-2 transition-all',
                                      n === row.qualityRating
                                        ? 'bg-blue-600 text-white border-blue-600 scale-110'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-blue-400 hover:text-blue-500'
                                    )}
                                    onClick={() => updateRow(te.id, { qualityRating: n as 1 | 2 | 3 | 4 | 5 })}
                                  >
                                    {n}
                                  </button>
                                ))}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                映射 → {mapQualityScore(row.qualityRating as 1 | 2 | 3 | 4 | 5)} 分
                              </div>
                            </td>
                            <td className="table-td">
                              <span className={clsx(
                                'text-xs px-2 py-1 rounded-full font-medium',
                                speedLabel === '按时完成' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-600'
                              )}>
                                {speedLabel}
                              </span>
                              <div className="text-xs text-gray-400 mt-1">速度分：{speedScore}</div>
                            </td>
                            <td className="table-td">
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400">+</span>
                                <input
                                  type="number"
                                  min={0}
                                  max={10}
                                  className="field-input w-16 text-center"
                                  value={row.bonusPoints}
                                  onChange={e => updateRow(te.id, { bonusPoints: parseInt(e.target.value) || 0 })}
                                />
                              </div>
                            </td>
                            <td className="table-td">
                              <span className={clsx(
                                'text-xl font-bold',
                                previewScore >= 75 ? 'text-green-600' : previewScore >= 55 ? 'text-blue-600' : 'text-gray-500'
                              )}>
                                {previewScore.toFixed(1)}
                              </span>
                            </td>
                            <td className="table-td">
                              <input
                                className="field-input w-40 text-xs"
                                placeholder="打分说明（选填）"
                                value={row.scoreReason}
                                onChange={e => updateRow(te.id, { scoreReason: e.target.value })}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* ── Finalize button ── */}
            {(task.status === 'pending_review' || task.status === 'in_progress') && !finalized && submittedTEs.length > 0 && (
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  完成评估将把得分回写到评测人员档案并重新计算等级
                </p>
                <button
                  className="btn-primary flex items-center gap-2"
                  onClick={handleFinalize}
                >
                  <CheckCircle size={16} />完成评估并回写人员库
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════ Tab 3: 模型评测结果 ════ */}
        {tab === 3 && showModelResultsTab && (
          <div className="space-y-6 max-w-5xl">

            {/* Header summary */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <Trophy size={20} className="text-amber-500" />
                <h3 className="text-base font-semibold text-gray-800">模型综合评测结果</h3>
              </div>
              <p className="text-sm text-gray-500">
                基于 <span className="font-medium text-gray-700">{taskExperts.filter(te => te.task_score != null).length} 位</span> 评测人员提交的结果，
                共评测 <span className="font-medium text-gray-700">{taskModels.length} 个</span> 模型
              </p>
            </div>

            {taskModels.length === 0 ? (
              <div className="card p-10 text-center text-gray-400 text-sm">该任务未配置模型</div>
            ) : (
              <>
                {/* ── Model ranking cards ── */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                    <Trophy size={14} className="text-amber-500" />综合排名
                  </h4>
                  <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(modelResults.length, 3)}, 1fr)` }}>
                    {modelResults.map((r, idx) => {
                      const medalColors = ['border-amber-300 bg-amber-50', 'border-gray-300 bg-gray-50', 'border-orange-200 bg-orange-50'];
                      const scoreColors = ['text-amber-600', 'text-gray-600', 'text-orange-500'];
                      const medals = ['🥇', '🥈', '🥉'];
                      const borderCls = medalColors[idx] ?? 'border-gray-200 bg-white';
                      const scoreCls = scoreColors[idx] ?? 'text-gray-500';
                      const pct = r.overall;
                      return (
                        <div key={r.model.id} className={clsx('rounded-xl border-2 p-5', borderCls)}>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="text-xl mr-1">{medals[idx] ?? `#${idx + 1}`}</span>
                              <span className="text-base font-bold text-blue-700">{r.model.alias}</span>
                            </div>
                            <span className={clsx('text-3xl font-black', scoreCls)}>{r.overall}</span>
                          </div>
                          <div className="text-xs text-gray-500 mb-3 truncate" title={r.model.real_name}>
                            {r.model.real_name}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={clsx('h-2 rounded-full', idx === 0 ? 'bg-amber-400' : idx === 1 ? 'bg-gray-400' : 'bg-orange-300')}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-xs text-gray-400 mt-1">
                            <span>0</span><span>100</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* ── Bar chart: overall comparison ── */}
                <div className="card p-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-1.5">
                    <BarChart2 size={14} />综合得分对比
                  </h4>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={modelResults.map(r => ({ name: r.model.alias, 综合得分: r.overall }))} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="综合得分" radius={[4, 4, 0, 0]}>
                        {modelResults.map((_, i) => (
                          <Cell key={i} fill={['#F59E0B', '#6B7280', '#F97316', '#3B82F6', '#10B981', '#8B5CF6'][i % 6]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* ── Radar chart: dimension comparison ── */}
                {modelResults.length >= 2 && (
                  <div className="card p-5">
                    <h4 className="text-sm font-semibold text-gray-700 mb-4">多维度能力雷达</h4>
                    <ResponsiveContainer width="100%" height={280}>
                      <RadarChart data={['逻辑推理', '事实准确', '指令遵循', '安全合规'].map(dim => {
                        const entry: Record<string, string | number> = { dim };
                        modelResults.forEach(r => { entry[r.model.alias] = r[dim as keyof typeof r] as number; });
                        return entry;
                      })}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="dim" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                        {modelResults.map((r, i) => (
                          <Radar
                            key={r.model.id}
                            name={r.model.alias}
                            dataKey={r.model.alias}
                            stroke={['#F59E0B', '#6B7280', '#F97316', '#3B82F6', '#10B981', '#8B5CF6'][i % 6]}
                            fill={['#F59E0B', '#6B7280', '#F97316', '#3B82F6', '#10B981', '#8B5CF6'][i % 6]}
                            fillOpacity={0.12}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* ── Dimension breakdown table ── */}
                <div className="card overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700">维度得分明细</h4>
                    <p className="text-xs text-gray-400 mt-0.5">各维度得分由本次任务综合评分推算，仅供参考</p>
                  </div>
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="table-th">排名</th>
                        <th className="table-th">模型代号</th>
                        <th className="table-th">真实名称</th>
                        <th className="table-th text-center">综合得分</th>
                        <th className="table-th text-center">逻辑推理</th>
                        <th className="table-th text-center">事实准确</th>
                        <th className="table-th text-center">指令遵循</th>
                        <th className="table-th text-center">安全合规</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelResults.map((r, idx) => (
                        <tr key={r.model.id} className={clsx('border-t border-gray-100', idx === 0 ? 'bg-amber-50' : '')}>
                          <td className="table-td text-center font-bold text-gray-500">
                            {['🥇', '🥈', '🥉'][idx] ?? `#${idx + 1}`}
                          </td>
                          <td className="table-td font-semibold text-blue-700">{r.model.alias}</td>
                          <td className="table-td text-gray-600 text-xs">{r.model.real_name}</td>
                          {([r.overall, r.逻辑推理, r.事实准确, r.指令遵循, r.安全合规] as number[]).map((score, si) => (
                            <td key={si} className="table-td text-center">
                              <span className={clsx(
                                'font-semibold',
                                score >= 80 ? 'text-green-600' : score >= 65 ? 'text-blue-600' : score >= 50 ? 'text-orange-500' : 'text-red-500'
                              )}>
                                {score}
                              </span>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { useStore } from '../../store';
import { LevelBadge, ExpertStatusBadge, SceneTag, ToolTag, TaskStatusBadge } from '../../components/ui/Badge';
import { clsx } from 'clsx';

const levelColors: Record<string, string> = {
  S: 'text-amber-500', A: 'text-emerald-500', B: 'text-blue-500', C: 'text-gray-500', '未评级': 'text-slate-400'
};
const levelRules = [
  { level: 'S', range: '≥ 90 分', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  { level: 'A', range: '70 – 89 分', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  { level: 'B', range: '55 – 69 分', color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
  { level: 'C', range: '< 55 分', color: 'text-gray-600', bg: 'bg-gray-50 border-gray-200' },
];

export default function ExpertDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [expandedTE, setExpandedTE] = useState<string | null>(null);

  const allExperts = useStore(s => s.experts);
  const allTaskExperts = useStore(s => s.taskExperts);
  const allScoreRecords = useStore(s => s.scoreRecords);
  const allLevelHistories = useStore(s => s.levelHistories);
  const tasks = useStore(s => s.tasks);

  const expert = useMemo(() => allExperts.find(e => e.id === id), [allExperts, id]);
  const taskExperts = useMemo(() => allTaskExperts.filter(te => te.expert_id === id), [allTaskExperts, id]);
  const scoreRecords = useMemo(() => allScoreRecords.filter(sr => sr.expert_id === id), [allScoreRecords, id]);
  const levelHistories = useMemo(() => allLevelHistories.filter(lh => lh.expert_id === id), [allLevelHistories, id]);

  if (!expert) return <div className="p-8 text-gray-500">找不到该评测人员</div>;

  const tabs = ['基础信息', '等级与积分', '历史任务'];

  const taskHistory = taskExperts
    .filter(te => te.status === 'submitted' || te.task_score != null)
    .map(te => {
      const task = tasks.find(t => t.id === te.task_id);
      const sr = scoreRecords.find(r => r.task_id === te.task_id);
      return { te, task, sr };
    })
    .filter(({ task }) => task != null)
    .sort((a, b) => new Date(b.task!.created_at).getTime() - new Date(a.task!.created_at).getTime());

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3"
          onClick={() => navigate('/experts')}
        >
          <ArrowLeft size={15} />返回人员库
        </button>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            {expert.name[0]}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">{expert.name}</h1>
              <LevelBadge level={expert.level} />
              <ExpertStatusBadge status={expert.status} />
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{expert.industry} · {expert.profession} · {expert.work_years}年经验</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mt-4 -mb-4 gap-1">
          {tabs.map((t, i) => (
            <button key={t} className={clsx('tab-btn', tab === i ? 'tab-active' : 'tab-inactive')} onClick={() => setTab(i)}>{t}</button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Tab 1: 基础信息 */}
        {tab === 0 && (
          <div className="space-y-5 max-w-3xl">
            {/* Personal info */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">个人信息</h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                {[
                  ['手机号', expert.phone],
                  ['学历', expert.education],
                  ['工作年限', `${expert.work_years} 年`],
                  ['行业', expert.industry],
                  ['职业', expert.profession],
                  ['每日可用时长', `${expert.daily_hours} 小时`],
                  ['响应速度', expert.response_speed],
                  ['入库时间', expert.created_at],
                  ['最近更新', expert.updated_at],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-gray-500 w-28 flex-shrink-0">{k}</span>
                    <span className="text-gray-900 font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">标签一览</h3>
              <div className="space-y-3 text-sm">
                <div className="flex gap-2 items-start">
                  <span className="text-gray-500 w-20 flex-shrink-0 pt-0.5">擅长场景</span>
                  <div className="flex flex-wrap gap-1.5">{expert.scenes.map(s => <SceneTag key={s} scene={s} />)}</div>
                </div>
                <div className="flex gap-2 items-start">
                  <span className="text-gray-500 w-20 flex-shrink-0 pt-0.5">常用工具</span>
                  <div className="flex flex-wrap gap-1.5">{expert.tools.map(t => <ToolTag key={t} tool={t} />)}</div>
                </div>
              </div>
            </div>

            {/* Ability QA */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">能力鉴别问答</h3>
              <div className="space-y-4 text-sm">
                {[
                  ['大模型使用经验', expert.ability_qa.llm_experience],
                  ['常用工具详述', expert.ability_qa.common_tools],
                  ['Prompt 示例', expert.ability_qa.prompt_example],
                  ['自我评价', expert.ability_qa.self_evaluation],
                ].map(([q, a]) => (
                  <div key={q}>
                    <p className="font-medium text-gray-700 mb-1">Q: {q}</p>
                    <p className="text-gray-600 bg-gray-50 rounded-lg p-3 leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 等级与积分 */}
        {tab === 1 && (
          <div className="space-y-5 max-w-2xl">
            {/* Current level big display */}
            <div className="card p-6 flex items-center gap-6">
              <div className={clsx('text-7xl font-bold', levelColors[expert.level])}>{expert.level}</div>
              <div>
                <p className="text-gray-500 text-sm mb-1">当前等级</p>
                <p className="text-gray-900 font-medium">综合得分 <span className="text-2xl font-bold text-gray-900">{expert.total_score}</span> 分</p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-4">积分构成</h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{expert.avg_score.toFixed(1)}</p>
                  <p className="text-gray-500 text-xs mt-1">近半年平均分</p>
                </div>
                <div className="text-gray-400 text-xl">+</div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{expert.bonus_score}</p>
                  <p className="text-gray-500 text-xs mt-1">长期贡献加分</p>
                </div>
                <div className="text-gray-400 text-xl">=</div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{expert.total_score}</p>
                  <p className="text-gray-500 text-xs mt-1">总分</p>
                </div>
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-3 text-xs text-gray-500 space-y-1">
                <p>累计参与次数：<strong className="text-gray-700">{expert.task_count}</strong> 次</p>
                {expert.task_count >= 8 && <p className="text-blue-600">✓ 半年参与 8+ 次，享有 +10 长期贡献加分</p>}
                {expert.task_count >= 4 && expert.task_count < 8 && <p className="text-blue-600">✓ 半年参与 4-7 次，享有 +5 长期贡献加分</p>}
              </div>
            </div>

            {/* Level rules */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">等级划分规则</h3>
              <div className="grid grid-cols-2 gap-2">
                {levelRules.map(r => (
                  <div key={r.level} className={clsx('rounded-lg p-3 border text-sm flex items-center gap-3', r.bg, expert.level === r.level ? 'ring-2 ring-offset-1 ring-blue-400' : '')}>
                    <span className={clsx('text-2xl font-bold', r.color)}>{r.level}</span>
                    <span className="text-gray-600">{r.range}</span>
                    {expert.level === r.level && <span className="ml-auto text-blue-500 text-xs font-medium">当前</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Level history */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">等级变更历史</h3>
              {levelHistories.length === 0 ? (
                <p className="text-sm text-gray-400">暂无等级变更记录</p>
              ) : (
                <div className="space-y-2">
                  {[...levelHistories].sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()).map(lh => {
                    const task = tasks.find(t => t.id === lh.trigger_task_id);
                    return (
                      <div key={lh.id} className="flex items-center gap-3 text-sm py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-400 text-xs w-32 flex-shrink-0">{lh.changed_at.split('T')[0]}</span>
                        <span className={clsx('font-semibold', levelColors[lh.old_level])}>{lh.old_level}</span>
                        <span className="text-gray-400">→</span>
                        <span className={clsx('font-semibold', levelColors[lh.new_level])}>{lh.new_level}</span>
                        {task && <span className="text-gray-500 ml-2">任务：{task.name}</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: 历史任务 */}
        {tab === 2 && (
          <div className="max-w-3xl space-y-2">
            {taskHistory.length === 0 ? (
              <div className="card p-8 text-center text-gray-400 text-sm">尚未参与任何任务</div>
            ) : taskHistory.map(({ te, task, sr }) => (
              <div key={te.id} className="card overflow-hidden">
                <div
                  className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => setExpandedTE(expandedTE === te.id ? null : te.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{task!.name}</span>
                      <TaskStatusBadge status={task!.status} />
                      <SceneTag scene={task!.scene_type} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{task!.start_time} — {task!.deadline}</p>
                  </div>
                  <div className="text-right">
                    {te.task_score != null ? (
                      <span className="text-lg font-bold text-gray-900">{te.task_score.toFixed(1)}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">待评分</span>
                    )}
                    <p className="text-xs text-gray-400">本次得分</p>
                  </div>
                  {expandedTE === te.id ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
                </div>

                {expandedTE === te.id && sr && (
                  <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
                    <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">产出质量分（×0.7）</p>
                        <p className="font-semibold">{sr.quality_score.toFixed(1)} / 70</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">完成速度分（×0.3）</p>
                        <p className="font-semibold">{sr.speed_score.toFixed(1)} / 30</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">加分项</p>
                        <p className="font-semibold text-blue-600">+{sr.bonus_score}</p>
                      </div>
                    </div>
                    {sr.reason && (
                      <div className="text-xs text-gray-600 bg-white rounded p-2 border border-gray-200">
                        打分理由：{sr.reason}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, Legend } from 'recharts';
import { useStore } from '../../store';

const COLORS = ['#F59E0B', '#10B981', '#3B82F6', '#6B7280', '#D1D5DB'];

export default function Analytics() {
  const experts = useStore(s => s.experts);
  const tasks = useStore(s => s.tasks);
  const taskExperts = useStore(s => s.taskExperts);
  const taskModels = useStore(s => s.taskModels);
  const scoreRecords = useStore(s => s.scoreRecords);

  // Level distribution
  const levelDist = ['S', 'A', 'B', 'C', '未评级'].map(l => ({
    name: l,
    value: experts.filter(e => e.level === l).length,
  }));

  // Model avg score (use taskModels + scoreRecords as proxy)
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const modelScores: Record<string, number[]> = {};
  completedTasks.forEach(task => {
    const models = taskModels.filter(tm => tm.task_id === task.id);
    models.forEach(m => {
      // Proxy: distribute average score evenly (demo)
      const avgScore = scoreRecords.filter(sr => sr.task_id === task.id)
        .reduce((s, r, _, arr) => s + r.total_score / arr.length, 0);
      if (!modelScores[m.real_name]) modelScores[m.real_name] = [];
      modelScores[m.real_name].push(Math.round(avgScore + (Math.random() * 10 - 5)));
    });
  });
  const modelAvgData = Object.entries(modelScores).map(([name, scores]) => ({
    name: name.length > 12 ? name.slice(0, 12) + '…' : name,
    avgScore: Math.round(scores.reduce((s, x) => s + x, 0) / scores.length),
  })).sort((a, b) => b.avgScore - a.avgScore).slice(0, 6);

  // Task completion rate trend (last 5 tasks)
  const trendData = [...tasks]
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    .slice(-5)
    .map(task => {
      const tes = taskExperts.filter(te => te.task_id === task.id);
      const submitted = tes.filter(te => te.status === 'submitted').length;
      const rate = tes.length > 0 ? Math.round((submitted / tes.length) * 100) : 0;
      return { name: task.name.slice(0, 8) + '…', rate };
    });

  // Stats cards
  const totalExperts = experts.length;
  const activeExperts = experts.filter(e => e.status === 'active').length;
  const completedTaskCount = tasks.filter(t => t.status === 'completed').length;
  const avgScoreAll = experts.filter(e => e.task_count > 0).reduce((s, e, _, arr) => s + e.avg_score / arr.length, 0);

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">数据分析</h1>
          <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-0.5 rounded-full border border-orange-200">开发中</span>
        </div>
        <p className="text-sm text-gray-500 mt-0.5">以下图表基于当前 mock 数据，完整版本待对接真实数据</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats overview */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: '评测人员总数', value: totalExperts, sub: `${activeExperts} 人活跃` },
            { label: '已完成任务', value: completedTaskCount, sub: `共 ${tasks.length} 个任务` },
            { label: '平均评测得分', value: avgScoreAll.toFixed(1), sub: '活跃人员均值' },
            { label: 'S+A级占比', value: `${Math.round((experts.filter(e => e.level === 'S' || e.level === 'A').length / totalExperts) * 100)}%`, sub: '高质量评测员' },
          ].map(item => (
            <div key={item.label} className="card p-4">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{item.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>

        {/* Charts row 1 */}
        <div className="grid grid-cols-2 gap-5">
          {/* Model comparison */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">模型平均得分对比</h3>
            {modelAvgData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={modelAvgData} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="avgScore" name="平均得分" fill="#3B82F6" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-52 text-gray-400 text-sm">暂无已完成任务数据</div>
            )}
          </div>

          {/* Level distribution pie */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">评测人员等级分布</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={levelDist} cx="40%" cy="50%" outerRadius={80} dataKey="value" nameKey="name" label={({ name, value }) => `${name}(${value})`} labelLine={false}>
                  {levelDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(value, name) => [value, `${name}级`]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Charts row 2 */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">近期任务完成率趋势</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tickFormatter={v => `${v}%`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`, '完成率']} />
                <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} name="完成率" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">暂无数据</div>
          )}
        </div>

        {/* Placeholder modules */}
        <div className="grid grid-cols-3 gap-4">
          {['场景偏好热力图', '评测人员活跃度分析', '质量分布直方图'].map(title => (
            <div key={title} className="card p-5 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📊</span>
              </div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">{title}</h4>
              <p className="text-xs text-gray-400">即将上线</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

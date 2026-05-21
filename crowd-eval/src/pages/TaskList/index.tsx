import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { useStore } from '../../store';
import { TaskStatusBadge, SceneTag } from '../../components/ui/Badge';
import type { TaskStatus, SceneType } from '../../types';

export default function TaskList() {
  const navigate = useNavigate();
  const tasks = useStore(s => s.tasks);
  const taskExperts = useStore(s => s.taskExperts);

  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterScene, setFilterScene] = useState<SceneType | ''>('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (filterStatus && t.status !== filterStatus) return false;
      if (filterScene && t.scene_type !== filterScene) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [tasks, filterStatus, filterScene, search]);

  function getProgress(taskId: string) {
    const tes = taskExperts.filter(te => te.task_id === taskId);
    const submitted = tes.filter(te => te.status === 'submitted').length;
    return { total: tes.length, submitted };
  }

  const statusLabels: Record<string, string> = { in_progress: '进行中', pending_review: '待评估', completed: '已完成' };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">任务管理</h1>
            <p className="text-sm text-gray-500 mt-0.5">共 {tasks.length} 个任务，当前显示 {filtered.length} 个</p>
          </div>
          <button className="btn-primary flex items-center gap-1.5" onClick={() => navigate('/tasks/create')}>
            <Plus size={15} />新建任务
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input className="field-input pl-9 w-56" placeholder="搜索任务名称" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="field-select w-36" value={filterStatus} onChange={e => setFilterStatus(e.target.value as TaskStatus | '')}>
            <option value="">全部状态</option>
            {Object.entries(statusLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
          <select className="field-select w-32" value={filterScene} onChange={e => setFilterScene(e.target.value as SceneType | '')}>
            <option value="">全部场景</option>
            <option value="Coding">Coding</option>
            <option value="Agent">Agent</option>
            <option value="通用">通用</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              {['任务名称', '场景类型', '状态', '人员进度', '创建时间', '截止时间'].map(h => (
                <th key={h} className="table-th whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-400">暂无任务</td></tr>
            ) : filtered.map(task => {
              const { total, submitted } = getProgress(task.id);
              const pct = total > 0 ? Math.round((submitted / total) * 100) : 0;
              return (
                <tr key={task.id} className="table-tr" onClick={() => navigate(`/tasks/${task.id}`)}>
                  <td className="table-td">
                    <div className="font-medium text-gray-900">{task.name}</div>
                    {task.special_requirements && (
                      <div className="text-xs text-gray-400 mt-0.5 truncate max-w-[300px]">{task.special_requirements}</div>
                    )}
                  </td>
                  <td className="table-td"><SceneTag scene={task.scene_type} /></td>
                  <td className="table-td"><TaskStatusBadge status={task.status} /></td>
                  <td className="table-td">
                    {total > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{submitted}/{total}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="table-td text-gray-500">{task.created_at}</td>
                  <td className="table-td text-gray-500">{task.deadline}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

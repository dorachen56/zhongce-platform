import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Upload, X, Plus, Pencil, Snowflake, Trash2, UserCheck } from 'lucide-react';
import { useStore } from '../../store';
import { LevelBadge, ExpertStatusBadge, SceneTag } from '../../components/ui/Badge';
import type { Level, ExpertStatus, SceneType, Expert, Education, ResponseSpeed } from '../../types';
import { clsx } from 'clsx';

const ALL_LEVELS: Level[] = ['S', 'A', 'B', 'C', '未评级'];
const ALL_SCENES: SceneType[] = ['Coding', 'Agent', '通用'];

const blankForm = () => ({
  name: '', phone: '', education: '本科' as Education,
  work_years: 3, industry: '', profession: '',
  scenes: [] as SceneType[], tools: '', daily_hours: 2,
  response_speed: '中' as ResponseSpeed, status: 'active' as ExpertStatus,
});

export default function ExpertList() {
  const navigate = useNavigate();
  const experts = useStore(s => s.experts);
  const updateExpert = useStore(s => s.updateExpert);
  const deleteExpert = useStore(s => s.deleteExpert);
  const importExperts = useStore(s => s.importExperts);

  const [search, setSearch] = useState('');
  const [filterLevels, setFilterLevels] = useState<Level[]>([]);
  const [filterScenes, setFilterScenes] = useState<SceneType[]>([]);
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterStatus, setFilterStatus] = useState<ExpertStatus | ''>('');

  const [showImport, setShowImport] = useState(false);
  const [importMsg, setImportMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Edit / New modal
  const [editingId, setEditingId] = useState<string | null>(null); // null = new
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState(blankForm());

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const industries = useMemo(() => [...new Set(experts.map(e => e.industry))].sort(), [experts]);

  const filtered = useMemo(() => {
    return experts.filter(e => {
      if (search) {
        const q = search.toLowerCase();
        if (!e.name.toLowerCase().includes(q) && !e.phone.includes(q)) return false;
      }
      if (filterLevels.length && !filterLevels.includes(e.level)) return false;
      if (filterScenes.length && !filterScenes.some(s => e.scenes.includes(s))) return false;
      if (filterIndustry && e.industry !== filterIndustry) return false;
      if (filterStatus && e.status !== filterStatus) return false;
      return true;
    });
  }, [experts, search, filterLevels, filterScenes, filterIndustry, filterStatus]);

  function openNew() {
    setEditingId(null);
    setForm(blankForm());
    setShowEditModal(true);
  }

  function openEdit(e: Expert, ev: React.MouseEvent) {
    ev.stopPropagation();
    setEditingId(e.id);
    setForm({
      name: e.name, phone: e.phone, education: e.education,
      work_years: e.work_years, industry: e.industry, profession: e.profession,
      scenes: [...e.scenes], tools: e.tools.join(', '),
      daily_hours: e.daily_hours, response_speed: e.response_speed, status: e.status,
    });
    setShowEditModal(true);
  }

  function saveForm() {
    const tools = form.tools.split(',').map(t => t.trim()).filter(Boolean);
    if (editingId) {
      updateExpert(editingId, { ...form, tools });
    } else {
      const now = new Date().toISOString().split('T')[0];
      importExperts([{
        id: `expert_${Date.now()}`,
        ...form, tools,
        level: '未评级', total_score: 0, avg_score: 0, bonus_score: 0, task_count: 0,
        ability_qa: { llm_experience: '', common_tools: '', prompt_example: '', self_evaluation: '' },
        created_at: now, updated_at: now,
      }]);
    }
    setShowEditModal(false);
  }

  function toggleFreeze(e: Expert, ev: React.MouseEvent) {
    ev.stopPropagation();
    updateExpert(e.id, { status: e.status === 'active' ? 'frozen' : 'active' });
  }

  function confirmDelete(id: string, ev: React.MouseEvent) {
    ev.stopPropagation();
    setDeleteId(id);
  }

  function doDelete() {
    if (deleteId) deleteExpert(deleteId);
    setDeleteId(null);
  }

  function handleImportFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let parsed: unknown[];
        if (file.name.endsWith('.json')) {
          parsed = JSON.parse(text);
        } else {
          const lines = text.trim().split('\n');
          const headers = lines[0].split(',').map(h => h.trim());
          parsed = lines.slice(1).map(line => {
            const vals = line.split(',').map(v => v.trim());
            return Object.fromEntries(headers.map((h, i) => [h, vals[i] ?? '']));
          });
        }
        const now = new Date().toISOString().split('T')[0];
        const newExperts = (parsed as Record<string, string>[]).map((row, idx) => ({
          id: `import_${Date.now()}_${idx}`,
          name: row.name || row['姓名'] || `导入人员${idx + 1}`,
          phone: row.phone || row['手机号'] || '',
          education: (row.education || '本科') as Education,
          work_years: parseInt(row.work_years || '0') || 0,
          industry: row.industry || row['行业'] || '未知',
          profession: row.profession || row['职业'] || '未知',
          scenes: [] as SceneType[],
          tools: [] as string[],
          daily_hours: 2, response_speed: '中' as ResponseSpeed,
          level: '未评级' as Level, total_score: 0, avg_score: 0, bonus_score: 0, task_count: 0,
          status: 'active' as ExpertStatus,
          ability_qa: { llm_experience: '', common_tools: '', prompt_example: '', self_evaluation: '' },
          created_at: now, updated_at: now,
        }));
        importExperts(newExperts);
        setImportMsg(`成功导入 ${newExperts.length} 名评测人员`);
      } catch {
        setImportMsg('解析失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  }

  const hasFilter = filterLevels.length || filterScenes.length || filterIndustry || filterStatus;
  const deleteTarget = experts.find(e => e.id === deleteId);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">评测人员库</h1>
            <p className="text-sm text-gray-500 mt-0.5">共 {experts.length} 名评测人员，当前显示 {filtered.length} 名</p>
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary flex items-center gap-1.5" onClick={() => setShowImport(true)}>
              <Upload size={15} />导入人员
            </button>
            <button className="btn-primary flex items-center gap-1.5" onClick={openNew}>
              <Plus size={15} />新增人员
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-2.5 text-gray-400" />
            <input className="field-input pl-9 w-56" placeholder="搜索姓名或手机号" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-gray-500 mr-1">等级:</span>
            {ALL_LEVELS.map(l => (
              <button key={l} onClick={() => setFilterLevels(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l])}
                className={clsx('px-2 py-1 rounded text-xs font-medium border transition-colors', filterLevels.includes(l) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400')}>
                {l}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500 mr-1">场景:</span>
            {ALL_SCENES.map(s => (
              <button key={s} onClick={() => setFilterScenes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s])}
                className={clsx('px-2 py-1 rounded text-xs font-medium border transition-colors', filterScenes.includes(s) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400')}>
                {s}
              </button>
            ))}
          </div>
          <select className="field-select w-36 text-sm" value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}>
            <option value="">全部行业</option>
            {industries.map(i => <option key={i} value={i}>{i}</option>)}
          </select>
          <select className="field-select w-28 text-sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value as ExpertStatus | '')}>
            <option value="">全部状态</option>
            <option value="active">活跃</option>
            <option value="frozen">已冻结</option>
          </select>
          {hasFilter ? (
            <button className="btn-ghost flex items-center gap-1 text-gray-500" onClick={() => { setFilterLevels([]); setFilterScenes([]); setFilterIndustry(''); setFilterStatus(''); }}>
              <X size={13} />清除筛选
            </button>
          ) : null}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10">
            <tr>
              {['姓名', '手机号', '学历', '工作年限', '行业/职业', '擅长场景', '等级', '参与次数', '近半年均分', '状态', '操作'].map(h => (
                <th key={h} className="table-th whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={11} className="text-center py-12 text-gray-400 text-sm">暂无符合条件的评测人员</td></tr>
            ) : filtered.map(e => (
              <tr key={e.id}
                className={clsx('table-tr', e.status === 'frozen' && 'opacity-60')}
                onClick={() => navigate(`/experts/${e.id}`)}>
                <td className="table-td font-medium text-gray-900">{e.name}</td>
                <td className="table-td text-gray-500">{e.phone}</td>
                <td className="table-td">{e.education}</td>
                <td className="table-td">{e.work_years}年</td>
                <td className="table-td">
                  <div className="text-gray-900">{e.industry}</div>
                  <div className="text-gray-400 text-xs">{e.profession}</div>
                </td>
                <td className="table-td">
                  <div className="flex flex-wrap gap-1">
                    {e.scenes.map(s => <SceneTag key={s} scene={s} />)}
                  </div>
                </td>
                <td className="table-td"><LevelBadge level={e.level} /></td>
                <td className="table-td text-center">{e.task_count}</td>
                <td className="table-td text-center">
                  {e.task_count > 0 ? <span className="font-medium">{e.avg_score.toFixed(1)}</span> : <span className="text-gray-400">—</span>}
                </td>
                <td className="table-td"><ExpertStatusBadge status={e.status} /></td>
                <td className="table-td">
                  <div className="flex items-center gap-1" onClick={ev => ev.stopPropagation()}>
                    <button title="编辑" onClick={ev => openEdit(e, ev)}
                      className="p-1.5 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                      <Pencil size={13} />
                    </button>
                    <button title={e.status === 'frozen' ? '解除冻结' : '冻结'}
                      onClick={ev => toggleFreeze(e, ev)}
                      className={clsx('p-1.5 rounded transition-colors', e.status === 'frozen' ? 'text-blue-500 hover:bg-blue-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50')}>
                      {e.status === 'frozen' ? <UserCheck size={13} /> : <Snowflake size={13} />}
                    </button>
                    <button title="删除" onClick={ev => confirmDelete(e.id, ev)}
                      className="p-1.5 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Edit / New Modal ── */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[560px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{editingId ? '编辑评测人员' : '新增评测人员'}</h2>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">姓名 *</label>
                  <input className="field-input" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="请输入姓名" />
                </div>
                <div>
                  <label className="field-label">手机号 *</label>
                  <input className="field-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="请输入手机号" />
                </div>
                <div>
                  <label className="field-label">学历</label>
                  <select className="field-select" value={form.education} onChange={e => setForm(p => ({ ...p, education: e.target.value as Education }))}>
                    {(['大专', '本科', '硕士', '博士'] as Education[]).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">工作年限</label>
                  <input type="number" min={0} max={50} className="field-input" value={form.work_years}
                    onChange={e => setForm(p => ({ ...p, work_years: parseInt(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="field-label">行业 *</label>
                  <input className="field-input" value={form.industry} onChange={e => setForm(p => ({ ...p, industry: e.target.value }))} placeholder="例：互联网/AI" />
                </div>
                <div>
                  <label className="field-label">职业 *</label>
                  <input className="field-input" value={form.profession} onChange={e => setForm(p => ({ ...p, profession: e.target.value }))} placeholder="例：算法工程师" />
                </div>
                <div>
                  <label className="field-label">日均评测时长（小时）</label>
                  <input type="number" min={0} max={24} step={0.5} className="field-input" value={form.daily_hours}
                    onChange={e => setForm(p => ({ ...p, daily_hours: parseFloat(e.target.value) || 0 }))} />
                </div>
                <div>
                  <label className="field-label">响应速度</label>
                  <select className="field-select" value={form.response_speed} onChange={e => setForm(p => ({ ...p, response_speed: e.target.value as ResponseSpeed }))}>
                    {(['快', '中', '慢'] as ResponseSpeed[]).map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="field-label">擅长场景</label>
                <div className="flex gap-2 mt-1">
                  {ALL_SCENES.map(s => (
                    <button key={s} type="button"
                      onClick={() => setForm(p => ({ ...p, scenes: p.scenes.includes(s) ? p.scenes.filter(x => x !== s) : [...p.scenes, s] }))}
                      className={clsx('px-3 py-1.5 rounded-lg text-sm border transition-colors', form.scenes.includes(s) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400')}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="field-label">常用工具（逗号分隔）</label>
                <input className="field-input" value={form.tools} onChange={e => setForm(p => ({ ...p, tools: e.target.value }))}
                  placeholder="例：Python, VS Code, Git, Postman" />
              </div>

              <div>
                <label className="field-label">状态</label>
                <div className="flex gap-3 mt-1">
                  {([['active', '活跃'], ['frozen', '冻结']] as [ExpertStatus, string][]).map(([v, l]) => (
                    <label key={v} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="status" value={v} checked={form.status === v}
                        onChange={() => setForm(p => ({ ...p, status: v }))} />
                      <span className="text-sm text-gray-700">{l}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button className="btn-secondary" onClick={() => setShowEditModal(false)}>取消</button>
              <button className="btn-primary" disabled={!form.name || !form.phone || !form.industry || !form.profession} onClick={saveForm}>
                {editingId ? '保存修改' : '创建人员'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6">
            <h2 className="font-semibold text-gray-900 mb-2">确认删除</h2>
            <p className="text-sm text-gray-600 mb-1">
              确定要删除评测人员 <span className="font-medium text-gray-900">「{deleteTarget?.name}」</span> 吗？
            </p>
            <p className="text-xs text-red-500 mb-5">此操作不可撤销，历史任务记录将保留。</p>
            <div className="flex justify-end gap-3">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>取消</button>
              <button className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors" onClick={doDelete}>
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import Modal ── */}
      {showImport && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[480px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">批量导入评测人员</h2>
              <button onClick={() => { setShowImport(false); setImportMsg(''); }} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-600 mb-4">支持 CSV / JSON 格式。CSV 第一行为列名（name, phone, education, work_years, industry, profession），JSON 为对象数组。</p>
            {importMsg && (
              <div className={clsx('rounded-lg p-3 text-sm mb-4', importMsg.includes('失败') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700')}>
                {importMsg}
              </div>
            )}
            <input ref={fileRef} type="file" accept=".csv,.json" className="hidden" onChange={handleImportFile} />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
              <Upload size={24} className="mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">点击选择文件或拖拽到此处</p>
              <p className="text-xs text-gray-400 mt-1">支持 .csv 和 .json 格式</p>
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn-secondary" onClick={() => { setShowImport(false); setImportMsg(''); }}>关闭</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

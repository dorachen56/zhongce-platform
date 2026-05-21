import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, AlertTriangle, Plus, X, Search } from 'lucide-react';
import { useStore } from '../../store';
import { LevelBadge, SceneTag, ExpertStatusBadge } from '../../components/ui/Badge';
import { filterAndRankExperts, validateSelection } from '../../utils/filtering';
import type { SceneType, Level } from '../../types';
import { clsx } from 'clsx';

interface Step1Data {
  name: string;
  scene_type: SceneType;
  expert_count: number | '';
  start_time: string;
  deadline: string;
  special_requirements: string;
}

interface SelectedModel {
  libId: string;
  real_name: string;
  alias: string;
}

const STEPS = ['基本信息', '配置模型', '筛选人员', '确认创建'];

function nextAlias(count: number) {
  return `模型${String.fromCharCode(65 + count)}`;
}

export default function TaskCreate() {
  const navigate = useNavigate();
  const createTask = useStore(s => s.createTask);
  const experts = useStore(s => s.experts);
  const taskExperts = useStore(s => s.taskExperts);
  const modelLibrary = useStore(s => s.modelLibrary);
  const addModelToLibrary = useStore(s => s.addModelToLibrary);

  const [step, setStep] = useState(0);

  // Step 1
  const [step1, setStep1] = useState<Step1Data>({
    name: '', scene_type: 'Coding', expert_count: '',
    start_time: '', deadline: '', special_requirements: '',
  });

  // Step 2
  const [selectedModels, setSelectedModels] = useState<SelectedModel[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModel, setNewModel] = useState({ name: '', provider: '' });
  const [modelSearch, setModelSearch] = useState('');

  // Step 3
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filterLevel, setFilterLevel] = useState<Level[]>([]);
  const [filterIndustry, setFilterIndustry] = useState('');

  const filteredExperts = useMemo(() => {
    return filterAndRankExperts(experts, taskExperts, {
      scene: step1.scene_type,
      levels: filterLevel.length ? filterLevel : undefined,
      industries: filterIndustry ? [filterIndustry] : undefined,
    });
  }, [experts, taskExperts, step1.scene_type, filterLevel, filterIndustry]);

  const selectedExperts = experts.filter(e => selectedIds.has(e.id));
  const validation = validateSelection(selectedExperts);
  const industries = useMemo(() => [...new Set(experts.map(e => e.industry))].sort(), [experts]);

  // Grouped model library
  const groupedLibrary = useMemo(() => {
    const filtered = modelLibrary.filter(m =>
      !modelSearch || m.name.toLowerCase().includes(modelSearch.toLowerCase()) || m.provider.toLowerCase().includes(modelSearch.toLowerCase())
    );
    const groups: Record<string, typeof filtered> = {};
    filtered.forEach(m => {
      if (!groups[m.provider]) groups[m.provider] = [];
      groups[m.provider].push(m);
    });
    return groups;
  }, [modelLibrary, modelSearch]);

  function toggleModel(libId: string, realName: string) {
    const exists = selectedModels.find(m => m.libId === libId);
    if (exists) {
      setSelectedModels(prev => prev.filter(m => m.libId !== libId));
    } else {
      setSelectedModels(prev => [...prev, { libId, real_name: realName, alias: nextAlias(prev.length) }]);
    }
  }

  function updateAlias(libId: string, alias: string) {
    setSelectedModels(prev => prev.map(m => m.libId === libId ? { ...m, alias } : m));
  }

  function removeSelectedModel(libId: string) {
    setSelectedModels(prev => prev.filter(m => m.libId !== libId));
  }

  function addCustomModel() {
    if (!newModel.name.trim()) return;
    const entry = addModelToLibrary(newModel.name.trim(), newModel.provider.trim() || '自定义');
    setSelectedModels(prev => [...prev, { libId: entry.id, real_name: entry.name, alias: nextAlias(prev.length) }]);
    setNewModel({ name: '', provider: '' });
    setShowAddModal(false);
  }

  function toggleExpert(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleCreate() {
    const taskId = createTask(
      {
        name: step1.name,
        scene_type: step1.scene_type,
        expert_count: step1.expert_count !== '' ? step1.expert_count : undefined,
        start_time: step1.start_time,
        deadline: step1.deadline,
        special_requirements: step1.special_requirements,
      },
      selectedModels.map(m => ({ real_name: m.real_name, alias: m.alias })),
      Array.from(selectedIds)
    );
    navigate(`/tasks/${taskId}`);
  }

  const step1Valid = !!(step1.name && step1.start_time && step1.deadline);
  const step2Valid = selectedModels.length > 0;
  const step3Valid = selectedIds.size > 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-3" onClick={() => navigate('/tasks')}>
          <ArrowLeft size={15} />返回任务列表
        </button>
        <h1 className="text-lg font-semibold text-gray-900">新建任务</h1>
        <div className="flex items-center gap-0 mt-4">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={clsx('flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
                i === step ? 'bg-blue-600 text-white' : i < step ? 'bg-blue-100 text-blue-700' : 'text-gray-400 bg-gray-100')}>
                {i < step ? <Check size={12} /> : <span>{i + 1}</span>}{s}
              </div>
              {i < STEPS.length - 1 && <div className={clsx('w-8 h-0.5 mx-1', i < step ? 'bg-blue-400' : 'bg-gray-200')} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 overflow-auto p-6">

        {/* ── Step 1: 基本信息 ── */}
        {step === 0 && (
          <div className="max-w-xl space-y-4">
            <div className="card p-5 space-y-4">
              <h3 className="font-medium text-gray-800">基本信息</h3>
              <div>
                <label className="field-label">任务名称 *</label>
                <input className="field-input" placeholder="例：Coding能力基础评测-2026Q2" value={step1.name}
                  onChange={e => setStep1(p => ({ ...p, name: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">场景类型 *</label>
                <select className="field-select" value={step1.scene_type} onChange={e => setStep1(p => ({ ...p, scene_type: e.target.value as SceneType }))}>
                  <option value="Coding">Coding</option>
                  <option value="Agent">Agent</option>
                  <option value="通用">通用</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="field-label">开始日期 *</label>
                  <input type="date" className="field-input" value={step1.start_time}
                    onChange={e => setStep1(p => ({ ...p, start_time: e.target.value }))} />
                </div>
                <div>
                  <label className="field-label">截止日期 *</label>
                  <input type="date" className="field-input" value={step1.deadline}
                    onChange={e => setStep1(p => ({ ...p, deadline: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="field-label">推荐参与人数（选填）</label>
                <div className="flex items-center gap-2">
                  <input type="number" min={1} max={100} className="field-input w-28"
                    placeholder="不填则不限"
                    value={step1.expert_count}
                    onChange={e => setStep1(p => ({ ...p, expert_count: e.target.value === '' ? '' : parseInt(e.target.value) || '' }))} />
                  <span className="text-sm text-gray-400">人（仅供参考，可在筛选步骤自由选择）</span>
                </div>
              </div>
              <div>
                <label className="field-label">特殊要求（选填）</label>
                <textarea className="field-input h-20 resize-none" placeholder="例：需有实际企业级项目经验"
                  value={step1.special_requirements}
                  onChange={e => setStep1(p => ({ ...p, special_requirements: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: 配置模型 ── */}
        {step === 1 && (
          <div className="max-w-3xl space-y-4">
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-800">从模型库选择</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2 text-gray-400" />
                    <input className="field-input pl-8 text-xs h-8 w-44" placeholder="搜索模型名称或厂商"
                      value={modelSearch} onChange={e => setModelSearch(e.target.value)} />
                  </div>
                  <button className="btn-secondary flex items-center gap-1 text-xs" onClick={() => setShowAddModal(true)}>
                    <Plus size={13} />自定义新增
                  </button>
                </div>
              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
                {Object.entries(groupedLibrary).map(([provider, models]) => (
                  <div key={provider}>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">{provider}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {models.map(m => {
                        const checked = selectedModels.some(s => s.libId === m.id);
                        return (
                          <label key={m.id}
                            className={clsx('flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-colors',
                              checked ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50')}>
                            <input type="checkbox" checked={checked} onChange={() => toggleModel(m.id, m.name)}
                              className="rounded border-gray-300 text-blue-600" />
                            <span className={clsx('text-sm font-medium', checked ? 'text-blue-700' : 'text-gray-700')}>{m.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {Object.keys(groupedLibrary).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">未找到匹配模型</p>
                )}
              </div>
            </div>

            {/* Selected models with editable alias */}
            {selectedModels.length > 0 && (
              <div className="card p-5">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  已选 <span className="text-blue-600 font-semibold">{selectedModels.length}</span> 个模型 — 配置匿名代号
                </h4>
                <p className="text-xs text-gray-400 mb-3">匿名代号是评测人员看到的名称，真实模型名仅内部可见</p>
                <div className="space-y-2">
                  {selectedModels.map((m, i) => (
                    <div key={m.libId} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-5 text-right">{i + 1}.</span>
                      <div className="w-36">
                        <label className="text-xs text-gray-500 mb-0.5 block">匿名代号</label>
                        <input className="field-input text-sm font-medium text-blue-700" value={m.alias}
                          onChange={e => updateAlias(m.libId, e.target.value)} placeholder="例：模型A" />
                      </div>
                      <div className="text-gray-400 text-sm mt-4">→</div>
                      <div className="flex-1">
                        <label className="text-xs text-gray-500 mb-0.5 block">真实名称</label>
                        <div className="field-input bg-gray-50 text-gray-600 text-sm cursor-default">{m.real_name}</div>
                      </div>
                      <button onClick={() => removeSelectedModel(m.libId)}
                        className="mt-4 text-gray-400 hover:text-red-500 transition-colors">
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 3: 筛选人员 ── */}
        {step === 2 && (
          <div className="flex gap-5 h-full">
            {/* Left: Filters */}
            <div className="w-60 space-y-4 flex-shrink-0">
              <div className="card p-4">
                <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-3">筛选条件</h4>
                <div className="space-y-3">
                  <div>
                    <label className="field-label text-xs">场景匹配</label>
                    <div className="flex gap-1.5 flex-wrap">
                      <SceneTag scene={step1.scene_type} />
                      <span className="text-xs text-gray-400">（自动预设）</span>
                    </div>
                  </div>
                  <div>
                    <label className="field-label text-xs">等级筛选</label>
                    <div className="flex flex-wrap gap-1">
                      {(['S', 'A', 'B', 'C', '未评级'] as Level[]).map(l => (
                        <button key={l} onClick={() => setFilterLevel(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l])}
                          className={clsx('px-2 py-0.5 rounded text-xs border', filterLevel.includes(l) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300')}>
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="field-label text-xs">行业筛选</label>
                    <select className="field-select text-xs" value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}>
                      <option value="">全部行业</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 space-y-1.5">
                <p className="font-semibold">派单规则提醒</p>
                <p>• 同场景同周内不重复</p>
                <p>• 每月最多参与 2 次</p>
                <p>• C级人员 ≤ 总数10%</p>
                <p>• 排序：S → A → B → C</p>
              </div>
            </div>

            {/* Right: Expert list */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-700">
                  符合条件：<span className="text-blue-600">{filteredExperts.filter(e => !e.excluded).length}</span> 人
                  {filteredExperts.filter(e => e.excluded).length > 0 && (
                    <span className="text-gray-400">，已排除 {filteredExperts.filter(e => e.excluded).length} 人</span>
                  )}
                </h4>
                <div className="text-sm">
                  <span className={clsx('font-medium', selectedIds.size > 0 ? 'text-green-600' : 'text-blue-600')}>
                    已选 {selectedIds.size} 人
                  </span>
                  {step1.expert_count !== '' && (
                    <span className="text-gray-400"> / 推荐 {step1.expert_count} 人</span>
                  )}
                </div>
              </div>

              {validation.warnings.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3 flex items-start gap-2">
                  <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-red-700 space-y-0.5">
                    {validation.warnings.map((w, i) => <p key={i}>{w}</p>)}
                  </div>
                </div>
              )}

              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead><tr>
                    <th className="table-th w-10"></th>
                    <th className="table-th">姓名</th>
                    <th className="table-th">等级</th>
                    <th className="table-th">场景</th>
                    <th className="table-th">行业</th>
                    <th className="table-th">工作年限</th>
                    <th className="table-th">上次参与</th>
                    <th className="table-th">状态</th>
                  </tr></thead>
                  <tbody>
                    {filteredExperts.map(e => (
                      <tr key={e.id}
                        className={clsx('border-t border-gray-100', e.excluded ? 'opacity-50 bg-gray-50' : 'hover:bg-gray-50 cursor-pointer')}
                        onClick={() => !e.excluded && toggleExpert(e.id)}>
                        <td className="table-td">
                          <input type="checkbox"
                            checked={!e.excluded && selectedIds.has(e.id)}
                            disabled={e.excluded}
                            onChange={() => !e.excluded && toggleExpert(e.id)}
                            className={clsx('rounded border-gray-300', e.excluded ? 'opacity-40 cursor-not-allowed' : 'text-blue-600 cursor-pointer')} />
                        </td>
                        <td className="table-td font-medium">{e.name}</td>
                        <td className="table-td"><LevelBadge level={e.level} /></td>
                        <td className="table-td"><div className="flex gap-1">{e.scenes.map(s => <SceneTag key={s} scene={s} />)}</div></td>
                        <td className="table-td text-gray-500">{e.industry}</td>
                        <td className="table-td text-gray-500">{e.work_years}年</td>
                        <td className="table-td text-gray-400 text-xs">{e.task_count > 0 ? e.updated_at : '—'}</td>
                        <td className="table-td">
                          {e.excluded
                            ? <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{e.exclusionReason}</span>
                            : <ExpertStatusBadge status={e.status} />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: 确认创建 ── */}
        {step === 3 && (
          <div className="max-w-2xl space-y-4">
            <div className="card p-5">
              <h3 className="font-medium text-gray-800 mb-4">任务信息</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['任务名称', step1.name],
                  ['场景类型', step1.scene_type],
                  ...(step1.expert_count !== '' ? [['推荐人数', `${step1.expert_count} 人`]] : []),
                  ['开始时间', step1.start_time],
                  ['截止时间', step1.deadline],
                ].map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <span className="text-gray-500 w-24">{k}</span>
                    <span className="font-medium text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
              {step1.special_requirements && (
                <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-500">特殊要求　</span>
                  <span className="text-gray-700">{step1.special_requirements}</span>
                </div>
              )}
            </div>

            <div className="card p-5">
              <h3 className="font-medium text-gray-800 mb-3">配置模型（{selectedModels.length} 个）</h3>
              <table className="w-full text-sm">
                <thead><tr>
                  <th className="table-th">匿名代号</th>
                  <th className="table-th">真实模型</th>
                </tr></thead>
                <tbody>
                  {selectedModels.map(m => (
                    <tr key={m.libId} className="border-t border-gray-100">
                      <td className="table-td font-medium text-blue-700">{m.alias}</td>
                      <td className="table-td text-gray-700">{m.real_name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card p-5">
              <h3 className="font-medium text-gray-800 mb-3">已选评测人员（{selectedExperts.length} 人）</h3>
              <div className="flex flex-wrap gap-2">
                {selectedExperts.map(e => (
                  <div key={e.id} className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1">
                    <span className="text-sm text-gray-700">{e.name}</span>
                    <LevelBadge level={e.level} />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
              确认后任务将立即发布为「进行中」状态，评测人员将收到派单通知。
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
        <button className="btn-secondary flex items-center gap-1.5"
          onClick={() => step === 0 ? navigate('/tasks') : setStep(s => s - 1)}>
          <ArrowLeft size={15} />{step === 0 ? '取消' : '上一步'}
        </button>
        <div className="text-xs text-gray-400">步骤 {step + 1} / {STEPS.length}</div>
        {step < 3 ? (
          <button className="btn-primary flex items-center gap-1.5"
            disabled={step === 0 ? !step1Valid : step === 1 ? !step2Valid : !step3Valid}
            onClick={() => setStep(s => s + 1)}>
            下一步<ArrowRight size={15} />
          </button>
        ) : (
          <button className="btn-primary flex items-center gap-1.5" onClick={handleCreate}>
            <Check size={15} />发布任务
          </button>
        )}
      </div>

      {/* ── Add Custom Model Modal ── */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-[420px] p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-900">自定义新增模型</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="field-label">模型名称 *</label>
                <input className="field-input" placeholder="例：MyModel-7B" value={newModel.name}
                  onChange={e => setNewModel(p => ({ ...p, name: e.target.value }))} autoFocus />
              </div>
              <div>
                <label className="field-label">厂商/来源（选填）</label>
                <input className="field-input" placeholder="例：内部研发、某某科技" value={newModel.provider}
                  onChange={e => setNewModel(p => ({ ...p, provider: e.target.value }))} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">该模型将同时添加到模型库供后续任务使用</p>
            <div className="flex justify-end gap-3 mt-4">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>取消</button>
              <button className="btn-primary" disabled={!newModel.name.trim()} onClick={addCustomModel}>
                添加并选中
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

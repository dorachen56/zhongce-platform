import type { Task, TaskModel } from '../types';

export const mockTasks: Task[] = [
  {
    id: 't001',
    name: 'Coding能力基础评测-2026Q2',
    scene_type: 'Coding',
    status: 'in_progress',
    expert_count: 8,
    start_time: '2026-05-25',
    deadline: '2026-06-05',
    special_requirements: '重点考察代码正确性和边界条件处理，评测人员需熟悉Python或Go',
    created_at: '2026-05-20',
  },
  {
    id: 't002',
    name: 'Agent任务规划能力评测-第3期',
    scene_type: 'Agent',
    status: 'in_progress',
    expert_count: 10,
    start_time: '2026-05-10',
    deadline: '2026-05-25',
    special_requirements: '需有Agent开发或深度使用经验，评测任务包含多步骤工具调用场景',
    created_at: '2026-05-08',
  },
  {
    id: 't003',
    name: 'Coding代码审查能力评测-2026Q2',
    scene_type: 'Coding',
    status: 'pending_review',
    expert_count: 8,
    start_time: '2026-04-20',
    deadline: '2026-05-05',
    special_requirements: '评测人员需具备代码审查实际经验，至少3年开发经验',
    created_at: '2026-04-18',
  },
  {
    id: 't004',
    name: 'Agent工具调用评测-第2期',
    scene_type: 'Agent',
    status: 'completed',
    expert_count: 8,
    start_time: '2026-03-15',
    deadline: '2026-03-30',
    special_requirements: '',
    created_at: '2026-03-12',
  },
  {
    id: 't005',
    name: 'Coding多语言生成质量评测',
    scene_type: 'Coding',
    status: 'completed',
    expert_count: 10,
    start_time: '2026-02-10',
    deadline: '2026-02-25',
    special_requirements: '评测人员需熟悉至少2种编程语言',
    created_at: '2026-02-08',
  },
];

export const mockTaskModels: TaskModel[] = [
  // t001 草稿 - 尚未配置完（但有预配置）
  { id: 'tm001', task_id: 't001', real_name: 'DeepSeek-V3', alias: '模型A' },
  { id: 'tm002', task_id: 't001', real_name: 'Claude Sonnet 4.5', alias: '模型B' },
  { id: 'tm003', task_id: 't001', real_name: 'GPT-4o', alias: '模型C' },

  // t002 进行中
  { id: 'tm004', task_id: 't002', real_name: 'Claude Opus 4', alias: '模型A' },
  { id: 'tm005', task_id: 't002', real_name: 'GPT-4o', alias: '模型B' },
  { id: 'tm006', task_id: 't002', real_name: 'Gemini 2.0 Pro', alias: '模型C' },

  // t003 待评估
  { id: 'tm007', task_id: 't003', real_name: 'DeepSeek-V3', alias: '模型A' },
  { id: 'tm008', task_id: 't003', real_name: 'Claude Sonnet 4.5', alias: '模型B' },

  // t004 已完成
  { id: 'tm009', task_id: 't004', real_name: 'Claude Opus 4', alias: '模型A' },
  { id: 'tm010', task_id: 't004', real_name: 'GPT-4o', alias: '模型B' },
  { id: 'tm011', task_id: 't004', real_name: 'Gemini 1.5 Pro', alias: '模型C' },

  // t005 已完成
  { id: 'tm012', task_id: 't005', real_name: 'DeepSeek-Coder-V2', alias: '模型A' },
  { id: 'tm013', task_id: 't005', real_name: 'Claude Sonnet 3.7', alias: '模型B' },
  { id: 'tm014', task_id: 't005', real_name: 'GPT-4o-mini', alias: '模型C' },
];

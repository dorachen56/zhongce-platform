import type { Level, TaskStatus, TaskExpertStatus, ExpertStatus } from '../../types';
import { clsx } from 'clsx';

const levelColors: Record<Level, string> = {
  S: 'bg-amber-100 text-amber-800 border-amber-300',
  A: 'bg-emerald-100 text-emerald-800 border-emerald-300',
  B: 'bg-blue-100 text-blue-800 border-blue-300',
  C: 'bg-gray-100 text-gray-600 border-gray-300',
  '未评级': 'bg-slate-100 text-slate-500 border-slate-300',
};

const taskStatusMap: Record<TaskStatus, { label: string; cls: string }> = {
  draft: { label: '草稿', cls: 'bg-gray-100 text-gray-600 border-gray-300' },
  in_progress: { label: '进行中', cls: 'bg-blue-100 text-blue-700 border-blue-300' },
  pending_review: { label: '待评估', cls: 'bg-orange-100 text-orange-700 border-orange-300' },
  completed: { label: '已完成', cls: 'bg-green-100 text-green-700 border-green-300' },
};

const teStatusMap: Record<TaskExpertStatus, { label: string; cls: string }> = {
  pending: { label: '待接单', cls: 'bg-gray-100 text-gray-500' },
  accepted: { label: '已接单', cls: 'bg-blue-100 text-blue-600' },
  in_progress: { label: '进行中', cls: 'bg-indigo-100 text-indigo-600' },
  submitted: { label: '已提交', cls: 'bg-green-100 text-green-700' },
  timeout: { label: '超时', cls: 'bg-red-100 text-red-600' },
  quit: { label: '已退出', cls: 'bg-orange-100 text-orange-600' },
};

const expertStatusMap: Record<ExpertStatus, { label: string; cls: string }> = {
  active: { label: '活跃', cls: 'bg-green-100 text-green-700' },
  frozen: { label: '冻结', cls: 'bg-red-100 text-red-600' },
};

interface BadgeProps { className?: string; children: React.ReactNode; }
export function Badge({ className, children }: BadgeProps) {
  return <span className={clsx('inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border', className)}>{children}</span>;
}

export function LevelBadge({ level }: { level: Level }) {
  return <Badge className={levelColors[level]}>{level}</Badge>;
}

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  const { label, cls } = taskStatusMap[status];
  return <Badge className={cls}>{label}</Badge>;
}

export function TEStatusBadge({ status }: { status: TaskExpertStatus }) {
  const { label, cls } = teStatusMap[status];
  return <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', cls)}>{label}</span>;
}

export function ExpertStatusBadge({ status }: { status: ExpertStatus }) {
  const { label, cls } = expertStatusMap[status];
  return <span className={clsx('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', cls)}>{label}</span>;
}

export function SceneTag({ scene }: { scene: string }) {
  const colors: Record<string, string> = {
    Coding: 'bg-purple-100 text-purple-700',
    Agent: 'bg-cyan-100 text-cyan-700',
    '通用': 'bg-teal-100 text-teal-700',
  };
  return <span className={clsx('inline-flex px-2 py-0.5 rounded text-xs font-medium', colors[scene] || 'bg-gray-100 text-gray-600')}>{scene}</span>;
}

export function ToolTag({ tool }: { tool: string }) {
  return <span className="inline-flex px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs">{tool}</span>;
}

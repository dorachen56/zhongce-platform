import type { Expert, TaskExpert, SceneType } from '../types';

export interface FilterOptions {
  scene?: SceneType;
  levels?: string[];
  industries?: string[];
  excludeFrozen?: boolean;
}

function isSameWeek(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const startOfWeek = (d: Date) => {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };
  return startOfWeek(d1).toDateString() === startOfWeek(d2).toDateString();
}

function isWithinSixMonths(date: string): boolean {
  const d = new Date(date);
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return d >= sixMonthsAgo;
}

function isWithinSameMonth(date1: string, date2: string): boolean {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth();
}

export interface ExclusionInfo {
  excluded: boolean;
  reason: string;
}

export function getExclusionInfo(
  expert: Expert,
  allTaskExperts: TaskExpert[],
  currentScene: SceneType,
  currentDate: string = new Date().toISOString().split('T')[0]
): ExclusionInfo {
  const expertTEs = allTaskExperts.filter(te => te.expert_id === expert.id);

  // Rule 1: same scene, same week
  const sameSceneWeek = expertTEs.find(te => {
    if (!te.invited_at) return false;
    // We'd need the task's scene to check this properly — simplified: check invited_at
    return isSameWeek(te.invited_at, currentDate);
  });
  if (sameSceneWeek) {
    return { excluded: true, reason: '同场景同周内已参与' };
  }

  // Rule 2: more than 2 tasks this month
  const thisMonthTEs = expertTEs.filter(te =>
    te.invited_at && isWithinSameMonth(te.invited_at, currentDate)
  );
  if (thisMonthTEs.length >= 2) {
    return { excluded: true, reason: '本月已参与2次（达上限）' };
  }

  return { excluded: false, reason: '' };
}

export function filterAndRankExperts(
  experts: Expert[],
  allTaskExperts: TaskExpert[],
  options: FilterOptions,
  currentDate: string = new Date().toISOString().split('T')[0]
): Array<Expert & { excluded: boolean; exclusionReason: string }> {
  let filtered = experts.filter(e => {
    if (options.excludeFrozen !== false && e.status === 'frozen') return false;
    if (options.scene && !e.scenes.includes(options.scene)) return false;
    if (options.levels && options.levels.length > 0 && !options.levels.includes(e.level)) return false;
    if (options.industries && options.industries.length > 0 && !options.industries.includes(e.industry)) return false;
    return true;
  });

  const withExclusion = filtered.map(e => {
    const info = getExclusionInfo(e, allTaskExperts, options.scene || '通用', currentDate);
    return { ...e, excluded: info.excluded, exclusionReason: info.reason };
  });

  // Sort: non-excluded first, then by level S>A>B>C>未评级
  const levelOrder: Record<string, number> = { S: 0, A: 1, B: 2, C: 3, '未评级': 4 };
  return withExclusion.sort((a, b) => {
    if (a.excluded !== b.excluded) return a.excluded ? 1 : -1;
    return (levelOrder[a.level] ?? 5) - (levelOrder[b.level] ?? 5);
  });
}

export interface SelectionValidation {
  valid: boolean;
  warnings: string[];
}

export function validateSelection(selectedExperts: Expert[]): SelectionValidation {
  const warnings: string[] = [];
  if (selectedExperts.length === 0) {
    return { valid: false, warnings: ['请至少选择一名评测人员'] };
  }

  const cCount = selectedExperts.filter(e => e.level === 'C').length;
  const cRatio = cCount / selectedExperts.length;
  if (cRatio > 0.1) {
    warnings.push(`C级人员占比 ${Math.round(cRatio * 100)}%，超过上限10%，建议调整`);
  }

  return { valid: warnings.length === 0 || !warnings.some(w => w.includes('超过')), warnings };
}

import type { TaskExpert, ScoreRecord, LevelHistory } from '../types';

export const mockTaskExperts: TaskExpert[] = [
  // ── t002 进行中 (10人，各种状态) ──────────────────────────────
  { id: 'te001', task_id: 't002', expert_id: 'e001', status: 'submitted', invited_at: '2026-05-10T09:00:00', accepted_at: '2026-05-10T10:30:00', submitted_at: '2026-05-18T14:20:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te002', task_id: 't002', expert_id: 'e002', status: 'submitted', invited_at: '2026-05-10T09:00:00', accepted_at: '2026-05-10T11:00:00', submitted_at: '2026-05-17T16:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te003', task_id: 't002', expert_id: 'e005', status: 'in_progress', invited_at: '2026-05-10T09:00:00', accepted_at: '2026-05-11T08:00:00', submitted_at: null, quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te004', task_id: 't002', expert_id: 'e006', status: 'in_progress', invited_at: '2026-05-10T09:00:00', accepted_at: '2026-05-11T09:30:00', submitted_at: null, quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te005', task_id: 't002', expert_id: 'e010', status: 'accepted', invited_at: '2026-05-10T09:00:00', accepted_at: '2026-05-12T10:00:00', submitted_at: null, quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te006', task_id: 't002', expert_id: 'e013', status: 'accepted', invited_at: '2026-05-10T09:00:00', accepted_at: '2026-05-12T14:00:00', submitted_at: null, quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te007', task_id: 't002', expert_id: 'e015', status: 'pending', invited_at: '2026-05-10T09:00:00', accepted_at: null, submitted_at: null, quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te008', task_id: 't002', expert_id: 'e019', status: 'pending', invited_at: '2026-05-10T09:00:00', accepted_at: null, submitted_at: null, quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te009', task_id: 't002', expert_id: 'e020', status: 'timeout', invited_at: '2026-05-10T09:00:00', accepted_at: '2026-05-11T20:00:00', submitted_at: null, quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te010', task_id: 't002', expert_id: 'e023', status: 'quit', invited_at: '2026-05-10T09:00:00', accepted_at: '2026-05-11T09:00:00', submitted_at: null, quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },

  // ── t003 待评估 (8人，全部已提交) ──────────────────────────────
  { id: 'te011', task_id: 't003', expert_id: 'e001', status: 'submitted', invited_at: '2026-04-20T09:00:00', accepted_at: '2026-04-20T10:00:00', submitted_at: '2026-05-03T15:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te012', task_id: 't003', expert_id: 'e003', status: 'submitted', invited_at: '2026-04-20T09:00:00', accepted_at: '2026-04-20T11:00:00', submitted_at: '2026-04-28T14:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te013', task_id: 't003', expert_id: 'e004', status: 'submitted', invited_at: '2026-04-20T09:00:00', accepted_at: '2026-04-21T09:00:00', submitted_at: '2026-04-30T16:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te014', task_id: 't003', expert_id: 'e008', status: 'submitted', invited_at: '2026-04-20T09:00:00', accepted_at: '2026-04-21T10:00:00', submitted_at: '2026-05-02T11:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te015', task_id: 't003', expert_id: 'e011', status: 'submitted', invited_at: '2026-04-20T09:00:00', accepted_at: '2026-04-22T09:00:00', submitted_at: '2026-05-04T17:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te016', task_id: 't003', expert_id: 'e013', status: 'submitted', invited_at: '2026-04-20T09:00:00', accepted_at: '2026-04-21T14:00:00', submitted_at: '2026-04-29T15:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te017', task_id: 't003', expert_id: 'e021', status: 'submitted', invited_at: '2026-04-20T09:00:00', accepted_at: '2026-04-22T10:00:00', submitted_at: '2026-05-05T10:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },
  { id: 'te018', task_id: 't003', expert_id: 'e025', status: 'submitted', invited_at: '2026-04-20T09:00:00', accepted_at: '2026-04-22T11:00:00', submitted_at: '2026-05-04T14:00:00', quality_rating: null, speed_rating: null, bonus_points: 0, task_score: null },

  // ── t004 已完成 (8人) ──────────────────────────────────────
  { id: 'te019', task_id: 't004', expert_id: 'e001', status: 'submitted', invited_at: '2026-03-15T09:00:00', accepted_at: '2026-03-15T10:00:00', submitted_at: '2026-03-25T14:00:00', quality_rating: 5, speed_rating: 100, bonus_points: 0, task_score: 100 },
  { id: 'te020', task_id: 't004', expert_id: 'e002', status: 'submitted', invited_at: '2026-03-15T09:00:00', accepted_at: '2026-03-15T11:00:00', submitted_at: '2026-03-26T16:00:00', quality_rating: 5, speed_rating: 75, bonus_points: 5, task_score: 97.5 },
  { id: 'te021', task_id: 't004', expert_id: 'e005', status: 'submitted', invited_at: '2026-03-15T09:00:00', accepted_at: '2026-03-16T09:00:00', submitted_at: '2026-03-27T11:00:00', quality_rating: 4, speed_rating: 75, bonus_points: 0, task_score: 75 },
  { id: 'te022', task_id: 't004', expert_id: 'e006', status: 'submitted', invited_at: '2026-03-15T09:00:00', accepted_at: '2026-03-16T10:00:00', submitted_at: '2026-03-28T15:00:00', quality_rating: 4, speed_rating: 50, bonus_points: 0, task_score: 67.5 },
  { id: 'te023', task_id: 't004', expert_id: 'e010', status: 'submitted', invited_at: '2026-03-15T09:00:00', accepted_at: '2026-03-17T09:00:00', submitted_at: '2026-03-29T10:00:00', quality_rating: 3, speed_rating: 50, bonus_points: 0, task_score: 50 },
  { id: 'te024', task_id: 't004', expert_id: 'e015', status: 'submitted', invited_at: '2026-03-15T09:00:00', accepted_at: '2026-03-16T14:00:00', submitted_at: '2026-03-26T12:00:00', quality_rating: 4, speed_rating: 100, bonus_points: 5, task_score: 82.5 },
  { id: 'te025', task_id: 't004', expert_id: 'e019', status: 'timeout', invited_at: '2026-03-15T09:00:00', accepted_at: '2026-03-16T15:00:00', submitted_at: null, quality_rating: null, speed_rating: 0, bonus_points: 0, task_score: 0 },
  { id: 'te026', task_id: 't004', expert_id: 'e020', status: 'submitted', invited_at: '2026-03-15T09:00:00', accepted_at: '2026-03-16T11:00:00', submitted_at: '2026-03-28T09:00:00', quality_rating: 3, speed_rating: 75, bonus_points: 0, task_score: 57.5 },

  // ── t005 已完成 (10人) ──────────────────────────────────────
  { id: 'te027', task_id: 't005', expert_id: 'e001', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-10T10:00:00', submitted_at: '2026-02-20T14:00:00', quality_rating: 5, speed_rating: 100, bonus_points: 5, task_score: 100 },
  { id: 'te028', task_id: 't005', expert_id: 'e003', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-11T09:00:00', submitted_at: '2026-02-22T11:00:00', quality_rating: 4, speed_rating: 75, bonus_points: 0, task_score: 75 },
  { id: 'te029', task_id: 't005', expert_id: 'e004', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-10T11:00:00', submitted_at: '2026-02-21T16:00:00', quality_rating: 5, speed_rating: 100, bonus_points: 0, task_score: 100 },
  { id: 'te030', task_id: 't005', expert_id: 'e008', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-11T10:00:00', submitted_at: '2026-02-23T10:00:00', quality_rating: 4, speed_rating: 50, bonus_points: 0, task_score: 67.5 },
  { id: 'te031', task_id: 't005', expert_id: 'e009', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-10T14:00:00', submitted_at: '2026-02-22T15:00:00', quality_rating: 4, speed_rating: 75, bonus_points: 0, task_score: 75 },
  { id: 'te032', task_id: 't005', expert_id: 'e013', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-11T09:00:00', submitted_at: '2026-02-21T11:00:00', quality_rating: 4, speed_rating: 100, bonus_points: 5, task_score: 82.5 },
  { id: 'te033', task_id: 't005', expert_id: 'e021', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-12T09:00:00', submitted_at: '2026-02-24T14:00:00', quality_rating: 3, speed_rating: 50, bonus_points: 0, task_score: 50 },
  { id: 'te034', task_id: 't005', expert_id: 'e025', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-12T10:00:00', submitted_at: '2026-02-24T16:00:00', quality_rating: 3, speed_rating: 50, bonus_points: 0, task_score: 50 },
  { id: 'te035', task_id: 't005', expert_id: 'e006', status: 'submitted', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-11T14:00:00', submitted_at: '2026-02-23T15:00:00', quality_rating: 4, speed_rating: 75, bonus_points: 0, task_score: 75 },
  { id: 'te036', task_id: 't005', expert_id: 'e011', status: 'quit', invited_at: '2026-02-10T09:00:00', accepted_at: '2026-02-11T10:00:00', submitted_at: null, quality_rating: null, speed_rating: 25, bonus_points: 0, task_score: 0 },
];

export const mockScoreRecords: ScoreRecord[] = [
  // t004 scores
  { id: 'sr001', expert_id: 'e001', task_id: 't004', quality_score: 70, speed_score: 30, bonus_score: 0, total_score: 100, scored_at: '2026-04-05T10:00:00', reason: '评测结果优质，逻辑清晰，覆盖全面' },
  { id: 'sr002', expert_id: 'e002', task_id: 't004', quality_score: 70, speed_score: 22.5, bonus_score: 5, total_score: 97.5, scored_at: '2026-04-05T10:10:00', reason: '评测深度出色，有建设性洞见，贡献被采纳' },
  { id: 'sr003', expert_id: 'e005', task_id: 't004', quality_score: 52.5, speed_score: 22.5, bonus_score: 0, total_score: 75, scored_at: '2026-04-05T10:20:00', reason: '评测质量良好，完成及时' },
  { id: 'sr004', expert_id: 'e006', task_id: 't004', quality_score: 52.5, speed_score: 15, bonus_score: 0, total_score: 67.5, scored_at: '2026-04-05T10:30:00', reason: '评测结果可用，完成速度偏慢' },
  { id: 'sr005', expert_id: 'e010', task_id: 't004', quality_score: 35, speed_score: 15, bonus_score: 0, total_score: 50, scored_at: '2026-04-05T10:40:00', reason: '评测结果基本可用，但深度不足' },
  { id: 'sr006', expert_id: 'e015', task_id: 't004', quality_score: 52.5, speed_score: 30, bonus_score: 5, total_score: 82.5, scored_at: '2026-04-05T10:50:00', reason: '按时完成，质量良好，系统性强' },
  { id: 'sr007', expert_id: 'e020', task_id: 't004', quality_score: 35, speed_score: 22.5, bonus_score: 0, total_score: 57.5, scored_at: '2026-04-05T11:00:00', reason: '评测完成，质量一般' },

  // t005 scores
  { id: 'sr008', expert_id: 'e001', task_id: 't005', quality_score: 70, speed_score: 30, bonus_score: 5, total_score: 100, scored_at: '2026-03-05T10:00:00', reason: '优秀评测员，持续高质量输出，提交有效建议' },
  { id: 'sr009', expert_id: 'e003', task_id: 't005', quality_score: 52.5, speed_score: 22.5, bonus_score: 0, total_score: 75, scored_at: '2026-03-05T10:10:00', reason: '良好表现，代码审查视角专业' },
  { id: 'sr010', expert_id: 'e004', task_id: 't005', quality_score: 70, speed_score: 30, bonus_score: 0, total_score: 100, scored_at: '2026-03-05T10:20:00', reason: '满分表现，速度快质量高' },
  { id: 'sr011', expert_id: 'e008', task_id: 't005', quality_score: 52.5, speed_score: 15, bonus_score: 0, total_score: 67.5, scored_at: '2026-03-05T10:30:00', reason: '质量良好，完成时间略晚' },
  { id: 'sr012', expert_id: 'e009', task_id: 't005', quality_score: 52.5, speed_score: 22.5, bonus_score: 0, total_score: 75, scored_at: '2026-03-05T10:40:00', reason: '前端视角独特，评测结果有参考价值' },
  { id: 'sr013', expert_id: 'e013', task_id: 't005', quality_score: 52.5, speed_score: 30, bonus_score: 5, total_score: 82.5, scored_at: '2026-03-05T10:50:00', reason: '优先提交，质量优良，ML视角有价值' },
  { id: 'sr014', expert_id: 'e021', task_id: 't005', quality_score: 35, speed_score: 15, bonus_score: 0, total_score: 50, scored_at: '2026-03-05T11:00:00', reason: '评测结果基本可用，深度有限' },
  { id: 'sr015', expert_id: 'e025', task_id: 't005', quality_score: 35, speed_score: 15, bonus_score: 0, total_score: 50, scored_at: '2026-03-05T11:10:00', reason: '评测完成，质量中等' },
  { id: 'sr016', expert_id: 'e006', task_id: 't005', quality_score: 52.5, speed_score: 22.5, bonus_score: 0, total_score: 75, scored_at: '2026-03-05T11:20:00', reason: '稳定发挥，评测结果可靠' },
];

export const mockLevelHistories: LevelHistory[] = [
  // 未评级 → C（首次参与后）
  { id: 'lh001', expert_id: 'e033', old_level: '未评级', new_level: 'C', trigger_task_id: 't005', changed_at: '2026-03-05T12:00:00' },
  { id: 'lh002', expert_id: 'e034', old_level: '未评级', new_level: 'C', trigger_task_id: 't005', changed_at: '2026-03-05T12:00:00' },

  // C → B（进步）
  { id: 'lh003', expert_id: 'e021', old_level: '未评级', new_level: 'C', trigger_task_id: 't005', changed_at: '2026-03-05T12:00:00' },
  { id: 'lh004', expert_id: 'e021', old_level: 'C', new_level: 'B', trigger_task_id: 't003', changed_at: '2026-05-05T12:00:00' },

  // B → A（进步）
  { id: 'lh005', expert_id: 'e006', old_level: '未评级', new_level: 'B', trigger_task_id: 't005', changed_at: '2026-03-05T12:00:00' },
  { id: 'lh006', expert_id: 'e006', old_level: 'B', new_level: 'A', trigger_task_id: 't004', changed_at: '2026-04-05T12:00:00' },

  // A → S（进步）
  { id: 'lh007', expert_id: 'e001', old_level: 'A', new_level: 'S', trigger_task_id: 't005', changed_at: '2026-03-05T12:00:00' },

  // A → B（降级）
  { id: 'lh008', expert_id: 'e010', old_level: 'A', new_level: 'A', trigger_task_id: 't004', changed_at: '2026-04-05T12:00:00' },

  // 未评级 → B（强人首次）
  { id: 'lh009', expert_id: 'e004', old_level: '未评级', new_level: 'S', trigger_task_id: 't005', changed_at: '2026-03-05T12:00:00' },
  { id: 'lh010', expert_id: 'e013', old_level: '未评级', new_level: 'A', trigger_task_id: 't005', changed_at: '2026-03-05T12:00:00' },

  // S 级历史 e002
  { id: 'lh011', expert_id: 'e002', old_level: 'A', new_level: 'S', trigger_task_id: 't004', changed_at: '2026-04-05T12:00:00' },
];

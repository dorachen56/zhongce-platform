import type { Level, TaskExpert, Expert, ScoreRecord, LevelHistory } from '../types';

const QUALITY_MAP: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 25, 3: 50, 4: 75, 5: 100 };

export function mapQualityScore(rating: 1 | 2 | 3 | 4 | 5): number {
  return QUALITY_MAP[rating];
}

export function calcTaskScore(qualityRating: 1 | 2 | 3 | 4 | 5, speedScore: number): number {
  return Math.round((mapQualityScore(qualityRating) * 0.7 + speedScore * 0.3) * 10) / 10;
}

// Rank 0–100, deadline as ISO string
export function calcSpeedScore(
  status: TaskExpert['status'],
  submittedAt: string | null,
  deadline: string,
  submittedRankPct: number  // 0-1, where in the submission list this person falls (lower = earlier)
): number {
  if (status === 'pending' || status === 'accepted') return 0;
  if (status === 'quit') return 25;
  if (!submittedAt) return 0;
  const submitted = new Date(submittedAt).getTime();
  const due = new Date(deadline).getTime();
  if (submitted > due) return 50;            // submitted but late
  return submittedRankPct <= 0.5 ? 100 : 75; // on time: top half vs bottom half
}

export function calcLevel(totalScore: number, taskCount: number): Level {
  if (taskCount === 0) return '未评级';
  if (totalScore >= 90) return 'S';
  if (totalScore >= 70) return 'A';
  if (totalScore >= 55) return 'B';
  return 'C';
}

export interface EvalRating {
  taskExpertId: string;
  expertId: string;
  qualityRating: 1 | 2 | 3 | 4 | 5;
  bonusPoints: number;
  scoreReason: string;
}

export interface FinalizeResult {
  updatedExperts: Expert[];
  newScoreRecords: ScoreRecord[];
  newLevelHistories: LevelHistory[];
  updatedTaskExperts: TaskExpert[];
}

export function finalizeEvaluation(
  taskId: string,
  taskDeadline: string,
  ratings: EvalRating[],
  taskExperts: TaskExpert[],
  allExperts: Expert[],
  allScoreRecords: ScoreRecord[]
): FinalizeResult {
  const submittedTEs = taskExperts.filter(
    te => te.task_id === taskId && te.status === 'submitted' && te.submitted_at
  );
  const sorted = [...submittedTEs].sort(
    (a, b) => new Date(a.submitted_at!).getTime() - new Date(b.submitted_at!).getTime()
  );

  const updatedTaskExperts: TaskExpert[] = [];
  const newScoreRecords: ScoreRecord[] = [];
  const newLevelHistories: LevelHistory[] = [];

  for (const rating of ratings) {
    const te = taskExperts.find(t => t.id === rating.taskExpertId);
    if (!te) continue;

    const rankIdx = sorted.findIndex(t => t.id === te.id);
    const rankPct = sorted.length > 1 ? rankIdx / (sorted.length - 1) : 0;
    const speedScore = calcSpeedScore(te.status, te.submitted_at, taskDeadline, rankPct);
    const taskScore = calcTaskScore(rating.qualityRating, speedScore);

    updatedTaskExperts.push({
      ...te,
      quality_rating: rating.qualityRating,
      speed_rating: speedScore,
      bonus_points: rating.bonusPoints,
      task_score: taskScore,
    });

    const sr: ScoreRecord = {
      id: `sr_${Date.now()}_${te.id}`,
      expert_id: rating.expertId,
      task_id: taskId,
      quality_score: mapQualityScore(rating.qualityRating) * 0.7,
      speed_score: speedScore * 0.3,
      bonus_score: rating.bonusPoints,
      total_score: taskScore,
      scored_at: new Date().toISOString(),
      reason: rating.scoreReason || '',
    };
    newScoreRecords.push(sr);
  }

  // Recalculate expert scores and levels
  const updatedExperts = allExperts.map(expert => {
    const newRating = ratings.find(r => r.expertId === expert.id);
    if (!newRating) return expert;

    const te = taskExperts.find(t => t.task_id === taskId && t.expert_id === expert.id);
    if (!te) return expert;

    const rankIdx = sorted.findIndex(t => t.id === te.id);
    const rankPct = sorted.length > 1 ? rankIdx / (sorted.length - 1) : 0;
    const speedScore = calcSpeedScore(te.status, te.submitted_at, taskDeadline, rankPct);
    const taskScore = calcTaskScore(newRating.qualityRating, speedScore);

    // Get all historical scores for this expert + new score
    const historicalScores = allScoreRecords
      .filter(sr => sr.expert_id === expert.id)
      .map(sr => sr.total_score);
    const allScores = [...historicalScores, taskScore];

    // Average of all task scores (simplified: use all history)
    const avg = allScores.length > 0
      ? Math.round((allScores.reduce((s, x) => s + x, 0) / allScores.length) * 10) / 10
      : 0;

    const newTaskCount = expert.task_count + 1;

    // Bonus score: half-year participation
    let autoBonus = 0;
    const recentCount = newTaskCount; // simplified
    if (recentCount >= 8) autoBonus = 10;
    else if (recentCount >= 4) autoBonus = 5;

    const manualBonus = newRating.bonusPoints;
    const totalBonus = autoBonus + manualBonus;
    const totalScore = Math.min(100, Math.round((avg + totalBonus) * 10) / 10);
    const oldLevel = expert.level;
    const newLevel = calcLevel(totalScore, newTaskCount);

    if (oldLevel !== newLevel) {
      newLevelHistories.push({
        id: `lh_${Date.now()}_${expert.id}`,
        expert_id: expert.id,
        old_level: oldLevel,
        new_level: newLevel,
        trigger_task_id: taskId,
        changed_at: new Date().toISOString(),
      });
    }

    return {
      ...expert,
      avg_score: avg,
      bonus_score: totalBonus,
      total_score: totalScore,
      level: newLevel,
      task_count: newTaskCount,
      updated_at: new Date().toISOString().split('T')[0],
    };
  });

  return { updatedExperts, newScoreRecords, newLevelHistories, updatedTaskExperts };
}

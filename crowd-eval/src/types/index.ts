export type Level = 'S' | 'A' | 'B' | 'C' | '未评级';
export type ExpertStatus = 'active' | 'frozen';
export type TaskStatus = 'in_progress' | 'pending_review' | 'completed';
export type TaskExpertStatus = 'pending' | 'accepted' | 'in_progress' | 'submitted' | 'timeout' | 'quit';
export type SceneType = 'Coding' | 'Agent' | '通用';
export type ResponseSpeed = '快' | '中' | '慢';
export type Education = '大专' | '本科' | '硕士' | '博士';

export interface AbilityQA {
  llm_experience: string;
  common_tools: string;
  prompt_example: string;
  self_evaluation: string;
}

export interface Expert {
  id: string;
  name: string;
  phone: string;
  education: Education;
  work_years: number;
  industry: string;
  profession: string;
  scenes: SceneType[];
  tools: string[];
  daily_hours: number;
  response_speed: ResponseSpeed;
  level: Level;
  total_score: number;
  avg_score: number;
  bonus_score: number;
  task_count: number;
  status: ExpertStatus;
  ability_qa: AbilityQA;
  created_at: string;
  updated_at: string;
}

export interface ModelLibraryEntry {
  id: string;
  name: string;
  provider: string;
}

export interface Task {
  id: string;
  name: string;
  scene_type: SceneType;
  status: TaskStatus;
  expert_count?: number;
  start_time: string;
  deadline: string;
  special_requirements: string;
  created_at: string;
}

export interface TaskModel {
  id: string;
  task_id: string;
  real_name: string;
  alias: string;
}

export interface TaskExpert {
  id: string;
  task_id: string;
  expert_id: string;
  status: TaskExpertStatus;
  invited_at: string;
  accepted_at: string | null;
  submitted_at: string | null;
  quality_rating: 1 | 2 | 3 | 4 | 5 | null;
  speed_rating: number | null;
  bonus_points: number;
  task_score: number | null;
}

export interface ScoreRecord {
  id: string;
  expert_id: string;
  task_id: string;
  quality_score: number;
  speed_score: number;
  bonus_score: number;
  total_score: number;
  scored_at: string;
  reason: string;
}

export interface LevelHistory {
  id: string;
  expert_id: string;
  old_level: Level;
  new_level: Level;
  trigger_task_id: string;
  changed_at: string;
}

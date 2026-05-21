import { create } from 'zustand';
import type { Expert, Task, TaskModel, TaskExpert, ScoreRecord, LevelHistory, ModelLibraryEntry } from '../types';
import {
  mockExperts, mockTasks, mockTaskModels,
  mockTaskExperts, mockScoreRecords, mockLevelHistories, mockModelLibrary
} from '../data';
import { finalizeEvaluation, type EvalRating } from '../utils/scoring';

interface AppStore {
  experts: Expert[];
  tasks: Task[];
  taskModels: TaskModel[];
  taskExperts: TaskExpert[];
  scoreRecords: ScoreRecord[];
  levelHistories: LevelHistory[];
  modelLibrary: ModelLibraryEntry[];

  // Expert actions
  updateExpert: (id: string, patch: Partial<Expert>) => void;
  deleteExpert: (id: string) => void;
  importExperts: (newExperts: Expert[]) => void;

  // Task actions
  createTask: (task: Omit<Task, 'id' | 'created_at' | 'status'>, models: Omit<TaskModel, 'id' | 'task_id'>[], expertIds: string[]) => string;
  updateTaskStatus: (taskId: string, status: Task['status']) => void;
  updateTaskExpertStatus: (taskExpertId: string, newStatus: TaskExpert['status']) => void;

  // Model library
  addModelToLibrary: (name: string, provider: string) => ModelLibraryEntry;

  // Evaluation
  finalizeTaskEvaluation: (taskId: string, ratings: EvalRating[]) => void;
}

let idCounter = 10000;
const uid = (prefix: string) => `${prefix}_${++idCounter}`;

export const useStore = create<AppStore>((set, get) => ({
  experts: mockExperts,
  tasks: mockTasks,
  taskModels: mockTaskModels,
  taskExperts: mockTaskExperts,
  scoreRecords: mockScoreRecords,
  levelHistories: mockLevelHistories,
  modelLibrary: mockModelLibrary,

  updateExpert: (id, patch) =>
    set(s => ({ experts: s.experts.map(e => e.id === id ? { ...e, ...patch } : e) })),

  deleteExpert: (id) =>
    set(s => ({ experts: s.experts.filter(e => e.id !== id) })),

  importExperts: (newExperts) =>
    set(s => ({ experts: [...s.experts, ...newExperts] })),

  addModelToLibrary: (name, provider) => {
    const entry: ModelLibraryEntry = { id: uid('ml'), name, provider };
    set(s => ({ modelLibrary: [...s.modelLibrary, entry] }));
    return entry;
  },

  createTask: (taskData, models, expertIds) => {
    const taskId = uid('task');
    const now = new Date().toISOString().split('T')[0];
    const task: Task = { ...taskData, id: taskId, status: 'in_progress', created_at: now };

    const taskModelsList: TaskModel[] = models.map((m, i) => ({
      id: uid('tm'),
      task_id: taskId,
      real_name: m.real_name,
      alias: m.alias || `模型${String.fromCharCode(65 + i)}`,
    }));

    const taskExpertsList: TaskExpert[] = expertIds.map(expertId => ({
      id: uid('te'),
      task_id: taskId,
      expert_id: expertId,
      status: 'pending',
      invited_at: new Date().toISOString(),
      accepted_at: null,
      submitted_at: null,
      quality_rating: null,
      speed_rating: null,
      bonus_points: 0,
      task_score: null,
    }));

    set(s => ({
      tasks: [...s.tasks, task],
      taskModels: [...s.taskModels, ...taskModelsList],
      taskExperts: [...s.taskExperts, ...taskExpertsList],
    }));

    return taskId;
  },

  updateTaskStatus: (taskId, status) =>
    set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, status } : t) })),

  updateTaskExpertStatus: (taskExpertId, newStatus) =>
    set(s => ({
      taskExperts: s.taskExperts.map(te => {
        if (te.id !== taskExpertId) return te;
        const now = new Date().toISOString();
        const updates: Partial<TaskExpert> = { status: newStatus };
        if (newStatus === 'accepted') updates.accepted_at = now;
        if (newStatus === 'submitted') updates.submitted_at = now;
        return { ...te, ...updates };
      }),
    })),

  finalizeTaskEvaluation: (taskId, ratings) => {
    const s = get();
    const task = s.tasks.find(t => t.id === taskId);
    if (!task) return;

    const result = finalizeEvaluation(
      taskId,
      task.deadline,
      ratings,
      s.taskExperts,
      s.experts,
      s.scoreRecords
    );

    set(prev => ({
      experts: prev.experts.map(e => result.updatedExperts.find(u => u.id === e.id) || e),
      scoreRecords: [...prev.scoreRecords, ...result.newScoreRecords],
      levelHistories: [...prev.levelHistories, ...result.newLevelHistories],
      taskExperts: prev.taskExperts.map(te => {
        const updated = result.updatedTaskExperts.find(u => u.id === te.id);
        return updated || te;
      }),
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t),
    }));
  },
}));

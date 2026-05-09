export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate: string | null;
  tags: string[];
  subtasks: Subtask[];
  estimatedTime: number | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  listId: string;
}

export interface TaskList {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  taskCount: number;
}

export type FilterType = 'all' | 'today' | 'upcoming' | 'completed' | 'high_priority';

export type SortType = 'due_date' | 'priority' | 'created' | 'alphabetical';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  focusMode: boolean;
  sidebarCollapsed: boolean;
  pomodoroWork: number;
  pomodoroBreak: number;
  pomodoroLongBreak: number;
  dailyGoal: number;
  soundEnabled: boolean;
}

export interface Statistics {
  tasksCompletedToday: number;
  tasksCompletedWeek: number;
  tasksCompletedMonth: number;
  totalTasks: number;
  completedTasks: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type Category = 'personal' | 'work' | 'shopping';

export interface PomodoroState {
  isRunning: boolean;
  isPaused: boolean;
  mode: 'work' | 'break' | 'longBreak';
  timeRemaining: number;
  sessionsCompleted: number;
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Toast, PomodoroState } from '../types';

function applyThemeClass(theme: 'light' | 'dark' | 'system') {
  const root = document.documentElement;
  if (theme === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  } else {
    root.classList.toggle('dark', theme === 'dark');
  }
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  focusMode: boolean;
  showShortcutsModal: boolean;
  showSettingsModal: boolean;
  showNewTaskModal: boolean;
  toasts: Toast[];

  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleFocusMode: () => void;
  setShowShortcutsModal: (show: boolean) => void;
  setShowSettingsModal: (show: boolean) => void;
  setShowNewTaskModal: (show: boolean) => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'system',
      sidebarOpen: true,
      focusMode: false,
      showShortcutsModal: false,
      showSettingsModal: false,
      showNewTaskModal: false,
      toasts: [],

      setTheme: (theme) => {
        set({ theme });
        applyThemeClass(theme);
      },

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
      setShowShortcutsModal: (show) => set({ showShortcutsModal: show }),
      setShowSettingsModal: (show) => set({ showSettingsModal: show }),
      setShowNewTaskModal: (show) => set({ showNewTaskModal: show }),

      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }));
        setTimeout(() => {
          set((state) => ({
            toasts: state.toasts.filter((t) => t.id !== id),
          }));
        }, 4000);
      },

      removeToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),
    }),
    {
      name: 'modern-todo-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
      onRehydrateStorage: () => (state) => {
        // Apply theme after state is rehydrated from localStorage
        if (state) {
          applyThemeClass(state.theme);
        }
      },
    }
  )
);

interface PomodoroStore extends PomodoroState {
  start: () => void;
  pause: () => void;
  reset: () => void;
  tick: () => void;
  completeSession: () => void;
  setMode: (mode: 'work' | 'break' | 'longBreak') => void;
}

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const LONG_BREAK_TIME = 15 * 60;

export const usePomodoroStore = create<PomodoroStore>((set, get) => ({
  isRunning: false,
  isPaused: false,
  mode: 'work',
  timeRemaining: WORK_TIME,
  sessionsCompleted: 0,

  start: () => set({ isRunning: true, isPaused: false }),

  pause: () => set({ isRunning: false, isPaused: true }),

  reset: () => {
    const { mode } = get();
    const time = mode === 'work' ? WORK_TIME : mode === 'break' ? BREAK_TIME : LONG_BREAK_TIME;
    set({ isRunning: false, isPaused: false, timeRemaining: time });
  },

  tick: () => {
    const { timeRemaining, isRunning } = get();
    if (isRunning && timeRemaining > 0) {
      set({ timeRemaining: timeRemaining - 1 });
    } else if (isRunning && timeRemaining === 0) {
      get().completeSession();
    }
  },

  completeSession: () => {
    const { mode, sessionsCompleted } = get();
    if (mode === 'work') {
      const newCount = sessionsCompleted + 1;
      if (newCount % 4 === 0) {
        set({
          isRunning: false,
          mode: 'longBreak',
          timeRemaining: LONG_BREAK_TIME,
          sessionsCompleted: newCount,
        });
      } else {
        set({
          isRunning: false,
          mode: 'break',
          timeRemaining: BREAK_TIME,
          sessionsCompleted: newCount,
        });
      }
    } else {
      set({
        isRunning: false,
        mode: 'work',
        timeRemaining: WORK_TIME,
      });
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Modern To-Do', {
        body: mode === 'work' ? 'Time for a break!' : 'Time to focus!',
      });
    }
  },

  setMode: (mode) => {
    const time = mode === 'work' ? WORK_TIME : mode === 'break' ? BREAK_TIME : LONG_BREAK_TIME;
    set({ mode, timeRemaining: time, isRunning: false, isPaused: false });
  },
}));

interface StatsState {
  tasksCompletedToday: number;
  tasksCompletedWeek: number;
  tasksCompletedMonth: number;
  currentStreak: number;
  longestStreak: number;
  lastCompletionDate: string | null;
  dailyGoal: number;

  incrementCompleted: () => void;
  setDailyGoal: (goal: number) => void;
  getCompletionRate: () => number;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      tasksCompletedToday: 0,
      tasksCompletedWeek: 0,
      tasksCompletedMonth: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastCompletionDate: null,
      dailyGoal: 5,

      incrementCompleted: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastCompletionDate, currentStreak, longestStreak } = get();

        let newStreak = currentStreak;
        if (lastCompletionDate) {
          const lastDate = new Date(lastCompletionDate);
          const todayDate = new Date(today);
          const diffDays = Math.floor(
            (todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          if (diffDays === 1) {
            newStreak = currentStreak + 1;
          } else if (diffDays > 1) {
            newStreak = 1;
          }
        } else {
          newStreak = 1;
        }

        set((state) => ({
          tasksCompletedToday: state.tasksCompletedToday + 1,
          tasksCompletedWeek: state.tasksCompletedWeek + 1,
          tasksCompletedMonth: state.tasksCompletedMonth + 1,
          currentStreak: newStreak,
          longestStreak: Math.max(longestStreak, newStreak),
          lastCompletionDate: today,
        }));
      },

      setDailyGoal: (goal) => set({ dailyGoal: goal }),

      getCompletionRate: () => {
        const { tasksCompletedToday, dailyGoal } = get();
        return Math.min(100, Math.round((tasksCompletedToday / dailyGoal) * 100));
      },
    }),
    {
      name: 'modern-todo-stats',
    }
  )
);
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
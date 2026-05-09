import { motion } from 'framer-motion';
import { CheckCircle, Flame, Target } from 'lucide-react';
import { useStatsStore } from '../../stores/statsStore';
import { useTaskStore } from '../../stores/taskStore';

export function ProgressCard() {
  const { tasksCompletedToday, currentStreak, dailyGoal } = useStatsStore();
  const { tasks } = useTaskStore();

  const completionRate = Math.min(100, Math.round((tasksCompletedToday / dailyGoal) * 100));
  const activeTasks = tasks.filter((t) => !t.completed).length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Progress
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">
              Daily Goal
            </span>
            <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {tasksCompletedToday}/{dailyGoal}
            </span>
          </div>
          <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionRate}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {completedTasks}
              </p>
              <p className="text-xs text-slate-500">Completed</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <Target className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {activeTasks}
              </p>
              <p className="text-xs text-slate-500">Active</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-slate-200 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <div className="flex-1">
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              {currentStreak} day streak
            </p>
            <p className="text-xs text-slate-500">
              Keep completing tasks to build your streak!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
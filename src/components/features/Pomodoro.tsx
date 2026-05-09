import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import { usePomodoroStore } from '../../stores/uiStore';
import { formatTime } from '../../utils/helpers';

export function Pomodoro() {
  const { isRunning, mode, timeRemaining, sessionsCompleted, start, pause, reset, tick, setMode } = usePomodoroStore();

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  const totalTime = mode === 'work' ? 25 * 60 : mode === 'break' ? 5 * 60 : 15 * 60;
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;

  const getModeLabel = () => {
    if (mode === 'work') return 'Focus Time';
    if (mode === 'break') return 'Short Break';
    return 'Long Break';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Pomodoro Timer
        </h3>
        <span className="text-sm text-slate-500">Session {sessionsCompleted + 1}</span>
      </div>

      <div className="flex justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200 dark:text-slate-700"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={553}
              strokeDashoffset={553 - (553 * progress) / 100}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366F1" />
                <stop offset="100%" stopColor="#8B5CF6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
              {formatTime(timeRemaining)}
            </span>
            <span className="text-sm text-slate-500 mt-1">
              {getModeLabel()}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setMode('work')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'work'
              ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Zap className="w-4 h-4 inline mr-1" />
          Work
        </button>
        <button
          onClick={() => setMode('break')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            mode === 'break'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'
          }`}
        >
          <Coffee className="w-4 h-4 inline mr-1" />
          Break
        </button>
      </div>

      <div className="flex justify-center gap-3">
        {!isRunning ? (
          <button
            onClick={start}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white flex items-center justify-center hover:shadow-glow transition-all"
          >
            <Play className="w-5 h-5 ml-0.5" />
          </button>
        ) : (
          <button
            onClick={pause}
            className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white flex items-center justify-center hover:shadow-glow transition-all"
          >
            <Pause className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={reset}
          className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
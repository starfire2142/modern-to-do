import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Clock,
  ChevronDown,
  ChevronRight,
  Tag,
} from 'lucide-react';
import type { Task } from '../../types';
import { useTaskStore } from '../../stores/taskStore';
import { useUIStore } from '../../stores/uiStore';
import { useStatsStore } from '../../stores/statsStore';
import { cn, formatDueDate, isOverdue, getPriorityBgColor } from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const { toggleTaskComplete, updateTask, deleteTask } = useTaskStore();
  const { addToast } = useUIStore();
  const { incrementCompleted } = useStatsStore();

  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const totalSubtasks = task.subtasks.length;

  const handleToggleComplete = () => {
    toggleTaskComplete(task.id);
    if (!task.completed) {
      incrementCompleted();
      addToast({ message: 'Task completed!', type: 'success' });
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
    addToast({
      message: 'Task deleted',
      type: 'warning',
      action: {
        label: 'Undo',
        onClick: () => {
          // Undo would require storing deleted task state
        },
      },
    });
  };

  const handleSaveEdit = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
    }
    setIsEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={cn(
        'group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700',
        'shadow-soft hover:shadow-elevated transition-all duration-200',
        'border-l-4',
        getPriorityBgColor(task.priority),
        task.completed && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={handleToggleComplete}
          className={cn(
            'flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200',
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 dark:border-slate-600 hover:border-indigo-500'
          )}
        >
          {task.completed && <Check className="w-3 h-3" />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="w-full px-2 py-1 rounded border border-indigo-500 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
              autoFocus
            />
          ) : (
            <h3
              className={cn(
                'font-medium text-slate-900 dark:text-slate-100 cursor-pointer',
                task.completed && 'line-through text-slate-500 dark:text-slate-400'
              )}
              onClick={() => setIsEditing(true)}
            >
              {task.title}
            </h3>
          )}

          {task.description && !isEditing && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-3">
            {task.dueDate && (
              <span
                className={cn(
                  'inline-flex items-center gap-1 text-xs font-medium',
                  isOverdue(task.dueDate) && !task.completed
                    ? 'text-red-500'
                    : 'text-slate-500 dark:text-slate-400'
                )}
              >
                <Calendar className="w-3.5 h-3.5" />
                {formatDueDate(task.dueDate)}
              </span>
            )}

            {task.estimatedTime && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {task.estimatedTime}m
              </span>
            )}

            {totalSubtasks > 0 && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Check className="w-3.5 h-3.5" />
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}

            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}

            {task.tags.length > 3 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {totalSubtasks > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}

          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={handleDelete}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && task.subtasks.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-4 pb-4 ml-9 border-t border-slate-200 dark:border-slate-700 pt-3"
        >
          <div className="space-y-2">
            {task.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateTask(task.id, {
                      subtasks: task.subtasks.map((s) =>
                        s.id === subtask.id
                          ? { ...s, completed: !s.completed }
                          : s
                      ),
                    })
                  }
                  className={cn(
                    'w-4 h-4 rounded border-2 flex items-center justify-center',
                    subtask.completed
                      ? 'bg-indigo-500 border-indigo-500'
                      : 'border-slate-300 dark:border-slate-600'
                  )}
                >
                  {subtask.completed && <Check className="w-2.5 h-2.5 text-white" />}
                </button>
                <span
                  className={cn(
                    'text-sm',
                    subtask.completed
                      ? 'text-slate-400 line-through'
                      : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  {subtask.title}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
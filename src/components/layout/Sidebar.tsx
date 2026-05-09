import { motion } from 'framer-motion';
import {
  Inbox,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Sun,
  Moon,
  Settings,
  Keyboard,
  Flame,
} from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useUIStore } from '../../stores/uiStore';
import type { FilterType, TaskList } from '../../types';
import { cn } from '../../utils/helpers';

interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  filter?: FilterType;
}

const navItems: NavItem[] = [
  { id: 'inbox', name: 'Inbox', icon: Inbox, filter: 'all' },
  { id: 'today', name: 'Today', icon: Calendar, filter: 'today' },
  { id: 'upcoming', name: 'Upcoming', icon: Clock, filter: 'upcoming' },
  { id: 'completed', name: 'Completed', icon: CheckCircle, filter: 'completed' },
  { id: 'high_priority', name: 'High Priority', icon: AlertCircle, filter: 'high_priority' },
];

export function Sidebar() {
  const { lists, activeListId, activeFilter, setActiveList, setActiveFilter } = useTaskStore();
  const {
    theme,
    setTheme,
    sidebarOpen,
    setShowShortcutsModal,
    setShowSettingsModal,
    setShowNewTaskModal,
  } = useUIStore();

  const handleNavClick = (item: NavItem) => {
    if (item.filter) {
      setActiveFilter(item.filter);
      setActiveList('inbox');
    } else {
      setActiveList(item.id);
    }
  };

  const isActive = (item: NavItem) => {
    if (item.filter) return activeFilter === item.filter && activeListId === 'inbox';
    return activeListId === item.id;
  };

  return (
    <>
      {sidebarOpen && (
        <motion.aside
          initial={{ x: -280 }}
          animate={{ x: 0 }}
          exit={{ x: -280 }}
          className={cn(
            'fixed left-0 top-0 h-full w-[280px] bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 z-40',
            'flex flex-col transition-colors duration-200'
          )}
        >
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  Modern To-Do
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Stay productive
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowNewTaskModal(true)}
              className="w-full btn-primary mb-6"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>

            <nav className="space-y-1 mb-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                    isActive(item)
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              ))}
            </nav>

            <div className="space-y-1">
              <h3 className="px-3 py-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Lists
              </h3>
              {lists.map((list: TaskList) => {
                return (
                  <button
                    key={list.id}
                    onClick={() => {
                      setActiveList(list.id);
                      setActiveFilter('all');
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200',
                      activeListId === list.id && activeFilter === 'all'
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    )}
                  >
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="flex-1 font-medium">{list.name}</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      {list.taskCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowShortcutsModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
            >
              <Keyboard className="w-5 h-5" />
              <span className="font-medium">Keyboard Shortcuts</span>
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
              <span className="font-medium">
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
              <span className="font-medium">Settings</span>
            </button>
          </div>
        </motion.aside>
      )}
    </>
  );
}
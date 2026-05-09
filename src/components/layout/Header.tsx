import { Search, Menu } from 'lucide-react';
import { useTaskStore } from '../../stores/taskStore';
import { useUIStore } from '../../stores/uiStore';
import type { SortType } from '../../types';

export function Header() {
  const { searchQuery, setSearchQuery, activeSort, setActiveSort, activeListId, activeFilter, lists } = useTaskStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const currentList = lists.find((l) => l.id === activeListId);

  const getTitle = () => {
    if (activeFilter === 'today') return 'Today';
    if (activeFilter === 'upcoming') return 'Upcoming';
    if (activeFilter === 'completed') return 'Completed';
    if (activeFilter === 'high_priority') return 'High Priority';
    return currentList?.name || 'All Tasks';
  };

  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'due_date', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'created', label: 'Created' },
    { value: 'alphabetical', label: 'Alphabetical' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-4 px-4 py-4 lg:px-6">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {getTitle()}
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value as SortType)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
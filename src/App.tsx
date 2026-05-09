import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sidebar, Header } from './components/layout';
import { TaskList, TaskInput } from './components/tasks';
import { Pomodoro, ProgressCard } from './components/features';
import { Modal, ToastContainer } from './components/ui';
import { useUIStore } from './stores/uiStore';
import { useTaskStore } from './stores/taskStore';
import { cn } from './utils/helpers';

function App() {
  const { sidebarOpen, theme, setTheme, showNewTaskModal, setShowNewTaskModal, showShortcutsModal, setShowShortcutsModal, showSettingsModal, setShowSettingsModal } = useUIStore();
  const { activeListId, activeFilter } = useTaskStore();

  useEffect(() => {
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        setShowNewTaskModal(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
      }
      if (e.key === 'Escape') {
        setShowNewTaskModal(false);
        setShowShortcutsModal(false);
        setShowSettingsModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setShowNewTaskModal, setShowShortcutsModal, setShowSettingsModal]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <Sidebar />

      <div
        className={cn(
          'transition-all duration-300',
          sidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-0'
        )}
      >
        <Header />

        <main className="p-4 lg:p-6">
          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeListId}-${activeFilter}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TaskList />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <div className="hidden xl:block fixed bottom-6 right-6 w-80 space-y-4">
          <Pomodoro />
          <ProgressCard />
        </div>
      </div>

      <Modal
        isOpen={showNewTaskModal}
        onClose={() => setShowNewTaskModal(false)}
        title="Add New Task"
      >
        <TaskInput onClose={() => setShowNewTaskModal(false)} />
      </Modal>

      <Modal
        isOpen={showShortcutsModal}
        onClose={() => setShowShortcutsModal(false)}
        title="Keyboard Shortcuts"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">New Task</span>
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-sm">Cmd + N</kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Search</span>
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-sm">Cmd + F</kbd>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Close Modal</span>
            <kbd className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-sm">Esc</kbd>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        title="Settings"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <p className="font-medium text-slate-900 dark:text-slate-100">Theme</p>
              <p className="text-sm text-slate-500">Choose your preferred color scheme</p>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
              className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default App;
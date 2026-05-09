import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TaskCard } from './TaskCard';
import { useTaskStore } from '../../stores/taskStore';
import { Inbox } from 'lucide-react';

export function TaskList() {
  const { getFilteredTasks, reorderTasks, activeFilter } = useTaskStore();
  const tasks = getFilteredTasks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderTasks(active.id as string, over.id as string);
    }
  };

  if (tasks.length === 0) {
    return <EmptyState filter={activeFilter} />;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <motion.div layout className="space-y-3 p-4 lg:p-6">
          <AnimatePresence mode="popLayout">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </motion.div>
      </SortableContext>
    </DndContext>
  );
}

function EmptyState({ filter }: { filter: string }) {
  const getMessage = () => {
    if (filter === 'completed') {
      return "No completed tasks yet. Complete a task to see it here!";
    }
    if (filter === 'today') {
      return "No tasks for today. Enjoy your free time!";
    }
    if (filter === 'upcoming') {
      return "No upcoming tasks. Plan ahead!";
    }
    if (filter === 'high_priority') {
      return "No high priority tasks. You're on top of things!";
    }
    return "No tasks found. Add a new task to get started!";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Inbox className="w-10 h-10 text-slate-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
        All caught up!
      </h3>
      <p className="text-slate-500 dark:text-slate-400 text-center max-w-xs">
        {getMessage()}
      </p>
    </motion.div>
  );
}
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { Task, TaskList, FilterType, SortType } from '../types';
import { defaultLists, defaultTasks } from '../data/mockData';
import { isToday, isBefore } from 'date-fns';

interface TaskState {
  tasks: Task[];
  lists: TaskList[];
  activeListId: string;
  activeFilter: FilterType;
  activeSort: SortType;
  searchQuery: string;
  selectedTaskIds: string[];

  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  reorderTasks: (activeId: string, overId: string) => void;
  setActiveList: (listId: string) => void;
  setActiveFilter: (filter: FilterType) => void;
  setActiveSort: (sort: SortType) => void;
  setSearchQuery: (query: string) => void;
  toggleTaskSelection: (id: string) => void;
  selectAllTasks: () => void;
  clearSelection: () => void;
  deleteSelectedTasks: () => void;
  completeSelectedTasks: () => void;
  addList: (name: string, color: string, icon: string) => void;
  updateList: (id: string, updates: Partial<TaskList>) => void;
  deleteList: (id: string) => void;

  getFilteredTasks: () => Task[];
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: defaultTasks,
      lists: defaultLists,
      activeListId: 'inbox',
      activeFilter: 'all',
      activeSort: 'due_date',
      searchQuery: '',
      selectedTaskIds: [],

      addTask: (taskData) => {
        const now = new Date().toISOString();
        const newTask: Task = {
          ...taskData,
          id: uuidv4(),
          createdAt: now,
          updatedAt: now,
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
          lists: state.lists.map((list) =>
            list.id === taskData.listId
              ? { ...list, taskCount: list.taskCount + 1 }
              : list
          ),
        }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date().toISOString() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
          lists: task
            ? state.lists.map((list) =>
                list.id === task.listId
                  ? { ...list, taskCount: Math.max(0, list.taskCount - 1) }
                  : list
              )
            : state.lists,
          selectedTaskIds: state.selectedTaskIds.filter((tid) => tid !== id),
        }));
      },

      toggleTaskComplete: (id) => {
        const task = get().tasks.find((t) => t.id === id);
        if (task) {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id
                ? {
                    ...t,
                    completed: !t.completed,
                    updatedAt: new Date().toISOString(),
                  }
                : t
            ),
          }));
        }
      },

      reorderTasks: (activeId, overId) => {
        set((state) => {
          const oldIndex = state.tasks.findIndex((t) => t.id === activeId);
          const newIndex = state.tasks.findIndex((t) => t.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;

          const newTasks = [...state.tasks];
          const [removed] = newTasks.splice(oldIndex, 1);
          newTasks.splice(newIndex, 0, removed);

          return { tasks: newTasks };
        });
      },

      setActiveList: (listId) => set({ activeListId: listId, activeFilter: 'all' }),
      setActiveFilter: (filter) => set({ activeFilter: filter }),
      setActiveSort: (sort) => set({ activeSort: sort }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      toggleTaskSelection: (id) => {
        set((state) => ({
          selectedTaskIds: state.selectedTaskIds.includes(id)
            ? state.selectedTaskIds.filter((tid) => tid !== id)
            : [...state.selectedTaskIds, id],
        }));
      },

      selectAllTasks: () => {
        const filteredTasks = get().getFilteredTasks();
        set({ selectedTaskIds: filteredTasks.map((t) => t.id) });
      },

      clearSelection: () => set({ selectedTaskIds: [] }),

      deleteSelectedTasks: () => {
        const { selectedTaskIds, tasks } = get();
        set({
          tasks: tasks.filter((t) => !selectedTaskIds.includes(t.id)),
          selectedTaskIds: [],
        });
      },

      completeSelectedTasks: () => {
        const { selectedTaskIds } = get();
        set((state) => ({
          tasks: state.tasks.map((t) =>
            selectedTaskIds.includes(t.id)
              ? { ...t, completed: true, updatedAt: new Date().toISOString() }
              : t
          ),
        }));
      },

      addList: (name, color, icon) => {
        const newList: TaskList = {
          id: uuidv4(),
          name,
          color,
          icon,
          isDefault: false,
          taskCount: 0,
        };
        set((state) => ({ lists: [...state.lists, newList] }));
      },

      updateList: (id, updates) => {
        set((state) => ({
          lists: state.lists.map((list) =>
            list.id === id ? { ...list, ...updates } : list
          ),
        }));
      },

      deleteList: (id) => {
        const list = get().lists.find((l) => l.id === id);
        if (list?.isDefault) return;
        set((state) => ({
          lists: state.lists.filter((l) => l.id !== id),
          tasks: state.tasks.map((t) =>
            t.listId === id ? { ...t, listId: 'inbox' } : t
          ),
          activeListId:
            state.activeListId === id ? 'inbox' : state.activeListId,
        }));
      },

      getFilteredTasks: () => {
        const { tasks, activeListId, activeFilter, activeSort, searchQuery } = get();
        let filtered = tasks;

        if (activeListId !== 'inbox') {
          filtered = filtered.filter((t) => t.listId === activeListId);
        }

        if (activeFilter === 'today') {
          filtered = filtered.filter(
            (t) => t.dueDate && isToday(new Date(t.dueDate)) && !t.completed
          );
        } else if (activeFilter === 'upcoming') {
          const nextWeek = new Date();
          nextWeek.setDate(nextWeek.getDate() + 7);
          filtered = filtered.filter(
            (t) =>
              t.dueDate &&
              !isToday(new Date(t.dueDate)) &&
              !isBefore(new Date(t.dueDate), nextWeek) &&
              !t.completed
          );
        } else if (activeFilter === 'completed') {
          filtered = filtered.filter((t) => t.completed);
        } else if (activeFilter === 'high_priority') {
          filtered = filtered.filter((t) => t.priority === 'high' && !t.completed);
        }

        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(
            (t) =>
              t.title.toLowerCase().includes(query) ||
              t.description.toLowerCase().includes(query) ||
              t.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        }

        if (activeSort === 'due_date') {
          filtered = [...filtered].sort((a, b) => {
            if (!a.dueDate) return 1;
            if (!b.dueDate) return -1;
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          });
        } else if (activeSort === 'priority') {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          filtered = [...filtered].sort(
            (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
          );
        } else if (activeSort === 'created') {
          filtered = [...filtered].sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        } else if (activeSort === 'alphabetical') {
          filtered = [...filtered].sort((a, b) =>
            a.title.localeCompare(b.title)
          );
        }

        return filtered;
      },
    }),
    {
      name: 'modern-todo-tasks',
    }
  )
);
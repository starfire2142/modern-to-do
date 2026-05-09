import { useState } from 'react';
import { Plus, Calendar, Tag, Clock } from 'lucide-react';
import type { Priority } from '../../types';
import { useTaskStore } from '../../stores/taskStore';
import { Button, Input, TextArea } from '../ui';

interface TaskInputProps {
  onClose?: () => void;
}

export function TaskInput({ onClose }: TaskInputProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tags, setTags] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');

  const { addTask, activeListId } = useTaskStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addTask({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      tags: newTags,
      subtasks: [],
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : null,
      completed: false,
      listId: activeListId,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setTags('');
    setEstimatedTime('');

    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        placeholder="What needs to be done?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
      />

      <TextArea
        placeholder="Add a description..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={3}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Priority
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <Input
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          icon={<Calendar className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Tags"
          placeholder="work, urgent, client"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          icon={<Tag className="w-4 h-4" />}
        />

        <Input
          label="Est. Time (min)"
          type="number"
          placeholder="30"
          value={estimatedTime}
          onChange={(e) => setEstimatedTime(e.target.value)}
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        {onClose && (
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={!title.trim()}>
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
      </div>
    </form>
  );
}
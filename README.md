# Modern To-Do

A premium, feature-rich task management application with a sleek modern UI/UX. Built with React, Vite, Tailwind CSS, Framer Motion, and Zustand.

## Features

### Core Task Management
- Add, edit, delete tasks with inline editing
- Mark tasks complete/incomplete
- Drag-and-drop task reordering
- Priority levels (Low, Medium, High)
- Due dates with smart formatting
- Tags and categories
- Subtasks/checklists
- Estimated completion time

### Organization
- Multiple lists/projects (Inbox, Personal, Work, Shopping)
- Smart filters: Today, Upcoming, Completed, High Priority
- Real-time search across all tasks
- Sort by due date, priority, created date, or alphabetical

### Productivity Features
- Pomodoro timer with work/break sessions
- Progress statistics dashboard
- Completion tracking and streaks
- Daily goals

### UI/UX
- Modern, minimal design
- Dark/light theme toggle
- Smooth Framer Motion animations
- Responsive mobile-first design
- Glassmorphism effects
- Toast notifications with undo

### Technical
- LocalStorage persistence
- Type-safe with TypeScript
- Component-based architecture
- Zustand state management

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Zustand
- @dnd-kit for drag and drop
- date-fns
- lucide-react icons

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Default Lists

- **Inbox** - Default task collection
- **Personal** - Personal tasks
- **Work** - Work-related tasks
- **Shopping** - Shopping lists

## Keyboard Shortcuts

- `Cmd/Ctrl + N` - New task
- `Cmd/Cmd + F` - Search
- `Escape` - Close modals

## Project Structure

```
src/
├── components/
│   ├── features/     # Pomodoro, Progress
│   ├── layout/      # Sidebar, Header
│   ├── tasks/      # TaskCard, TaskList, TaskInput
│   └── ui/         # Button, Input, Modal, Toast
├── stores/         # Zustand stores
├── types/         # TypeScript types
├── utils/         # Helper functions
└── data/         # Mock data
```

## License

MIT
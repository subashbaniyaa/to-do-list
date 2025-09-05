import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Trash2 } from 'lucide-react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category?: 'today' | 'tomorrow' | 'thisWeek' | 'upcoming';
  list?: 'personal' | 'work' | 'list1';
  dueDate?: Date;
  tags?: string[];
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  compact?: boolean;
}

export function TaskItem({ task, onToggleComplete, onDeleteTask, compact = false }: TaskItemProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3 flex-1">
        <Checkbox
          checked={task.completed}
          onCheckedChange={() => onToggleComplete(task.id)}
          className="shrink-0"
        />
        <span 
          className={`flex-1 text-sm transition-all ${
            task.completed 
              ? 'line-through text-muted-foreground' 
              : 'text-foreground'
          }`}
        >
          {task.text}
        </span>
        {task.completed && (
          <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
            Personal
          </span>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDeleteTask(task.id)}
          className="shrink-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border shadow-sm transition-all hover:shadow-md backdrop-blur-sm ${
      task.completed 
        ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90'
    }`}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        className="shrink-0"
      />
      <span 
        className={`flex-1 transition-all ${
          task.completed 
            ? 'line-through text-muted-foreground' 
            : 'text-foreground'
        }`}
      >
        {task.text}
      </span>
      {task.completed && (
        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
          ✓ Done
        </span>
      )}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDeleteTask(task.id)}
        className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
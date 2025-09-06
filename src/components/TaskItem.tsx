import React from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Trash2, Edit, Calendar } from 'lucide-react';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  category?: 'today' | 'tomorrow' | 'thisWeek' | 'upcoming';
  list?: 'personal' | 'work' | 'list1';
  dueDate?: Date;
  tags?: string[];
  description?: string;
  color?: string;
  subtasks?: Subtask[];
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: Task) => void;
  compact?: boolean;
}

export function TaskItem({ task, onToggleComplete, onDeleteTask, onEditTask, compact = false }: TaskItemProps) {
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

  const taskStyle = task.color ? { borderLeftColor: task.color, borderLeftWidth: '4px' } : {};

  return (
    <div className={`group flex items-center gap-3 p-4 rounded-xl border shadow-sm transition-all hover:shadow-md backdrop-blur-sm cursor-pointer ${
      task.completed 
        ? 'bg-green-50/80 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
        : 'bg-white/80 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:bg-white/90 dark:hover:bg-gray-800/90'
    }`} style={taskStyle}>
      <Checkbox
        checked={task.completed}
        onCheckedChange={() => onToggleComplete(task.id)}
        className="shrink-0"
        onClick={(e) => e.stopPropagation()}
      />
      <div className="flex-1 min-w-0 space-y-1" onClick={onEditTask ? () => onEditTask(task) : undefined}>
        <div className={`font-medium transition-all ${
          task.completed 
            ? 'line-through text-muted-foreground' 
            : 'text-foreground'
        }`}>
          {task.text}
        </div>
        {task.description && (
          <div className="text-sm text-muted-foreground line-clamp-2">
            {task.description}
          </div>
        )}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {task.dueDate.toLocaleDateString()}
            </div>
          )}
          {task.subtasks && task.subtasks.length > 0 && (
            <div>
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
            </div>
          )}
        </div>
        {task.tags && task.tags.length > 0 && (
          <div className="flex gap-1 flex-wrap">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      {task.completed && (
        <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full">
          ✓ Done
        </span>
      )}
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onEditTask && (
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEditTask(task);
            }}
            className="shrink-0 text-muted-foreground hover:text-blue-600"
          >
            <Edit className="w-4 h-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteTask(task.id);
          }}
          className="shrink-0 text-muted-foreground hover:text-destructive hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
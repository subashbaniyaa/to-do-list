import React, { useState } from 'react';
import { Plus, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { TaskItem, Task } from './TaskItem';

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask?: (task: Task) => void;
  showAddNew?: boolean;
  emptyMessage?: string;
}

export function TaskSection({ 
  title, 
  tasks, 
  onAddTask, 
  onToggleComplete, 
  onDeleteTask,
  onEditTask,
  showAddNew = true,
  emptyMessage = "No tasks yet. Add one above to get started!"
}: TaskSectionProps) {
  const [showInput, setShowInput] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      onAddTask(newTaskText.trim());
      setNewTaskText('');
      setShowInput(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    } else if (e.key === 'Escape') {
      setShowInput(false);
      setNewTaskText('');
    }
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg mb-4">{title}</h3>
      
      {showAddNew && (
        <div className="mb-4">
          {!showInput ? (
            <Button
              variant="ghost"
              onClick={() => setShowInput(true)}
              className="w-full justify-start text-gray-500 dark:text-gray-400 h-10 px-3 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          ) : (
            <div className="flex gap-2">
              <Input
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter task description..."
                className="flex-1"
                autoFocus
              />
              <Button onClick={handleAddTask} disabled={!newTaskText.trim()}>
                Add
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  setShowInput(false);
                  setNewTaskText('');
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <TaskItem
                task={task}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                onEditTask={onEditTask}
                compact={true}
              />
              <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))
        ) : (
          !showAddNew && (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">
                {emptyMessage}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
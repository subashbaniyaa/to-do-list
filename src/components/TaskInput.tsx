import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Plus } from 'lucide-react';

interface TaskInputProps {
  onAddTask: (text: string) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [taskText, setTaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim()) {
      onAddTask(taskText.trim());
      setTaskText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full">
      <Input
        type="text"
        placeholder="Add a new task…"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        className="flex-1 bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm border-gray-200 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-500"
      />
      <Button 
        type="submit" 
        size="default" 
        className="shrink-0 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </form>
  );
}
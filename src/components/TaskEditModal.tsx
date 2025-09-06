import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { CalendarIcon, Plus, X, Trash2, Clock, Bell, Target } from 'lucide-react';
import { format } from 'date-fns';
import { Task, Subtask } from './TaskItem';

interface TaskEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const taskColors = [
  '#3B82F6', '#EF4444', '#10B981', '#F59E0B', 
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

const listOptions = [
  { value: 'personal', label: 'Personal', color: 'bg-red-500' },
  { value: 'work', label: 'Work', color: 'bg-blue-500' },
  { value: 'list1', label: 'List 1', color: 'bg-yellow-500' }
];

export function TaskEditModal({ isOpen, onClose, task, onSave, onDelete }: TaskEditModalProps) {
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [newTag, setNewTag] = useState('');
  const [newSubtask, setNewSubtask] = useState('');

  useEffect(() => {
    if (task) {
      setEditedTask({
        ...task,
        description: task.description || '',
        color: task.color || taskColors[0],
        subtasks: task.subtasks || [],
        estimatedMinutes: task.estimatedMinutes || 60,
        actualMinutes: task.actualMinutes || 0,
        reminder: task.reminder || 60,
        priority: task.priority || 'medium'
      });
    } else {
      setEditedTask({
        text: '',
        description: '',
        list: 'personal',
        category: 'upcoming',
        tags: [],
        color: taskColors[0],
        subtasks: [],
        completed: false,
        createdAt: Date.now(),
        estimatedMinutes: 60,
        actualMinutes: 0,
        reminder: 60,
        priority: 'medium'
      });
    }
  }, [task, isOpen]);

  const handleSave = () => {
    if (!editedTask.text?.trim()) return;
    
    const taskToSave: Task = {
      id: task?.id || crypto.randomUUID(),
      text: editedTask.text,
      completed: editedTask.completed || false,
      createdAt: editedTask.createdAt || Date.now(),
      category: editedTask.category || 'upcoming',
      list: editedTask.list as Task['list'],
      dueDate: editedTask.dueDate,
      tags: editedTask.tags || [],
      description: editedTask.description || '',
      color: editedTask.color || taskColors[0],
      subtasks: editedTask.subtasks || [],
      estimatedMinutes: editedTask.estimatedMinutes || 0,
      actualMinutes: editedTask.actualMinutes || 0,
      reminder: editedTask.reminder || 60,
      priority: editedTask.priority || 'medium'
    };

    onSave(taskToSave);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !editedTask.tags?.includes(newTag.trim())) {
      setEditedTask(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTask(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: crypto.randomUUID(),
        text: newSubtask.trim(),
        completed: false
      };
      setEditedTask(prev => ({
        ...prev,
        subtasks: [...(prev.subtasks || []), subtask]
      }));
      setNewSubtask('');
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    setEditedTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      ) || []
    }));
  };

  const removeSubtask = (subtaskId: string) => {
    setEditedTask(prev => ({
      ...prev,
      subtasks: prev.subtasks?.filter(st => st.id !== subtaskId) || []
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title">Task</Label>
            <Input
              id="task-title"
              value={editedTask.text || ''}
              onChange={(e) => setEditedTask(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Enter task title..."
              className="text-lg"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="task-description">Description</Label>
            <Textarea
              id="task-description"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          {/* List and Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>List</Label>
              <Select
                value={editedTask.list || 'personal'}
                onValueChange={(value) => setEditedTask(prev => ({ ...prev, list: value as Task['list'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {listOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editedTask.dueDate ? format(editedTask.dueDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={editedTask.dueDate}
                    onSelect={(date) => setEditedTask(prev => ({ ...prev, dueDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" onClick={addTag} size="sm">
                Add Tag
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {editedTask.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Time Estimates and Priority */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimated-time">Estimated Time (minutes)</Label>
              <Input
                id="estimated-time"
                type="number"
                min="0"
                value={editedTask.estimatedMinutes || ''}
                onChange={(e) => setEditedTask(prev => ({ 
                  ...prev, 
                  estimatedMinutes: parseInt(e.target.value) || 0 
                }))}
                placeholder="60"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reminder">Reminder (minutes before)</Label>
              <Input
                id="reminder"
                type="number"
                min="0"
                value={editedTask.reminder || ''}
                onChange={(e) => setEditedTask(prev => ({ 
                  ...prev, 
                  reminder: parseInt(e.target.value) || 0 
                }))}
                placeholder="60"
              />
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={editedTask.priority || 'medium'}
                onValueChange={(value) => setEditedTask(prev => ({ ...prev, priority: value as Task['priority'] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      Low
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      High
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              {taskColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setEditedTask(prev => ({ ...prev, color }))}
                  className={`w-8 h-8 rounded-full transition-all duration-200 hover:scale-110 ${
                    editedTask.color === color ? 'ring-2 ring-offset-2 ring-blue-500' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
            <Label>Subtasks</Label>
            <div className="flex gap-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubtask();
                  }
                }}
              />
              <Button type="button" onClick={addSubtask} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {editedTask.subtasks?.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-3 p-2 border rounded">
                  <Checkbox
                    checked={subtask.completed}
                    onCheckedChange={() => toggleSubtask(subtask.id)}
                  />
                  <span className={`flex-1 ${subtask.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {subtask.text}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubtask(subtask.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between pt-6">
          {task && onDelete && (
            <Button
              variant="destructive"
              onClick={() => {
                onDelete(task.id);
                onClose();
              }}
            >
              Delete Task
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!editedTask.text?.trim()}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
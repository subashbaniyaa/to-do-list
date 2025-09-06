import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Task } from './TaskItem';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { format, isSameDay } from 'date-fns';

interface DragDropCalendarProps {
  tasks: Task[];
  onUpdateTask: (task: Task) => void;
}

export function DragDropCalendar({ tasks, onUpdateTask }: DragDropCalendarProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const getTasksForDate = (date: Date) => {
    return tasks.filter(task => 
      task.dueDate && isSameDay(new Date(task.dueDate), date)
    );
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetDate: Date) => {
    e.preventDefault();
    if (draggedTask) {
      const updatedTask = {
        ...draggedTask,
        dueDate: targetDate,
        category: getTaskCategory(targetDate)
      };
      onUpdateTask(updatedTask);
      setDraggedTask(null);
    }
  };

  const getTaskCategory = (date: Date): Task['category'] => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() + 7);

    if (isSameDay(date, today)) return 'today';
    if (isSameDay(date, tomorrow)) return 'tomorrow';
    if (date <= thisWeek) return 'thisWeek';
    return 'upcoming';
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50 dark:bg-red-900/10';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-l-green-500 bg-green-50 dark:bg-green-900/10';
      default: return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/10';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="w-full"
          components={{
            DayContent: ({ date }) => {
              const dayTasks = getTasksForDate(date);
              return (
                <div 
                  className="relative w-full h-full p-1"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, date)}
                >
                  <div className="text-center mb-1">
                    {format(date, 'd')}
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={`text-xs p-1 rounded border-l-2 cursor-move ${getPriorityColor(task.priority)}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        style={{ borderLeftColor: task.color }}
                      >
                        <div className="truncate">{task.text}</div>
                      </div>
                    ))}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              );
            }
          }}
        />
      </div>

      {/* Selected Date Tasks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">
          {selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'Select a date'}
        </h3>
        
        {selectedDate && (
          <div className="space-y-2">
            {getTasksForDate(selectedDate).map((task) => (
              <Card 
                key={task.id}
                className={`cursor-move hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(task.priority)}`}
                draggable
                onDragStart={(e) => handleDragStart(e, task)}
                style={{ borderLeftColor: task.color }}
              >
                <CardContent className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{task.text}</h4>
                      {task.priority && (
                        <Badge 
                          variant={task.priority === 'high' ? 'destructive' : 
                                 task.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                      )}
                    </div>
                    
                    {task.description && (
                      <p className="text-sm text-muted-foreground">
                        {task.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {task.estimatedMinutes && (
                        <span>Est: {Math.floor(task.estimatedMinutes / 60)}h {task.estimatedMinutes % 60}m</span>
                      )}
                      {task.actualMinutes && (
                        <span>Actual: {Math.floor(task.actualMinutes / 60)}h {task.actualMinutes % 60}m</span>
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
                </CardContent>
              </Card>
            ))}
            
            {getTasksForDate(selectedDate).length === 0 && (
              <div 
                className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center text-muted-foreground"
                onDragOver={handleDragOver}
                onDrop={(e) => selectedDate && handleDrop(e, selectedDate)}
              >
                Drop tasks here to reschedule
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
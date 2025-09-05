import React, { useState } from 'react';
import { Calendar } from './ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CalendarDays, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from './TaskItem';
import { TaskSection } from './TaskSection';

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (text: string, category?: Task['category'], dueDate?: Date) => void;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export function CalendarView({ tasks, onAddTask, onToggleComplete, onDeleteTask }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Get tasks for a specific date
  const getTasksForDate = (date: Date) => {
    const dateStr = date.toDateString();
    return tasks.filter(task => {
      if (task.dueDate) {
        return new Date(task.dueDate).toDateString() === dateStr;
      }
      // For tasks without due dates, show today's tasks on today's date
      const today = new Date().toDateString();
      return dateStr === today && task.category === 'today';
    });
  };

  // Get tasks for selected date
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  // Create a custom day component that shows task counts
  const CustomDay = ({ date, ...props }: any) => {
    const tasksForDay = getTasksForDate(date);
    const hasIncompleTasks = tasksForDay.some(task => !task.completed);
    
    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <span>{date.getDate()}</span>
        {tasksForDay.length > 0 && (
          <div className={`absolute -bottom-1 -right-1 w-2 h-2 rounded-full ${
            hasIncompleTasks ? 'bg-red-500' : 'bg-green-500'
          }`} />
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Calendar */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarDays className="w-5 h-5" />
                Calendar
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <h3 className="text-lg">
                {currentMonth.toLocaleDateString('en-US', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </h3>
            </div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="w-full"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                month: "space-y-4 w-full",
                caption: "flex justify-center pt-1 relative items-center",
                caption_label: "text-sm",
                nav: "space-x-1 flex items-center",
                nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex w-full",
                head_cell: "text-muted-foreground rounded-md flex-1 text-xs text-center",
                row: "flex w-full mt-2",
                cell: "relative text-center text-sm p-0 flex-1 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                day: "h-12 w-full p-0 text-xs hover:bg-accent hover:text-accent-foreground flex items-center justify-center relative",
                day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
              components={{
                Day: CustomDay
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Selected Date Tasks */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDate ? (
                <>Tasks for {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'short', 
                  day: 'numeric' 
                })}</>
              ) : (
                'Select a date'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {selectedDate && (
              <TaskSection
                title=""
                tasks={selectedDateTasks}
                onAddTask={(text) => onAddTask(text, 'upcoming', selectedDate)}
                onToggleComplete={onToggleComplete}
                onDeleteTask={onDeleteTask}
                showAddNew={true}
              />
            )}
            {selectedDate && selectedDateTasks.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-2">
                  No tasks for this date
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => selectedDate && onAddTask('New task', 'upcoming', selectedDate)}
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Task
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calendar Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Legend</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="text-sm">Has pending tasks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm">All tasks completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-primary rounded-full" />
              <span className="text-sm">Selected date</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
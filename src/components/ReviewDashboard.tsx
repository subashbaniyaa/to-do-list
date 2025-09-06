import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Task } from './TaskItem';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  BarChart3,
  PieChart
} from 'lucide-react';
import { format, startOfWeek, endOfWeek, startOfDay, endOfDay, subDays, isWithinInterval } from 'date-fns';

interface ReviewDashboardProps {
  tasks: Task[];
}

export function ReviewDashboard({ tasks }: ReviewDashboardProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDateRange = () => {
    if (viewMode === 'daily') {
      return {
        start: startOfDay(selectedDate),
        end: endOfDay(selectedDate),
        label: format(selectedDate, 'EEEE, MMM d')
      };
    } else {
      return {
        start: startOfWeek(selectedDate),
        end: endOfWeek(selectedDate),
        label: `Week of ${format(startOfWeek(selectedDate), 'MMM d')}`
      };
    }
  };

  const { start, end, label } = getDateRange();

  const getTasksInRange = () => {
    return tasks.filter(task => {
      // Include tasks that are due in range
      if (task.dueDate && isWithinInterval(new Date(task.dueDate), { start, end })) {
        return true;
      }
      // Include tasks that were completed in range
      if (task.completedAt && isWithinInterval(new Date(task.completedAt), { start, end })) {
        return true;
      }
      // Include tasks that were created in range if no due date
      if (!task.dueDate && task.createdAt && isWithinInterval(new Date(task.createdAt), { start, end })) {
        return true;
      }
      return false;
    });
  };

  const getCompletedTasks = () => {
    return tasks.filter(task => {
      if (!task.completed) return false;
      // If task has completedAt, check if it's in range
      if (task.completedAt) {
        return isWithinInterval(new Date(task.completedAt), { start, end });
      }
      // Otherwise, include if it's in the general task range
      return getTasksInRange().some(t => t.id === task.id);
    });
  };

  const getPendingTasks = () => {
    return getTasksInRange().filter(task => !task.completed);
  };

  const getOverdueTasks = () => {
    const now = new Date();
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < now && 
      !task.completed
    );
  };

  const getTotalTimeTracked = () => {
    return getTasksInRange().reduce((total, task) => total + (task.actualMinutes || 0), 0);
  };

  const getTotalTimeEstimated = () => {
    return getTasksInRange().reduce((total, task) => total + (task.estimatedMinutes || 0), 0);
  };

  const getProductivityScore = () => {
    const completed = getCompletedTasks().length;
    const total = getTasksInRange().length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getTasksByPriority = () => {
    const rangedTasks = getTasksInRange();
    return {
      high: rangedTasks.filter(task => task.priority === 'high'),
      medium: rangedTasks.filter(task => task.priority === 'medium'),
      low: rangedTasks.filter(task => task.priority === 'low'),
    };
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    return `${hours}h ${mins}m`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const days = viewMode === 'daily' ? 1 : 7;
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? days : -days));
    setSelectedDate(newDate);
  };

  const completedTasks = getCompletedTasks();
  const pendingTasks = getPendingTasks();
  const overdueTasks = getOverdueTasks();
  const totalTimeTracked = getTotalTimeTracked();
  const totalTimeEstimated = getTotalTimeEstimated();
  const productivityScore = getProductivityScore();
  const tasksByPriority = getTasksByPriority();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Review Dashboard</h2>
          <p className="text-muted-foreground">{label}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border p-1">
            <Button
              variant={viewMode === 'daily' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('daily')}
            >
              Daily
            </Button>
            <Button
              variant={viewMode === 'weekly' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('weekly')}
            >
              Weekly
            </Button>
          </div>
          
          <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigateDate('next')}>
            Next
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {getTasksInRange().length} total tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{pendingTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              {overdueTasks.length} overdue
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Tracked</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{formatTime(totalTimeTracked)}</div>
            <p className="text-xs text-muted-foreground">
              Est: {formatTime(totalTimeEstimated)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productivity</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{productivityScore}%</div>
            <p className="text-xs text-muted-foreground">Completion rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Task Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">High Priority</span>
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-xs">
                    {tasksByPriority.high.filter(t => t.completed).length}/{tasksByPriority.high.length}
                  </Badge>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: tasksByPriority.high.length > 0 
                      ? `${(tasksByPriority.high.filter(t => t.completed).length / tasksByPriority.high.length) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Medium Priority</span>
                <Badge variant="default" className="text-xs">
                  {tasksByPriority.medium.filter(t => t.completed).length}/{tasksByPriority.medium.length}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: tasksByPriority.medium.length > 0 
                      ? `${(tasksByPriority.medium.filter(t => t.completed).length / tasksByPriority.medium.length) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Low Priority</span>
                <Badge variant="secondary" className="text-xs">
                  {tasksByPriority.low.filter(t => t.completed).length}/{tasksByPriority.low.length}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: tasksByPriority.low.length > 0 
                      ? `${(tasksByPriority.low.filter(t => t.completed).length / tasksByPriority.low.length) * 100}%` 
                      : '0%' 
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Completions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Recent Completions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedTasks.slice(0, 5).map((task) => (
                <div key={task.id} className="flex items-center gap-3 p-2 rounded border">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{task.text}</p>
                    <p className="text-xs text-muted-foreground">
                      {task.completedAt && format(new Date(task.completedAt), 'MMM d, h:mm a')}
                    </p>
                  </div>
                  {task.actualMinutes && (
                    <Badge variant="outline" className="text-xs">
                      {formatTime(task.actualMinutes)}
                    </Badge>
                  )}
                </div>
              ))}
              
              {completedTasks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No completed tasks in this period
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
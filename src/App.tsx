import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from './components/ui/button';
import { Task } from './components/TaskItem';
import { Sidebar } from './components/Sidebar';
import { TaskSection } from './components/TaskSection';
import { TaskEditModal } from './components/TaskEditModal';
import { DarkModeToggle } from './components/DarkModeToggle';
import { SettingsModal, Settings as SettingsType } from './components/SettingsModal';
import { CalendarView } from './components/CalendarView';
import { StickyWall } from './components/StickyWall';
import { UserGreeting } from './components/UserGreeting';
import { MotivationalQuote } from './components/MotivationalQuote';
import { NotificationManager } from './components/NotificationManager';
import { ReviewDashboard } from './components/ReviewDashboard';

const STORAGE_KEY = 'todo-tasks';
const THEME_KEY = 'todo-theme';
const NOTES_KEY = 'todo-notes';
const SETTINGS_KEY = 'todo-settings';

interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  tags: string[];
}



const defaultSettings: SettingsType = {
  userName: '',
  notifications: true,
  autoSort: true,
  taskReminders: false,
  defaultView: 'upcoming',
  customLists: [],
  customTags: []
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<StickyNote[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [activeView, setActiveView] = useState('upcoming');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [settings, setSettings] = useState<SettingsType>(defaultSettings);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [customTags, setCustomTags] = useState<string[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    // Load tasks
    const savedTasks = localStorage.getItem(STORAGE_KEY);
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        // Convert dueDate strings back to Date objects
        const tasksWithDates = parsedTasks.map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined
        }));
        setTasks(tasksWithDates);
      } catch (error) {
        console.error('Failed to parse saved tasks:', error);
      }
    }

    // Load notes
    const savedNotes = localStorage.getItem(NOTES_KEY);
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error('Failed to parse saved notes:', error);
      }
    }

    // Load settings
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    if (savedSettings) {
      try {
        setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
      } catch (error) {
        console.error('Failed to parse settings:', error);
      }
    }

    // Load theme
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(savedTheme === 'dark' || (!savedTheme && prefersDark));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Apply dark mode class and save theme preference
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
  }, [isDark]);

  // Set default view from settings
  useEffect(() => {
    if (settings.defaultView && activeView === 'upcoming') {
      setActiveView(settings.defaultView);
    }
  }, [settings.defaultView]);

  const addTask = (text: string, category?: Task['category'], dueDate?: Date, list?: string) => {
    // Determine the list based on the active view
    let taskList: Task['list'] = list as Task['list'] || 'personal';
    
    if (activeView === 'work') taskList = 'work';
    else if (activeView === 'list1') taskList = 'list1';
    else if (activeView.startsWith('custom-')) {
      // For custom lists, we'll default to 'personal' since they're not in the defined type
      taskList = 'personal';
    }

    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: Date.now(),
      category: category || 'upcoming',
      list: taskList,
      dueDate,
      tags: [],
      description: '',
      color: '#3B82F6',
      subtasks: [],
      estimatedMinutes: 60,
      actualMinutes: 0,
      reminder: 60,
      priority: 'medium'
    };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const updatedTask = { ...task, completed: !task.completed };
          if (!task.completed) {
            // Task is being completed
            updatedTask.completedAt = Date.now();
            // Stop time tracking if this task was being tracked
            if (runningTaskId === id) {
              setRunningTaskId(null);
            }
          }
          return updatedTask;
        }
        return task;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const updateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      updateTask(task);
    } else {
      setTasks(prev => [...prev, task]);
    }
  };

  const handleCloseTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  // Time tracking functions
  const startTimeTracking = (taskId: string) => {
    setRunningTaskId(taskId);
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, startedAt: Date.now() }
        : task
    ));
  };

  const pauseTimeTracking = (taskId: string) => {
    setRunningTaskId(null);
  };

  const stopTimeTracking = (taskId: string, totalMinutes: number) => {
    setRunningTaskId(null);
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, actualMinutes: totalMinutes, startedAt: undefined }
        : task
    ));
  };

  // Tag management functions
  const addCustomTag = (tag: string, color: string) => {
    if (!customTags.includes(tag)) {
      setCustomTags(prev => [...prev, tag]);
    }
  };

  const removeCustomTag = (tag: string) => {
    setCustomTags(prev => prev.filter(t => t !== tag));
  };

  const toggleDarkMode = () => {
    setIsDark(prev => !prev);
  };

  // Note management
  const addNote = (note: Omit<StickyNote, 'id' | 'createdAt'>) => {
    const newNote: StickyNote = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: Date.now()
    };
    setNotes(prev => [...prev, newNote]);
  };

  const updateNote = (id: string, updates: Partial<StickyNote>) => {
    setNotes(prev =>
      prev.map(note =>
        note.id === id ? { ...note, ...updates } : note
      )
    );
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  // Filter functions
  const getFilteredTasks = () => {
    let filteredTasks = tasks;

    // Apply search filter
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filteredTasks;
  };

  const getTodayTasks = () => getFilteredTasks().filter(task => task.category === 'today');
  const getTomorrowTasks = () => getFilteredTasks().filter(task => task.category === 'tomorrow');
  const getThisWeekTasks = () => getFilteredTasks().filter(task => task.category === 'thisWeek');
  const getUpcomingTasks = () => getFilteredTasks().filter(task => task.category === 'upcoming' || !task.category);
  const getPersonalTasks = () => getFilteredTasks().filter(task => task.list === 'personal');
  const getWorkTasks = () => getFilteredTasks().filter(task => task.list === 'work');
  const getList1Tasks = () => getFilteredTasks().filter(task => task.list === 'list1');

  // Get task counts
  const taskCounts = {
    upcoming: [...getTodayTasks(), ...getTomorrowTasks(), ...getThisWeekTasks(), ...getUpcomingTasks()].filter(t => !t.completed).length,
    today: getTodayTasks().filter(t => !t.completed).length,
    personal: getPersonalTasks().filter(t => !t.completed).length,
    work: getWorkTasks().filter(t => !t.completed).length,
    list1: getList1Tasks().filter(t => !t.completed).length,
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'upcoming':
        return (
          <div className="max-w-4xl">
            <UserGreeting isDark={isDark} />
            <div className="mb-6">
              <MotivationalQuote />
            </div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl">Upcoming</h1>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                  {taskCounts.upcoming}
                </span>
              </div>
            </div>

            <TaskSection
              title="Today"
              tasks={getTodayTasks()}
              onAddTask={(text) => addTask(text, 'today')}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
            />

            <TaskSection
              title="Tomorrow"
              tasks={getTomorrowTasks()}
              onAddTask={(text) => addTask(text, 'tomorrow')}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
            />

            <TaskSection
              title="This Week"
              tasks={getThisWeekTasks()}
              onAddTask={(text) => addTask(text, 'thisWeek')}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
            />
          </div>
        );
      
      case 'today':
        return (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl">Today</h1>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                  {taskCounts.today}
                </span>
              </div>
            </div>

            <TaskSection
              title="Today's Tasks"
              tasks={getTodayTasks()}
              onAddTask={(text) => addTask(text, 'today')}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
            />
          </div>
        );

      case 'calendar':
        return (
          <CalendarView
            tasks={getFilteredTasks()}
            onAddTask={addTask}
            onToggleComplete={toggleTaskComplete}
            onDeleteTask={deleteTask}
          />
        );
      
      case 'review':
        return <ReviewDashboard tasks={getFilteredTasks()} />;

      case 'sticky':
        return (
          <StickyWall
            notes={notes}
            onAddNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
          />
        );

      case 'personal':
        return (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <h1 className="text-2xl">Personal</h1>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                  {taskCounts.personal}
                </span>
              </div>
            </div>

            <TaskSection
              title="Personal Tasks"
              tasks={getPersonalTasks()}
              onAddTask={(text) => addTask(text, 'upcoming')}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
            />
          </div>
        );

      case 'work':
        return (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <h1 className="text-2xl">Work</h1>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                  {taskCounts.work}
                </span>
              </div>
            </div>

            <TaskSection
              title="Work Tasks"
              tasks={getWorkTasks()}
              onAddTask={(text) => addTask(text, 'upcoming')}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
            />
          </div>
        );

      case 'list1':
        return (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <h1 className="text-2xl">List 1</h1>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                  {taskCounts.list1}
                </span>
              </div>
            </div>

            <TaskSection
              title="List 1 Tasks"
              tasks={getList1Tasks()}
              onAddTask={(text) => addTask(text, 'upcoming')}
              onToggleComplete={toggleTaskComplete}
              onDeleteTask={deleteTask}
              onEditTask={handleEditTask}
            />
          </div>
        );

      default:
        // Handle custom lists and tags
        if (activeView.startsWith('custom-')) {
          const listName = activeView.replace('custom-', '');
          const customListTasks = getFilteredTasks().filter(task => task.list === listName);
          return (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl capitalize">{listName}</h1>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                    {customListTasks.filter(t => !t.completed).length}
                  </span>
                </div>
              </div>

              <TaskSection
                title={`${listName} Tasks`}
                tasks={customListTasks}
                onAddTask={(text) => addTask(text, 'upcoming')}
                onToggleComplete={toggleTaskComplete}
                onDeleteTask={deleteTask}
                onEditTask={handleEditTask}
              />
            </div>
          );
        }

        if (activeView.startsWith('tag-')) {
          const tagName = activeView.replace('tag-', '');
          const tagTasks = getFilteredTasks().filter(task => task.tags?.includes(tagName));
          return (
            <div className="max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl">#{tagName}</h1>
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
                    {tagTasks.filter(t => !t.completed).length}
                  </span>
                </div>
              </div>

              <TaskSection
                title={`Tasks tagged with #${tagName}`}
                tasks={tagTasks}
                onAddTask={(text) => addTask(text, 'upcoming')}
                onToggleComplete={toggleTaskComplete}
                onDeleteTask={deleteTask}
                onEditTask={handleEditTask}
              />
            </div>
          );
        }

        return (
          <div className="max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl capitalize">{activeView}</h1>
            </div>
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                This view is coming soon!
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        taskCounts={taskCounts}
        onSearch={handleSearch}
        customLists={settings.customLists}
        customTags={settings.customTags}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="absolute top-4 right-4 z-10">
          <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
        </div>
        
        <div className="flex-1 p-8 overflow-auto">
          {renderMainContent()}
        </div>
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDark={isDark}
        onToggleDarkMode={toggleDarkMode}
        onSettingsChange={setSettings}
        currentSettings={settings}
      />

      <TaskEditModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        task={editingTask}
        onSave={handleSaveTask}
        onDelete={deleteTask}
      />

      <NotificationManager
        tasks={tasks}
        enabled={notificationsEnabled}
      />
    </div>
  );
}
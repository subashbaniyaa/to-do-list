import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Plus, X, Trash2, User, Bell, Palette, Database } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDark: boolean;
  onToggleDarkMode: () => void;
  onSettingsChange: (settings: Settings) => void;
  currentSettings: Settings;
}

const SETTINGS_KEY = 'todo-settings';

export interface Settings {
  userName: string;
  notifications: boolean;
  autoSort: boolean;
  taskReminders: boolean;
  defaultView: string;
  customLists: string[];
  customTags: string[];
}

const defaultSettings: Settings = {
  userName: '',
  notifications: true,
  autoSort: true,
  taskReminders: false,
  defaultView: 'upcoming',
  customLists: [],
  customTags: []
};

export function SettingsModal({ isOpen, onClose, isDark, onToggleDarkMode, onSettingsChange, currentSettings }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [newList, setNewList] = useState('');
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isOpen) {
      setSettings(currentSettings);
    }
  }, [isOpen, currentSettings]);

  const saveSettings = () => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    onSettingsChange(settings);
    onClose();
  };

  const updateSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const addCustomList = () => {
    if (newList.trim() && !settings.customLists.includes(newList.trim())) {
      updateSetting('customLists', [...settings.customLists, newList.trim()]);
      setNewList('');
    }
  };

  const removeCustomList = (listToRemove: string) => {
    updateSetting('customLists', settings.customLists.filter(list => list !== listToRemove));
  };

  const addCustomTag = () => {
    if (newTag.trim() && !settings.customTags.includes(newTag.trim())) {
      updateSetting('customTags', [...settings.customTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeCustomTag = (tagToRemove: string) => {
    updateSetting('customTags', settings.customTags.filter(tag => tag !== tagToRemove));
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all tasks and data? This action cannot be undone.')) {
      localStorage.removeItem('todo-tasks');
      localStorage.removeItem(SETTINGS_KEY);
      localStorage.removeItem('todo-user-name');
      localStorage.removeItem('todo-daily-quote');
      localStorage.removeItem('todo-quote-date');
      window.location.reload();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Customize your task management experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <Label className="text-sm">Personal Information</Label>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="userName">Display Name</Label>
              <Input
                id="userName"
                value={settings.userName}
                onChange={(e) => updateSetting('userName', e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>

          <Separator />

          {/* Appearance */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              <Label className="text-sm">Appearance</Label>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch checked={isDark} onCheckedChange={onToggleDarkMode} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="defaultView">Default View</Label>
              <Select value={settings.defaultView} onValueChange={(value) => updateSetting('defaultView', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select default view" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="calendar">Calendar</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="work">Work</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Notifications & Behavior */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <Label className="text-sm">Notifications & Behavior</Label>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable browser notifications
                  </p>
                </div>
                <Switch 
                  checked={settings.notifications} 
                  onCheckedChange={(value) => updateSetting('notifications', value)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Sort Tasks</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically sort completed tasks to bottom
                  </p>
                </div>
                <Switch 
                  checked={settings.autoSort} 
                  onCheckedChange={(value) => updateSetting('autoSort', value)} 
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Reminders</Label>
                  <p className="text-sm text-muted-foreground">
                    Get reminders for upcoming tasks
                  </p>
                </div>
                <Switch 
                  checked={settings.taskReminders} 
                  onCheckedChange={(value) => updateSetting('taskReminders', value)} 
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Custom Lists */}
          <div className="space-y-4">
            <Label className="text-sm">Custom Lists</Label>
            <div className="flex gap-2">
              <Input
                value={newList}
                onChange={(e) => setNewList(e.target.value)}
                placeholder="Add new list..."
                onKeyDown={(e) => e.key === 'Enter' && addCustomList()}
              />
              <Button onClick={addCustomList} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.customLists.map((list) => (
                <Badge key={list} variant="secondary" className="flex items-center gap-1">
                  {list}
                  <button
                    onClick={() => removeCustomList(list)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Custom Tags */}
          <div className="space-y-4">
            <Label className="text-sm">Custom Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag..."
                onKeyDown={(e) => e.key === 'Enter' && addCustomTag()}
              />
              <Button onClick={addCustomTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {settings.customTags.map((tag) => (
                <Badge key={tag} variant="outline" className="flex items-center gap-1">
                  {tag}
                  <button
                    onClick={() => removeCustomTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Data Management */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <Label className="text-sm">Data Management</Label>
            </div>
            <Button 
              variant="destructive" 
              onClick={clearAllData}
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
            <p className="text-xs text-muted-foreground">
              This will permanently delete all your tasks, lists, and settings.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={saveSettings}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { Search, Calendar, StickyNote, User, Briefcase, List, Plus, Settings, ChevronRight } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  taskCounts: {
    upcoming: number;
    today: number;
    personal: number;
    work: number;
    list1: number;
  };
  onSearch: (query: string) => void;
  customLists?: string[];
  customTags?: string[];
  onOpenSettings: () => void;
}

export function Sidebar({ activeView, onViewChange, taskCounts, onSearch, customLists = [], customTags = [], onOpenSettings }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onSearch(value);
  };

  const menuItems = [
    {
      category: 'TASKS',
      items: [
        { id: 'upcoming', label: 'Upcoming', icon: ChevronRight, count: taskCounts.upcoming },
        { id: 'today', label: 'Today', icon: Calendar, count: taskCounts.today },
        { id: 'calendar', label: 'Calendar', icon: Calendar, count: 0 },
        { id: 'sticky', label: 'Notes', icon: StickyNote, count: 0 },
      ]
    },
    {
      category: 'PRODUCTIVITY',
      items: [
        { id: 'drag-calendar', label: 'Drag Calendar', icon: Calendar, count: 0 },
        { id: 'review', label: 'Review', icon: ChevronRight, count: 0 },
        { id: 'streaks', label: 'Streaks', icon: ChevronRight, count: 0 },
      ]
    },
    {
      category: 'LISTS',
      items: [
        { id: 'personal', label: 'Personal', icon: User, count: taskCounts.personal, color: 'bg-red-500' },
        { id: 'work', label: 'Work', icon: Briefcase, count: taskCounts.work, color: 'bg-blue-500' },
        { id: 'list1', label: 'List 1', icon: List, count: taskCounts.list1, color: 'bg-yellow-500' },
      ]
    }
  ];

  return (
    <div className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen">
      {/* Header */}
      <div className="p-4">
        <h2 className="text-lg mb-4">Menu</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4">
        {menuItems.map((section) => (
          <div key={section.category} className="mb-6">
            <h3 className="text-xs text-gray-500 dark:text-gray-400 mb-3 tracking-wider">
              {section.category}
            </h3>
            <div className="space-y-1">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.color && (
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                    )}
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.count > 0 && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {item.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Custom Lists */}
        {customLists.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs text-gray-500 dark:text-gray-400 mb-3 tracking-wider">
              CUSTOM LISTS
            </h3>
            <div className="space-y-1">
              {customLists.map((listName) => (
                <button
                  key={listName}
                  onClick={() => onViewChange(`custom-${listName}`)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeView === `custom-${listName}`
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-gray-400" />
                    <List className="w-4 h-4" />
                    <span>{listName}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-xs text-gray-500 dark:text-gray-400 mb-3 tracking-wider">
            TAGS
          </h3>
          <div className="flex gap-2 flex-wrap">
            {customTags.map((tag) => (
              <button
                key={tag}
                onClick={() => onViewChange(`tag-${tag}`)}
                className={`px-2 py-1 text-xs rounded transition-colors ${
                  activeView === `tag-${tag}`
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {tag}
              </button>
            ))}
            {customTags.length === 0 && (
              <span className="text-xs text-gray-400">No tags yet</span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-1">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-700 dark:text-gray-300"
            onClick={onOpenSettings}
          >
            <Settings className="w-4 h-4 mr-3" />
            Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { JSX } from 'react/jsx-runtime';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';

const NAME_KEY = 'todo-user-name';

interface UserGreetingProps {
  isDark: boolean;
}

export function UserGreeting({ isDark }: UserGreetingProps) {
  const [userName, setUserName] = useState('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [inputName, setInputName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem(NAME_KEY);
    if (savedName) {
      setUserName(savedName);
    } else {
      setShowNameDialog(true);
    }
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', emoji: '🌞' };
    if (hour < 17) return { text: 'Good Afternoon', emoji: '🌇' };
    if (hour < 21) return { text: 'Good Evening', emoji: '🌄' };
    return { text: 'Good Night', emoji: '🌝' };
  };

  const handleSaveName = () => {
    if (inputName.trim()) {
      const name = inputName.trim();
      setUserName(name);
      localStorage.setItem(NAME_KEY, name);
      setShowNameDialog(false);
      setInputName('');
    }
  };

  const handleEditName = () => {
    setInputName(userName);
    setShowNameDialog(true);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-semibold">
            {getTimeBasedGreeting().emoji} {getTimeBasedGreeting().text}, {userName || 'there'}!
          </h2>
          {userName && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditName}
              className="h-6 px-2 text-xs"
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      <Dialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome! What's your name?</DialogTitle>
            <DialogDescription>
              We'd like to personalize your experience and greet you properly.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="Enter your name"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
            autoFocus
          />
          <DialogFooter>
            <Button onClick={handleSaveName} disabled={!inputName.trim()}>
              Save Name
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
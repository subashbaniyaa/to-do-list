import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { User } from 'lucide-react';

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
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
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
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {getTimeBasedGreeting()}
            </h2>
            {userName && (
              <div className="flex items-center gap-2">
                <p className="text-lg text-muted-foreground">{userName}!</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEditName}
                  className="h-6 px-2 text-xs"
                >
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
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
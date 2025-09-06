import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Task } from './TaskItem';
import { 
  Flame, 
  Target, 
  Calendar,
  Trophy,
  Zap,
  Star,
  RefreshCw
} from 'lucide-react';
import { format, startOfDay, subDays, isSameDay } from 'date-fns';

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalDaysActive: number;
  weeklyGoal: number;
  monthlyGoal: number;
}

interface StreakTrackerProps {
  tasks: Task[];
}

const motivationalQuotes = [
  "Success is the sum of small efforts repeated day in and day out. - Robert Collier",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Don't let yesterday take up too much of today. - Will Rogers",
  "You don't have to be great to get started, but you have to get started to be great. - Les Brown",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The only way to do great work is to love what you do. - Steve Jobs",
  "Innovation distinguishes between a leader and a follower. - Steve Jobs",
  "Your limitation—it's only your imagination.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
  "Don't stop when you're tired. Stop when you're done."
];

export function StreakTracker({ tasks }: StreakTrackerProps) {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
    totalDaysActive: 0,
    weeklyGoal: 5,
    monthlyGoal: 20
  });
  
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    // Load streak data from localStorage
    const saved = localStorage.getItem('streak-data');
    if (saved) {
      try {
        setStreakData(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading streak data:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save streak data to localStorage
    localStorage.setItem('streak-data', JSON.stringify(streakData));
  }, [streakData]);

  useEffect(() => {
    // Calculate streak based on completed tasks
    calculateStreak();
  }, [tasks]);

  const calculateStreak = () => {
    const completedDates = getCompletedTaskDates();
    const currentStreak = calculateCurrentStreak(completedDates);
    const longestStreak = calculateLongestStreak(completedDates);
    
    setStreakData(prev => ({
      ...prev,
      currentStreak,
      longestStreak: Math.max(longestStreak, prev.longestStreak),
      lastActiveDate: completedDates.length > 0 ? completedDates[0] : null,
      totalDaysActive: completedDates.length
    }));
  };

  const getCompletedTaskDates = (): string[] => {
    const dates = new Set<string>();
    
    tasks.forEach(task => {
      if (task.completed && task.completedAt) {
        const date = startOfDay(new Date(task.completedAt));
        dates.add(format(date, 'yyyy-MM-dd'));
      }
    });
    
    return Array.from(dates).sort().reverse();
  };

  const calculateCurrentStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    
    let streak = 0;
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    
    // Check if user was active today or yesterday
    const mostRecentDate = dates[0];
    const yesterday = format(startOfDay(subDays(new Date(), 1)), 'yyyy-MM-dd');
    
    if (mostRecentDate !== today && mostRecentDate !== yesterday) {
      return 0;
    }
    
    // Count consecutive days
    for (let i = 0; i < dates.length; i++) {
      const expectedDate = format(startOfDay(subDays(new Date(), i)), 'yyyy-MM-dd');
      if (dates[i] === expectedDate) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateLongestStreak = (dates: string[]): number => {
    if (dates.length === 0) return 0;
    
    let maxStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i]);
      const previousDate = new Date(dates[i - 1]);
      const dayDiff = Math.abs(currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
      
      if (dayDiff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    
    return maxStreak;
  };

  const getWeeklyProgress = (): number => {
    const thisWeekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = format(startOfDay(subDays(new Date(), i)), 'yyyy-MM-dd');
      thisWeekDates.push(date);
    }
    
    const completedDates = getCompletedTaskDates();
    const thisWeekCompleted = completedDates.filter(date => 
      thisWeekDates.includes(date)
    ).length;
    
    return Math.min((thisWeekCompleted / streakData.weeklyGoal) * 100, 100);
  };

  const getStreakEmoji = (streak: number): string => {
    if (streak >= 30) return '🏆';
    if (streak >= 21) return '💎';
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⭐';
    if (streak >= 3) return '🌟';
    return '✨';
  };

  const getMotivationalMessage = (): string => {
    const streak = streakData.currentStreak;
    if (streak === 0) return "Every expert was once a beginner. Start your streak today!";
    if (streak === 1) return "Great start! One day down, many more to go!";
    if (streak < 7) return `${streak} days strong! You're building momentum!`;
    if (streak < 14) return `Impressive ${streak}-day streak! You're on fire! 🔥`;
    if (streak < 30) return `Amazing ${streak}-day streak! You're unstoppable!`;
    return `Legendary ${streak}-day streak! You're a productivity master! 🏆`;
  };

  const rotateQuote = () => {
    setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
  };

  return (
    <div className="space-y-6">
      {/* Main Streak Card */}
      <Card className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 opacity-10" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Streak Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-500 mb-1">
                {streakData.currentStreak}
                <span className="text-2xl ml-1">
                  {getStreakEmoji(streakData.currentStreak)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">
                {streakData.longestStreak}
                <Trophy className="w-5 h-5 inline ml-1" />
              </div>
              <p className="text-sm text-muted-foreground">Longest Streak</p>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">
                {streakData.totalDaysActive}
                <Calendar className="w-5 h-5 inline ml-1" />
              </div>
              <p className="text-sm text-muted-foreground">Total Active Days</p>
            </div>
          </div>
          
          <div className="text-center p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{getMotivationalMessage()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Weekly Goal Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">This Week</span>
              <Badge variant="outline">
                {Math.floor(getWeeklyProgress())}% Complete
              </Badge>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getWeeklyProgress()}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Goal: Stay active {streakData.weeklyGoal} days this week
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Quote */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Daily Motivation
            </div>
            <Button variant="ghost" size="sm" onClick={rotateQuote}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <blockquote className="italic text-center p-4 bg-muted rounded-lg">
            "{motivationalQuotes[currentQuote]}"
          </blockquote>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.completed && t.priority === 'high').length}
              </div>
              <p className="text-sm text-muted-foreground">High Priority Done</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold">
                {tasks.filter(t => t.completed && isSameDay(new Date(t.completedAt || 0), new Date())).length}
              </div>
              <p className="text-sm text-muted-foreground">Completed Today</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
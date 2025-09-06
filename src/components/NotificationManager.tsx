import { useEffect } from 'react';
import { Task } from './TaskItem';

interface NotificationManagerProps {
  tasks: Task[];
  enabled: boolean;
}

export function NotificationManager({ tasks, enabled }: NotificationManagerProps) {
  useEffect(() => {
    if (!enabled || !('Notification' in window)) return;

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const checkReminders = () => {
      const now = new Date();
      
      tasks.forEach((task) => {
        if (task.completed || !task.dueDate || !task.reminder) return;
        
        const dueTime = new Date(task.dueDate);
        const reminderTime = new Date(dueTime.getTime() - (task.reminder * 60 * 1000));
        
        // Check if it's time for a reminder (within 1 minute window)
        const timeDiff = now.getTime() - reminderTime.getTime();
        if (timeDiff >= 0 && timeDiff < 60000) {
          showNotification(task);
        }
      });
    };

    const showNotification = (task: Task) => {
      if (Notification.permission === 'granted') {
        const notification = new Notification(`Task Reminder: ${task.text}`, {
          body: task.description || `Due: ${task.dueDate?.toLocaleString()}`,
          icon: '/favicon.ico',
          tag: task.id, // Prevents duplicate notifications
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };

        // Auto close after 10 seconds
        setTimeout(() => notification.close(), 10000);
      }
    };

    // Check every minute
    const intervalId = setInterval(checkReminders, 60000);
    
    // Initial check
    checkReminders();

    return () => clearInterval(intervalId);
  }, [tasks, enabled]);

  return null; // This component doesn't render anything
}
import { useState, useEffect } from 'react';
import { RefreshCw, Quote } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

const motivationalQuotes = [
  {
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney"
  },
  {
    text: "Don't let yesterday take up too much of today.",
    author: "Will Rogers"
  },
  {
    text: "You don't have to be great to get started, but you have to get started to be great.",
    author: "Les Brown"
  },
  {
    text: "The future depends on what you do today.",
    author: "Mahatma Gandhi"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon"
  },
  {
    text: "It is during our darkest moments that we must focus to see the light.",
    author: "Aristotle"
  },
  {
    text: "The only impossible journey is the one you never begin.",
    author: "Tony Robbins"
  },
  {
    text: "In the middle of difficulty lies opportunity.",
    author: "Albert Einstein"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  },
  {
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb"
  }
];

const QUOTE_KEY = 'todo-daily-quote';
const QUOTE_DATE_KEY = 'todo-quote-date';

export function MotivationalQuote() {
  const [currentQuote, setCurrentQuote] = useState(motivationalQuotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem(QUOTE_DATE_KEY);
    const savedQuoteIndex = localStorage.getItem(QUOTE_KEY);

    if (savedDate === today && savedQuoteIndex) {
      const quoteIndex = parseInt(savedQuoteIndex, 10);
      if (quoteIndex >= 0 && quoteIndex < motivationalQuotes.length) {
        setCurrentQuote(motivationalQuotes[quoteIndex]);
        return;
      }
    }

    // Set a new daily quote
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    setCurrentQuote(motivationalQuotes[randomIndex]);
    localStorage.setItem(QUOTE_KEY, randomIndex.toString());
    localStorage.setItem(QUOTE_DATE_KEY, today);
  }, []);

  const refreshQuote = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
      setCurrentQuote(motivationalQuotes[randomIndex]);
      localStorage.setItem(QUOTE_KEY, randomIndex.toString());
      localStorage.setItem(QUOTE_DATE_KEY, new Date().toDateString());
      setIsRefreshing(false);
    }, 300);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Quote className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-1 shrink-0" />
          <div className="flex-1 min-w-0">
            <blockquote className="text-sm leading-relaxed text-foreground mb-2">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-xs text-muted-foreground not-italic">
              — {currentQuote.author}
            </cite>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={refreshQuote}
            disabled={isRefreshing}
            className="shrink-0 h-8 w-8 p-0 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
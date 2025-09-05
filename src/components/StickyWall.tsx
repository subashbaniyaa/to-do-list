import React, { useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { StickyNote as StickyNoteIcon, Plus, X, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';

interface StickyNote {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: number;
  tags: string[];
}

interface StickyWallProps {
  notes: StickyNote[];
  onAddNote: (note: Omit<StickyNote, 'id' | 'createdAt'>) => void;
  onUpdateNote: (id: string, updates: Partial<StickyNote>) => void;
  onDeleteNote: (id: string) => void;
}

const noteColors = [
  { name: 'Yellow', value: 'bg-yellow-200 dark:bg-yellow-800', border: 'border-yellow-300 dark:border-yellow-700' },
  { name: 'Pink', value: 'bg-pink-200 dark:bg-pink-800', border: 'border-pink-300 dark:border-pink-700' },
  { name: 'Blue', value: 'bg-blue-200 dark:bg-blue-800', border: 'border-blue-300 dark:border-blue-700' },
  { name: 'Green', value: 'bg-green-200 dark:bg-green-800', border: 'border-green-300 dark:border-green-700' },
  { name: 'Purple', value: 'bg-purple-200 dark:bg-purple-800', border: 'border-purple-300 dark:border-purple-700' },
  { name: 'Orange', value: 'bg-orange-200 dark:bg-orange-800', border: 'border-orange-300 dark:border-orange-700' },
];

export function StickyWall({ notes, onAddNote, onUpdateNote, onDeleteNote }: StickyWallProps) {
  const [editingNote, setEditingNote] = useState<StickyNote | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: noteColors[0].value,
    tags: [] as string[]
  });
  const [newTag, setNewTag] = useState('');

  const handleAddNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      onAddNote({
        title: newNote.title.trim() || 'Untitled',
        content: newNote.content.trim(),
        color: newNote.color,
        tags: newNote.tags
      });
      setNewNote({
        title: '',
        content: '',
        color: noteColors[0].value,
        tags: []
      });
      setIsAddDialogOpen(false);
    }
  };

  const handleUpdateNote = () => {
    if (editingNote) {
      onUpdateNote(editingNote.id, {
        title: editingNote.title.trim() || 'Untitled',
        content: editingNote.content.trim(),
        color: editingNote.color,
        tags: editingNote.tags
      });
      setEditingNote(null);
    }
  };

  const addTag = (noteId: string, tag: string) => {
    if (tag.trim()) {
      const note = notes.find(n => n.id === noteId);
      if (note && !note.tags.includes(tag.trim())) {
        onUpdateNote(noteId, {
          tags: [...note.tags, tag.trim()]
        });
      }
    }
  };

  const removeTag = (noteId: string, tagToRemove: string) => {
    const note = notes.find(n => n.id === noteId);
    if (note) {
      onUpdateNote(noteId, {
        tags: note.tags.filter(tag => tag !== tagToRemove)
      });
    }
  };

  const getColorClass = (color: string) => {
    return noteColors.find(c => c.value === color) || noteColors[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl">Sticky Wall</h1>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded">
            {notes.length}
          </span>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Note</DialogTitle>
              <DialogDescription>
                Add a new sticky note to your wall
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="note-title">Title</Label>
                <Input
                  id="note-title"
                  value={newNote.title}
                  onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Note title..."
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="note-content">Content</Label>
                <Textarea
                  id="note-content"
                  value={newNote.content}
                  onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="What's on your mind..."
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {noteColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setNewNote(prev => ({ ...prev, color: color.value }))}
                      className={`w-8 h-8 rounded border-2 ${color.value} ${
                        newNote.color === color.value ? color.border : 'border-transparent'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (newTag.trim() && !newNote.tags.includes(newTag.trim())) {
                          setNewNote(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
                          setNewTag('');
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (newTag.trim() && !newNote.tags.includes(newTag.trim())) {
                        setNewNote(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
                        setNewTag('');
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {newNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => setNewNote(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote}>
                Add Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {notes.map((note) => {
          const colorClass = getColorClass(note.color);
          return (
            <Card
              key={note.id}
              className={`group ${colorClass.value} ${colorClass.border} border-2 shadow-sm hover:shadow-md transition-shadow`}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-sm line-clamp-1">{note.title}</h3>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => setEditingNote(note)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:text-destructive"
                      onClick={() => onDeleteNote(note.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-6 whitespace-pre-wrap">
                  {note.content}
                </p>
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs bg-white/50 dark:bg-gray-900/50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {notes.length === 0 && (
        <div className="text-center py-12">
          <StickyNoteIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg mb-2">No sticky notes yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first sticky note to get started
          </p>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Note
          </Button>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Note</DialogTitle>
            <DialogDescription>
              Make changes to your sticky note
            </DialogDescription>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={editingNote.title}
                  onChange={(e) => setEditingNote(prev => prev ? { ...prev, title: e.target.value } : null)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-content">Content</Label>
                <Textarea
                  id="edit-content"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote(prev => prev ? { ...prev, content: e.target.value } : null)}
                  rows={4}
                />
              </div>
              <div className="grid gap-2">
                <Label>Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {noteColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setEditingNote(prev => prev ? { ...prev, color: color.value } : null)}
                      className={`w-8 h-8 rounded border-2 ${color.value} ${
                        editingNote.color === color.value ? color.border : 'border-transparent'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-1">
                  {editingNote.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        onClick={() => removeTag(editingNote.id, tag)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingNote(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateNote}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Save, Bold, Italic, List, Clock, Download, Type } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  videoTime?: string;
  flashcardId?: string;
}

interface NotesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentVideoTime?: string;
  currentFlashcardId?: string;
}

const NotesPanel: React.FC<NotesPanelProps> = ({ 
  isOpen, 
  onClose, 
  currentVideoTime, 
  currentFlashcardId 
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem('study-notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever notes change
  useEffect(() => {
    localStorage.setItem('study-notes', JSON.stringify(notes));
  }, [notes]);

  const saveNote = () => {
    if (currentNote.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        content: currentNote,
        timestamp: new Date(),
        videoTime: currentVideoTime,
        flashcardId: currentFlashcardId
      };
      setNotes([newNote, ...notes]);
      setCurrentNote('');
    }
  };

  const formatText = (format: 'bold' | 'italic' | 'bullet') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = currentNote.substring(start, end);
    
    if (selectedText) {
      let formattedText = '';
      switch (format) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'bullet':
          formattedText = `• ${selectedText}`;
          break;
      }
      
      const newNote = currentNote.substring(0, start) + formattedText + currentNote.substring(end);
      setCurrentNote(newNote);
    }
  };

  const exportNotes = () => {
    const notesText = notes.map(note => {
      let noteText = `[${note.timestamp.toLocaleString()}]`;
      if (note.videoTime) noteText += ` [Video: ${note.videoTime}]`;
      if (note.flashcardId) noteText += ` [Flashcard: ${note.flashcardId}]`;
      noteText += `\n${note.content}\n\n`;
      return noteText;
    }).join('');

    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-notes-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl border-l border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Notes</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={exportNotes}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                title="Export Notes"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl"
              >
                ×
              </button>
            </div>
          </div>
        </div>

        {/* Note Input Area */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          {/* Formatting Toolbar */}
          <div className="flex items-center space-x-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <button
              onClick={() => formatText('bold')}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
              title="Bold"
            >
              <Bold className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => formatText('italic')}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
              title="Italic"
            >
              <Italic className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => formatText('bullet')}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors duration-200"
              title="Bullet Point"
            >
              <List className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <div className="flex-1"></div>
            {currentVideoTime && (
              <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {currentVideoTime}
              </span>
            )}
          </div>

          <textarea
            ref={textareaRef}
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Write your notes here... Use the formatting buttons above for styling."
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <button
            onClick={saveNote}
            disabled={!currentNote.trim()}
            className="mt-3 w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {notes.length === 0 ? (
              <div className="text-center py-8">
                <Type className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-gray-500 dark:text-gray-400">No notes yet</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">Start taking notes to see them here</p>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 group hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{note.timestamp.toLocaleString()}</span>
                      {note.videoTime && (
                        <span className="flex items-center text-blue-600 dark:text-blue-400">
                          <Clock className="h-3 w-3 mr-1" />
                          {note.videoTime}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-all duration-200"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {note.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesPanel;
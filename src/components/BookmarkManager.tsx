import React from 'react';
import { Bookmark, Play, FileText, Brain, Trash2, Clock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Bookmark as BookmarkType } from '../types';
import { mockVideos, mockDocuments, mockQuizzes } from '../data/mockData';

interface BookmarkManagerProps {
  onViewChange: (view: string) => void;
}

const BookmarkManager: React.FC<BookmarkManagerProps> = ({ onViewChange }) => {
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkType[]>('bookmarks', []);

  const removeBookmark = (bookmarkId: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== bookmarkId));
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Play;
      case 'document':
        return FileText;
      case 'quiz':
        return Brain;
      default:
        return Clock;
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-blue-600';
      case 'document':
        return 'text-purple-600';
      case 'quiz':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleResourceClick = (bookmark: BookmarkType) => {
    switch (bookmark.resourceType) {
      case 'video':
        onViewChange('videos');
        break;
      case 'document':
        onViewChange('documents');
        break;
      case 'quiz':
        onViewChange('quizzes');
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bookmarks</h2>
        <p className="text-gray-600">Access your saved resources and continue learning where you left off.</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Bookmark className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
          <p className="text-gray-600 mb-6">Start bookmarking videos, documents, and quizzes to keep track of important resources.</p>
          <button
            onClick={() => onViewChange('dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Explore Resources
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((bookmark) => {
            const Icon = getResourceIcon(bookmark.resourceType);
            
            return (
              <div key={bookmark.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 rounded-lg ${
                      bookmark.resourceType === 'video' ? 'bg-blue-50' :
                      bookmark.resourceType === 'document' ? 'bg-purple-50' : 'bg-emerald-50'
                    }`}>
                      <Icon className={`h-6 w-6 ${getResourceColor(bookmark.resourceType)}`} />
                    </div>
                  </div>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{bookmark.title}</h3>
                <p className="text-sm text-gray-500 mb-4 capitalize">{bookmark.resourceType}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Saved {new Date(bookmark.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => handleResourceClick(bookmark)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      bookmark.resourceType === 'video' 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : bookmark.resourceType === 'document'
                          ? 'bg-purple-600 hover:bg-purple-700 text-white'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    Open
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookmarkManager;
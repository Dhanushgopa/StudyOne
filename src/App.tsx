import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SearchInterface from './components/SearchInterface';
import SearchResults from './components/SearchResults';
import VideoPlayer from './components/VideoPlayer';
import DocumentViewer from './components/DocumentViewer';
import QuizSystem from './components/QuizSystem';
import LearningPaths from './components/LearningPaths';
import BookmarkManager from './components/BookmarkManager';
import NoteGenerator from './components/NoteGenerator';
import { mockVideos, mockDocuments, mockQuizzes, mockLearningPaths } from './data/mockData';
import { SearchResult } from './types';

function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  const handleSearchComplete = (results: SearchResult) => {
    setSearchResults(results);
    setActiveView('search-results');
  };

  const handleBackToSearch = () => {
    setActiveView('search');
    setSearchResults(null);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'search':
        return <SearchInterface onSearchComplete={handleSearchComplete} />;
      case 'search-results':
        return searchResults ? (
          <SearchResults results={searchResults} onBack={handleBackToSearch} />
        ) : (
          <SearchInterface onSearchComplete={handleSearchComplete} />
        );
      case 'videos':
        return <VideoPlayer videos={mockVideos} />;
      case 'documents':
        return <DocumentViewer documents={mockDocuments} />;
      case 'quizzes':
        return <QuizSystem quizzes={mockQuizzes} />;
      case 'paths':
        return <LearningPaths paths={mockLearningPaths} onViewChange={setActiveView} />;
      case 'bookmarks':
        return <BookmarkManager onViewChange={setActiveView} />;
      case 'notes':
        return <NoteGenerator />;
      default:
        return <Dashboard onViewChange={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <main className="pb-8">
        {renderActiveView()}
      </main>
    </div>
  );
}

export default App;
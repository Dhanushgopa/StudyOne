import React, { useState } from 'react';
import { ArrowLeft, ExternalLink, Calendar, User, Eye, Clock, Download, BookOpen, Play, Brain, Layers, Edit3 } from 'lucide-react';
import { SearchResult, YouTubeVideo, Article, ResearchPaper } from '../types';
import QuizSystem from './QuizSystem';
import VideoNoteEditor from './VideoNoteEditor';
import EnhancedFlashcards from './EnhancedFlashcards';
import StudyRoomLobby from './StudyRoomLobby';
import StudyRoom from './StudyRoom';
import NotesPanel from './NotesPanel';

interface SearchResultsProps {
  results: SearchResult;
  onBack: () => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onBack }) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'articles' | 'papers' | 'quiz' | 'flashcards'>('videos');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const [selectedVideoForNotes, setSelectedVideoForNotes] = useState<YouTubeVideo | null>(null);
  const [showStudyRoomLobby, setShowStudyRoomLobby] = useState(false);
  const [currentStudyRoom, setCurrentStudyRoom] = useState<string | null>(null);
  const [showNotesPanel, setShowNotesPanel] = useState(false);
  const [currentFlashcardId, setCurrentFlashcardId] = useState<string | null>(null);

  const toggleCard = (cardId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(cardId)) {
      newFlipped.delete(cardId);
    } else {
      newFlipped.add(cardId);
    }
    setFlippedCards(newFlipped);
  };

  const tabs = [
    { id: 'videos', label: 'Videos', icon: Play, count: results.videos.length },
    { id: 'articles', label: 'Articles', icon: BookOpen, count: results.articles.length },
    { id: 'papers', label: 'Papers', icon: Download, count: results.papers.length },
    { id: 'quiz', label: 'Quiz', icon: Brain, count: results.quiz.questions.length },
    { id: 'flashcards', label: 'Flashcards', icon: Layers, count: results.flashcards.length },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const openNoteEditor = (video: YouTubeVideo) => {
    setSelectedVideoForNotes(video);
    setShowNoteEditor(true);
  };

  const handleJoinStudyRoom = () => {
    setShowStudyRoomLobby(true);
  };

  const handleCreateRoom = (roomName: string, isPrivate: boolean) => {
    const roomId = `room-${Date.now()}`;
    setCurrentStudyRoom(roomId);
    setShowStudyRoomLobby(false);
  };

  const handleJoinRoom = (roomId: string) => {
    setCurrentStudyRoom(roomId);
    setShowStudyRoomLobby(false);
  };

  const handleLeaveRoom = () => {
    setCurrentStudyRoom(null);
  };

  const handleOpenNotes = (flashcardId: string) => {
    setCurrentFlashcardId(flashcardId);
    setShowNotesPanel(true);
  };

  // If in study room, show study room interface
  if (currentStudyRoom) {
    return (
      <StudyRoom
        roomId={currentStudyRoom}
        onLeave={handleLeaveRoom}
      />
    );
  }
  const VideoCard: React.FC<{ video: YouTubeVideo }> = ({ video }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="aspect-video relative">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{video.channelName}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {video.viewCount}
            </span>
            <span className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(video.publishedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Watch Video
            <ExternalLink className="h-3 w-3 ml-1" />
          </a>
          <button
            onClick={() => openNoteEditor(video)}
            className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
          >
            <Edit3 className="h-3 w-3 mr-1" />
            Take Notes
          </button>
        </div>
      </div>
    </div>
  );

  const ArticleCard: React.FC<{ article: Article }> = ({ article }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
        <span className="flex items-center">
          <User className="h-3 w-3 mr-1" />
          {article.author}
        </span>
        <span>{article.source}</span>
        <span className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {article.readTime}
        </span>
      </div>
      <p className="text-gray-700 mb-4 text-sm">{article.summary}</p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{formatDate(article.publishedAt)}</span>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-purple-600 hover:text-purple-700 text-sm font-medium"
        >
          Read Article
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );

  const PaperCard: React.FC<{ paper: ResearchPaper }> = ({ paper }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{paper.title}</h3>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Authors:</span> {paper.authors.join(', ')}
      </div>
      <div className="text-sm text-gray-600 mb-3">
        <span className="font-medium">Published in:</span> {paper.journal} • {formatDate(paper.publishedAt)}
      </div>
      <p className="text-gray-700 mb-4 text-sm">{paper.abstract}</p>
      {paper.keyFindings.length > 0 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-2 text-sm">Key Findings:</h4>
          <ul className="space-y-1">
            {paper.keyFindings.map((finding, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start">
                <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">DOI: {paper.doi}</span>
        <a
          href={paper.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium"
        >
          View Paper
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Search
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Research Results for "{results.query}"
        </h1>
        <p className="text-gray-600">
          Searched on {formatDate(results.timestamp)}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div>
        {activeTab === 'videos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

        {activeTab === 'articles' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {activeTab === 'papers' && (
          <div className="space-y-6">
            {results.papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} />
            ))}
          </div>
        )}

        {activeTab === 'quiz' && (
          <div className="max-w-4xl mx-auto">
            <QuizSystem quizzes={[results.quiz]} />
          </div>
        )}

        {activeTab === 'flashcards' && (
          <EnhancedFlashcards
            flashcards={results.flashcards}
            onOpenNotes={handleOpenNotes}
            onJoinStudyRoom={handleJoinStudyRoom}
          />
        )}
      </div>

      {/* Note Editor Modal */}
      {showNoteEditor && selectedVideoForNotes && (
        <VideoNoteEditor
          videoId={selectedVideoForNotes.id}
          videoTitle={selectedVideoForNotes.title}
          onClose={() => {
            setShowNoteEditor(false);
            setSelectedVideoForNotes(null);
          }}
        />
      )}

      {/* Study Room Lobby */}
      {showStudyRoomLobby && (
        <StudyRoomLobby
          onJoinRoom={handleJoinRoom}
          onCreateRoom={handleCreateRoom}
          onClose={() => setShowStudyRoomLobby(false)}
        />
      )}

      {/* Notes Panel */}
      <NotesPanel
        isOpen={showNotesPanel}
        onClose={() => setShowNotesPanel(false)}
        currentFlashcardId={currentFlashcardId}
      />
    </div>
  );
};

export default SearchResults;
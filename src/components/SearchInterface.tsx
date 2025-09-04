import React, { useState } from 'react';
import { Search, Loader2, BookOpen, Video, FileText, Brain, Layers } from 'lucide-react';
import { SearchService } from '../services/searchService';
import { SearchResult } from '../types';

interface SearchInterfaceProps {
  onSearchComplete: (results: SearchResult) => void;
}

const SearchInterface: React.FC<SearchInterfaceProps> = ({ onSearchComplete }) => {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [apiStatus, setApiStatus] = useState<string>('');

  const searchService = SearchService.getInstance();

  // Test API on component mount
  React.useEffect(() => {
    const testAPI = async () => {
      console.log('Testing Gemini API with key:', import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10) + '...');
      const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (geminiKey) {
        try {
          // Simple test call to Gemini
          const testResult = await searchService.testGeminiConnection();
          console.log('Gemini test result:', testResult);
          setApiStatus(`✅ Gemini API working - ${testResult}`);
        } catch (error) {
          console.error('Gemini API test failed:', error);
          setApiStatus(`❌ Gemini API failed: ${error.message}`);
        }
      } else {
        setApiStatus('❌ Gemini API key not found');
      }
    };
    
    testAPI();
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    console.log('Starting search for:', searchQuery);
    setIsSearching(true);
    
    try {
      
      // Perform parallel searches for content types (except quiz which takes longer)
      console.log('Fetching videos, articles, and papers...');
      const [videos, articles, papers] = await Promise.all([
        searchService.searchYouTubeVideos(searchQuery),
        searchService.searchArticles(searchQuery),
        searchService.searchResearchPapers(searchQuery)
      ]);

      console.log('Basic search completed. Starting AI content generation...');
      
      // Generate AI content (quiz and flashcards) - these may take longer
      const [quiz, flashcards] = await Promise.all([
        searchService.generateQuiz(searchQuery, 'intermediate'),
        searchService.generateFlashcards(searchQuery)
      ]);
      
      console.log('AI content generation completed. Quiz questions:', quiz.questions.length, 'Flashcards:', flashcards.length);
      
      const searchResult: SearchResult = {
        id: `search-${Date.now()}`,
        query: searchQuery,
        timestamp: new Date().toISOString(),
        videos,
        articles,
        papers,
        quiz,
        flashcards
      };

      // Update search history
      setSearchHistory(prev => [searchQuery, ...prev.filter(q => q !== searchQuery)].slice(0, 5));
      
      onSearchComplete(searchResult);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed. Please check your API keys and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  const popularTopics = [
    'Machine Learning',
    'React Development',
    'Data Science',
    'Artificial Intelligence',
    'Web Development',
    'Python Programming'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Research Any Topic
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get comprehensive learning resources including videos, articles, research papers, quizzes, and flashcards
        </p>
        {apiStatus && (
          <div className={`text-sm p-2 rounded ${apiStatus.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            API Status: {apiStatus}
          </div>
        )}
      </div>

      {/* Search Form */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter any topic to research (e.g., Machine Learning, React Hooks, Quantum Computing)"
            className="block w-full pl-10 pr-12 py-4 border border-gray-300 rounded-xl text-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isSearching}
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {isSearching ? (
              <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
            ) : (
              <div className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200">
                Search
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Searches</h3>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => {
                  setQuery(historyQuery);
                  handleSearch(historyQuery);
                }}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors duration-200"
              >
                {historyQuery}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Popular Topics */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Popular Topics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {popularTopics.map((topic, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(topic);
                handleSearch(topic);
              }}
              className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 text-left transition-all duration-200"
              disabled={isSearching}
            >
              <div className="font-medium text-gray-900">{topic}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Preview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">What you'll get:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="flex items-center space-x-2">
            <Video className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">YouTube Videos</span>
          </div>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-purple-600" />
            <span className="text-sm text-gray-700">Recent Articles</span>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            <span className="text-sm text-gray-700">Research Papers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-orange-600" />
            <span className="text-sm text-gray-700">Interactive Quiz</span>
          </div>
          <div className="flex items-center space-x-2">
            <Layers className="h-5 w-5 text-pink-600" />
            <span className="text-sm text-gray-700">Flashcards</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
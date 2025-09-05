import React, { useState } from 'react';
import { RotateCcw, Star, BookOpen, Brain, Users, StickyNote } from 'lucide-react';
import { Flashcard } from '../types';

interface EnhancedFlashcardsProps {
  flashcards: Flashcard[];
  onOpenNotes: (flashcardId: string) => void;
  onJoinStudyRoom: () => void;
}

const EnhancedFlashcards: React.FC<EnhancedFlashcardsProps> = ({ 
  flashcards, 
  onOpenNotes, 
  onJoinStudyRoom 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set());
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const filteredCards = flashcards.filter(card => 
    difficulty === 'all' || card.difficulty === difficulty
  );

  const currentCard = filteredCards[currentIndex];

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
    setIsFlipped(false);
  };

  const markAsStudied = () => {
    if (currentCard) {
      setStudiedCards(new Set([...studiedCards, currentCard.id]));
    }
  };

  const resetProgress = () => {
    setStudiedCards(new Set());
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  if (!currentCard) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No flashcards available</h3>
        <p className="text-gray-600 dark:text-gray-400">Generate some flashcards to start studying!</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Flashcards</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Filter:</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Levels</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onJoinStudyRoom()}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
          >
            <Users className="h-4 w-4" />
            <span>Study Together</span>
          </button>
          <button
            onClick={() => onOpenNotes(currentCard.id)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <StickyNote className="h-4 w-4" />
            <span>Take Notes</span>
          </button>
          <button
            onClick={resetProgress}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Progress: {studiedCards.size} / {filteredCards.length} cards studied
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Card {currentIndex + 1} of {filteredCards.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(studiedCards.size / filteredCards.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000 mb-6">
        <div
          className={`relative preserve-3d w-full h-96 duration-700 cursor-pointer ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
          onClick={() => setIsFlipped(!isFlipped)}
        >
          {/* Front */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-800 border-2 border-blue-200 dark:border-blue-700 p-8 flex flex-col justify-between backface-hidden shadow-xl">
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                {currentCard.difficulty}
              </div>
              {studiedCards.has(currentCard.id) && (
                <Star className="h-6 w-6 text-yellow-500 fill-current" />
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Brain className="h-12 w-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">Question</h3>
                <p className="text-lg text-blue-800 dark:text-blue-200 leading-relaxed max-w-2xl">
                  {currentCard.front}
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-blue-600 dark:text-blue-400">Click to reveal answer</p>
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900 dark:to-emerald-800 border-2 border-emerald-200 dark:border-emerald-700 p-8 flex flex-col justify-between rotate-y-180 backface-hidden shadow-xl">
            <div className="flex items-center justify-between">
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                {currentCard.difficulty}
              </div>
              {studiedCards.has(currentCard.id) && (
                <Star className="h-6 w-6 text-yellow-500 fill-current" />
              )}
            </div>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100 mb-4">Answer</h3>
                <div className="text-base text-emerald-800 dark:text-emerald-200 leading-relaxed max-w-2xl">
                  {currentCard.back.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-3 last:mb-0">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Click to see question again</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-4">
        <button
          onClick={prevCard}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          Previous
        </button>
        
        <button
          onClick={markAsStudied}
          disabled={studiedCards.has(currentCard.id)}
          className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200 font-medium flex items-center space-x-2"
        >
          <Star className="h-4 w-4" />
          <span>{studiedCards.has(currentCard.id) ? 'Studied' : 'Mark as Studied'}</span>
        </button>
        
        <button
          onClick={nextCard}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium"
        >
          Next
        </button>
      </div>

      {/* Study Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{studiedCards.size}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Cards Studied</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{filteredCards.length - studiedCards.size}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Remaining</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round((studiedCards.size / filteredCards.length) * 100)}%
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Complete</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedFlashcards;
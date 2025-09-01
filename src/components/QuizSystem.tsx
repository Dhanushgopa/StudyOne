import React, { useState } from 'react';
import { Brain, CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';
import { Quiz, Question } from '../types';
import { useLearningProgress } from '../hooks/useLearningProgress';

interface QuizSystemProps {
  quizzes: Quiz[];
}

const QuizSystem: React.FC<QuizSystemProps> = ({ quizzes }) => {
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const { completedQuizzes, quizScores, markQuizComplete } = useLearningProgress();

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < selectedQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!selectedQuiz) return;
    
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return acc + (answer === selectedQuiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    markQuizComplete(selectedQuiz.id, percentage);
    setShowResults(true);
    setQuizCompleted(true);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setQuizCompleted(false);
  };

  const currentQuestion = selectedQuiz?.questions[currentQuestionIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Center</h2>
        <p className="text-gray-600">Test your understanding with interactive quizzes and get instant feedback.</p>
      </div>

      {!selectedQuiz ? (
        // Quiz Selection
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const isCompleted = completedQuizzes.includes(quiz.id);
            const score = quizScores[quiz.id];
            
            return (
              <div key={quiz.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-emerald-50 rounded-lg">
                    <Brain className="h-6 w-6 text-emerald-600" />
                  </div>
                  {isCompleted && (
                    <div className="flex items-center text-emerald-600">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      <span className="text-sm font-medium">{score}%</span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{quiz.questions.length} questions</p>
                <button
                  onClick={() => startQuiz(quiz)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  {isCompleted ? 'Retake Quiz' : 'Start Quiz'}
                </button>
              </div>
            );
          })}
        </div>
      ) : showResults ? (
        // Quiz Results
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h3>
              <p className="text-gray-600">Here's how you performed:</p>
            </div>
            
            <div className="mb-8">
              <div className="text-4xl font-bold text-emerald-600 mb-2">
                {quizScores[selectedQuiz.id]}%
              </div>
              <p className="text-gray-600">
                {selectedAnswers.filter((answer, index) => answer === selectedQuiz.questions[index].correctAnswer).length} out of {selectedQuiz.questions.length} correct
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {selectedQuiz.questions.map((question, index) => {
                const userAnswer = selectedAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="text-left border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3 mb-2">
                      {isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <p className="font-medium text-gray-900">{question.question}</p>
                    </div>
                    <p className="text-sm text-gray-600 ml-8">{question.explanation}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={resetQuiz}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Take Another Quiz
            </button>
          </div>
        </div>
      ) : (
        // Quiz Taking Interface
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Progress Bar */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{selectedQuiz.title}</h3>
                <span className="text-sm text-gray-600">
                  {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            {currentQuestion && (
              <div className="p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-6">{currentQuestion.question}</h4>
                <div className="space-y-3 mb-6">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? 'border-emerald-300 bg-emerald-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full border-2 transition-colors duration-200 ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? 'border-emerald-600 bg-emerald-600'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswers[currentQuestionIndex] === index && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="text-gray-900">{option}</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <button
                    onClick={resetQuiz}
                    className="flex items-center text-gray-600 hover:text-gray-700 text-sm"
                  >
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Exit Quiz
                  </button>
                  <button
                    onClick={nextQuestion}
                    disabled={selectedAnswers[currentQuestionIndex] === undefined}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    {currentQuestionIndex === selectedQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizSystem;
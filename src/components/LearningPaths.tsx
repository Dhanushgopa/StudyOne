import React from 'react';
import { Target, Play, FileText, Brain, CheckCircle, Clock } from 'lucide-react';
import { LearningPath } from '../types';
import { useLearningProgress } from '../hooks/useLearningProgress';

interface LearningPathsProps {
  paths: LearningPath[];
  onViewChange: (view: string) => void;
}

const LearningPaths: React.FC<LearningPathsProps> = ({ paths, onViewChange }) => {
  const { calculatePathProgress, completedVideos, completedDocuments, completedQuizzes } = useLearningProgress();

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'watch':
        return Play;
      case 'read':
        return FileText;
      case 'test':
        return Brain;
      default:
        return Clock;
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'watch':
        return 'text-blue-600';
      case 'read':
        return 'text-purple-600';
      case 'test':
        return 'text-emerald-600';
      default:
        return 'text-gray-600';
    }
  };

  const isStepCompleted = (step: any) => {
    switch (step.type) {
      case 'watch':
        return completedVideos.includes(step.resourceId);
      case 'read':
        return completedDocuments.includes(step.resourceId);
      case 'test':
        return completedQuizzes.includes(step.resourceId);
      default:
        return false;
    }
  };

  const handleStepClick = (step: any) => {
    switch (step.type) {
      case 'watch':
        onViewChange('videos');
        break;
      case 'read':
        onViewChange('documents');
        break;
      case 'test':
        onViewChange('quizzes');
        break;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Learning Paths</h2>
        <p className="text-gray-600">Follow structured learning journeys designed to build your knowledge step by step.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {paths.map((path) => {
          const progress = calculatePathProgress(path);
          
          return (
            <div key={path.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-50 rounded-lg mr-4">
                      <Target className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{path.title}</h3>
                      <p className="text-gray-600 text-sm">{path.description}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {path.steps.map((step, index) => {
                    const Icon = getStepIcon(step.type);
                    const isCompleted = isStepCompleted(step);
                    const isNext = !isCompleted && path.steps.slice(0, index).every(prevStep => isStepCompleted(prevStep));
                    
                    return (
                      <div key={step.id} className="relative">
                        {index < path.steps.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
                        )}
                        <button
                          onClick={() => handleStepClick(step)}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                            isCompleted 
                              ? 'border-emerald-200 bg-emerald-50' 
                              : isNext
                                ? 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                                : 'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${
                              isCompleted ? 'bg-emerald-100' : 'bg-white'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5 text-emerald-600" />
                              ) : (
                                <Icon className={`h-5 w-5 ${getStepColor(step.type)}`} />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">{step.title}</h4>
                              <p className="text-xs text-gray-500 capitalize">{step.type} • Step {index + 1}</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPaths;
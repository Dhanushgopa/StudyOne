import React from 'react';
import { Play, FileText, Brain, TrendingUp, Clock, Award } from 'lucide-react';
import { mockLearningPaths, mockVideos, mockDocuments, mockQuizzes } from '../data/mockData';
import { useLearningProgress } from '../hooks/useLearningProgress';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { completedVideos, completedDocuments, completedQuizzes, calculatePathProgress } = useLearningProgress();

  const stats = [
    {
      label: 'Videos Watched',
      value: completedVideos.length,
      total: mockVideos.length,
      icon: Play,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Documents Read',
      value: completedDocuments.length,
      total: mockDocuments.length,
      icon: FileText,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      label: 'Quizzes Completed',
      value: completedQuizzes.length,
      total: mockQuizzes.length,
      icon: Brain,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
  ];

  const recentActivity = [
    { action: 'Completed', resource: 'Introduction to ML', type: 'video', time: '2 hours ago' },
    { action: 'Started', resource: 'Linear Algebra Quiz', type: 'quiz', time: '5 hours ago' },
    { action: 'Bookmarked', resource: 'Attention Research Paper', type: 'document', time: '1 day ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back to StudyOne</h2>
        <p className="text-gray-600">Continue your learning journey with curated resources and AI-powered tools.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const percentage = stat.total > 0 ? Math.round((stat.value / stat.total) * 100) : 0;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className="text-2xl font-bold text-gray-900">{stat.value}/{stat.total}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">{stat.label}</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    stat.color === 'text-blue-600' ? 'bg-blue-600' :
                    stat.color === 'text-purple-600' ? 'bg-purple-600' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Learning Paths */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
              Learning Paths
            </h3>
            <button 
              onClick={() => onViewChange('paths')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {mockLearningPaths.slice(0, 2).map((path) => {
              const progress = calculatePathProgress(path);
              return (
                <div key={path.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors duration-200">
                  <h4 className="font-medium text-gray-900 mb-2">{path.title}</h4>
                  <p className="text-sm text-gray-600 mb-3">{path.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex-1 mr-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <Clock className="h-5 w-5 mr-2 text-purple-600" />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className={`p-2 rounded-full ${
                  activity.type === 'video' ? 'bg-blue-50' :
                  activity.type === 'quiz' ? 'bg-emerald-50' : 'bg-purple-50'
                }`}>
                  {activity.type === 'video' && <Play className="h-4 w-4 text-blue-600" />}
                  {activity.type === 'quiz' && <Brain className="h-4 w-4 text-emerald-600" />}
                  {activity.type === 'document' && <FileText className="h-4 w-4 text-purple-600" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action} <span className="text-gray-600">{activity.resource}</span>
                  </p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Award className="h-5 w-5 mr-2 text-emerald-600" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => onViewChange('videos')}
            className="bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg p-4 text-left transition-colors duration-200"
          >
            <Play className="h-6 w-6 text-blue-600 mb-2" />
            <h4 className="font-medium text-gray-900">Watch Videos</h4>
            <p className="text-sm text-gray-600">Explore curated video content</p>
          </button>
          <button 
            onClick={() => onViewChange('documents')}
            className="bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg p-4 text-left transition-colors duration-200"
          >
            <FileText className="h-6 w-6 text-purple-600 mb-2" />
            <h4 className="font-medium text-gray-900">Read Documents</h4>
            <p className="text-sm text-gray-600">Access research papers and articles</p>
          </button>
          <button 
            onClick={() => onViewChange('quizzes')}
            className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg p-4 text-left transition-colors duration-200"
          >
            <Brain className="h-6 w-6 text-emerald-600 mb-2" />
            <h4 className="font-medium text-gray-900">Take Quizzes</h4>
            <p className="text-sm text-gray-600">Test your understanding</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
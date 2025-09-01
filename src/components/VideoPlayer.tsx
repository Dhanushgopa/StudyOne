import React, { useState } from 'react';
import { Clock, CheckCircle, Play, ExternalLink, Edit3 } from 'lucide-react';
import { Video } from '../types';
import { useLearningProgress } from '../hooks/useLearningProgress';
import VideoNoteEditor from './VideoNoteEditor';

interface VideoPlayerProps {
  videos: Video[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videos }) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(videos[0] || null);
  const [showNoteEditor, setShowNoteEditor] = useState(false);
  const { completedVideos, markVideoComplete } = useLearningProgress();

  const handleVideoComplete = (videoId: string) => {
    markVideoComplete(videoId);
  };

  const formatTimestamp = (timestamp: string) => {
    const [minutes, seconds] = timestamp.split(':');
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Video Library</h2>
        <p className="text-gray-600">Watch curated educational content with key timestamps and insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Player */}
        <div className="lg:col-span-2">
          {selectedVideo && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?enablejsapi=1`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{selectedVideo.title}</h3>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">{selectedVideo.duration}</span>
                  </div>
                </div>
                
                {!completedVideos.includes(selectedVideo.id) && (
                  <button
                    onClick={() => handleVideoComplete(selectedVideo.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 mb-4"
                  >
                    Mark as Complete
                  </button>
                )}

                {completedVideos.includes(selectedVideo.id) && (
                  <div className="flex items-center text-emerald-600 mb-4">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                )}

                <button
                  onClick={() => setShowNoteEditor(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 mr-4"
                >
                  <Edit3 className="h-4 w-4 mr-2 inline" />
                  Take Notes
                </button>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Key Timestamps</h4>
                  <div className="space-y-2">
                    {selectedVideo.keyTimestamps.map((timestamp, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <span className="text-sm font-mono text-blue-600 mr-3 min-w-[50px]">
                          {formatTimestamp(timestamp.time)}
                        </span>
                        <span className="text-sm text-gray-700">{timestamp.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Video List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Videos</h3>
            <div className="space-y-3">
              {videos.map((video) => {
                const isCompleted = completedVideos.includes(video.id);
                const isSelected = selectedVideo?.id === video.id;
                
                return (
                  <button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                      isSelected 
                        ? 'border-blue-300 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <img 
                        src={video.thumbnailUrl} 
                        alt={video.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm mb-1 truncate">
                          {video.title}
                        </h4>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{video.duration}</span>
                          {isCompleted && (
                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Note Editor Modal */}
      {showNoteEditor && selectedVideo && (
        <VideoNoteEditor
          videoId={selectedVideo.youtubeId}
          videoTitle={selectedVideo.title}
          onClose={() => setShowNoteEditor(false)}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
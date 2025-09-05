import React, { useState, useRef, useEffect } from 'react';
import { Video, VideoOff, Mic, MicOff, Users, Share2, MessageCircle, Settings } from 'lucide-react';

interface StudyRoomProps {
  roomId: string;
  onLeave: () => void;
}

const StudyRoom: React.FC<StudyRoomProps> = ({ roomId, onLeave }) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [participants, setParticipants] = useState(['You', 'Alice', 'Bob']);
  const [currentVideo, setCurrentVideo] = useState('');
  const [videoTime, setVideoTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, timestamp: Date}>>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Simulated WebRTC setup (in real implementation, use actual WebRTC)
  useEffect(() => {
    // Initialize video stream
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then(stream => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(err => console.error('Error accessing media devices:', err));
  }, []);

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    // In real implementation: toggle video track
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    // In real implementation: toggle audio track
  };

  const handleVideoControl = (action: 'play' | 'pause' | 'seek', time?: number) => {
    // Broadcast control to all participants
    console.log(`Broadcasting ${action}`, time);
    setIsPlaying(action === 'play');
    if (time !== undefined) {
      setVideoTime(time);
    }
  };

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now().toString(),
        user: 'You',
        message: newMessage,
        timestamp: new Date()
      };
      setChatMessages([...chatMessages, message]);
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="flex h-screen">
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Study Room: {roomId}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{participants.length} participants</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isVideoOn 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                  }`}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-lg transition-colors duration-200 ${
                    isAudioOn 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                      : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                  }`}
                >
                  {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </button>
                <button
                  onClick={onLeave}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  Leave Room
                </button>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="flex-1 p-4">
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Shared Content Area */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Shared Content</h3>
                  <button className="flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors duration-200">
                    <Share2 className="h-4 w-4" />
                    <span>Share Screen</span>
                  </button>
                </div>
                
                {/* YouTube Video Player */}
                <div className="aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/ukzFI9rgwfU?enablejsapi=1"
                    title="Shared Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-lg"
                  ></iframe>
                </div>

                {/* Video Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => handleVideoControl(isPlaying ? 'pause' : 'play')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                  >
                    {isPlaying ? 'Pause' : 'Play'}
                  </button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Synchronized for all participants
                  </span>
                </div>
              </div>

              {/* Video Call Area */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Participants</h3>
                <div className="grid grid-cols-2 gap-2 h-full">
                  {/* Local Video */}
                  <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                    <video
                      ref={localVideoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                      You {!isVideoOn && '(Video Off)'}
                    </div>
                  </div>
                  
                  {/* Remote Videos */}
                  {participants.slice(1).map((participant, index) => (
                    <div key={participant} className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <Users className="h-8 w-8" />
                      </div>
                      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        {participant}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Chat
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">{msg.user}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{msg.message}</p>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;
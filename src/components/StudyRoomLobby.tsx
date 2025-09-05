import React, { useState } from 'react';
import { Users, Plus, Video, Globe, Lock } from 'lucide-react';

interface StudyRoomLobbyProps {
  onJoinRoom: (roomId: string) => void;
  onCreateRoom: (roomName: string, isPrivate: boolean) => void;
  onClose: () => void;
}

const StudyRoomLobby: React.FC<StudyRoomLobbyProps> = ({ onJoinRoom, onCreateRoom, onClose }) => {
  const [activeTab, setActiveTab] = useState<'join' | 'create'>('join');
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  // Mock active rooms
  const activeRooms = [
    { id: 'room-1', name: 'Machine Learning Study Group', participants: 3, isPrivate: false },
    { id: 'room-2', name: 'React Development', participants: 2, isPrivate: false },
    { id: 'room-3', name: 'Data Science Prep', participants: 5, isPrivate: true },
  ];

  const handleJoinRoom = (roomId: string) => {
    onJoinRoom(roomId);
  };

  const handleCreateRoom = () => {
    if (roomName.trim()) {
      onCreateRoom(roomName, isPrivate);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Study Together</h2>
              <p className="text-purple-100">Join or create a collaborative study room</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                activeTab === 'join'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Users className="h-5 w-5 mx-auto mb-1" />
              Join Room
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                activeTab === 'create'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Plus className="h-5 w-5 mx-auto mb-1" />
              Create Room
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'join' && (
            <div className="space-y-6">
              {/* Quick Join */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Quick Join</h3>
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    placeholder="Enter room ID"
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => handleJoinRoom(roomId)}
                    disabled={!roomId.trim()}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                  >
                    Join
                  </button>
                </div>
              </div>

              {/* Active Rooms */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Active Rooms</h3>
                <div className="space-y-3">
                  {activeRooms.map((room) => (
                    <div key={room.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                          {room.isPrivate ? (
                            <Lock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          ) : (
                            <Globe className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{room.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {room.participants} participants • {room.isPrivate ? 'Private' : 'Public'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleJoinRoom(room.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                      >
                        Join
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Create New Room</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Room Name
                    </label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="Enter room name"
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="private-room"
                      checked={isPrivate}
                      onChange={(e) => setIsPrivate(e.target.checked)}
                      className="w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500"
                    />
                    <label htmlFor="private-room" className="text-sm text-gray-700 dark:text-gray-300">
                      Make room private (requires invitation)
                    </label>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Room Features:</h4>
                    <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                      <li>• Video calling with up to 8 participants</li>
                      <li>• Synchronized YouTube video watching</li>
                      <li>• Real-time chat and screen sharing</li>
                      <li>• Shared flashcard sessions</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    disabled={!roomName.trim()}
                    className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-lg transition-all duration-200 font-medium"
                  >
                    <Video className="h-5 w-5 mr-2 inline" />
                    Create & Join Room
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyRoomLobby;
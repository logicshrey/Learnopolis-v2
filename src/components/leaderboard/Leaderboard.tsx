import React from 'react';
import { User } from '@/types';

interface LeaderboardProps {
  users: User[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.points - a.points);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Global Leaderboard</h2>
      <div className="space-y-4">
        {sortedUsers.map((user, index) => (
          <div
            key={user.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <span className={`text-lg font-bold ${
                index === 0 ? 'text-yellow-500' :
                index === 1 ? 'text-gray-400' :
                index === 2 ? 'text-amber-600' :
                'text-gray-600'
              }`}>
                #{index + 1}
              </span>
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-500">Level {user.level}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-indigo-600">{user.points} pts</p>
              <div className="flex space-x-1">
                {user.badges.slice(0, 3).map((badge) => (
                  <img
                    key={badge.id}
                    src={badge.image}
                    alt={badge.name}
                    className="w-6 h-6"
                    title={badge.name}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard; 
import { Achievement } from '@/types/Achievement';

interface AchievementsListProps {
  achievements: Achievement[];
}

export default function AchievementsList({ achievements }: AchievementsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Achievements</h2>
      
      {achievements.length > 0 ? (
        <div className="space-y-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex items-start p-4 bg-indigo-50 rounded-lg"
            >
              <div className="flex-shrink-0">
                {achievement.type === 'level_up' && (
                  <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                )}
                {achievement.type === 'course_complete' && (
                  <div className="w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-900">
                  {achievement.title}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {achievement.description}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No achievements yet. Keep learning to earn badges!
        </div>
      )}
    </div>
  );
} 
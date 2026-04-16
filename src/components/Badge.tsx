
import { Badge as BadgeType } from '../types';
import { useStore } from '../hooks/useStore';

interface BadgeProps {
  badge: BadgeType;
}

const Badge = ({ badge }: BadgeProps) => {
  const isBadgeUnlocked = useStore(state => state.isBadgeUnlocked);
  const unlocked = isBadgeUnlocked(badge.id);

  const categoryColors = {
    '学习': 'from-blue-500 to-blue-600',
    '练习': 'from-green-500 to-green-600',
    '测评': 'from-purple-500 to-purple-600',
    '终极': 'from-amber-500 to-orange-600'
  };

  return (
    <div className={`relative group ${unlocked ? '' : 'opacity-50 grayscale'}`}>
      <div className={`p-6 rounded-2xl ${unlocked ? 'bg-gradient-to-br from-white to-gray-50' : 'bg-gray-100'} shadow-lg border-2 ${unlocked ? `border-transparent bg-clip-padding bg-gradient-to-br ${categoryColors[badge.category as keyof typeof categoryColors]}` : 'border-gray-200'} transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center text-5xl ${unlocked ? `bg-gradient-to-br ${categoryColors[badge.category as keyof typeof categoryColors]}` : 'bg-gray-300'} shadow-lg`}>
          {badge.icon}
        </div>
        
        <h3 className="text-lg font-bold text-center text-gray-800 mb-2">
          {badge.name}
        </h3>
        
        <p className="text-sm text-gray-600 text-center mb-3">
          {badge.description}
        </p>
        
        <div className="flex items-center justify-center gap-1 text-amber-500">
          <span className="text-lg">⭐</span>
          <span className="font-bold">{badge.pointsReward}</span>
        </div>

        <div className="mt-3 text-xs text-gray-500 text-center">
          {badge.requirement}
        </div>

        {unlocked && (
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-white text-lg">✓</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Badge;


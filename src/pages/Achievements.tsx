
import { Trophy, Users, TrendingUp, Award, Star, BookOpen } from 'lucide-react';
import Badge from '../components/Badge';
import { useStore } from '../hooks/useStore';

const Achievements = () => {
  const allBadges = useStore(state => state.allBadges);
  const achievements = useStore(state => state.achievements);
  const user = useStore(state => state.user);
  const courses = useStore(state => state.courses);
  const courseProgress = useStore(state => state.courseProgress);
  const completedExercises = useStore(state => state.completedExercises);

  const unlockedBadgeIds = achievements.map(a => a.badgeId);
  const unlockedCount = unlockedBadgeIds.length;
  const totalCount = allBadges.length;

  const mockLeaderboard = [
    { name: '数据分析达人', avatar: '👨‍💼', points: 2850 },
    { name: 'Python高手', avatar: '👩‍💻', points: 2450 },
    { name: user.name, avatar: user.avatar, points: user.totalPoints },
    { name: '学习之星', avatar: '🧑‍🎓', points: 1200 },
    { name: '新手学习者', avatar: '👨‍🎓', points: 580 },
  ].sort((a, b) => b.points - a.points);

  const userRank = mockLeaderboard.findIndex(u => u.name === user.name) + 1;

  const stats = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      label: '完成课程',
      value: courseProgress.filter(p => p.completed).length,
      total: courses.length,
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      label: '完成练习',
      value: completedExercises.length,
      total: courses.reduce((sum, c) => sum + c.chapters.reduce((s, ch) => s + ch.exercises.length, 0), 0),
      color: 'from-green-500 to-green-600'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      label: '获得徽章',
      value: unlockedCount,
      total: totalCount,
      color: 'from-amber-500 to-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Trophy className="w-20 h-20 mx-auto mb-6 text-amber-200" />
            <h1 className="text-5xl font-bold mb-4">成就系统</h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              完成学习任务，解锁专属徽章，获得积分奖励
            </p>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center text-white mb-4`}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                  <span className="text-lg text-gray-400">/{stat.total}</span>
                </h3>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Badges */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">徽章墙</h2>
                  <p className="text-gray-600">
                    已解锁 {unlockedCount}/{totalCount} 枚徽章
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {allBadges.map((badge) => (
                  <Badge key={badge.id} badge={badge} />
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">排行榜</h2>
                <Users className="w-6 h-6 text-blue-500" />
              </div>

              <div className="space-y-4">
                {mockLeaderboard.map((user, index) => {
                  const isCurrentUser = user.name === '学习者';
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        isCurrentUser
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                        index === 0
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-white'
                          : index === 1
                          ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
                          : index === 2
                          ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {index + 1}
                      </div>

                      <div className="text-3xl">{user.avatar}</div>

                      <div className="flex-1">
                        <p className={`font-semibold ${isCurrentUser ? 'text-blue-600' : 'text-gray-900'}`}>
                          {user.name}
                          {isCurrentUser && <span className="text-xs text-blue-500 ml-2">(你)</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold">{user.points}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {userRank > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white text-center">
                  <p className="text-sm text-blue-100 mb-1">你的排名</p>
                  <p className="text-3xl font-bold">第 {userRank} 名</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;


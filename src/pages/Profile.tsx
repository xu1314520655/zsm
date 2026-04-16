
import { User, Calendar, Award, TrendingUp, BookOpen, CheckCircle, Clock, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProgressBar from '../components/ProgressBar';
import { useStore } from '../hooks/useStore';

const Profile = () => {
  const user = useStore(state => state.user);
  const courses = useStore(state => state.courses);
  const courseProgress = useStore(state => state.courseProgress);
  const quizScores = useStore(state => state.quizScores);
  const achievements = useStore(state => state.achievements);
  const allBadges = useStore(state => state.allBadges);
  const completedExercises = useStore(state => state.completedExercises);

  const recentScores = quizScores.slice(-5).reverse();
  const totalLessons = courses.reduce((sum, c) => sum + c.chapters.reduce((s, ch) => s + ch.lessons.length, 0), 0);
  const completedLessonsCount = courseProgress.reduce((sum, p) => sum + p.completedLessons.length, 0);

  const stats = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      label: '学习进度',
      value: `${Math.round((completedLessonsCount / totalLessons) * 100)}%`,
      color: 'text-blue-600',
      bg: 'bg-blue-100'
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      label: '完成课程',
      value: courseProgress.filter(p => p.completed).length,
      color: 'text-green-600',
      bg: 'bg-green-100'
    },
    {
      icon: <Award className="w-6 h-6" />,
      label: '获得徽章',
      value: achievements.length,
      color: 'text-amber-600',
      bg: 'bg-amber-100'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: '总积分',
      value: user.totalPoints,
      color: 'text-purple-600',
      bg: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-6xl shadow-2xl">
              {user.avatar}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-blue-200 text-lg">{user.email}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-4">
                <span className="text-amber-300 text-2xl">⭐</span>
                <span className="text-2xl font-bold">{user.totalPoints} 积分</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stats */}
          <div className="lg:col-span-3">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
                  <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color} mb-4`}>
                    {stat.icon}
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Course Progress */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue-500" />
                  学习进度
                </h2>
                <Link
                  to="/courses"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  查看全部 →
                </Link>
              </div>

              <div className="space-y-6">
                {courses.map((course) => {
                  const progress = courseProgress.find(p => p.courseId === course.id);
                  return (
                    <div key={course.id} className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                      <div className="flex items-start gap-4">
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/courses/${course.id}`}
                            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
                          >
                            {course.title}
                          </Link>
                          <p className="text-gray-500 text-sm mt-1">{course.category}</p>
                          <div className="mt-4">
                            {progress ? (
                              <ProgressBar progress={progress.progress} size="sm" color={progress.completed ? 'green' : 'blue'} />
                            ) : (
                              <p className="text-sm text-gray-500">尚未开始学习</p>
                            )}
                          </div>
                        </div>
                        {progress?.completed && (
                          <CheckCircle className="w-8 h-8 text-green-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-1 space-y-8">
            {/* Recent Quiz Scores */}
            {recentScores.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  最近测评
                </h2>
                <div className="space-y-4">
                  {recentScores.map((score) => {
                    const course = courses.find(c => c.id === score.courseId);
                    return (
                      <div key={score.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">{course?.title}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(score.completedAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                        <div className={`px-3 py-1 rounded-lg font-bold ${
                          score.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {Math.round(score.score)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Badges */}
            {achievements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  最近获得
                </h2>
                <div className="space-y-4">
                  {achievements.slice(-3).reverse().map((achievement) => {
                    const badge = allBadges.find(b => b.id === achievement.badgeId);
                    return badge && (
                      <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
                        <div className="text-4xl">{badge.icon}</div>
                        <div>
                          <p className="font-bold text-gray-900">{badge.name}</p>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {new Date(achievement.earnedAt).toLocaleDateString('zh-CN')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <Link
                  to="/achievements"
                  className="mt-6 block text-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  查看全部徽章 →
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


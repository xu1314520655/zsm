
import { Link } from 'react-router-dom';
import { BookOpen, Trophy, TrendingUp, ArrowRight, GraduationCap, CheckCircle } from 'lucide-react';
import CourseCard from '../components/CourseCard';
import Badge from '../components/Badge';
import { useStore } from '../hooks/useStore';

const Home = () => {
  const courses = useStore(state => state.courses);
  const achievements = useStore(state => state.achievements);
  const allBadges = useStore(state => state.allBadges);
  const user = useStore(state => state.user);

  const recentAchievements = achievements.slice(-3).reverse();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-blue-700/50 px-4 py-2 rounded-full text-sm">
                <GraduationCap className="w-5 h-5" />
                <span>专业数据分析学习平台</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                开启你的
                <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  数据分析师
                </span>
                成长之路
              </h1>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                系统化课程体系，互动式学习体验，成就激励系统。从Python基础到机器学习实战，全面提升商业数据分析能力。
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  开始学习
                  <ArrowRight className="w-6 h-6" />
                </Link>
                <Link
                  to="/achievements"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 border border-white/30"
                >
                  查看成就
                  <Trophy className="w-6 h-6" />
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-blue-200 text-sm">专业课程</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">20+</div>
                  <div className="text-blue-200 text-sm">课程章节</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-blue-200 text-sm">成就徽章</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 text-blue-300" />
                    <div className="text-2xl font-bold">{courses.length}</div>
                    <div className="text-blue-200 text-sm">课程总数</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <Trophy className="w-12 h-12 mx-auto mb-3 text-amber-300" />
                    <div className="text-2xl font-bold">{achievements.length}</div>
                    <div className="text-blue-200 text-sm">获得徽章</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-3 text-green-300" />
                    <div className="text-2xl font-bold">{user.totalPoints}</div>
                    <div className="text-blue-200 text-sm">总积分</div>
                  </div>
                  <div className="bg-white/10 rounded-2xl p-6 text-center">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-cyan-300" />
                    <div className="text-2xl font-bold">{Math.round((achievements.length / allBadges.length) * 100)}%</div>
                    <div className="text-blue-200 text-sm">完成度</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">精选课程</h2>
          <p className="text-xl text-gray-600">从基础到进阶，系统化学习数据分析</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
          >
            查看全部课程
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">最近成就</h2>
              <p className="text-xl text-gray-600">继续努力，解锁更多徽章！</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 justify-items-center">
              {recentAchievements.map((achievement) => {
                const badge = allBadges.find(b => b.id === achievement.badgeId);
                return badge && <Badge key={achievement.id} badge={badge} />;
              })}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/achievements"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                查看全部成就
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;


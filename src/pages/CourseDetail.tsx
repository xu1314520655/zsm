
import { useParams, Link } from 'react-router-dom';
import { Clock, BookOpen, ArrowLeft, PlayCircle, CheckCircle, ChevronRight } from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { useStore } from '../hooks/useStore';

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const courses = useStore(state => state.courses);
  const getCourseProgress = useStore(state => state.getCourseProgress);
  const course = courses.find(c => c.id === id);
  const progress = getCourseProgress(id || '');

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">课程未找到</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">返回课程列表</Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    1: 'bg-green-100 text-green-800',
    2: 'bg-yellow-100 text-yellow-800',
    3: 'bg-red-100 text-red-800'
  };

  const difficultyLabels = {
    1: '初级',
    2: '中级',
    3: '高级'
  };

  const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);

  const firstChapter = course.chapters[0];
  const firstLesson = firstChapter?.lessons[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          返回课程列表
        </Link>
      </div>

      {/* Course Header */}
      <section className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${difficultyColors[course.difficulty as keyof typeof difficultyColors]}`}>
                  {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
                </span>
                <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                  {course.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-6">{course.title}</h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">{course.description}</p>

              <div className="flex items-center gap-8 mb-8">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-5 h-5" />
                  <span>{course.duration} 小时</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-5 h-5" />
                  <span>{course.chapters.length} 章节</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-5 h-5" />
                  <span>{totalLessons} 课时</span>
                </div>
              </div>

              {progress && (
                <div className="mb-8">
                  <ProgressBar progress={progress.progress} size="lg" color={progress.completed ? 'green' : 'blue'} />
                </div>
              )}

              {firstChapter && firstLesson && (
                <Link
                  to={`/learn/${course.id}/${firstChapter.id}`}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <PlayCircle className="w-6 h-6" />
                  {progress ? '继续学习' : '开始学习'}
                </Link>
              )}
            </div>

            <div>
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={course.coverImage}
                  alt={course.title}
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">课程章节</h2>

          <div className="space-y-4">
            {course.chapters.map((chapter, index) => {
              const isChapterStarted = progress?.completedLessons.some(lessonId =>
                chapter.lessons.some(lesson => lesson.id === lessonId)
              );
              const chapterLessonsCompleted = chapter.lessons.filter(lesson =>
                progress?.completedLessons.includes(lesson.id)
              ).length;

              return (
                <div key={chapter.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${isChapterStarted ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{chapter.title}</h3>
                          <p className="text-sm text-gray-500">
                            {chapter.lessons.length} 课时 · {chapterLessonsCompleted}/{chapter.lessons.length} 已完成
                          </p>
                        </div>
                      </div>
                      {chapterLessonsCompleted === chapter.lessons.length && progress && (
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      )}
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="space-y-2">
                      {chapter.lessons.map((lesson) => {
                        const isCompleted = progress?.completedLessons.includes(lesson.id);
                        return (
                          <Link
                            key={lesson.id}
                            to={`/learn/${course.id}/${chapter.id}`}
                            className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors group"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}>
                                {isCompleted ? (
                                  <CheckCircle className="w-4 h-4 text-white" />
                                ) : (
                                  <PlayCircle className="w-4 h-4 text-gray-400" />
                                )}
                              </div>
                              <span className={`font-medium ${isCompleted ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                                {lesson.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="w-4 h-4" />
                              <span>{lesson.duration} 分钟</span>
                              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>

                    {chapter.exercises.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">章节练习</h4>
                        <p className="text-sm text-gray-500">{chapter.exercises.length} 道练习题</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quiz Section */}
          <div className="mt-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">课程测评</h3>
                <p className="text-purple-100">完成综合测试，检验你的学习成果</p>
                <p className="text-purple-200 text-sm mt-2">
                  满分 {course.quiz.totalPoints} 分 · 合格 {course.quiz.passingScore} 分
                </p>
              </div>
              <Link
                to={`/quiz/${course.id}`}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold hover:bg-purple-50 transition-colors shadow-lg"
              >
                开始测评
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CourseDetail;


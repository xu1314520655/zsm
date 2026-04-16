
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, BookOpen, Check, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const Learn = () => {
  const { courseId, chapterId } = useParams<{ courseId: string; chapterId: string }>();
  const navigate = useNavigate();
  const courses = useStore(state => state.courses);
  const markLessonComplete = useStore(state => state.markLessonComplete);
  const markExerciseComplete = useStore(state => state.markExerciseComplete);
  const checkAndUnlockBadges = useStore(state => state.checkAndUnlockBadges);
  const completedExercises = useStore(state => state.completedExercises);
  const courseProgress = useStore(state => state.getCourseProgress(courseId || ''));

  const course = courses.find(c => c.id === courseId);
  const chapter = course?.chapters.find(ch => ch.id === chapterId);

  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [showExercises, setShowExercises] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    checkAndUnlockBadges();
  }, [checkAndUnlockBadges]);

  if (!course || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">内容未找到</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">返回课程列表</Link>
        </div>
      </div>
    );
  }

  const currentLesson = chapter.lessons[currentLessonIndex];

  const handleLessonComplete = () => {
    if (currentLesson) {
      markLessonComplete(course.id, currentLesson.id);
    }
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < chapter.lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
    } else {
      setShowExercises(true);
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
    }
  };

  const handleExerciseAnswer = (exerciseId: string, answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: answer }));
  };

  const handleSubmitExercises = () => {
    setShowResults(true);
    chapter.exercises.forEach(exercise => {
      if (selectedAnswers[exercise.id] === exercise.correctAnswer) {
        markExerciseComplete(exercise.id, exercise.points);
      }
    });
    checkAndUnlockBadges();
  };

  const isLessonCompleted = courseProgress?.completedLessons.includes(currentLesson?.id || '');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              返回课程
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-500">{chapter.title}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showExercises ? (
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar - Lesson List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  课程内容
                </h3>
                <div className="space-y-2">
                  {chapter.lessons.map((lesson, index) => {
                    const isCompleted = courseProgress?.completedLessons.includes(lesson.id);
                    const isCurrent = index === currentLessonIndex;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setCurrentLessonIndex(index)}
                        className={`w-full text-left p-3 rounded-xl transition-all ${
                          isCurrent
                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                            : isCompleted
                            ? 'bg-green-50 text-green-800 hover:bg-green-100'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </span>
                          )}
                          <span className="font-medium text-sm">{lesson.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {/* Lesson Content */}
                <div className="p-8">
                  <div className="mb-6">
                    <span className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                      第 {currentLessonIndex + 1} 课 / 共 {chapter.lessons.length} 课
                    </span>
                  </div>
                  
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">{currentLesson.title}</h2>
                  
                  <div className="prose prose-lg max-w-none">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
                      <p className="text-gray-700 leading-relaxed text-lg">{currentLesson.content}</p>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900">学习要点</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">理解核心概念</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">掌握实践技能</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">完成课后练习</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="border-t border-gray-100 p-6 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={handlePrevLesson}
                      disabled={currentLessonIndex === 0}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        currentLessonIndex === 0
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                      }`}
                    >
                      <ChevronLeft className="w-5 h-5" />
                      上一课
                    </button>

                    {!isLessonCompleted && (
                      <button
                        onClick={handleLessonComplete}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                      >
                        <CheckCircle className="w-5 h-5" />
                        标记完成
                      </button>
                    )}

                    <button
                      onClick={handleNextLesson}
                      className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
                    >
                      {currentLessonIndex < chapter.lessons.length - 1 ? '下一课' : '开始练习'}
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Exercises Section */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-8 border-b border-gray-100">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">章节练习</h2>
                <p className="text-gray-600">完成以下练习，巩固所学知识</p>
              </div>

              <div className="p-8 space-y-8">
                {chapter.exercises.map((exercise, index) => {
                  const isCompleted = completedExercises.includes(exercise.id);
                  const selectedAnswer = selectedAnswers[exercise.id];
                  const isCorrect = selectedAnswer === exercise.correctAnswer;

                  return (
                    <div key={exercise.id} className="border border-gray-200 rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg font-semibold text-gray-900 mb-2">{exercise.question}</p>
                          <p className="text-sm text-amber-600 font-medium">+{exercise.points} 分</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {exercise.options.map((option, optIndex) => {
                          let optionClass = 'border-2 p-4 rounded-xl cursor-pointer transition-all hover:border-blue-300';
                          
                          if (showResults) {
                            if (option === exercise.correctAnswer) {
                              optionClass += ' border-green-500 bg-green-50';
                            } else if (selectedAnswer === option && !isCorrect) {
                              optionClass += ' border-red-500 bg-red-50';
                            } else {
                              optionClass += ' border-gray-200 opacity-50';
                            }
                          } else if (selectedAnswer === option) {
                            optionClass += ' border-blue-500 bg-blue-50';
                          } else {
                            optionClass += ' border-gray-200';
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => !showResults && !isCompleted && handleExerciseAnswer(exercise.id, option)}
                              disabled={showResults || isCompleted}
                              className={optionClass}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                  showResults
                                    ? option === exercise.correctAnswer
                                      ? 'bg-green-500 border-green-500'
                                      : selectedAnswer === option
                                      ? 'bg-red-500 border-red-500'
                                      : 'border-gray-300'
                                    : selectedAnswer === option
                                    ? 'bg-blue-500 border-blue-500'
                                    : 'border-gray-300'
                                }`}>
                                  {(showResults && option === exercise.correctAnswer) || selectedAnswer === option ? (
                                    <Check className="w-4 h-4 text-white" />
                                  ) : null}
                                </div>
                                <span className={`text-left ${showResults && option === exercise.correctAnswer ? 'font-bold text-green-800' : ''}`}>
                                  {option}
                                </span>
                                {showResults && option === exercise.correctAnswer && (
                                  <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                                )}
                                {showResults && selectedAnswer === option && !isCorrect && (
                                  <X className="w-5 h-5 text-red-500 ml-auto" />
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {showResults && (
                        <div className={`mt-4 p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                          <p className="font-medium text-gray-900 mb-1">答案解析：</p>
                          <p className="text-gray-700">{exercise.explanation}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!showResults && (
                <div className="p-8 border-t border-gray-100 bg-gray-50">
                  <button
                    onClick={handleSubmitExercises}
                    disabled={Object.keys(selectedAnswers).length !== chapter.exercises.length}
                    className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                      Object.keys(selectedAnswers).length === chapter.exercises.length
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    提交答案
                  </button>
                </div>
              )}

              {showResults && (
                <div className="p-8 border-t border-gray-100 bg-gray-50">
                  <Link
                    to={`/courses/${course.id}`}
                    className="w-full py-4 rounded-xl font-semibold text-lg bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    返回课程
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn;


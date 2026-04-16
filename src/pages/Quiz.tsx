
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, X, Award, RotateCcw, Trophy } from 'lucide-react';
import { useStore } from '../hooks/useStore';

const Quiz = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const courses = useStore(state => state.courses);
  const addQuizScore = useStore(state => state.addQuizScore);
  const checkAndUnlockBadges = useStore(state => state.checkAndUnlockBadges);
  const quizScores = useStore(state => state.quizScores);

  const course = courses.find(c => c.id === courseId);
  const quiz = course?.quiz;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    checkAndUnlockBadges();
  }, [checkAndUnlockBadges]);

  if (!course || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">测评未找到</h2>
          <Link to="/courses" className="text-blue-600 hover:underline">返回课程列表</Link>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const previousAttempt = quizScores.find(s => s.quizId === quiz.id && s.courseId === courseId);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    let totalScore = 0;
    quiz.questions.forEach(question => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        totalScore += question.points;
      }
    });
    
    const percentage = (totalScore / quiz.totalPoints) * 100;
    const passed = percentage >= quiz.passingScore;
    
    setScore(percentage);
    setShowResults(true);
    addQuizScore(quiz.id, course.id, percentage, passed);
    checkAndUnlockBadges();
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to={`/courses/${course.id}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              返回课程
            </Link>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-500">{course.title}</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showResults ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* Progress Bar */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  第 {currentQuestionIndex + 1} 题 / 共 {quiz.questions.length} 题
                </span>
                <span className="text-sm text-blue-600 font-medium">
                  已答 {answeredCount}/{quiz.questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Question */}
            <div className="p-8">
              <div className="flex items-start gap-4 mb-8">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl">
                  {currentQuestionIndex + 1}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentQuestion.question}</h2>
                  <p className="text-amber-600 font-medium">{currentQuestion.points} 分</p>
                </div>
              </div>

              <div className="space-y-4">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === option;
                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(option)}
                      className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                        </div>
                        <span className="text-lg font-medium text-gray-900">{option}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation */}
            <div className="p-6 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    currentQuestionIndex === 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  上一题
                </button>

                {currentQuestionIndex < quiz.questions.length - 1 ? (
                  <button
                    onClick={handleNextQuestion}
                    disabled={!selectedAnswers[currentQuestion.id]}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                      selectedAnswers[currentQuestion.id]
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    下一题
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={answeredCount < quiz.questions.length}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all ${
                      answeredCount === quiz.questions.length
                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle className="w-5 h-5" />
                    提交测评
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-8 text-center border-b border-gray-100">
              <div className={`w-32 h-32 mx-auto mb-6 rounded-full flex items-center justify-center ${
                score >= quiz.passingScore
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}>
                {score >= quiz.passingScore ? (
                  <Trophy className="w-16 h-16 text-white" />
                ) : (
                  <X className="w-16 h-16 text-white" />
                )}
              </div>
              
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {score >= quiz.passingScore ? '恭喜通过！' : '再接再厉'}
              </h2>
              <p className="text-xl text-gray-600 mb-6">
                {score >= quiz.passingScore
                  ? '你已成功完成课程测评'
                  : '没有通过，再试一次吧！'}
              </p>

              <div className="inline-block bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 mb-6">
                <div className="text-6xl font-bold text-blue-600 mb-2">{Math.round(score)}%</div>
                <div className="text-gray-600">
                  合格线: {quiz.passingScore}%
                </div>
              </div>

              {score >= quiz.passingScore && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 inline-flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-500" />
                  <span className="font-semibold text-amber-800">+100 积分已到账！</span>
                </div>
              )}
            </div>

            <div className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">答题回顾</h3>
              
              <div className="space-y-6">
                {quiz.questions.map((question, index) => {
                  const selectedAnswer = selectedAnswers[question.id];
                  const isCorrect = selectedAnswer === question.correctAnswer;

                  return (
                    <div
                      key={question.id}
                      className={`border-2 rounded-xl p-6 ${
                        isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          isCorrect ? 'bg-green-500' : 'bg-red-500'
                        }`}>
                          {isCorrect ? (
                            <CheckCircle className="w-6 h-6 text-white" />
                          ) : (
                            <X className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">
                            {index + 1}. {question.question}
                          </p>
                          <p className="text-sm text-gray-500">{question.points} 分</p>
                        </div>
                      </div>

                      <div className="space-y-2 ml-14">
                        {question.options.map((option, optIndex) => {
                          let optionClass = 'p-3 rounded-lg';
                          if (option === question.correctAnswer) {
                            optionClass += ' bg-green-200 border-2 border-green-400';
                          } else if (selectedAnswer === option && !isCorrect) {
                            optionClass += ' bg-red-200 border-2 border-red-400';
                          } else {
                            optionClass += ' bg-white border border-gray-200';
                          }

                          return (
                            <div key={optIndex} className={optionClass}>
                              <div className="flex items-center gap-3">
                                <span className="text-gray-700">{option}</span>
                                {option === question.correctAnswer && (
                                  <span className="text-green-700 font-medium text-sm">正确答案</span>
                                )}
                                {selectedAnswer === option && !isCorrect && (
                                  <span className="text-red-700 font-medium text-sm">你的答案</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-8 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleRetakeQuiz}
                className="flex items-center justify-center gap-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 shadow transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                重新测试
              </button>
              <Link
                to={`/courses/${course.id}`}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 shadow-lg transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                返回课程
              </Link>
            </div>
          </div>
        )}

        {/* Previous Attempts */}
        {previousAttempt && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">历史记录</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-gray-900">
                  {new Date(previousAttempt.completedAt).toLocaleDateString('zh-CN')}
                </p>
                <p className="text-sm text-gray-500">
                  成绩: {Math.round(previousAttempt.score)}%
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                previousAttempt.passed
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {previousAttempt.passed ? '已通过' : '未通过'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;


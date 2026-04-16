
import { Link } from 'react-router-dom';
import { Clock, Star, BookOpen } from 'lucide-react';
import { Course } from '../types';
import { useStore } from '../hooks/useStore';
import ProgressBar from './ProgressBar';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const getCourseProgress = useStore(state => state.getCourseProgress);
  const progress = getCourseProgress(course.id);

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

  return (
    <Link to={`/courses/${course.id}`}>
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group">
        <div className="relative h-48 overflow-hidden">
          <img
            src={course.coverImage}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4">
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[course.difficulty as keyof typeof difficultyColors]}`}>
              {difficultyLabels[course.difficulty as keyof typeof difficultyLabels]}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded">
              {course.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration} 小时</span>
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              <span>{course.chapters.length} 章节</span>
            </div>
          </div>

          {progress && (
            <div className="mb-4">
              <ProgressBar progress={progress.progress} size="sm" color={progress.completed ? 'green' : 'blue'} />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all">
              {progress?.completed ? '已完成' : '开始学习'}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;


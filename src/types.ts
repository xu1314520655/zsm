
export interface User {
  id: string;
  name: string;
  email: string;
  totalPoints: number;
  avatar: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  duration: number;
  coverImage: string;
  chapters: Chapter[];
  quiz: Quiz;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  order: number;
  lessons: Lesson[];
  exercises: Exercise[];
}

export interface Lesson {
  id: string;
  chapterId: string;
  title: string;
  content: string;
  type: 'video' | 'text';
  duration: number;
}

export interface Exercise {
  id: string;
  chapterId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  points: number;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  totalPoints: number;
  passingScore: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  points: number;
}

export interface CourseProgress {
  id: string;
  userId: string;
  courseId: string;
  completedLessons: string[];
  completedExercises: string[];
  progress: number;
  completed: boolean;
}

export interface Achievement {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  pointsReward: number;
  requirement: string;
}

export interface QuizScore {
  id: string;
  userId: string;
  quizId: string;
  courseId: string;
  score: number;
  completedAt: string;
  passed: boolean;
}


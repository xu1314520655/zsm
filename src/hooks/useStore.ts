
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  User, 
  Course, 
  CourseProgress, 
  Achievement, 
  Badge, 
  QuizScore 
} from '../types';
import { courses, badges } from '../utils/data';

interface StoreState {
  user: User;
  courses: Course[];
  courseProgress: CourseProgress[];
  achievements: Achievement[];
  allBadges: Badge[];
  quizScores: QuizScore[];
  completedExercises: string[];
  
  setUser: (user: User) => void;
  addPoints: (points: number) => void;
  markLessonComplete: (courseId: string, lessonId: string) => void;
  markExerciseComplete: (exerciseId: string, points: number) => void;
  addQuizScore: (quizId: string, courseId: string, score: number, passed: boolean) => void;
  unlockBadge: (badgeId: string) => void;
  checkAndUnlockBadges: () => void;
  getCourseProgress: (courseId: string) => CourseProgress | undefined;
  isBadgeUnlocked: (badgeId: string) => boolean;
}

const initialUser: User = {
  id: 'user-1',
  name: '学习者',
  email: 'student@example.com',
  totalPoints: 0,
  avatar: '👨‍🎓'
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: initialUser,
      courses: courses,
      courseProgress: [],
      achievements: [],
      allBadges: badges,
      quizScores: [],
      completedExercises: [],

      setUser: (user: User) => set({ user }),

      addPoints: (points: number) => set((state) => ({
        user: { ...state.user, totalPoints: state.user.totalPoints + points }
      })),

      markLessonComplete: (courseId: string, lessonId: string) => set((state) => {
        const course = state.courses.find(c => c.id === courseId);
        if (!course) return state;

        const totalLessons = course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0);
        
        let progress = state.courseProgress.find(p => p.courseId === courseId);
        let updatedProgress;

        if (!progress) {
          updatedProgress = {
            id: `progress-${courseId}`,
            userId: state.user.id,
            courseId,
            completedLessons: [lessonId],
            completedExercises: [],
            progress: (1 / totalLessons) * 100,
            completed: false
          };
        } else {
          if (progress.completedLessons.includes(lessonId)) return state;
          const newCompletedLessons = [...progress.completedLessons, lessonId];
          updatedProgress = {
            ...progress,
            completedLessons: newCompletedLessons,
            progress: (newCompletedLessons.length / totalLessons) * 100,
            completed: newCompletedLessons.length === totalLessons
          };
        }

        const newProgressList = progress 
          ? state.courseProgress.map(p => p.courseId === courseId ? updatedProgress : p)
          : [...state.courseProgress, updatedProgress];

        return { courseProgress: newProgressList };
      }),

      markExerciseComplete: (exerciseId: string, points: number) => set((state) => {
        if (state.completedExercises.includes(exerciseId)) return state;
        
        get().addPoints(points);
        
        return {
          completedExercises: [...state.completedExercises, exerciseId]
        };
      }),

      addQuizScore: (quizId: string, courseId: string, score: number, passed: boolean) => set((state) => {
        const newScore: QuizScore = {
          id: `score-${Date.now()}`,
          userId: state.user.id,
          quizId,
          courseId,
          score,
          completedAt: new Date().toISOString(),
          passed
        };

        if (passed) {
          get().addPoints(100);
        }

        return {
          quizScores: [...state.quizScores, newScore]
        };
      }),

      unlockBadge: (badgeId: string) => set((state) => {
        if (state.achievements.some(a => a.badgeId === badgeId)) return state;

        const badge = state.allBadges.find(b => b.id === badgeId);
        if (!badge) return state;

        get().addPoints(badge.pointsReward);

        const newAchievement: Achievement = {
          id: `achievement-${Date.now()}`,
          userId: state.user.id,
          badgeId,
          earnedAt: new Date().toISOString()
        };

        return {
          achievements: [...state.achievements, newAchievement]
        };
      }),

      checkAndUnlockBadges: () => {
        const state = get();
        
        const completedFirstChapter = state.courseProgress.some(p => p.completedLessons.length > 0);
        if (completedFirstChapter) {
          state.unlockBadge('badge-1');
        }

        if (state.completedExercises.length >= 10) {
          state.unlockBadge('badge-2');
        }

        if (state.quizScores.some(s => s.passed)) {
          state.unlockBadge('badge-3');
        }

        if (state.courseProgress.some(p => p.completed)) {
          state.unlockBadge('badge-4');
        }

        if (state.courseProgress.filter(p => p.completed).length >= 5) {
          state.unlockBadge('badge-5');
        }
      },

      getCourseProgress: (courseId: string) => {
        return get().courseProgress.find(p => p.courseId === courseId);
      },

      isBadgeUnlocked: (badgeId: string) => {
        return get().achievements.some(a => a.badgeId === badgeId);
      }
    }),
    {
      name: 'data-analytics-platform-storage'
    }
  )
);


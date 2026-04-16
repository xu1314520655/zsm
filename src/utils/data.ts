
import { Course, Badge } from '../types';

export const courses: Course[] = [
  {
    id: 'course-1',
    title: 'Python数据分析基础',
    description: '从零开始学习Python编程，掌握NumPy、Pandas等核心数据分析库',
    category: '基础课程',
    difficulty: 1,
    duration: 20,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=python%20programming%20data%20analysis%20code%20screen&image_size=square',
    chapters: [
      {
        id: 'chapter-1-1',
        courseId: 'course-1',
        title: 'Python入门基础',
        order: 1,
        lessons: [
          {
            id: 'lesson-1-1-1',
            chapterId: 'chapter-1-1',
            title: 'Python环境搭建',
            content: '学习如何安装Python和配置开发环境，包括Anaconda和Jupyter Notebook的使用。',
            type: 'text',
            duration: 15
          },
          {
            id: 'lesson-1-1-2',
            chapterId: 'chapter-1-1',
            title: '变量与数据类型',
            content: '掌握Python的基本数据类型：整数、浮点数、字符串、列表、字典等。',
            type: 'text',
            duration: 20
          }
        ],
        exercises: [
          {
            id: 'exercise-1-1-1',
            chapterId: 'chapter-1-1',
            question: 'Python中用于表示整数的数据类型是？',
            options: ['float', 'int', 'str', 'list'],
            correctAnswer: 'int',
            explanation: 'int是Python中用于表示整数的数据类型。',
            points: 10
          }
        ]
      },
      {
        id: 'chapter-1-2',
        courseId: 'course-1',
        title: 'NumPy基础',
        order: 2,
        lessons: [
          {
            id: 'lesson-1-2-1',
            chapterId: 'chapter-1-2',
            title: 'NumPy数组创建',
            content: '学习如何创建和操作NumPy数组，这是数据分析的基础。',
            type: 'text',
            duration: 25
          }
        ],
        exercises: [
          {
            id: 'exercise-1-2-1',
            chapterId: 'chapter-1-2',
            question: 'NumPy数组的主要优势是？',
            options: ['更美观', '内存效率更高且运算更快', '支持更多数据类型', '可以存储图片'],
            correctAnswer: '内存效率更高且运算更快',
            explanation: 'NumPy数组在内存使用和运算速度上都优于Python列表。',
            points: 15
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-1',
      courseId: 'course-1',
      title: 'Python数据分析基础综合测试',
      questions: [
        {
          id: 'q1',
          question: 'Pandas中用于处理表格数据的主要数据结构是？',
          options: ['Array', 'DataFrame', 'List', 'Dictionary'],
          correctAnswer: 'DataFrame',
          points: 20
        },
        {
          id: 'q2',
          question: '以下哪个不是Python的数据类型？',
          options: ['int', 'string', 'boolean', 'float'],
          correctAnswer: 'boolean',
          points: 20
        }
      ],
      totalPoints: 100,
      passingScore: 60
    }
  },
  {
    id: 'course-2',
    title: '商业数据可视化',
    description: '使用Matplotlib和Seaborn创建专业的商业数据可视化图表',
    category: '进阶课程',
    difficulty: 2,
    duration: 15,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=data%20visualization%20charts%20business%20analytics&image_size=square',
    chapters: [
      {
        id: 'chapter-2-1',
        courseId: 'course-2',
        title: 'Matplotlib入门',
        order: 1,
        lessons: [
          {
            id: 'lesson-2-1-1',
            chapterId: 'chapter-2-1',
            title: '基础图表绘制',
            content: '学习使用Matplotlib创建折线图、柱状图、饼图等基础图表。',
            type: 'text',
            duration: 30
          }
        ],
        exercises: [
          {
            id: 'exercise-2-1-1',
            chapterId: 'chapter-2-1',
            question: '适合展示趋势变化的图表类型是？',
            options: ['饼图', '折线图', '散点图', '直方图'],
            correctAnswer: '折线图',
            explanation: '折线图最适合展示数据随时间的变化趋势。',
            points: 10
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-2',
      courseId: 'course-2',
      title: '商业数据可视化综合测试',
      questions: [
        {
          id: 'q1',
          question: 'Seaborn是基于哪个库构建的？',
          options: ['Plotly', 'Matplotlib', 'Bokeh', 'ggplot'],
          correctAnswer: 'Matplotlib',
          points: 25
        }
      ],
      totalPoints: 100,
      passingScore: 60
    }
  },
  {
    id: 'course-3',
    title: '统计分析与应用',
    description: '学习描述统计、推论统计、假设检验等核心统计知识',
    category: '进阶课程',
    difficulty: 2,
    duration: 25,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=statistics%20charts%20probability%20analysis&image_size=square',
    chapters: [
      {
        id: 'chapter-3-1',
        courseId: 'course-3',
        title: '描述统计',
        order: 1,
        lessons: [
          {
            id: 'lesson-3-1-1',
            chapterId: 'chapter-3-1',
            title: '集中趋势与离散程度',
            content: '学习均值、中位数、众数、方差、标准差等统计指标。',
            type: 'text',
            duration: 40
          }
        ],
        exercises: [
          {
            id: 'exercise-3-1-1',
            chapterId: 'chapter-3-1',
            question: '不受极端值影响的集中趋势指标是？',
            options: ['均值', '中位数', '众数', '方差'],
            correctAnswer: '中位数',
            explanation: '中位数是位置平均数，不受极端值的影响。',
            points: 15
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-3',
      courseId: 'course-3',
      title: '统计分析综合测试',
      questions: [
        {
          id: 'q1',
          question: 'p值小于0.05通常表示？',
          options: ['结果不显著', '结果显著', '数据有错误', '需要更多数据'],
          correctAnswer: '结果显著',
          points: 25
        }
      ],
      totalPoints: 100,
      passingScore: 60
    }
  },
  {
    id: 'course-4',
    title: '机器学习入门',
    description: '了解机器学习基本概念，学习scikit-learn进行预测建模',
    category: '高级课程',
    difficulty: 3,
    duration: 30,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=machine%20learning%20neural%20networks%20artificial%20intelligence&image_size=square',
    chapters: [
      {
        id: 'chapter-4-1',
        courseId: 'course-4',
        title: '机器学习概述',
        order: 1,
        lessons: [
          {
            id: 'lesson-4-1-1',
            chapterId: 'chapter-4-1',
            title: '什么是机器学习',
            content: '了解机器学习的定义、分类和应用场景。',
            type: 'text',
            duration: 35
          }
        ],
        exercises: [
          {
            id: 'exercise-4-1-1',
            chapterId: 'chapter-4-1',
            question: '以下哪个属于监督学习？',
            options: ['聚类', '分类', '降维', '关联规则'],
            correctAnswer: '分类',
            explanation: '分类是有标签的监督学习任务。',
            points: 20
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-4',
      courseId: 'course-4',
      title: '机器学习入门综合测试',
      questions: [
        {
          id: 'q1',
          question: '用于评估分类模型性能的指标是？',
          options: ['R平方', '准确率', '均方误差', '平均绝对误差'],
          correctAnswer: '准确率',
          points: 25
        }
      ],
      totalPoints: 100,
      passingScore: 60
    }
  },
  {
    id: 'course-5',
    title: '数据分析实战项目',
    description: '通过真实商业案例，综合运用所学知识完成数据分析项目',
    category: '实战项目',
    difficulty: 3,
    duration: 40,
    coverImage: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=business%20analytics%20project%20dashboard%20report&image_size=square',
    chapters: [
      {
        id: 'chapter-5-1',
        courseId: 'course-5',
        title: '项目流程与方法论',
        order: 1,
        lessons: [
          {
            id: 'lesson-5-1-1',
            chapterId: 'chapter-5-1',
            title: 'CRISP-DM方法论',
            content: '学习跨行业数据挖掘标准流程，掌握完整的项目生命周期。',
            type: 'text',
            duration: 45
          }
        ],
        exercises: [
          {
            id: 'exercise-5-1-1',
            chapterId: 'chapter-5-1',
            question: 'CRISP-DM的第一步是？',
            options: ['数据准备', '商业理解', '建模', '评估'],
            correctAnswer: '商业理解',
            explanation: 'CRISP-DM从商业理解开始，明确项目目标。',
            points: 20
          }
        ]
      }
    ],
    quiz: {
      id: 'quiz-5',
      courseId: 'course-5',
      title: '数据分析实战综合测试',
      questions: [
        {
          id: 'q1',
          question: '数据可视化在项目中的主要作用是？',
          options: ['美化报告', '展示数据和发现洞见', '替代数据分析', '增加文件大小'],
          correctAnswer: '展示数据和发现洞见',
          points: 25
        }
      ],
      totalPoints: 100,
      passingScore: 60
    }
  }
];

export const badges: Badge[] = [
  {
    id: 'badge-1',
    name: '初学者',
    description: '完成第一个课程章节',
    icon: '🌱',
    category: '学习',
    pointsReward: 50,
    requirement: '完成任意课程的第一个章节'
  },
  {
    id: 'badge-2',
    name: '练习达人',
    description: '完成10道练习题',
    icon: '✏️',
    category: '练习',
    pointsReward: 100,
    requirement: '完成10道练习题'
  },
  {
    id: 'badge-3',
    name: '测评高手',
    description: '首次通过课程测评',
    icon: '🏆',
    category: '测评',
    pointsReward: 150,
    requirement: '通过任意一个课程测评'
  },
  {
    id: 'badge-4',
    name: '课程完成者',
    description: '完成一门完整课程',
    icon: '📚',
    category: '学习',
    pointsReward: 200,
    requirement: '完成任意一门课程的所有章节'
  },
  {
    id: 'badge-5',
    name: '全栈分析师',
    description: '完成所有课程',
    icon: '🎯',
    category: '终极',
    pointsReward: 500,
    requirement: '完成所有5门课程'
  }
];


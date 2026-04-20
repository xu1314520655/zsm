
import { BookOpen, Code, Database, BarChart3, Brain, ArrowRight, FileText, CheckCircle, Play } from 'lucide-react';
import { useState } from 'react';
import CodeEditor from '../components/CodeEditor';
import CodeOutput from '../components/CodeOutput';

interface Project {
  id: number;
  title: string;
  background: string;
  techPoints: string[];
  tasks: string[];
  dataFile: string;
  icon: React.ReactNode;
  level: 'beginner' | 'intermediate' | 'advanced';
  defaultCode: string;
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runCode = async (code: string) => {
    setIsLoading(true);
    setOutput('');
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/run-python', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setOutput(result.output);
      setError(result.error);
    } catch (err) {
      setError('执行代码时发生错误，请检查后端服务是否运行');
    } finally {
      setIsLoading(false);
    }
  };

  const projects: Project[] = [
    {
      id: 1,
      title: '电商订单数据清洗与质量评估',
      background: '某电商平台订单表含缺失值、异常值、重复记录。',
      techPoints: [
        'pd.read_csv() 与参数调优',
        '缺失值识别与处理（isna(), fillna(), dropna()）',
        '异常值检测（IQR规则、业务逻辑阈值）',
        '重复数据去重（duplicated(), drop_duplicates()）',
        '数据类型转换（astype(), pd.to_datetime()）'
      ],
      tasks: [
        '加载数据，输出清洗前后数据质量报告（缺失率、异常值数量）。',
        '清洗后保存为新文件。'
      ],
      dataFile: 'orders.csv',
      icon: <Database className="w-8 h-8" />,
      level: 'beginner',
      defaultCode: `# 加载数据
import pandas as pd
import numpy as np

# 读取数据文件
df = pd.read_csv(data_dir + 'orders.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 检查缺失值
print("\n缺失值情况：")
print(df.isna().sum())

# 检查重复值
print("\n重复值数量：")
print(df.duplicated().sum())

# 数据类型转换
df['order_date'] = pd.to_datetime(df['order_date'])

# 异常值检测（IQR规则）
Q1 = df['amount'].quantile(0.25)
Q3 = df['amount'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df[(df['amount'] < lower_bound) | (df['amount'] > upper_bound)]
print(f"\n异常值数量：{len(outliers)}")
print("异常值详情：")
print(outliers)

# 数据清洗
cleaned_df = df.dropna()
cleaned_df = cleaned_df.drop_duplicates()
cleaned_df = cleaned_df[(cleaned_df['amount'] >= lower_bound) & (cleaned_df['amount'] <= upper_bound)]

print("\n清洗后数据形状：", cleaned_df.shape)
print("清洗后数据基本信息：")
print(cleaned_df.info())`
    },
    {
      id: 2,
      title: '用户行为日志解析与特征工程',
      background: '用户点击流日志（时间戳、URL、用户ID），需提取行为特征。',
      techPoints: [
        '时间序列处理（提取小时、星期、是否为周末）',
        '字符串解析（str.extract() 从URL提取页面类型）',
        '分组聚合（groupby + agg 统计PV/UV）',
        '会话划分（按用户ID + 30分钟无操作切分）'
      ],
      tasks: [
        '构建特征表：每个用户的平均会话时长、深夜访问次数、关键页面访问比例。'
      ],
      dataFile: 'user_logs.csv',
      icon: <FileText className="w-8 h-8" />,
      level: 'beginner',
      defaultCode: `# 用户行为日志分析
import pandas as pd
import numpy as np

# 读取数据文件
df = pd.read_csv(data_dir + 'user_logs.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 时间序列处理
df['timestamp'] = pd.to_datetime(df['timestamp'])
df['hour'] = df['timestamp'].dt.hour
df['day_of_week'] = df['timestamp'].dt.dayofweek
df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
df['is_late_night'] = df['hour'].apply(lambda x: 1 if x >= 22 or x <= 5 else 0)

# 字符串解析：从URL提取页面类型
df['page_type'] = df['url'].str.extract(r'/([^/]+)/', expand=False).fillna('unknown')

# 会话划分（按用户ID + 30分钟无操作切分）
df = df.sort_values(['user_id', 'timestamp'])
df['time_diff'] = df.groupby('user_id')['timestamp'].diff().dt.total_seconds() / 60
df['session_id'] = (df['time_diff'] > 30).cumsum()
df['session_id'] = df['user_id'].astype(str) + '_' + df['session_id'].astype(str)

# 计算会话时长
session_duration = df.groupby('session_id')['timestamp'].agg(['min', 'max'])
session_duration['duration_minutes'] = (session_duration['max'] - session_duration['min']).dt.total_seconds() / 60

# 构建用户特征表
user_features = df.groupby('user_id').agg(
    total_visits=('user_id', 'count'),
    unique_pages=('page_type', 'nunique'),
    late_night_visits=('is_late_night', 'sum'),
    weekend_visits=('is_weekend', 'sum'),
    avg_session_duration=('session_id', lambda x: session_duration.loc[x.unique(), 'duration_minutes'].mean()),
    purchase_page_visits=('page_type', lambda x: (x == 'purchase').sum()),
    product_page_visits=('page_type', lambda x: (x == 'product').sum())
).reset_index()

# 计算关键页面访问比例
user_features['purchase_page_ratio'] = user_features['purchase_page_visits'] / user_features['total_visits']
user_features['product_page_ratio'] = user_features['product_page_visits'] / user_features['total_visits']

print("\n用户特征表：")
print(user_features.head())

print("\n特征表基本信息：")
print(user_features.info())`
    },
    {
      id: 3,
      title: '购物车分析 —— 关联规则挖掘准备',
      background: '交易数据（订单ID，商品名称），需生成频繁项集输入格式。',
      techPoints: [
        'pandas 数据透视（pivot_table 构造0/1矩阵）',
        '事务数据转换为项集列表（groupby + agg(list)）',
        '计算支持度（向量化操作避免循环）',
        '与 mlxtend.frequent_patterns 联动'
      ],
      tasks: [
        '输出每个订单对应的商品列表（逗号分隔）。',
        '生成二元矩阵，计算单项商品支持度，筛选支持度>0.01的商品。'
      ],
      dataFile: 'transactions.csv',
      icon: <BarChart3 className="w-8 h-8" />,
      level: 'intermediate'
    },
    {
      id: 4,
      title: 'RFM客户价值分群',
      background: '零售交易记录（客户ID，交易日期，金额）。',
      techPoints: [
        '计算最近购买时间、频率、金额',
        'pd.cut() 实现评分分层（1-5分）',
        '客户分群规则（高价值、唤醒、流失等）',
        '可视化：分群占比饼图、雷达图'
      ],
      tasks: [
        '将客户分为8类（如"重要价值客户""一般发展客户"），输出每类人数与贡献金额占比。'
      ],
      dataFile: 'customer_transactions.csv',
      icon: <Brain className="w-8 h-8" />,
      level: 'intermediate'
    },
    {
      id: 5,
      title: '时间序列分析 —— 销售趋势与异常检测',
      background: '日销售数据（日期，销售额），含节假日标识。',
      techPoints: [
        '重采样（resample(\'W\') 周趋势）',
        '滑动窗口统计（rolling 计算7日移动平均）',
        '同比/环比计算（shift）',
        '基于Z-score的异常检测'
      ],
      tasks: [
        '绘制原始序列 + 移动平均线。',
        '标记异常点（超出3倍标准差）。',
        '输出节假日对销售的拉动系数。'
      ],
      dataFile: 'sales_data.csv',
      icon: <BarChart3 className="w-8 h-8" />,
      level: 'intermediate'
    },
    {
      id: 6,
      title: '用户留存与漏斗分析',
      background: '用户注册及每日登录日志（user_id, date, event_type=signup/login/purchase）。',
      techPoints: [
        '生成同期群（groupby 获取用户首次注册日期）',
        '计算N日留存率（pivot_table + 自定义留存函数）',
        '漏斗转化：各环节用户数及流失率（cumsum, merge）'
      ],
      tasks: [
        '输出第1、3、7日留存率矩阵（注册日期 vs 留存周期）。',
        '绘制注册→登录→加购→支付的转化漏斗图。'
      ],
      dataFile: 'user_events.csv',
      icon: <FileText className="w-8 h-8" />,
      level: 'intermediate'
    },
    {
      id: 7,
      title: 'A/B测试结果分析（假设检验）',
      background: '实验组与对照组用户的转化率数据（user_id, group, converted）。',
      techPoints: [
        '分组聚合计算转化率',
        '二项分布置信区间计算（statsmodels.stats.proportion.proportion_confint）',
        '卡方检验（pd.crosstab + chi2_contingency）'
      ],
      tasks: [
        '判断实验组转化率是否显著高于对照组（α=0.05），输出P值及效应量。'
      ],
      dataFile: 'ab_test.csv',
      icon: <Brain className="w-8 h-8" />,
      level: 'advanced'
    },
    {
      id: 8,
      title: 'K-Means用户聚类（基于消费行为）',
      background: '用户消费特征表（消费总额，频次，最近购买天数，平均客单价）。',
      techPoints: [
        '数据标准化（sklearn.preprocessing.StandardScaler）',
        '肘部法则确定K值（KMeans.inertia_）',
        '聚类结果分析与可视化（matplotlib 散点图，降维后展示）',
        '轮廓系数评估（silhouette_score）'
      ],
      tasks: [
        '将用户分为3-5类，命名并解释每类特征。',
        '输出每类用户的营销建议。'
      ],
      dataFile: 'user_features.csv',
      icon: <Brain className="w-8 h-8" />,
      level: 'advanced'
    },
    {
      id: 9,
      title: '商品价格带与购物篮大小分析',
      background: '交易明细（商品价格，数量，订单ID）。',
      techPoints: [
        '计算购物篮总金额、商品数量',
        '分位数划分价格带（qcut）',
        '交叉表分析（pd.crosstab 价格带 vs 是否购买高利润商品）',
        '分组统计：不同购物篮大小对应的平均折扣率'
      ],
      tasks: [
        '输出"小篮（1-2件）""中篮（3-5件）""大篮（6件以上）"的订单数及平均客单价。'
      ],
      dataFile: 'basket_data.csv',
      icon: <BarChart3 className="w-8 h-8" />,
      level: 'intermediate'
    },
    {
      id: 10,
      title: '完整数据分析报告 —— 电商综合诊断',
      background: '提供订单表、用户表、商品表、评价表（多表关联）。',
      techPoints: [
        '多表合并（merge, concat）',
        '综合运用上述1-9项技术',
        '输出结构化分析报告（Markdown/HTML）',
        '提出数据驱动的业务建议'
      ],
      tasks: [
        '回答：哪个商品类别的复购率最高？哪个时段下单用户流失最严重？',
        '基于聚类结果与购物车分析，设计一个交叉销售策略。',
        '撰写结论页（含可视化图表）。'
      ],
      dataFile: 'users.csv, products.csv, reviews.csv, orders.csv',
      icon: <BookOpen className="w-8 h-8" />,
      level: 'advanced'
    }
  ];

  const levelColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800'
  };

  const levelLabels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Code className="w-20 h-20 mx-auto mb-6 text-blue-300" />
            <h1 className="text-5xl font-bold mb-4">递进式训练项目</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              从数据清洗到机器学习，覆盖Pandas核心能力的10个实战项目
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Project List */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white`}>
                        {project.icon}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${levelColors[project.level]}`}>
                        {levelLabels[project.level]}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      项目{project.id}：{project.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {project.background}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-600 font-medium">
                        数据文件：{project.dataFile}
                      </span>
                      <ArrowRight className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Project Detail */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              {selectedProject ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      项目{selectedProject.id}：{selectedProject.title}
                    </h2>
                    <p className="text-gray-600">{selectedProject.background}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-blue-500" />
                      技术要点
                    </h3>
                    <ul className="space-y-2">
                      {selectedProject.techPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-blue-500" />
                      任务要求
                    </h3>
                    <ul className="space-y-2">
                      {selectedProject.tasks.map((task, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <ArrowRight className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{task}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Database className="w-5 h-5 text-blue-500" />
                      数据文件
                    </h3>
                    <p className="text-gray-700 text-sm">{selectedProject.dataFile}</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex flex-col gap-4">
                      <a
                        href={`/data/${selectedProject.dataFile.split(',')[0].trim()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg w-full justify-center"
                      >
                        下载数据文件
                        <ArrowRight className="w-5 h-5" />
                      </a>
                      
                      <button
                        onClick={() => setSelectedProject({ ...selectedProject, defaultCode: selectedProject.defaultCode })}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-lg w-full justify-center"
                      >
                        重置代码
                        <CheckCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Database className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-500 mb-2">选择一个项目</h3>
                  <p className="text-gray-400">点击左侧的项目卡片查看详情</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Section */}
      {selectedProject && (
        <section className="bg-white py-16 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">在线代码编辑器</h2>
              <p className="text-xl text-gray-600">直接在浏览器中编写和运行Python代码</p>
            </div>

            <div className="space-y-6">
              <CodeEditor
                initialCode={selectedProject.defaultCode}
                language="python"
                onRunCode={runCode}
              />
              <CodeOutput
                output={output}
                error={error}
                isLoading={isLoading}
              />
            </div>
          </div>
        </section>
      )}

      {/* Data Access Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">数据文件访问</h2>
            <p className="text-xl text-gray-600">所有训练项目的数据文件已生成，可直接下载使用</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'orders.csv', 'user_logs.csv', 'transactions.csv', 'customer_transactions.csv',
              'sales_data.csv', 'user_events.csv', 'ab_test.csv', 'user_features.csv',
              'basket_data.csv', 'users.csv', 'products.csv', 'reviews.csv'
            ].map((file) => (
              <a
                key={file}
                href={`/data/${file}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 hover:bg-gradient-to-r from-blue-100 to-indigo-100 transition-all flex items-center gap-3"
              >
                <Database className="w-6 h-6 text-blue-500" />
                <span className="font-medium text-gray-800">{file}</span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;


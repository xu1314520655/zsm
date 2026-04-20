
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
      level: 'intermediate',
      defaultCode: `# 购物车分析
import pandas as pd
import numpy as np

# 读取数据文件
df = pd.read_csv(data_dir + 'transactions.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 输出每个订单对应的商品列表
order_products = df.groupby('order_id')['product_name'].agg(list).reset_index()
order_products['product_list'] = order_products['product_name'].apply(lambda x: ', '.join(x))
print("\n每个订单对应的商品列表：")
print(order_products[['order_id', 'product_list']].head())

# 生成二元矩阵（0/1矩阵）
binary_matrix = pd.crosstab(df['order_id'], df['product_name'])
binary_matrix = binary_matrix.applymap(lambda x: 1 if x > 0 else 0)
print("\n二元矩阵形状：", binary_matrix.shape)
print("二元矩阵前5行：")
print(binary_matrix.head())

# 计算单项商品支持度
support = binary_matrix.mean()
print("\n单项商品支持度：")
print(support.sort_values(ascending=False).head(10))

# 筛选支持度>0.01的商品
high_support_products = support[support > 0.01]
print(f"\n支持度>0.01的商品数量：{len(high_support_products)}")
print("支持度>0.01的商品：")
print(high_support_products.sort_values(ascending=False))

# 保存处理后的数据
binary_matrix.to_csv('binary_matrix.csv')
order_products.to_csv('order_products.csv', index=False)
print("\n数据处理完成并保存")`
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
      level: 'intermediate',
      defaultCode: `# RFM客户价值分群
import pandas as pd
import numpy as np
from datetime import datetime

# 读取数据文件
df = pd.read_csv(data_dir + 'customer_transactions.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 数据预处理
df['transaction_date'] = pd.to_datetime(df['transaction_date'])

# 计算RFM值
current_date = df['transaction_date'].max() + pd.Timedelta(days=1)

rfm = df.groupby('customer_id').agg({
    'transaction_date': lambda x: (current_date - x.max()).days,  # Recency
    'transaction_id': 'count',  # Frequency
    'amount': 'sum'  # Monetary
}).rename(columns={
    'transaction_date': 'Recency',
    'transaction_id': 'Frequency',
    'amount': 'Monetary'
}).reset_index()

print("\nRFM数据：")
print(rfm.head())

# RFM评分（1-5分，越高越好）
rfm['R_score'] = pd.cut(rfm['Recency'], 5, labels=[5, 4, 3, 2, 1])
rfm['F_score'] = pd.cut(rfm['Frequency'], 5, labels=[1, 2, 3, 4, 5])
rfm['M_score'] = pd.cut(rfm['Monetary'], 5, labels=[1, 2, 3, 4, 5])

# 转换为数值类型
rfm['R_score'] = rfm['R_score'].astype(int)
rfm['F_score'] = rfm['F_score'].astype(int)
rfm['M_score'] = rfm['M_score'].astype(int)

# 客户分群规则
def customer_segment(row):
    r, f, m = row['R_score'], row['F_score'], row['M_score']
    
    if r >= 4 and f >= 4 and m >= 4:
        return '重要价值客户'
    elif r >= 4 and f < 4 and m >= 4:
        return '重要发展客户'
    elif r < 4 and f >= 4 and m >= 4:
        return '重要保持客户'
    elif r < 4 and f < 4 and m >= 4:
        return '重要挽留客户'
    elif r >= 4 and f >= 4 and m < 4:
        return '一般价值客户'
    elif r >= 4 and f < 4 and m < 4:
        return '一般发展客户'
    elif r < 4 and f >= 4 and m < 4:
        return '一般保持客户'
    else:
        return '一般挽留客户'

rfm['segment'] = rfm.apply(customer_segment, axis=1)

# 分析分群结果
segment_analysis = rfm.groupby('segment').agg(
    count=('customer_id', 'count'),
    total_amount=('Monetary', 'sum'),
    avg_recency=('Recency', 'mean'),
    avg_frequency=('Frequency', 'mean'),
    avg_monetary=('Monetary', 'mean')
).reset_index()

# 计算占比
segment_analysis['count_ratio'] = segment_analysis['count'] / segment_analysis['count'].sum()
segment_analysis['amount_ratio'] = segment_analysis['total_amount'] / segment_analysis['total_amount'].sum()

print("\n客户分群分析：")
print(segment_analysis)

print("\n各分群人数占比：")
for _, row in segment_analysis.iterrows():
    print(f"{row['segment']}: {row['count']}人 ({row['count_ratio']:.2%})")

print("\n各分群贡献金额占比：")
for _, row in segment_analysis.iterrows():
    print(f"{row['segment']}: {row['total_amount']:.2f} ({row['amount_ratio']:.2%})")`
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
      level: 'intermediate',
      defaultCode: `# 时间序列分析
import pandas as pd
import numpy as np

# 读取数据文件
df = pd.read_csv(data_dir + 'sales_data.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 数据预处理
df['date'] = pd.to_datetime(df['date'])
df.set_index('date', inplace=True)

# 重采样：周趋势
weekly_sales = df['sales'].resample('W').sum()
print("\n周销售趋势：")
print(weekly_sales.head())

# 滑动窗口：7日移动平均
df['7day_ma'] = df['sales'].rolling(window=7).mean()
print("\n7日移动平均：")
print(df[['sales', '7day_ma']].head(10))

# 同比/环比计算
df['month_over_month'] = df['sales'] / df['sales'].shift(1) - 1
df['year_over_year'] = df['sales'] / df['sales'].shift(365) - 1
print("\n环比和同比增长：")
print(df[['sales', 'month_over_month', 'year_over_year']].tail())

# 基于Z-score的异常检测
df['z_score'] = (df['sales'] - df['sales'].mean()) / df['sales'].std()
df['is_outlier'] = abs(df['z_score']) > 3
print(f"\n异常点数量：{df['is_outlier'].sum()}")
print("异常点详情：")
print(df[df['is_outlier']])

# 节假日对销售的影响
holiday_sales = df[df['is_holiday'] == 1]['sales'].mean()
non_holiday_sales = df[df['is_holiday'] == 0]['sales'].mean()
pull_factor = holiday_sales / non_holiday_sales
print(f"\n节假日平均销售额：{holiday_sales:.2f}")
print(f"非节假日平均销售额：{non_holiday_sales:.2f}")
print(f"节假日拉动系数：{pull_factor:.2f}")

# 按月份分析
df['month'] = df.index.month
monthly_analysis = df.groupby('month').agg(
    avg_sales=('sales', 'mean'),
    total_sales=('sales', 'sum'),
    holiday_days=('is_holiday', 'sum')
).reset_index()
print("\n月度销售分析：")
print(monthly_analysis)`
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
      level: 'intermediate',
      defaultCode: `# 用户留存与漏斗分析
import pandas as pd
import numpy as np

# 读取数据文件
df = pd.read_csv(data_dir + 'user_events.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 数据预处理
df['date'] = pd.to_datetime(df['date'])

# 生成同期群：获取用户首次注册日期
user_first_signup = df[df['event_type'] == 'signup'].groupby('user_id')['date'].min().reset_index()
user_first_signup.columns = ['user_id', 'signup_date']

# 合并回原始数据
df = df.merge(user_first_signup, on='user_id', how='left')

# 计算用户注册后的天数
df['days_since_signup'] = (df['date'] - df['signup_date']).dt.days

# 计算每日活跃用户
daily_active = df[df['event_type'] != 'signup'].groupby(['signup_date', 'days_since_signup'])['user_id'].nunique().reset_index()
daily_active.columns = ['signup_date', 'days_since_signup', 'active_users']

# 计算注册用户数
signup_counts = df[df['event_type'] == 'signup'].groupby('signup_date')['user_id'].nunique().reset_index()
signup_counts.columns = ['signup_date', 'total_signups']

# 合并计算留存率
retention = daily_active.merge(signup_counts, on='signup_date', how='left')
retention['retention_rate'] = retention['active_users'] / retention['total_signups']

# 生成留存率矩阵
retention_matrix = retention.pivot(index='signup_date', columns='days_since_signup', values='retention_rate')
print("\n留存率矩阵（前5行）：")
print(retention_matrix.head())

# 输出第1、3、7日留存率
print("\n第1日留存率：")
print(retention_matrix[1].dropna())

print("\n第3日留存率：")
print(retention_matrix[3].dropna())

print("\n第7日留存率：")
print(retention_matrix[7].dropna())

# 漏斗分析：注册→登录→加购→支付
event_order = ['signup', 'login', 'add_to_cart', 'purchase']

# 计算各环节用户数
funnel_data = df.groupby('event_type')['user_id'].nunique().reset_index()
funnel_data.columns = ['event_type', 'user_count']

# 按顺序排列
funnel_data = funnel_data[funnel_data['event_type'].isin(event_order)]
funnel_data['event_order'] = funnel_data['event_type'].map({event: i for i, event in enumerate(event_order)})
funnel_data = funnel_data.sort_values('event_order').drop('event_order', axis=1)

# 计算转化率和流失率
funnel_data['conversion_rate'] = funnel_data['user_count'] / funnel_data['user_count'].iloc[0]
funnel_data['churn_rate'] = 1 - funnel_data['conversion_rate']

print("\n漏斗分析：")
print(funnel_data)

# 计算各环节间的转化率
for i in range(1, len(funnel_data)):
    prev_count = funnel_data['user_count'].iloc[i-1]
    current_count = funnel_data['user_count'].iloc[i]
    conversion_between = current_count / prev_count
    print(f"\n{funnel_data['event_type'].iloc[i-1]} → {funnel_data['event_type'].iloc[i]} 转化率：{conversion_between:.2%}")`
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
      level: 'advanced',
      defaultCode: `# A/B测试结果分析
import pandas as pd
import numpy as np
from scipy.stats import chi2_contingency

# 读取数据文件
df = pd.read_csv(data_dir + 'ab_test.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 分组统计
ab_stats = df.groupby('group').agg(
    total_users=('user_id', 'count'),
    converted_users=('converted', 'sum'),
    conversion_rate=('converted', 'mean')
).reset_index()

print("\nA/B测试结果：")
print(ab_stats)

# 计算转化率差异
test_group = ab_stats[ab_stats['group'] == 'test']
control_group = ab_stats[ab_stats['group'] == 'control']

conversion_diff = test_group['conversion_rate'].values[0] - control_group['conversion_rate'].values[0]
relative_improvement = conversion_diff / control_group['conversion_rate'].values[0]

print(f"\n转化率差异：{conversion_diff:.4f}")
print(f"相对提升：{relative_improvement:.2%}")

# 卡方检验
contingency_table = pd.crosstab(df['group'], df['converted'])
print("\n列联表：")
print(contingency_table)

chi2, p_value, dof, expected = chi2_contingency(contingency_table)
print(f"\n卡方检验结果：")
print(f"卡方统计量：{chi2:.4f}")
print(f"P值：{p_value:.4f}")
print(f"自由度：{dof}")

# 结论
if p_value < 0.05:
    print("\n结论：实验组转化率显著高于对照组（α=0.05）")
else:
    print("\n结论：实验组转化率与对照组无显著差异（α=0.05）")

# 计算效应量（Cramer's V）
n = len(df)
cramers_v = np.sqrt(chi2 / (n * min(contingency_table.shape) - 1))
print(f"\n效应量（Cramer's V）：{cramers_v:.4f}")

# 计算置信区间
def proportion_confint(successes, trials, confidence=0.95):
    import math
    p = successes / trials
    z = 1.96  # 95%置信区间
    se = math.sqrt(p * (1 - p) / trials)
    return (p - z * se, p + z * se)

test_successes = test_group['converted_users'].values[0]
test_trials = test_group['total_users'].values[0]
control_successes = control_group['converted_users'].values[0]
control_trials = control_group['total_users'].values[0]

test_ci = proportion_confint(test_successes, test_trials)
control_ci = proportion_confint(control_successes, control_trials)

print("\n95%置信区间：")
print(f"实验组：{test_ci[0]:.4f} - {test_ci[1]:.4f}")
print(f"对照组：{control_ci[0]:.4f} - {control_ci[1]:.4f}")`
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
      level: 'advanced',
      defaultCode: `# K-Means用户聚类
import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import silhouette_score

# 读取数据文件
df = pd.read_csv(data_dir + 'user_features.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 数据预处理
features = df[['total_amount', 'frequency', 'recency', 'avg_order_value']]

# 数据标准化
scaler = StandardScaler()
scaled_features = scaler.fit_transform(features)

# 肘部法则确定K值
inertia = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(scaled_features)
    inertia.append(kmeans.inertia_)

print("\n肘部法则结果：")
for i, val in enumerate(inertia):
    print(f"K={i+1}: 惯性={val:.2f}")

# 选择K=4进行聚类
k = 4
kmeans = KMeans(n_clusters=k, random_state=42)
clusters = kmeans.fit_predict(scaled_features)

# 添加聚类结果到原数据
df['cluster'] = clusters

# 计算轮廓系数
silhouette_avg = silhouette_score(scaled_features, clusters)
print(f"\n轮廓系数：{silhouette_avg:.4f}")

# 分析每个聚类的特征
cluster_analysis = df.groupby('cluster').agg({
    'total_amount': 'mean',
    'frequency': 'mean',
    'recency': 'mean',
    'avg_order_value': 'mean',
    'user_id': 'count'
}).reset_index()

print("\n聚类分析结果：")
print(cluster_analysis)

# 为每个聚类命名并提供营销建议
def cluster_name(row):
    if row['total_amount'] > 10000 and row['frequency'] > 20:
        return '高价值活跃用户'
    elif row['total_amount'] > 5000 and row['frequency'] > 10:
        return '中高价值用户'
    elif row['recency'] > 60:
        return '流失风险用户'
    else:
        return '一般用户'

cluster_analysis['cluster_name'] = cluster_analysis.apply(cluster_name, axis=1)

print("\n聚类命名结果：")
print(cluster_analysis[['cluster', 'cluster_name', 'user_id', 'total_amount', 'frequency', 'recency']])

# 营销建议
print("\n营销建议：")
for _, row in cluster_analysis.iterrows():
    if row['cluster_name'] == '高价值活跃用户':
        print(f"{row['cluster_name']}：提供VIP服务，专属优惠，个性化推荐")
    elif row['cluster_name'] == '中高价值用户':
        print(f"{row['cluster_name']}：会员升级邀请，满减活动，新品试用")
    elif row['cluster_name'] == '流失风险用户':
        print(f"{row['cluster_name']}：召回活动，专属折扣，个性化推送")
    else:
        print(f"{row['cluster_name']}：新手礼包，首单优惠，引导消费")

# 保存聚类结果
df.to_csv('user_clusters.csv', index=False)
print("\n聚类结果已保存到 user_clusters.csv")`
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
      level: 'intermediate',
      defaultCode: `# 商品价格带与购物篮大小分析
import pandas as pd
import numpy as np

# 读取数据文件
df = pd.read_csv(data_dir + 'basket_data.csv')

# 查看数据基本信息
print("数据基本信息：")
print(df.info())

print("\n数据前5行：")
print(df.head())

# 计算购物篮总金额和商品数量
basket_analysis = df.groupby('order_id').agg(
    total_amount=('price', 'sum'),
    item_count=('quantity', 'sum'),
    avg_price=('price', 'mean')
).reset_index()

print("\n购物篮分析：")
print(basket_analysis.head())

# 定义购物篮大小
def basket_size(row):
    if row['item_count'] <= 2:
        return '小篮（1-2件）'
    elif row['item_count'] <= 5:
        return '中篮（3-5件）'
    else:
        return '大篮（6件以上）'

basket_analysis['basket_size'] = basket_analysis.apply(basket_size, axis=1)

# 分析不同购物篮大小的订单数和平均客单价
basket_size_analysis = basket_analysis.groupby('basket_size').agg(
    order_count=('order_id', 'count'),
    avg_total_amount=('total_amount', 'mean'),
    avg_item_count=('item_count', 'mean'),
    avg_price=('avg_price', 'mean')
).reset_index()

print("\n购物篮大小分析：")
print(basket_size_analysis)

# 商品价格带分析
df['price_band'] = pd.qcut(df['price'], 4, labels=['低价位', '中低价位', '中高价位', '高价位'])

price_band_analysis = df.groupby('price_band').agg(
    product_count=('product_id', 'count'),
    avg_price=('price', 'mean'),
    total_sales=('price', 'sum')
).reset_index()

print("\n价格带分析：")
print(price_band_analysis)

# 高利润商品识别（假设利润率>30%为高利润）
df['is_high_profit'] = df['profit_margin'] > 0.3

# 交叉表分析：价格带 vs 是否购买高利润商品
cross_analysis = pd.crosstab(df['price_band'], df['is_high_profit'], margins=True)
print("\n价格带与高利润商品交叉分析：")
print(cross_analysis)

# 不同购物篮大小对应的平均折扣率
basket_discount = df.groupby('order_id').agg(
    basket_size=('order_id', lambda x: basket_size(basket_analysis.loc[basket_analysis['order_id'] == x.iloc[0], :].iloc[0])),
    avg_discount=('discount', 'mean')
).reset_index()

basket_discount_analysis = basket_discount.groupby('basket_size').agg(
    avg_discount=('avg_discount', 'mean'),
    order_count=('order_id', 'count')
).reset_index()

print("\n不同购物篮大小的平均折扣率：")
print(basket_discount_analysis)

# 保存分析结果
basket_analysis.to_csv('basket_analysis.csv', index=False)
price_band_analysis.to_csv('price_band_analysis.csv', index=False)
print("\n分析结果已保存")`
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
      level: 'advanced',
      defaultCode: `# 完整数据分析报告 —— 电商综合诊断
import pandas as pd
import numpy as np

# 读取数据文件
orders = pd.read_csv(data_dir + 'orders.csv')
users = pd.read_csv(data_dir + 'users.csv')
products = pd.read_csv(data_dir + 'products.csv')
reviews = pd.read_csv(data_dir + 'reviews.csv')

# 查看数据基本信息
print("订单数据基本信息：")
print(orders.info())

print("\n用户数据基本信息：")
print(users.info())

print("\n商品数据基本信息：")
print(products.info())

print("\n评价数据基本信息：")
print(reviews.info())

# 数据预处理
orders['order_date'] = pd.to_datetime(orders['order_date'])
reviews['review_date'] = pd.to_datetime(reviews['review_date'])

# 多表合并
order_product = orders.merge(products, on='product_id', how='left')
order_product_user = order_product.merge(users, on='user_id', how='left')
order_product_user_review = order_product_user.merge(reviews, on=['order_id', 'product_id'], how='left')

print("\n合并后数据形状：", order_product_user_review.shape)
print("合并后数据前5行：")
print(order_product_user_review.head())

# 1. 哪个商品类别的复购率最高？
# 计算每个用户对每个类别的购买次数
user_category_purchase = order_product.groupby(['user_id', 'category']).agg(
    purchase_count=('order_id', 'count')
).reset_index()

# 计算复购率（购买次数>=2的用户比例）
category_repurchase = user_category_purchase.groupby('category').agg(
    total_users=('user_id', 'nunique'),
    repurchase_users=('purchase_count', lambda x: (x >= 2).sum())
).reset_index()

category_repurchase['repurchase_rate'] = category_repurchase['repurchase_users'] / category_repurchase['total_users']
category_repurchase = category_repurchase.sort_values('repurchase_rate', ascending=False)

print("\n各商品类别的复购率：")
print(category_repurchase)
print(f"\n复购率最高的商品类别：{category_repurchase.iloc[0]['category']}，复购率：{category_repurchase.iloc[0]['repurchase_rate']:.2%}")

# 2. 哪个时段下单用户流失最严重？
# 提取下单小时
orders['order_hour'] = orders['order_date'].dt.hour

# 计算每个小时的下单用户数
hourly_users = orders.groupby('order_hour')['user_id'].nunique().reset_index()
hourly_users.columns = ['order_hour', 'total_users']

# 计算每个小时的流失用户数（只下单一次的用户）
user_order_count = orders.groupby('user_id').agg(
    order_count=('order_id', 'count'),
    first_order_hour=('order_hour', 'first')
).reset_index()

churned_users = user_order_count[user_order_count['order_count'] == 1]
hourly_churn = churned_users.groupby('first_order_hour')['user_id'].nunique().reset_index()
hourly_churn.columns = ['order_hour', 'churned_users']

# 合并计算流失率
hourly_analysis = hourly_users.merge(hourly_churn, on='order_hour', how='left')
hourly_analysis['churn_rate'] = hourly_analysis['churned_users'] / hourly_analysis['total_users']
hourly_analysis = hourly_analysis.sort_values('churn_rate', ascending=False)

print("\n各时段下单用户流失率：")
print(hourly_analysis)
print(f"\n流失最严重的时段：{hourly_analysis.iloc[0]['order_hour']}点，流失率：{hourly_analysis.iloc[0]['churn_rate']:.2%}")

# 3. 交叉销售策略设计
# 分析商品关联购买
product_cooccurrence = order_product.groupby('order_id')['product_id'].agg(list).reset_index()
product_cooccurrence['product_count'] = product_cooccurrence['product_id'].apply(len)

# 只考虑包含多个商品的订单
multi_product_orders = product_cooccurrence[product_cooccurrence['product_count'] >= 2]

# 计算商品共现次数
from collections import defaultdict
cooccurrence = defaultdict(int)

for products in multi_product_orders['product_id']:
    for i in range(len(products)):
        for j in range(i+1, len(products)):
            pair = tuple(sorted([products[i], products[j]]))
            cooccurrence[pair] += 1

# 转换为DataFrame
cooccurrence_df = pd.DataFrame.from_dict(cooccurrence, orient='index', columns=['cooccurrence_count']).reset_index()
cooccurrence_df[['product1', 'product2']] = pd.DataFrame(cooccurrence_df['index'].tolist(), index=cooccurrence_df.index)
cooccurrence_df = cooccurrence_df.drop('index', axis=1)
cooccurrence_df = cooccurrence_df.sort_values('cooccurrence_count', ascending=False)

print("\n商品关联购买分析（前10对）：")
print(cooccurrence_df.head(10))

# 4. 综合业务建议
print("\n=== 电商综合诊断报告 ===")
print("\n1. 商品类别分析：")
print(f"   - 复购率最高的类别：{category_repurchase.iloc[0]['category']} ({category_repurchase.iloc[0]['repurchase_rate']:.2%})")
print(f"   - 建议：重点推广该类别商品，增加相关商品推荐")

print("\n2. 用户行为分析：")
print(f"   - 流失最严重的时段：{hourly_analysis.iloc[0]['order_hour']}点 ({hourly_analysis.iloc[0]['churn_rate']:.2%})")
print(f"   - 建议：在该时段增加客服支持，提供限时优惠")

print("\n3. 交叉销售策略：")
top_pair = cooccurrence_df.iloc[0]
product1_name = products[products['product_id'] == top_pair['product1']]['product_name'].iloc[0]
product2_name = products[products['product_id'] == top_pair['product2']]['product_name'].iloc[0]
print(f"   - 最常一起购买的商品：{product1_name} 和 {product2_name}")
print("   - 建议：设置捆绑销售，推出组合优惠")

print("\n4. 整体运营建议：")
print("   - 优化用户留存：针对高流失时段的用户制定专属挽留计划")
print("   - 提升复购率：对高复购类别的商品进行个性化推荐")
print("   - 增强用户体验：完善评价系统，提高商品质量")
print("   - 数据驱动决策：建立定期数据分析机制，持续优化运营策略")

# 保存分析结果
category_repurchase.to_csv('category_repurchase.csv', index=False)
hourly_analysis.to_csv('hourly_analysis.csv', index=False)
cooccurrence_df.to_csv('product_cooccurrence.csv', index=False)
print("\n分析结果已保存")`
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


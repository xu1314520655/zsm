
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
  answerCode: string;
  answerExplanation: string;
}

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentCode, setCurrentCode] = useState('');

  const runCode = async (code: string, output: string, error: string) => {
    setIsLoading(true);
    setOutput(output);
    setError(error);
    setIsLoading(false);
  };

  const handleShowAnswer = () => {
    if (selectedProject) {
      setCurrentCode(selectedProject.answerCode);
      setShowAnswer(true);
    }
  };

  const handleResetCode = () => {
    if (selectedProject) {
      setCurrentCode(selectedProject.defaultCode);
      setShowAnswer(false);
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
      defaultCode: '# 电商订单数据清洗\nimport pandas as pd\nimport numpy as np\n\ndf = load_orders()\nprint(\"数据加载成功！\")\nprint(df.head())',
      answerCode: '# 电商订单数据清洗 - 完整答案\nimport pandas as pd\nimport numpy as np\n\ndf = load_orders()\nprint(\"=== 清洗前数据质量报告 ===\")\nprint(f\"总行数: {len(df)}\")\nprint(f\"缺失值:\")\nprint(df.isna().sum())\nprint(f\"重复值: {df.duplicated().sum()}\")\n\ndf[\"order_date\"] = pd.to_datetime(df[\"order_date\"])\nQ1 = df[\"amount\"].quantile(0.25)\nQ3 = df[\"amount\"].quantile(0.75)\nIQR = Q3 - Q1\nlower = Q1 - 1.5 * IQR\nupper = Q3 + 1.5 * IQR\n\noutliers = df[(df[\"amount\"] < lower) | (df[\"amount\"] > upper)]\nprint(f\"\\n异常值数量: {len(outliers)}\")\n\ncleaned_df = df.dropna().drop_duplicates()\ncleaned_df = cleaned_df[(cleaned_df[\"amount\"] >= lower) & (cleaned_df[\"amount\"] <= upper)]\n\nprint(\"\\n=== 清洗后数据质量报告 ===\")\nprint(f\"总行数: {len(cleaned_df)}\")',
      answerExplanation: '**解题思路：**\n\n1. **数据加载**：使用 load_orders() 函数加载订单数据\n2. **数据探查**：使用 info()、head() 查看数据结构\n3. **缺失值处理**：使用 dropna() 删除缺失值\n4. **重复值处理**：使用 drop_duplicates() 删除重复记录\n5. **异常值检测**：使用IQR方法识别异常值\n6. **数据清洗**：综合应用以上方法完成清洗\n\n**关键要点：**\n- isna().sum() 用于统计缺失值\n- duplicated().sum() 用于统计重复值\n- IQR = Q3 - Q1，异常值范围：[Q1-1.5IQR, Q3+1.5IQR]\n- 清洗顺序：先处理缺失值，再处理重复值，最后处理异常值'
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
      defaultCode: '# 用户行为日志分析\nimport pandas as pd\nimport numpy as np\n\ndf = load_user_logs()\nprint(\"数据加载成功！\")\nprint(df.head())',
      answerCode: '# 用户行为日志解析与特征工程\nimport pandas as pd\nimport numpy as np\n\ndf = load_user_logs()\ndf[\"timestamp\"] = pd.to_datetime(df[\"timestamp\"])\ndf[\"hour\"] = df[\"timestamp\"].dt.hour\ndf[\"is_late_night\"] = df[\"hour\"].apply(lambda x: 1 if x >= 22 or x <= 5 else 0)\ndf[\"page_type\"] = df[\"url\"].str.extract(r\"/([^/]+)/\", expand=False).fillna(\"unknown\")\nprint(\"=== 处理后数据 ===\")\nprint(df.head())',
      answerExplanation: '**解题思路：**\n\n1. **时间特征提取**：从timestamp中提取小时、星期、是否周末、是否深夜\n2. **URL解析**：使用正则表达式从URL中提取页面类型\n3. **会话划分**：按用户分组，计算相邻访问时间差，超过30分钟切分新会话\n4. **特征聚合**：统计每个用户的访问次数、深夜访问次数、周末访问次数、平均会话时长\n\n**关键要点：**\n- dt.hour, dt.dayofweek 用于提取时间特征\n- str.extract() 用于正则表达式提取\n- groupby().diff() 用于计算组内差值\n- cumsum() 用于累积计数，生成会话ID'
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
      defaultCode: '# 购物车分析\nimport pandas as pd\nimport numpy as np\n\n# 加载交易数据\ndf = load_transactions()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\nprint(\"\\n=== 数据前5行 ===\")\nprint(df.head())',
      answerCode: '# 购物车分析 - 完整答案\nimport pandas as pd\nimport numpy as np\n\n# 加载交易数据\ndf = load_transactions()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\nprint(\"\\n=== 数据前5行 ===\")\nprint(df.head())\n\n# 输出每个订单对应的商品列表\norder_products = df.groupby(\"order_id\")[\"product_name\"].agg(list).reset_index()\norder_products[\"product_list\"] = order_products[\"product_name\"].apply(lambda x: \", \".join(x))\nprint(\"\\n=== 每个订单对应的商品列表 ===\")\nprint(order_products[[\"order_id\", \"product_list\"]])\n\n# 生成二元矩阵（0/1矩阵）\nbinary_matrix = pd.crosstab(df[\"order_id\"], df[\"product_name\"])\nbinary_matrix = binary_matrix.applymap(lambda x: 1 if x > 0 else 0)\nprint(\"\\n=== 二元矩阵 ===\")\nprint(f\"矩阵形状: {binary_matrix.shape}\")\nprint(binary_matrix)\n\n# 计算单项商品支持度\nsupport = binary_matrix.mean()\nprint(\"\\n=== 单项商品支持度 ===\")\nprint(support.sort_values(ascending=False))\n\n# 筛选支持度>0.1的商品\nhigh_support_products = support[support > 0.1]\nprint(f\"\\n支持度>0.1的商品数量: {len(high_support_products)}\")\nprint(\"支持度>0.1的商品:\")\nprint(high_support_products.sort_values(ascending=False))',
      answerExplanation: '**解题思路：**\n\n1. **数据加载**：使用 load_transactions() 加载交易数据\n2. **商品列表聚合**：按订单分组，将每个订单的商品聚合为列表\n3. **二元矩阵构建**：使用 crosstab 构建订单×商品的0/1矩阵\n4. **支持度计算**：计算每个商品在订单中出现的比例\n5. **筛选高频商品**：筛选支持度高于阈值的商品\n\n**关键要点：**\n- groupby().agg(list) 用于聚合每个组的列表\n- crosstab() 用于构建交叉表\n- applymap() 用于逐元素转换\n- mean() 在二元矩阵上计算的就是支持度'
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
      defaultCode: '# RFM客户价值分群\nimport pandas as pd\nimport numpy as np\n\n# 加载客户交易数据\ndf = load_customer_transactions()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\nprint(\"\\n=== 数据前5行 ===\")\nprint(df.head())',
      answerCode: '# RFM客户价值分群 - 完整答案\nimport pandas as pd\nimport numpy as np\n\n# 加载客户交易数据\ndf = load_customer_transactions()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\n# 数据预处理\ndf[\"transaction_date\"] = pd.to_datetime(df[\"transaction_date\"])\n\n# 计算RFM值\ncurrent_date = df[\"transaction_date\"].max() + pd.Timedelta(days=1)\n\nrfm = df.groupby(\"customer_id\").agg({\n    \"transaction_date\": lambda x: (current_date - x.max()).days,\n    \"transaction_id\": \"count\",\n    \"amount\": \"sum\"\n}).rename(columns={\n    \"transaction_date\": \"Recency\",\n    \"transaction_id\": \"Frequency\",\n    \"amount\": \"Monetary\"\n}).reset_index()\n\nprint(\"\\n=== RFM数据 ===\")\nprint(rfm)\n\n# RFM评分（1-5分）\nrfm[\"R_score\"] = pd.cut(rfm[\"Recency\"], 5, labels=[5, 4, 3, 2, 1])\nrfm[\"F_score\"] = pd.cut(rfm[\"Frequency\"], 5, labels=[1, 2, 3, 4, 5])\nrfm[\"M_score\"] = pd.cut(rfm[\"Monetary\"], 5, labels=[1, 2, 3, 4, 5])\n\nrfm[\"R_score\"] = rfm[\"R_score\"].astype(int)\nrfm[\"F_score\"] = rfm[\"F_score\"].astype(int)\nrfm[\"M_score\"] = rfm[\"M_score\"].astype(int)\n\n# 客户分群\ndef customer_segment(row):\n    r, f, m = row[\"R_score\"], row[\"F_score\"], row[\"M_score\"]\n    if r >= 4 and f >= 4 and m >= 4:\n        return \"重要价值客户\"\n    elif r >= 4 and f < 4 and m >= 4:\n        return \"重要发展客户\"\n    elif r < 4 and f >= 4 and m >= 4:\n        return \"重要保持客户\"\n    elif r < 4 and f < 4 and m >= 4:\n        return \"重要挽留客户\"\n    elif r >= 4 and f >= 4 and m < 4:\n        return \"一般价值客户\"\n    elif r >= 4 and f < 4 and m < 4:\n        return \"一般发展客户\"\n    elif r < 4 and f >= 4 and m < 4:\n        return \"一般保持客户\"\n    else:\n        return \"一般挽留客户\"\n\nrfm[\"segment\"] = rfm.apply(customer_segment, axis=1)\n\n# 分析分群结果\nsegment_analysis = rfm.groupby(\"segment\").agg(\n    count=(\"customer_id\", \"count\"),\n    total_amount=(\"Monetary\", \"sum\"),\n    avg_recency=(\"Recency\", \"mean\"),\n    avg_frequency=(\"Frequency\", \"mean\"),\n    avg_monetary=(\"Monetary\", \"mean\")\n).reset_index()\n\nprint(\"\\n=== 客户分群分析 ===\")\nprint(segment_analysis)',
      answerExplanation: '**解题思路：**\n\n1. **RFM计算**：\n   - Recency：最近一次购买距离当前的天数\n   - Frequency：购买频次\n   - Monetary：购买总金额\n\n2. **评分转换**：使用pd.cut()将RFM值转换为1-5分\n   - R值：越小越好，所以标签反转[5,4,3,2,1]\n   - F值和M值：越大越好，标签[1,2,3,4,5]\n\n3. **客户分群**：根据RFM评分组合将客户分为8类\n   - 重要价值客户：高R高F高M\n   - 重要发展客户：高R低F高M\n   - 重要保持客户：低R高F高M\n   - 重要挽留客户：低R低F高M\n   - 其他四类为一般客户\n\n**关键要点：**\n- groupby().agg() 用于同时计算多个聚合指标\n- pd.cut() 用于区间划分\n- apply() 配合自定义函数实现复杂逻辑'
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
      defaultCode: '# 时间序列分析\nimport pandas as pd\nimport numpy as np\n\n# 加载销售数据\ndf = load_sales_data()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\nprint(\"\\n=== 数据前5行 ===\")\nprint(df.head())',
      answerCode: '# 时间序列分析 - 完整答案\nimport pandas as pd\nimport numpy as np\n\n# 加载销售数据\ndf = load_sales_data()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\n# 数据预处理\ndf[\"date\"] = pd.to_datetime(df[\"date\"])\ndf.set_index(\"date\", inplace=True)\n\n# 重采样：周趋势\nweekly_sales = df[\"sales\"].resample(\"W\").sum()\nprint(\"\\n=== 周销售趋势 ===\")\nprint(weekly_sales)\n\n# 滑动窗口：7日移动平均\ndf[\"7day_ma\"] = df[\"sales\"].rolling(window=7).mean()\nprint(\"\\n=== 7日移动平均 ===\")\nprint(df[[\"sales\", \"7day_ma\"]].head(10))\n\n# 环比计算\ndf[\"month_over_month\"] = df[\"sales\"] / df[\"sales\"].shift(1) - 1\nprint(\"\\n=== 环比增长 ===\")\nprint(df[[\"sales\", \"month_over_month\"]].tail())\n\n# 基于Z-score的异常检测\ndf[\"z_score\"] = (df[\"sales\"] - df[\"sales\"].mean()) / df[\"sales\"].std()\ndf[\"is_outlier\"] = abs(df[\"z_score\"]) > 3\nprint(f\"\\n异常点数量: {df[\"is_outlier\"].sum()}\")\nprint(\"异常点详情:\")\nprint(df[df[\"is_outlier\"]])\n\n# 节假日对销售的影响\nholiday_sales = df[df[\"is_holiday\"] == 1][\"sales\"].mean()\nnon_holiday_sales = df[df[\"is_holiday\"] == 0][\"sales\"].mean()\npull_factor = holiday_sales / non_holiday_sales\nprint(f\"\\n节假日平均销售额: {holiday_sales:.2f}\")\nprint(f\"非节假日平均销售额: {non_holiday_sales:.2f}\")\nprint(f\"节假日拉动系数: {pull_factor:.2f}\")',
      answerExplanation: '**解题思路：**\n\n1. **数据预处理**：将日期列转换为datetime格式并设置为索引\n2. **重采样**：使用resample(\'W\')按周汇总销售数据\n3. **移动平均**：使用rolling(window=7)计算7日移动平均\n4. **环比计算**：使用shift(1)获取前一天数据进行比较\n5. **异常检测**：基于Z-score识别异常点（超出3倍标准差）\n6. **节假日分析**：比较节假日与非节假日的销售额差异\n\n**关键要点：**\n- resample() 用于时间序列重采样\n- rolling() 用于滑动窗口计算\n- shift() 用于获取前移/后移数据\n- Z-score = (x - mean) / std，用于异常检测'
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
    print(f"\n{funnel_data['event_type'].iloc[i-1]} → {funnel_data['event_type'].iloc[i]} 转化率：{conversion_between:.2%}")`,
      answerCode: '# 用户留存与漏斗分析 - 完整答案\nimport pandas as pd\nimport numpy as np\n\n# 加载用户事件数据\ndf = load_user_events()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\n# 数据预处理\ndf[\"date\"] = pd.to_datetime(df[\"date\"])\n\n# 获取用户首次注册日期\nuser_first_signup = df[df[\"event_type\"] == \"signup\"].groupby(\"user_id\")[\"date\"].min().reset_index()\nuser_first_signup.columns = [\"user_id\", \"signup_date\"]\n\ndf = df.merge(user_first_signup, on=\"user_id\", how=\"left\")\ndf[\"days_since_signup\"] = (df[\"date\"] - df[\"signup_date\"]).dt.days\n\n# 计算每日活跃用户\ndaily_active = df[df[\"event_type\"] != \"signup\"].groupby([\"signup_date\", \"days_since_signup\"])[\"user_id\"].nunique().reset_index()\ndaily_active.columns = [\"signup_date\", \"days_since_signup\", \"active_users\"]\n\n# 计算注册用户数\nsignup_counts = df[df[\"event_type\"] == \"signup\"].groupby(\"signup_date\")[\"user_id\"].nunique().reset_index()\nsignup_counts.columns = [\"signup_date\", \"total_signups\"]\n\n# 计算留存率\nretention = daily_active.merge(signup_counts, on=\"signup_date\", how=\"left\")\nretention[\"retention_rate\"] = retention[\"active_users\"] / retention[\"total_signups\"]\n\nretention_matrix = retention.pivot(index=\"signup_date\", columns=\"days_since_signup\", values=\"retention_rate\")\nprint(\"\\n=== 第1、3、7日留存率 ===\")\nprint(f\"第1日留存率: {retention_matrix[1].mean():.2%}\")\nprint(f\"第3日留存率: {retention_matrix[3].mean():.2%}\")\nprint(f\"第7日留存率: {retention_matrix[7].mean():.2%}\")\n\n# 漏斗分析\nevent_order = [\"signup\", \"login\", \"add_to_cart\", \"purchase\"]\nfunnel_data = df.groupby(\"event_type\")[\"user_id\"].nunique().reset_index()\nfunnel_data.columns = [\"event_type\", \"user_count\"]\nfunnel_data = funnel_data[funnel_data[\"event_type\"].isin(event_order)]\nfunnel_data[\"event_order\"] = funnel_data[\"event_type\"].map({event: i for i, event in enumerate(event_order)})\nfunnel_data = funnel_data.sort_values(\"event_order\").drop(\"event_order\", axis=1)\nfunnel_data[\"conversion_rate\"] = funnel_data[\"user_count\"] / funnel_data[\"user_count\"].iloc[0]\n\nprint(\"\\n=== 漏斗分析 ===\")\nprint(funnel_data)',
      answerExplanation: '**解题思路：**\n\n1. **同期群分析**：按用户首次注册日期分组，追踪不同批次用户的留存情况\n2. **留存率计算**：计算第1、3、7日留存率\n3. **漏斗分析**：分析注册→登录→加购→支付的转化漏斗\n\n**关键要点：**\n- groupby().min() 用于获取用户首次注册日期\n- pivot() 用于生成留存率矩阵\n- 漏斗分析需要按事件顺序排列'
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
print(f"对照组：{control_ci[0]:.4f} - {control_ci[1]:.4f}")`,
      answerCode: '# A/B测试结果分析 - 完整答案\nimport pandas as pd\nimport numpy as np\nfrom scipy.stats import chi2_contingency\n\n# 加载A/B测试数据\ndf = load_ab_test()\n\nprint(\"=== 分组统计 ===\")\nab_stats = df.groupby(\"group\").agg(\n    total_users=(\"user_id\", \"count\"),\n    converted_users=(\"converted\", \"sum\"),\n    conversion_rate=(\"converted\", \"mean\")\n).reset_index()\nprint(ab_stats)\n\n# 计算转化率差异\ntest_group = ab_stats[ab_stats[\"group\"] == \"test\"]\ncontrol_group = ab_stats[ab_stats[\"group\"] == \"control\"]\n\nconversion_diff = test_group[\"conversion_rate\"].values[0] - control_group[\"conversion_rate\"].values[0]\nrelative_improvement = conversion_diff / control_group[\"conversion_rate\"].values[0]\n\nprint(f\"\\n转化率差异: {conversion_diff:.4f}\")\nprint(f\"相对提升: {relative_improvement:.2%}\")\n\n# 卡方检验\ncontingency_table = pd.crosstab(df[\"group\"], df[\"converted\"])\nchi2, p_value, dof, expected = chi2_contingency(contingency_table)\n\nprint(f\"\\n卡方检验结果:\")\nprint(f\"卡方统计量: {chi2:.4f}\")\nprint(f\"P值: {p_value:.4f}\")\n\n# 结论\nif p_value < 0.05:\n    print(\"\\n结论：实验组转化率显著高于对照组（α=0.05）\")\nelse:\n    print(\"\\n结论：实验组转化率与对照组无显著差异（α=0.05）\")',
      answerExplanation: '**解题思路：**\n\n1. **分组统计**：计算实验组和对照组的转化率\n2. **转化率差异**：计算绝对差异和相对提升\n3. **卡方检验**：检验两组转化率是否存在显著差异\n4. **结论判断**：根据P值判断是否显著（α=0.05）\n\n**关键要点：**\n- 卡方检验适用于分类数据的独立性检验\n- P值 < 0.05 表示结果具有统计学显著性\n- 效应量（如Cramer\'s V）用于衡量差异大小'
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
print("\n聚类结果已保存到 user_clusters.csv")`,
      answerCode: '# K-Means用户聚类 - 完整答案\nimport pandas as pd\nimport numpy as np\nfrom sklearn.cluster import KMeans\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.metrics import silhouette_score\n\n# 加载用户特征数据\ndf = load_user_features()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\n# 数据标准化\nfeatures = df[[\"total_amount\", \"frequency\", \"recency\", \"avg_order_value\"]]\nscaler = StandardScaler()\nscaled_features = scaler.fit_transform(features)\n\n# 肘部法则确定K值\ninertia = []\nfor k in range(1, 8):\n    kmeans = KMeans(n_clusters=k, random_state=42)\n    kmeans.fit(scaled_features)\n    inertia.append(kmeans.inertia_)\n\nprint(\"\\n=== 肘部法则结果 ===\")\nfor i, val in enumerate(inertia):\n    print(f\"K={i+1}: 惯性={val:.2f}\")\n\n# 选择K=4进行聚类\nk = 4\nkmeans = KMeans(n_clusters=k, random_state=42)\nclusters = kmeans.fit_predict(scaled_features)\ndf[\"cluster\"] = clusters\n\n# 计算轮廓系数\nsilhouette_avg = silhouette_score(scaled_features, clusters)\nprint(f\"\\n轮廓系数: {silhouette_avg:.4f}\")\n\n# 分析聚类特征\ncluster_analysis = df.groupby(\"cluster\").agg({\n    \"total_amount\": \"mean\",\n    \"frequency\": \"mean\",\n    \"recency\": \"mean\",\n    \"avg_order_value\": \"mean\",\n    \"user_id\": \"count\"\n}).reset_index()\n\nprint(\"\\n=== 聚类分析结果 ===\")\nprint(cluster_analysis)',
      answerExplanation: '**解题思路：**\n\n1. **数据标准化**：使用StandardScaler对特征进行标准化处理\n2. **肘部法则**：计算不同K值的惯性，选择肘部点作为最佳K\n3. **K-Means聚类**：使用选定的K值进行聚类\n4. **聚类评估**：使用轮廓系数评估聚类效果\n5. **聚类分析**：分析每个聚类的特征并命名\n\n**关键要点：**\n- 数据标准化是K-Means聚类的必要步骤\n- 肘部法则帮助确定最佳聚类数\n- 轮廓系数范围[-1,1]，越大表示聚类效果越好'
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
print("\n分析结果已保存")`,
      answerCode: '# 商品价格带与购物篮大小分析 - 完整答案\nimport pandas as pd\nimport numpy as np\n\n# 加载购物篮数据\ndf = load_basket_data()\n\nprint(\"=== 数据基本信息 ===\")\nprint(df.info())\n\n# 计算购物篮总金额和商品数量\nbasket_analysis = df.groupby(\"order_id\").agg(\n    total_amount=(\"price\", \"sum\"),\n    item_count=(\"quantity\", \"sum\")\n).reset_index()\n\n# 定义购物篮大小\ndef basket_size(row):\n    if row[\"item_count\"] <= 2:\n        return \"小篮（1-2件）\"\n    elif row[\"item_count\"] <= 5:\n        return \"中篮（3-5件）\"\n    else:\n        return \"大篮（6件以上）\"\n\nbasket_analysis[\"basket_size\"] = basket_analysis.apply(basket_size, axis=1)\n\n# 分析不同购物篮大小\nbasket_size_analysis = basket_analysis.groupby(\"basket_size\").agg(\n    order_count=(\"order_id\", \"count\"),\n    avg_total_amount=(\"total_amount\", \"mean\"),\n    avg_item_count=(\"item_count\", \"mean\")\n).reset_index()\n\nprint(\"\\n=== 购物篮大小分析 ===\")\nprint(basket_size_analysis)\n\n# 价格带分析\ndf[\"price_band\"] = pd.qcut(df[\"price\"], 4, labels=[\"低价位\", \"中低价位\", \"中高价位\", \"高价位\"])\n\nprice_band_analysis = df.groupby(\"price_band\").agg(\n    product_count=(\"product_id\", \"count\"),\n    avg_price=(\"price\", \"mean\")\n).reset_index()\n\nprint(\"\\n=== 价格带分析 ===\")\nprint(price_band_analysis)',
      answerExplanation: '**解题思路：**\n\n1. **购物篮分析**：按订单分组，计算每个订单的总金额和商品数量\n2. **购物篮大小分类**：定义小篮（1-2件）、中篮（3-5件）、大篮（6件以上）\n3. **价格带分析**：使用qcut按分位数划分价格带\n4. **交叉分析**：分析不同价格带商品的购买情况\n\n**关键要点：**\n- qcut按分位数划分，确保每个区间样本数量大致相等\n- groupby().agg()用于聚合多个指标\n- 自定义函数配合apply实现复杂分类逻辑'
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
print("\n分析结果已保存")`,
      answerCode: '# 电商综合诊断 - 完整答案\nimport pandas as pd\nimport numpy as np\n\n# 加载所有数据\norders = load_orders()\nusers = load_users()\nproducts = load_products()\nreviews = load_reviews()\n\nprint(\"=== 数据加载完成 ===\")\nprint(f\"订单数: {len(orders)}\")\nprint(f\"用户数: {len(users)}\")\nprint(f\"商品数: {len(products)}\")\nprint(f\"评价数: {len(reviews)}\")\n\n# 多表合并\norder_product = orders.merge(products, on=\"product_id\", how=\"left\")\norder_product_user = order_product.merge(users, on=\"user_id\", how=\"left\")\n\n# 1. 商品类别复购率分析\nuser_category_purchase = order_product.groupby([\"user_id\", \"category\"]).agg(\n    purchase_count=(\"order_id\", \"count\")\n).reset_index()\n\ncategory_repurchase = user_category_purchase.groupby(\"category\").agg(\n    total_users=(\"user_id\", \"nunique\"),\n    repurchase_users=(\"purchase_count\", lambda x: (x >= 2).sum())\n).reset_index()\n\ncategory_repurchase[\"repurchase_rate\"] = category_repurchase[\"repurchase_users\"] / category_repurchase[\"total_users\"]\ncategory_repurchase = category_repurchase.sort_values(\"repurchase_rate\", ascending=False)\n\nprint(\"\\n=== 商品类别复购率 ===\")\nprint(category_repurchase)\nprint(f\"\\n复购率最高的类别: {category_repurchase.iloc[0][\"category\"]} ({category_repurchase.iloc[0][\"repurchase_rate\"]:.2%})\")\n\n# 2. 时段流失分析\norders[\"order_hour\"] = pd.to_datetime(orders[\"order_date\"]).dt.hour\nuser_order_count = orders.groupby(\"user_id\").agg(\n    order_count=(\"order_id\", \"count\"),\n    first_order_hour=(\"order_hour\", \"first\")\n).reset_index()\n\nchurned_users = user_order_count[user_order_count[\"order_count\"] == 1]\nhourly_churn = churned_users.groupby(\"first_order_hour\")[\"user_id\"].nunique().reset_index()\nhourly_churn.columns = [\"order_hour\", \"churned_users\"]\n\nhourly_users = orders.groupby(\"order_hour\")[\"user_id\"].nunique().reset_index()\nhourly_users.columns = [\"order_hour\", \"total_users\"]\n\nhourly_analysis = hourly_users.merge(hourly_churn, on=\"order_hour\", how=\"left\")\nhourly_analysis[\"churn_rate\"] = hourly_analysis[\"churned_users\"] / hourly_analysis[\"total_users\"]\nhourly_analysis = hourly_analysis.sort_values(\"churn_rate\", ascending=False)\n\nprint(\"\\n=== 时段流失分析 ===\")\nprint(f\"流失最严重的时段: {hourly_analysis.iloc[0][\"order_hour\"]}点 ({hourly_analysis.iloc[0][\"churn_rate\"]:.2%})\")',
      answerExplanation: '**解题思路：**\n\n1. **多表合并**：将订单表、用户表、商品表、评价表合并\n2. **复购率分析**：计算每个商品类别的复购率\n3. **时段流失分析**：分析不同时段下单用户的流失情况\n4. **交叉销售分析**：分析商品关联购买模式\n5. **综合建议**：基于分析结果提出业务建议\n\n**关键要点：**\n- merge()用于多表关联\n- groupby().agg()用于复杂聚合\n- 综合运用前面项目的所有技术'
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
                        onClick={handleShowAnswer}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg w-full justify-center"
                      >
                        显示正确答案
                        <Play className="w-5 h-5" />
                      </button>
                      
                      <button
                        onClick={handleResetCode}
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
                initialCode={showAnswer ? selectedProject.answerCode : selectedProject.defaultCode}
                language="python"
                onRunCode={runCode}
              />
              <CodeOutput
                output={output}
                error={error}
                isLoading={isLoading}
              />
              {showAnswer && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-purple-600" />
                    答案解析
                  </h3>
                  <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                    {selectedProject.answerExplanation}
                  </div>
                </div>
              )}
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


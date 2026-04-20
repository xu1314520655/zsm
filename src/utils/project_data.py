
import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import os

# 确保数据目录存在
data_dir = 'data'
os.makedirs(data_dir, exist_ok=True)

# 项目1：电商订单数据清洗与质量评估
def generate_order_data():
    np.random.seed(42)
    n = 10000
    
    order_ids = [f'ORDER_{i:06d}' for i in range(n)]
    customer_ids = [f'CUST_{random.randint(1000, 9999)}' for _ in range(n)]
    order_dates = [datetime.now() - timedelta(days=random.randint(1, 90)) for _ in range(n)]
    amounts = np.random.uniform(10, 1000, n)
    
    # 引入缺失值
    for i in range(0, n, 10):
        customer_ids[i] = np.nan  # 10% 缺失
    for i in range(0, n, 15):
        amounts[i] = np.nan  # 约7% 缺失
    
    # 引入异常值
    for i in range(0, n, 20):
        amounts[i] = amounts[i] * 10  # 5% 异常值
    
    # 引入重复记录
    df = pd.DataFrame({
        'order_id': order_ids,
        'customer_id': customer_ids,
        'order_date': order_dates,
        'amount': amounts,
        'status': [random.choice(['completed', 'pending', 'cancelled']) for _ in range(n)]
    })
    
    # 添加重复行
    duplicates = df.sample(100, random_state=42)
    df = pd.concat([df, duplicates], ignore_index=True)
    
    df.to_csv(os.path.join(data_dir, 'orders.csv'), index=False)
    print('项目1数据生成完成: orders.csv')

# 项目2：用户行为日志解析与特征工程
def generate_user_logs():
    np.random.seed(42)
    n = 50000
    
    user_ids = [f'USER_{random.randint(1000, 9999)}' for _ in range(n)]
    timestamps = [datetime.now() - timedelta(minutes=random.randint(1, 43200)) for _ in range(n)]  # 30天内
    
    # 页面类型
    page_types = ['home', 'product', 'cart', 'checkout', 'payment', 'profile', 'search']
    urls = [f'https://example.com/{random.choice(page_types)}/{random.randint(1, 1000)}' for _ in range(n)]
    
    df = pd.DataFrame({
        'timestamp': timestamps,
        'user_id': user_ids,
        'url': urls,
        'ip_address': [f'{random.randint(1, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}.{random.randint(0, 255)}' for _ in range(n)]
    })
    
    df.to_csv(os.path.join(data_dir, 'user_logs.csv'), index=False)
    print('项目2数据生成完成: user_logs.csv')

# 项目3：购物车分析 —— 关联规则挖掘准备
def generate_transaction_data():
    np.random.seed(42)
    n = 10000
    
    # 商品列表
    products = [
        '牛奶', '面包', '鸡蛋', '水果', '蔬菜', '肉类', '饮料', '零食',
        '洗发水', '牙膏', '纸巾', '洗涤剂', '化妆品', '电子产品', '服装'
    ]
    
    order_ids = []
    product_names = []
    
    for i in range(n):
        order_id = f'ORDER_{i:06d}'
        # 每个订单1-5个商品
        num_products = random.randint(1, 5)
        order_products = random.sample(products, num_products)
        
        for product in order_products:
            order_ids.append(order_id)
            product_names.append(product)
    
    df = pd.DataFrame({
        'order_id': order_ids,
        'product_name': product_names
    })
    
    df.to_csv(os.path.join(data_dir, 'transactions.csv'), index=False)
    print('项目3数据生成完成: transactions.csv')

# 项目4：RFM客户价值分群
def generate_customer_transactions():
    np.random.seed(42)
    n = 5000
    
    customer_ids = [f'CUST_{i:04d}' for i in range(1000)]  # 1000个客户
    
    data = []
    for customer_id in customer_ids:
        # 每个客户1-20笔交易
        num_transactions = random.randint(1, 20)
        for _ in range(num_transactions):
            transaction_date = datetime.now() - timedelta(days=random.randint(1, 365))
            amount = random.uniform(50, 500)
            data.append([customer_id, transaction_date, amount])
    
    df = pd.DataFrame(data, columns=['customer_id', 'transaction_date', 'amount'])
    
    df.to_csv(os.path.join(data_dir, 'customer_transactions.csv'), index=False)
    print('项目4数据生成完成: customer_transactions.csv')

# 项目5：时间序列分析 —— 销售趋势与异常检测
def generate_sales_data():
    np.random.seed(42)
    
    # 365天数据
    dates = [datetime.now() - timedelta(days=i) for i in range(365)][::-1]
    
    # 基础趋势
    base_trend = np.linspace(1000, 1500, 365)
    # 季节性（周）
    weekly_seasonality = np.sin(np.arange(365) * (2 * np.pi / 7)) * 100
    # 噪声
    noise = np.random.normal(0, 50, 365)
    # 节假日效应
    holiday_effect = np.zeros(365)
    holidays = [1, 10, 50, 100, 150, 200, 250, 300, 350]  # 假设的节假日
    for day in holidays:
        holiday_effect[day] = 300
    
    sales = base_trend + weekly_seasonality + noise + holiday_effect
    sales = np.maximum(sales, 500)  # 确保销售额为正
    
    # 添加异常点
    sales[::60] *= 2  # 每60天一个异常点
    
    df = pd.DataFrame({
        'date': dates,
        'sales': sales,
        'is_holiday': [1 if i in holidays else 0 for i in range(365)]
    })
    
    df.to_csv(os.path.join(data_dir, 'sales_data.csv'), index=False)
    print('项目5数据生成完成: sales_data.csv')

# 项目6：用户留存与漏斗分析
def generate_user_events():
    np.random.seed(42)
    n = 20000
    
    user_ids = []
    dates = []
    event_types = []
    
    # 生成1000个用户的事件
    for user_id in range(1000):
        user_id_str = f'USER_{user_id:04d}'
        signup_date = datetime.now() - timedelta(days=random.randint(1, 90))
        
        # 注册事件
        user_ids.append(user_id_str)
        dates.append(signup_date)
        event_types.append('signup')
        
        # 登录事件（30%概率每天登录）
        for day in range(1, 30):
            if random.random() < 0.3:
                user_ids.append(user_id_str)
                dates.append(signup_date + timedelta(days=day))
                event_types.append('login')
        
        # 加购事件（10%概率）
        if random.random() < 0.1:
            user_ids.append(user_id_str)
            dates.append(signup_date + timedelta(days=random.randint(1, 15)))
            event_types.append('add_to_cart')
        
        # 购买事件（5%概率）
        if random.random() < 0.05:
            user_ids.append(user_id_str)
            dates.append(signup_date + timedelta(days=random.randint(1, 20)))
            event_types.append('purchase')
    
    df = pd.DataFrame({
        'user_id': user_ids,
        'date': dates,
        'event_type': event_types
    })
    
    df.to_csv(os.path.join(data_dir, 'user_events.csv'), index=False)
    print('项目6数据生成完成: user_events.csv')

# 项目7：A/B测试结果分析（假设检验）
def generate_ab_test_data():
    np.random.seed(42)
    n = 10000
    
    # 控制组：10%转化率
    control_group = pd.DataFrame({
        'user_id': [f'USER_{i:06d}' for i in range(5000)],
        'group': 'control',
        'converted': np.random.binomial(1, 0.1, 5000)
    })
    
    # 实验组：15%转化率
    test_group = pd.DataFrame({
        'user_id': [f'USER_{i:06d}' for i in range(5000, 10000)],
        'group': 'test',
        'converted': np.random.binomial(1, 0.15, 5000)
    })
    
    df = pd.concat([control_group, test_group], ignore_index=True)
    
    df.to_csv(os.path.join(data_dir, 'ab_test.csv'), index=False)
    print('项目7数据生成完成: ab_test.csv')

# 项目8：K-Means用户聚类（基于消费行为）
def generate_user_features():
    np.random.seed(42)
    n = 1000
    
    # 生成4个聚类的用户
    cluster_1 = pd.DataFrame({
        'user_id': [f'USER_{i:04d}' for i in range(250)],
        'total_spend': np.random.normal(5000, 1000, 250),
        'frequency': np.random.normal(20, 5, 250),
        'recency': np.random.normal(5, 2, 250),
        'avg_order_value': np.random.normal(250, 50, 250)
    })
    
    cluster_2 = pd.DataFrame({
        'user_id': [f'USER_{i:04d}' for i in range(250, 500)],
        'total_spend': np.random.normal(1000, 300, 250),
        'frequency': np.random.normal(5, 2, 250),
        'recency': np.random.normal(15, 5, 250),
        'avg_order_value': np.random.normal(200, 30, 250)
    })
    
    cluster_3 = pd.DataFrame({
        'user_id': [f'USER_{i:04d}' for i in range(500, 750)],
        'total_spend': np.random.normal(2000, 500, 250),
        'frequency': np.random.normal(10, 3, 250),
        'recency': np.random.normal(10, 3, 250),
        'avg_order_value': np.random.normal(200, 40, 250)
    })
    
    cluster_4 = pd.DataFrame({
        'user_id': [f'USER_{i:04d}' for i in range(750, 1000)],
        'total_spend': np.random.normal(8000, 2000, 250),
        'frequency': np.random.normal(30, 5, 250),
        'recency': np.random.normal(3, 1, 250),
        'avg_order_value': np.random.normal(267, 60, 250)
    })
    
    df = pd.concat([cluster_1, cluster_2, cluster_3, cluster_4], ignore_index=True)
    
    # 添加一些噪声
    df['total_spend'] += np.random.normal(0, 500, n)
    df['frequency'] = np.maximum(1, df['frequency'] + np.random.normal(0, 2, n))
    df['recency'] = np.maximum(1, df['recency'] + np.random.normal(0, 2, n))
    df['avg_order_value'] = np.maximum(50, df['avg_order_value'] + np.random.normal(0, 30, n))
    
    df.to_csv(os.path.join(data_dir, 'user_features.csv'), index=False)
    print('项目8数据生成完成: user_features.csv')

# 项目9：商品价格带与购物篮大小分析
def generate_basket_data():
    np.random.seed(42)
    n = 10000
    
    order_ids = []
    product_prices = []
    quantities = []
    is_high_profit = []
    discount_rates = []
    
    for i in range(5000):  # 5000个订单
        order_id = f'ORDER_{i:06d}'
        # 购物篮大小
        basket_size = random.randint(1, 10)
        
        for _ in range(basket_size):
            order_ids.append(order_id)
            # 价格带：低(0-50)、中(50-200)、高(200+)
            price = random.choice([
                random.uniform(10, 50),
                random.uniform(50, 200),
                random.uniform(200, 500)
            ])
            product_prices.append(price)
            quantities.append(random.randint(1, 3))
            # 高利润商品（30%概率）
            is_high_profit.append(1 if random.random() < 0.3 else 0)
            # 折扣率（与购物篮大小相关）
            discount = min(0.3, basket_size * 0.02)
            discount_rates.append(discount)
    
    df = pd.DataFrame({
        'order_id': order_ids,
        'product_price': product_prices,
        'quantity': quantities,
        'is_high_profit': is_high_profit,
        'discount_rate': discount_rates
    })
    
    df.to_csv(os.path.join(data_dir, 'basket_data.csv'), index=False)
    print('项目9数据生成完成: basket_data.csv')

# 项目10：完整数据分析报告 —— 电商综合诊断
def generate_complete_data():
    # 生成订单表
    generate_order_data()
    
    # 生成用户表
    np.random.seed(42)
    n = 2000
    
    user_ids = [f'CUST_{i:04d}' for i in range(n)]
    registration_dates = [datetime.now() - timedelta(days=random.randint(1, 365)) for _ in range(n)]
    genders = [random.choice(['M', 'F']) for _ in range(n)]
    age_groups = [random.choice(['18-24', '25-34', '35-44', '45+']) for _ in range(n)]
    
    users_df = pd.DataFrame({
        'customer_id': user_ids,
        'registration_date': registration_dates,
        'gender': genders,
        'age_group': age_groups
    })
    users_df.to_csv(os.path.join(data_dir, 'users.csv'), index=False)
    
    # 生成商品表
    products = [
        ('电子产品', '手机', 2999),
        ('电子产品', '电脑', 5999),
        ('服装', 'T恤', 99),
        ('服装', '牛仔裤', 299),
        ('食品', '零食', 29),
        ('食品', '饮料', 9),
        ('家居', '床上用品', 199),
        ('家居', '厨房用品', 149)
    ]
    
    product_df = pd.DataFrame(products, columns=['category', 'product_name', 'price'])
    product_df['product_id'] = [f'PROD_{i:04d}' for i in range(len(products))]
    product_df.to_csv(os.path.join(data_dir, 'products.csv'), index=False)
    
    # 生成评价表
    order_ids = [f'ORDER_{i:06d}' for i in range(1000)]
    ratings = [random.randint(1, 5) for _ in range(1000)]
    reviews = [random.choice([
        '非常满意', '满意', '一般', '不满意', '非常不满意'
    ]) for _ in range(1000)]
    
    review_df = pd.DataFrame({
        'order_id': order_ids,
        'rating': ratings,
        'review': reviews,
        'review_date': [datetime.now() - timedelta(days=random.randint(1, 30)) for _ in range(1000)]
    })
    review_df.to_csv(os.path.join(data_dir, 'reviews.csv'), index=False)
    
    print('项目10数据生成完成: users.csv, products.csv, reviews.csv')

if __name__ == '__main__':
    print('开始生成训练项目数据...')
    generate_order_data()
    generate_user_logs()
    generate_transaction_data()
    generate_customer_transactions()
    generate_sales_data()
    generate_user_events()
    generate_ab_test_data()
    generate_user_features()
    generate_basket_data()
    generate_complete_data()
    print('所有数据生成完成！')


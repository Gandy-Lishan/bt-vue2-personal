import Mock from 'mockjs';

// 示例：拦截/api/data的请求，返回模拟数据
Mock.mock('/api/data', 'get', {
  'status': 200,
  'data|10': [{
    'id|+1': 1,
    'name': '@name',
    'age|18-60': 1
  }]
});

console.log('Mock Server Running...');

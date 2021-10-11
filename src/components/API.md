##### 1. signal 数据列表

- 请求路径：signal
- 请求方式： get
- 请求参数：
  > 参数名：filter(过滤项)、pagenum(当前页码)、pagesize(每页显示条数)
- 响应参数：

  > 参数名：total(总记录数)、pagenum(当前页码)、signal(signal 数据合集)
  > 接口数据示例
  > {

      "data": {
        "total": 60,
        "pagenum": 1,
        "signal": [
          {
            "type": "long",
            "analysis_basis": "sentiment",
            "name": "long signal for short-term trading S&P 500",
            "used_indicators": "Short term Combined Model",
            "description": "Consider going long the S&P 500 when the Short Term Combined model reading is below -10",
            "winrate_percentage": "50%",
            "risk_reward_ratio": "1/2
          }
        ]
      },

  }

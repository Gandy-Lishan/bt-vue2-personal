mockDate: {
  stock_name: "AAPL",
  cash: 10000.0,
  cashalloc: 0.2,
  commission: 0.001,
  slippage: 0.02,
  riskfreerate: 0.001,
  fromdate: "2015-01-01",
  todate: "2016-12-31",
  Entry: {
    type: "long",
    analysis_basis: "technical",
    used_indicators: "SMA",
    frequency: "Weekly",
    combination: 0,
    score: 0.0,
    complication: 0,
    parameter: "SMA Value",
    condition: 2,
    period: 30
  },
  Exit: {
    type: "longexit",
    analysis_basis: "technical",
    used_indicators: "SMA",
    frequency: "Daily",
    combination: 0,
    score: 0.0,
    complication: 0,
    parameter: "SMA Value",
    condition: 1,
    period: 20
  }
}
export default mockDate
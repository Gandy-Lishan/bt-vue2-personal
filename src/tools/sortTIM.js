
// 排序规则函数
const sortByRule = (a, b) => {
  const order = {
    'Day': 0,
    'Days': 1,
    'Week': 2,
    'Weeks': 3,
    'Month': 4,
    'Months': 5
  };

  const getNumber = item => parseInt(item);

  const getItemInfo = item => {
    const parts = item.split(' ');
    const timeframe = parts[1];
    const number = getNumber(parts[0]);
    return { timeframe, number };
  };

  const aInfo = getItemInfo(a);
  const bInfo = getItemInfo(b);

  if (aInfo.timeframe !== bInfo.timeframe) {
    return order[aInfo.timeframe] - order[bInfo.timeframe];
  } else {
    return aInfo.number - bInfo.number;
  }
};
export default sortByRule
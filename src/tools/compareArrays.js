export function compareArrays(arr1, arr2) {
  const uniqueDates = [];

  // 将两个数组合并，并去除重复项
  const mergedArray = [...new Set([...arr1, ...arr2])];

  // 遍历合并后的数组
  mergedArray.forEach(date => {
    // 判断日期是否在两个数组中同时存在
    const isInArr1 = arr1.includes(date);
    const isInArr2 = arr2.includes(date);

    // 如果日期不在其中一个数组中，则将其添加到结果数组中
    if (isInArr1 && !isInArr2) {
      uniqueDates.push(date);
    } else if (!isInArr1 && isInArr2) {
      uniqueDates.push(date);
    }
  });

  return uniqueDates.length === 0 ? true : uniqueDates;
}
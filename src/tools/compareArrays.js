// 比较两数组，相同返回 true, 不同返回不同的元素 返回的是 Set 数据结构
export function compareArrays(arr1, arr2) {
  const diff = new Set();

  if (arr1.length !== arr2.length) {
    return diff.add(...arr1, ...arr2);
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      diff.add(arr1[i]).add(arr2[i]);
    }
  }

  return diff.size === 0 ? true : diff;
}
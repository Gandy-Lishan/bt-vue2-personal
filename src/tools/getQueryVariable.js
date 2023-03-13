function getQueryVariable(variable) {
  //获取当前URL中的查询字符串部分（即问号后面的部分）
  var query = window.location.search.substring(1);
  //把查询字符串按照&符号分割成数组
  var vars = query.split("&");
  //遍历数组中的每个元素
  for (var i = 0; i < vars.length; i++) {
    //把当前元素按照=符号分割成键和值
    var pair = vars[i].split("=");
    //如果当前元素的键等于参数名，则返回对应的值
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  //如果没有找到匹配的参数名，则返回false
  return false;
}
export default getQueryVariable
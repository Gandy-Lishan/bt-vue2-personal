/* Used to determine whether the data is JSON */
const isJson = function(str){
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(typeof obj == 'object' && obj ){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            return false;
        }
    }
}

const isSerialized = function(obj) {
    try {
      JSON.parse(obj);
      return true; // 解析成功，是已序列化的 JSON 字符串
    } catch (e) {
      return false; // 解析失败，不是已序列化的 JSON 字符串
    }
  }

  
export {isJson, isSerialized}
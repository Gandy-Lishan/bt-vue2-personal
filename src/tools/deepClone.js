function deepClone1(obj) {
    var _obj = JSON.stringify(obj),
      objClone = JSON.parse(_obj);
    return objClone;
  }
  export default deepClone1

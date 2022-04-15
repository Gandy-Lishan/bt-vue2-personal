function throttle (fn, delay) {
  var t = null;
  let begin = new Date().getTime();
  return function () {
    const _self = this;
    const  args = arguments;
    let cur = new Date().getTime();
      clearTimeout(t);
      if(cur - begin >= delay){
        fn.apply(_self, args);
        begin = cur;
      }else{
        t = setTimeout(function () {
          fn.apply(_self, args)
        }, delay)
      }
  }
}
// The delay is triggered only once in time
export {
  throttle
}
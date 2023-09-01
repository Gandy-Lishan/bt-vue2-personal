/* Find items with the same array */
function searchKeys(data) {
  let sameArr = [];
  let list = [];

  for (let i = 0; i < data.length; i++) {
    const commentDes = data[i].commentDes;

    if (!list.includes(commentDes)) {
      let haveSame = false;
      let _index = i.toString();

      for (let j = i + 1; j < data.length; j++) {
        if (data[j].commentDes === commentDes) {
          _index += ',' + j;
          haveSame = true;
        }
      }

      if (haveSame) {
        list.push(commentDes);
        sameArr.push(_index);
      }
    }
  }

  return sameArr;
}

export default searchKeys



/* Find items with the same array */
function searchKeys(arr) {
	let sameArr = []
	let list = []
	for (let i = 0; i < arr.length; i++) {
		if(arr[i]) {
			let hasRead = false
		for (let k = 0; k < list.length; k++) {
			if (list[k] == arr[i]) {
				hasRead = true
			}
		}
			if (!hasRead) {
			let _index = i,
				haveSame = false
			for (let j = i + 1; j < arr.length; j++) {
				if (arr[i] == arr[j]) {
					_index += ',' + j
					haveSame = true
				}
			}
			if (haveSame) {
				list.push(arr[i])
				sameArr.push(_index)
			}
		}
		}
	}
	return sameArr
}
export default searchKeys

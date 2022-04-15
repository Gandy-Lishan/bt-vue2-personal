function searchKeys(arr) {
	let sameArr = []
	let list = []
	for (let i = 0; i < arr.length; i++) {
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
				// str += '数组下标为' + _index + '，相同值为' + arr[i] + '\n'
				sameArr.push(_index)
			}
		}
	}
	return sameArr
}
// const arr = [
// 	'TI:Alligator;IDS:ALLI;SC:TEETH/4/JAW',
// 	'TI:Alligator;IDS:ALLI;SC:TEETH/4/LIPS',
// 	'TI:Alligator;IDS:ALLI;SC:TEETH/4/TEETH',
// 	'SI:Smart Money Confidence;IDS:EO20/EP80;SC:SVMA20/3/20'
// ]
// console.log(searchKeys(arr))
// let sameIndexArr = searchKeys(arr)
// if (sameIndexArr.length > 1) {
// 	for (let j = 0; j < sameIndexArr.length; j++) {
// 		let sameItem = []
// 		sameItem = sameIndexArr[j].split(',')
// 		for (let n = 0; n < sameItem.length; n++) {
// 			console.log('相同的信号面板为' + sameItem[n])
// 		}
// 	}
// }
export default searchKeys

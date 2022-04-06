export function deepClone(obj) {
	// 深度拷贝对象、数组
	let deepClone = Array.isArray(obj) ? [] : {}
	if (obj && typeof obj === 'object') {
		for (let key in obj) {
			if (obj.hasOwnProperty(key)) {
				if (obj[key] && typeof obj[key] === 'object') {
					deepClone[key] = deepClone(obj[key])
				} else {
					deepClone[key] = obj[key]
				}
			}
		}
		return deepClone
	}
}

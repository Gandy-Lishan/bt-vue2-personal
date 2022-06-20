/* Generate UUID */
const crypto = require('crypto')
const reg = /(\w{4})/
function UUID(s) {
	let hash = null
	hash = crypto.createHash('md5')
	hash.update(s)
	let a = hash.digest('hex').split(reg)
	a.forEach(function (item, index, arr) {
		if (item === '') {
			arr.splice(index, 1)
		}
	})
	let c = ''
	for (let i = 0; i < a.length; i++) {
		if (i < 2) {
			c += a[i]
		} else if (i < 5) {
			c += '-' + a[i]
		} else if (i == 5) {
			c += '-' + a[i]
		} else {
			c += a[i]
		}
	}
	return c
}
export default UUID

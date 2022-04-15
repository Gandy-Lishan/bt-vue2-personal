const crypto = require('crypto')
const reg = /(\w{4})/
// // 可任意多次调用update(),效果相当于多个字符串相加
// hash.update('987653abc');
// hash.update('123456789');

// // 最终加密的字符串为'987653abc123456789',hash.digest('hex')表示输出的格式为16进制
// const a = hash.digest('hex');

// console.log(a);  // c3b93d3065f112b02ac70e09762469b0
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
// UUID('yrvyrtfyjifutyiftyf')
export default UUID

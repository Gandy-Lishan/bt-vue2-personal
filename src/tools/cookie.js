import Cookies from 'vue-cookie'
import CryptoJS from 'crypto-js'
const COOKIE_DOMAIN = '.sentdevsite.com'
const COOKIE_HASH = '49Xsc8027bdNU3174b2cbb92dwWWExa9'
const MY_DOMAIN = 'host.sentdevsite.com'
// const cookies = new Cookies(COOKIE_HASH);
export const setCookieData = (data, isLocal) => {
	const ciphertext =
		data === null
			? ''
			: CryptoJS.AES.encrypt(JSON.stringify(data), COOKIE_HASH).toString()
	return Cookies.set('my-test-id', ciphertext, {
		path: '/',
		domain: isLocal ? 'localhost' : MY_DOMAIN
	})
}

export const getCookieData = () => {
	const string = Cookies.get('sentimen_session')
	// const string =
	// 	'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHiyyC8aUXGJf1sVk3V3g1DOnddYhcNFhvfKk6GE7niVJpjGaiWpFdOSzIpJegTp6wrzLuSxZQHxgeBGsyOsIs3sToycuPQkt97utVpuFtWo1MCeEyON1QPkFA6suPxEVy+7zrpCQRN+FaQDNFKXG0RZAgClauHMEAJ19C5IihySD7gIQ6luZFfq6GdHssy0ebkmM/ViY3/NDzl7CLRC8LSIQ6MjxWHyntzNMyH6no/Y5bLsED7/QOCDRGZsQkRQe6v5qfsSEhYfndla2c+Yam4FrpJEtrJqx9wE3UmJ2M+CJA=='
	// const string = Cookies.get('my-test-id');
	const key = CryptoJS.enc.Utf8.parse(COOKIE_HASH)
	if (!string) {
		return null
	}
	const bytes = CryptoJS.AES.decrypt(string, key, {mode: CryptoJS.mode.ECB})
	// const bytes = CryptoJS.AES.decrypt(string, key, {
	// mode: CryptoJS.mode.ECB,
	// padding: CryptoJS.pad.Pkcs7
	// })
	const originalText = bytes.toString(CryptoJS.enc.Utf8)
	return originalText && originalText.length && originalText !== 'undefined'
		? JSON.parse(originalText)
		: null
}
// import Cookies from 'universal-cookie'
// import CryptoJS from 'crypto-js'

// const cookies = new Cookies(process.env.COOKIE_HASH)

// export const setCookieData = (data, isLocal) => {
// 	const key = CryptoJS.enc.Utf8.parse(process.env.COOKIE_HASH)
// 	const ciphertext =
// 		data === null
// 			? ''
// 			: CryptoJS.AES.encrypt(JSON.stringify(data), key, {
// 					mode: CryptoJS.mode.ECB,
// 					padding: CryptoJS.pad.Pkcs7
// 			  }).toString()

// 	return cookies.set('sentimen_session', ciphertext, {
// 		path: '/',
// 		domain: isLocal ? 'localhost' : process.env.COOKIE_DOMAIN
// 	})
// }

// export const getCookieData = () => {
// 	const string = cookies.get('sentimen_session')
// 	const key = CryptoJS.enc.Utf8.parse(process.env.COOKIE_HASH)
// 	if (!string) {
// 		return null
// 	}
// 	const bytes = CryptoJS.AES.decrypt(string, key, {
// 		mode: CryptoJS.mode.ECB,
// 		padding: CryptoJS.pad.Pkcs7
// 	})
// 	const originalText = bytes.toString(CryptoJS.enc.Utf8)

// 	return originalText && originalText.length && originalText !== 'undefined'
// 		? JSON.parse(originalText)
// 		: null
// }

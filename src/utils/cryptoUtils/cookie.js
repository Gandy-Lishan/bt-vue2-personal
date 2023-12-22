/*
	Get cookies and set cookies
*/
import Cookies from 'universal-cookie';
import VueCookies from 'vue-cookie';
import CryptoJS from 'crypto-js';
const COOKIE_DOMAIN = '.sentdevsite.com'
const COOKIE_HASH = '49Xsc8027bdNU3174b2cbb92dwWWExa9'
const MY_DOMAIN = '.sentimentrader.com'
const cookies = new Cookies(COOKIE_HASH);
export const setCookieData = (data, isLocal) => {
	const ciphertext =
		data === null
			? ''
			: CryptoJS.AES.encrypt(JSON.stringify(data), COOKIE_HASH).toString()
	return Cookies.set('sentimen_session', ciphertext, {
		path: '/',
		domain: isLocal ? 'localhost' : MY_DOMAIN
	})
}

// export const getCookieData = () => {
// 	let string = Cookies.get('sentimen_session');
// 	if(string.includes('%')) {
// 	  string = decodeURIComponent(string);
// 		Cookies.set('sentimen_session', string)
// 	}
// 	const key = CryptoJS.enc.Utf8.parse(COOKIE_HASH)
// 	if (!string) {
// 		return null
// 	}
// 	const bytes = CryptoJS.AES.decrypt(string, key, {mode: CryptoJS.mode.ECB})
// 	const originalText = bytes.toString(CryptoJS.enc.Utf8)
// 	return originalText && originalText.length && originalText !== 'undefined'
// 		? JSON.parse(originalText)
// 		: null
// }

export const getCookieData = (cookie = '') => {
	let string = cookie || cookies.get('sentimen_session');
	if(string.includes('%')) {
	  string = decodeURIComponent(string);
		VueCookies.set('sentimen_session', string)
	}

	const key = CryptoJS.enc.Utf8.parse(COOKIE_HASH);

	if (!string) {
		return null;
	}

	const bytes = CryptoJS.AES.decrypt(string, key, {
		mode: CryptoJS.mode.ECB,
	});
	const originalText = bytes.toString(CryptoJS.enc.Utf8);

	return originalText &&
		originalText.length &&
		originalText !== 'undefined'
		? JSON.parse(originalText)
		: null;
};

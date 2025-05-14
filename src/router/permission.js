import Cookies from 'vue-cookies'
import { CIQ } from '@/components/common/chart/st-development/js'
import { getCurDate } from '@/service/ai'
import { getIndicatorsRowData } from "@/service/service";
import { getQueryVariable, LocalStorageUtil, getTokenRole, printConsole } from '@/utils'
import store from '../store'
import { uniqWith, isEqual } from "lodash"
import { getCookieData } from "@/utils/cryptoUtils/cookie";

export function setRouterPermission(router) {
	router.beforeEach(async (to, from, next) => {
		// 如果跳入404，则直接进入跳转外链的待定阶段，没有其他cookie或者验证判断(准备弃用，因为登录后或者购买后404应该重新验证并跳转)
		//if(to.path == "/404") next()

		CIQ.store = store
		//  开发环境无法判断环境变量
		// if(process.env.ST_ENV === "dev" || process.env.ST_ENV === undefined) loginUrl = 'https://sentdevsite.com/login'
		// 先判断有无 sentimen_session
		if (Cookies.isKey('sentimen_session')) {
			// 删除 devbt2Userid
			Cookies.remove('devbt2Userid')
		} else {
			// 判断 url 有无 userid
			if (getQueryVariable('userid'))
				Cookies.set('devbt2Userid', getQueryVariable('userid'))
		}
		// 当跳转携带 backtestID 时，填充
		const backtestID = getQueryVariable('backtestID')
		if (backtestID) localStorage.setItem('backtestID', backtestID)
		// 当跳转携带 indicator 和 symbol 时，填充
		// const indicator = getQueryVariable('indicator')
		// let symbol = getQueryVariable('index')
		// if (symbol === 'Unknown'){
		// 	const rowData = await getIndicatorsRowData(indicator)
  //     const {market_symbol} = rowData?.data
		// 	const _symbol = market_symbol || 'SPX'
		// 	symbol = _symbol
		// }
		// if (symbol === 'TEN') symbol = 'ten'	// handle special case
		// if (indicator) sessionStorage.setItem('indicator', indicator)
		// if (symbol) sessionStorage.setItem('symbol', symbol)
		// 当有 sentimen_session 或 devbt2Userid 时才能发请求
		printConsole(process.env.NODE_ENV)
		if(process.env.NODE_ENV == 'development'){
			// hao@sentimentrader
			const _userCookies = 'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHgCIpzJIACssjQOW7bWH20fpw0OiGw0poJIV2Nzvk3FatVlMwKuU6zTMuorJTgFps1U8Hf6ux9GVpeoQR1iivqwN2hd9ZIY8qo4NiJD0KNh11JZNTcxiPKBDRcdvrCIKT6n6fP4p8m0vZCRGExnFzlNyGOMAg6L0P8uxwaORgH6lTcesVlyOUjwVPoejA8q5vu9+2Ua1ZC0EPtbgoyLBrCWduhPJnynwcIMq74y1JTK49iuJXZZ1xi0lq9R6vfCbfwQ6yKaPTUk5SLPIURdC+tXAgClauHMEAJ19C5IihySD7gIQ6luZFfq6GdHssy0ebkiQoEoX8ymUzMdH4a8jX583j6RaCOWJ+L9xfq8bbQ7vFSysWWZ6nzD3EbCdqKT7Kfvx5pSii2XwuP42aqx/k1nf26ufCqzOnUj4olrtCt/Tg=='
			// reports 权限
			// const _userCookies = "IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqdQrcuNNKjaFjCDJpptbkKEBBGDtuUiNycG03w9h1VkezpvTm0BdvYrnHrJbQm8XdjDG75olOAHnLoIzuBhH95QQh9lQK52awOyIAnQ55MrzxDroVR6gZhkF/lWfNUwC2dgagWW04VYkeLys1phd3Yifupks/kTkN2c/UcDmQ+BEBM0gMLIGnK3J1Knds5RDdxnZyi/ID3qWNxnNGYKTZf6DFMSvHKMNTeEVXtvptbBy2eqB1l3OX5WjCbfJJFtkotn4LL1LUML6evLgl6Tdr+zBBGDtuUiNycG03w9h1Vke5Pi4P3OVvyNrt7/sdPUBdPk9hdfGaP97xE2my/HuAne"
			// daniel@sentimentrader.com

			// const _userCookies = "IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqdEMzpmhxCv6gNShtTcDmbal9HogiBIRYhxP9M5JqBxhvRAoCi9fuRYJjeTsdb0VjwkMB27XTL0g1I3dW7w5v9XL6qlKrueeGC0Uli9jUq0AK3hz2XcFQbELMaMVR3TpMWSl4OV46kBaEQ2+X15NdZRq9pBUXsik/FD8n+xznUaxs3rtxKFbWFMbK9jCJEzgPrUiEHWHKBM5MlWrFsdG08U4TE+l7hXmVyAsAMMv03AduZoAdot4ilWWHEdg3Fzj4Bpeb4MJv9j3/w8hSd47J4Pfupks/kTkN2c/UcDmQ+BEBM0gMLIGnK3J1Knds5RDdxnZyi/ID3qWNxnNGYKTZf6hncazwRWKGcmprbtmXVye7J9mNxarng0OJsRRSvDEF8/H719MKJbl9GknLd5DZxGl9HogiBIRYhxP9M5JqBxhrAZERQfwQ5uPEnPN5jrE78M0Y+6xdHCfexMWtmR0Z1r"
			// research
			// const _userCookies = "IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqcsTz91zkuJk2wfg+q3b0AuZ7TqnVlZ+oRDVTXkC+xxcsndEt+m/nzXAA8wNg3qTixCWpQ5tFO+6vuXw29HD/Qjzeu3EoVtYUxsr2MIkTOA+oqCY89P1tKPStOoO0WuQaE3Msh+dNj6oYSTtFVBGzd6/uegvnDWsSxgT3pR04E//OLae8yOOSIc3bX/wOiJzdzU8riAwdq/dT6a7f8kBOph88bzKrmyR1UMnOgNtFA4a1zvnwvimjpeck1akEQaQSjs1fz/4bJtcNzuQ/IHj2LqLfjxa0yPLkhGi8nFeTgyvDu+g9g3YvCp0bQ71M8XgpcNR8g0dUCnZHWKblzhsgNIfIBslxbjFuahhKYKkdyl9vRlLb9S5/DNd/B83Mbl2BybgPEiNj5i+CagFTuPwOJs"
			// corelite
			// const _userCookies = "IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqejoZeS+pZ9xdhKrkTjTWcCFVxWebii4op4cCMiPBV73opZm7ogud2q1OLV96pFi+1K1E2kEHEDRSO73gIBBLzLgUs9px+NQUAhS6QuXGi61iXjPsyCUB+eZRfZ9cmee9jUARkAMoG/B1S8I3Htjb/vX/2j0sHgJbeplV2WSfrwAFMYBj9lCXHXCZ4oXH8hbfJIw0wqaRKd8xXx7SQHKFrhctGlPBiU/NVN+tuzK4g32K5DZib9pJY25o6aMK7uSOwU3Zr6IIsg5Nw1LD/s7dUxArFIVekxyQUKd9epvqDwXyLiaGJI7G1mhM0aKXbwRRDFlyVRtvqJMD9BXf0Or/hETAe6m96mFxmT3ccFQLrxOQ=="
			// datalite
			// const _userCookies = "IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqf7esOK24j4IZaV+aGkCMK1HDsNiXUfX5Pu5upJJST8oTpvTm0BdvYrnHrJbQm8XdjYFZgwUNoEBiuKsKAIH4rEW6nBv511krdR+eHgpUiRNjeE2og+1mrxGst89AW01Bj56Uo1kJPBGfw7MWFmpCeFkNoXjLNOzTbmMirhca1m7nEOyuDTUqoUp59w2G6c1gdLdLRI8tjYxKcH8tV8WFx1krMbQVbAzv4tegUYI5fOLTv/vcyCJxxnapa38ygsA7g="
			Cookies.set(
				'sentimen_session',
				_userCookies
				
			)
			// Cookies.set('session', _userCookies)
		}
		// Jason
		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqcN9CQdnFaRNktBfGsp36QeFVxWebii4op4cCMiPBV73opZm7ogud2q1OLV96pFi+0vcTpqWZAjLb0iJ6dp18kt5hH2geqpB1exbtw/yYdP2D9/VjibGDdw9DyfjBHRWaVoXd/mPe4WcTSnfnn1EMOqokSbIB1fAssMlGvUkAQdLOvUQfndgipjVbAhMO5rY25foEnSKruuuFKxZAhn+crXFtSbHwb23K5orItqrIwsjsJAiwZM7whCdHxcxB2D17jKrZ/o/ncL+IZRTL15p/klG7WAza/+HkiUsAVfbX+EBm/BD3NhZr437u0/OdtL+oWDDKX8aNxvhCNDS4Me0RFpuGWKFtlBevjOZlqqV08oj23EMUV24p3Njx3/XiRtH4bmziAmq8LE6/MM8L8hMWor'
		// )
		/* dean */
		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqcXnDSFIxtMrVEk8NDM/J1BJ6b0zEi712Cd/Wuu8VCSDrgP5IovRDyZmwIXdFxicPZZ07rW868yMR7Iab1kh0zUC3WoQQZnBaLpZ27Buvu5pUu/F7+211xHuWOEuyEQt6D9lMQDeQ5jAGpV/J/uVsLqfD9n+0hQxUhLItFmELpTrxVpiNQOZ0MtBHJiNo+fyKF63WtW8kFlRGqLEpCU8U/lXLL+RR4vvII1X6o84D0TYzg7G4kSsmu3tQJj7QpZ+Rfmqht63Tk4/E8FpXch/WeSjDcnUfavjAa8KynVD7Ega5+/8+OuiQuNiSc89YrXYjCTPiEOsd/zGwruaBmugeGl4lK7gx5Ukquf9L72KLFaJJB+vnmBRKuxM6AtJ1D2CtQdE2w2Fde38kYPyl24AB5S'
		// )

		/* normal user */
		// Cookies.set(
		// 	'sentimen_session',
		// 	"IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqdUTF4lDbhFi%2BG/AK9qppMeRdVuhKlUa0iTjInguKLY7tZjyiWv57kyoLcG888O0xAhu0H/KHwXnj1L5puZwd3oFOSUz5DVakcIvHH3J9PUYaNMpsGlkwwSBd%2BCLMUQOmEslNzkWxIy7QN7mFzarQpWbNCIQXhJam4wGXldOAHfqsyEupNJmR9e5VGQxRhK0qNMEApCb0dIU5tWjR3yBCYhwkCLBkzvCEJ0fFzEHYPXuMqtn%2Bj%2Bdwv4hlFMvXmn%2BSUbtYDNr/4eSJSwBV9tf4QGp9BmW5vD2SctAsQjfQo%2B9v6wt/wEpNFJgOL25VvoGF9hfB6KUV9TRts17P5ja%2BOaxkiCSWmF2MCRuZVqvaaEYXdhjzof%2BffgfACVlcYey8SSN4batfkGv%2BpxANe945EO"
		// )
	
		/* hao@sentimentrader.com */
		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHgCIpzJIACssjQOW7bWH20fpw0OiGw0poJIV2Nzvk3FatVlMwKuU6zTMuorJTgFps1U8Hf6ux9GVpeoQR1iivqwN2hd9ZIY8qo4NiJD0KNh11JZNTcxiPKBDRcdvrCIKT6n6fP4p8m0vZCRGExnFzlNyGOMAg6L0P8uxwaORgH6lTcesVlyOUjwVPoejA8q5vu9+2Ua1ZC0EPtbgoyLBrCWduhPJnynwcIMq74y1JTK49iuJXZZ1xi0lq9R6vfCbfwQ6yKaPTUk5SLPIURdC+tXAgClauHMEAJ19C5IihySD7gIQ6luZFfq6GdHssy0ebkiQoEoX8ymUzMdH4a8jX583j6RaCOWJ+L9xfq8bbQ7vFSysWWZ6nzD3EbCdqKT7Kfvx5pSii2XwuP42aqx/k1nf26ufCqzOnUj4olrtCt/Tg=='
		// )
		// research-monthly
		// Cookies.set('sentimen_session',
		// "IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqf/sBFMX616yOW7YUN5zVebiJ7W1Qv1Oe5lhvonA3DqQTpvTm0BdvYrnHrJbQm8XdjDG75olOAHnLoIzuBhH95Q5hH2geqpB1exbtw/yYdP2Fm1fE94tHyj1HY0rUWymoni2nvMjjkiHN21/8Doic3cpu388+FNN7XBJOT5ENgs3L8uKgdlbkLT2Y4//mPb0oQkyAH8s59AbgjdO8PYJbohvHK9CGLWtA+KDrEGkPqVsIN0Yua3XiT8VmJA+DXGC6QEmrgSphk3Gv9uPCsqbz6yF0Ogf6SCvzDCG4cBGcxzv10uNgkfra92bDG9OCVeAu+SvHsF2e+LYyt5q6OCD44l3dI3QYk4dDgxyCnkwvS4KCjqYroGOyzv8AnQf1fRcJ/7HjtGBVk6lZWR0Wz/Gv9d"
		// )
		// everything
		// Cookies.set('sentimen_session',
		// "IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqfBVkGCV4rpr1DK3aKxOc85wgqp0eI3LC2dkl7sQuuGwLgP5IovRDyZmwIXdFxicPaUl+bRg44d6PU1SnKcCGYLaXm+DCb/Y9/8PIUneOyeD+Z+jnvIrUGa3SRoaUnEgSxxls4Jem/UK+iJaEibfjd2aF3f5j3uFnE0p3559RDDqoVd4CyJJwQ/FvT/nd0Vb4yqb7QvzagQKpiUuuL0QY8NTRvwJwnjsfBHEeRVsXZ/EQQaOJKUNSeTgkZTZ+36WUZIw0wqaRKd8xXx7SQHKFrhctGlPBiU/NVN+tuzK4g32GxRQSx9d7iVZ1kJyW6rlkggYXmphC7Rl3QVAfytOp8hArFIVekxyQUKd9epvqDwX2Vb6J0ZjYwaKSoJcZhPHS4Q2yUFSbTs1vW/vY8JQHyx8Jv8plSPpWgHN/ymJF1+qQ=="
		// )

		/* erichuerichu003@gmail.com */

		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHgvUwa2PVjPkzAS3Cz0RiOfAcWgdbigTrlPMz+1DPMqZHSm7Bdl9U+9skjq8uFG+9ZuaUSU2cw9b5fl3zG2qYLillioMh+Ulz6t0A+dyomkyUNJ6XNYMoabcQfANgH0a7eMNydR9q+MBrwrKdUPsSBrsxa7yWy7GjkPaKamQ1iBoLEaLpff7cjysFfFwKrMGmLst41vP91uvmWrOTWzTe6aYvYesQSMLyyQT9FI9l2zIpI3htq1+Qa/6nEA173jkQ4='
		// )

		/* jinjing@elixiroftechnology.com */

		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqd8Wla1zo7ruX/cgQVVp3cgiqt/9WkKuHREX8aSJJ7mIC5GdVbirl1MowfCqGmZZYzzI4zhAL3Tey6TKBM3fD8sQuB+8YvL4zUehmqhzcAjDFrvjhktk3srF6kAB1eQGEiittMsmMhei4TX0qrt3ikE+infhHI0oBeMXf2J2i4MGuYR9oHqqQdXsW7cP8mHT9hoXd/mPe4WcTSnfnn1EMOqqZ1DGIB+mkPCA7BHS101X0+7EhpzWwAhim49KNkKwWgittqf0Ajf1gZ6jpzeuonFlN3h7cvcnOxxdMvZ7z6YAJUfJEau0yk/rnUkZpgcrc2jSFQXro+DG3EJJw97+tc28+HDqkJTAcz/VHKF3tktUd+ptxMi7jqya/wCy5wSX9L0ZS2/UufwzXfwfNzG5dgcm4DxIjY+YvgmoBU7j8DibA=='
		// )

		/* he+PB@sentimentrader.com */

		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqdVL9w+9RqKgMsDueS5f+2BFVxWebii4op4cCMiPBV73opZm7ogud2q1OLV96pFi+2+qzE4/ILSnmDhqElkFHI9mmf8DAM5cVRNJpHMI+SAgSeYCrC1/ZAc/DA8PCWXfAHswmJVM3XAYt3b4R11bmMI5n6Oe8itQZrdJGhpScSBLKpvtC/NqBAqmJS64vRBjw3PSsocTeKkji+OWnUG6KTFfId4fRWpIj47FlICxoE7RlTeGfRB2V/0DX9ClNsjrConH9rNV/DYDrkV7ox9paOLt1OmTEJi9IRD4+m1XyegNNo/HfYmvnds6RrfnmiSVA0XRfVDUJ3AL85XnqbwFI5UzAFehCmLWvpBYFPC90z+y3p59/icLFt8cqDx93jum4YkxuSKBKnT0INUzBhSIfy5bnE9qbfh2NuqiGPTVBlitw=='
		// )

		/* jinjing@elixiroftechnology.com */

		// Cookies.set(
		// 	'sentimen_session',
		// 	'IJLN7EhBuOXvsdvgYt7rLyYvp4GSk2hXdln69TOIHHhhO%2B65ptY8oR7y7M%2FpJ8xU36m3EyLuOrJr%2FALLnBJf0lgbQWWdLdd0Wv%2BcAjeN13qO%2FIZ4ifRX7V5OiD7gG4OoI4gNYu0rPJnWOFilqpB9nC7n36CeMNI%2BHVEIOu1VTV1kEZvcku30lgyE%2FmtKYbiBqW1e86SlvDZp9IHRs%2B320k6MnLj0JLfe7rVabhbVqNRIG5r5izjjRoQdsgngG7zLu866QkETfhWkAzRSlxtEWQIApWrhzBACdfQuSIockg%2B4CEOpbmRX6uhnR7LMtHm5lR8kRq7TKT%2BudSRmmBytzV2xBVSEvxkDNj4x%2F1cC6Q4bcyuhLXP8MNm9xNCFdp1l%2BWALb1ryZkuhMjQHhZfeWu1d5e5LWBVXPHGUA1TJZ7o%3D'
		// )

		// Cookies.set(
		// 	'sentimen-session',
		// 	'IJLN7EhBuOXvsdvgYt7rL0ygDYmDBQ7rF4xRIKaLAqcOrAwYSJ4eSBTuZhZqrInKI+C5rORbU/iO3bXPPpsd6sndEt+m/nzXAA8wNg3qTiym8DmTFO9E1dYMIsK/g/dxfId4fRWpIj47FlICxoE7RkeeNCd3UV1JMZlEx/hFtyHUARkAMoG/B1S8I3Htjb/vX/2j0sHgJbeplV2WSfrwABeUfgFvahpjXNn+xUxHH8smHHrUp+gLpfKeBmaxIqC9U1mEqJebqxfuVk5hKzD484S3SOmHNzyYYuYGXx/e00GDaFa0z0UNm3b+NNYl1y1DN4TaiD7WavEay3z0BbTUGNhgskUX8Zgd2tTLScWF/fG6dMUn/AUuoF+dXnjAfKnjcQ7K4NNSqhSnn3DYbpzWB7tQ81fTdf+YSTTVueh/vFiE801WK2HHYPXSXGyyHpTrOSgNBAgEnjmO1n4imKBKbw=='
		// )

		// test ignlore

		if (Cookies.isKey('sentimen_session') || Cookies.isKey('devbt2Userid')) {
			//set 10 sec as default,However, some time-consuming requests are processed separately
			if (
				getQueryVariable('userid') ||
				getQueryVariable('backtestID')
			) {
				if(getQueryVariable('backtestID') && !location.pathname.includes('backtester')) window.location.href = `${location.origin}/backtester/sr/setup${location.pathname}`
				else window.location.href = `${location.origin}${location.pathname}`
			}
			let _index = getQueryVariable('index') || ''
			let _indicator = getQueryVariable('indicator') || ''
			if(_index && _indicator) {
					if (_index === 'Unknown'){
						const rowData = await getIndicatorsRowData(_indicator)
						const {market_symbol} = rowData?.data
						_index = market_symbol || 'SPX'
					}
					if (_index === 'TEN') _index = 'ten'	// handle special case
					store.commit('chart/SET_JUMP_TO_BT_SYMBOL', _index)
			}
			if (to.path == '/404') {
				// todo 再加一层scannerAI或者backtester权限判断，用于在404页面跳转回网站，或者防止网站跳到404又无限循环
				//next('/home')
				next()
			} else {

				if (to.name == 'scannerai' || to.name == 'scannerai_chart') {
					await initiateCurrentDate()
					await initiateList(to.name)
					store.dispatch('states/set_scannerai_flag', true)
				} else {
					await initiateList(to.name)
					store.dispatch('states/set_scannerai_flag', false)
				}
			/* 权限跳转控制 */
   const access_level = getCookieData()?.access_level
			if(Array.isArray(access_level)) {
				// 全部权限 everything
				if(access_level.some(str => str.includes('everything')) || access_level.some(str => str.includes('premium'))) {
					next()
				}
				// 全部权限 Scanner 除外: essential, research
				else if(access_level.some(str => str.includes('essential')) || access_level.some(str => str.includes('research'))) {
					if(to.path.includes('/scannerai')) next('/dashboard')
				}
				// 全部权限 除了 Reports 页面: datalite
				else if(access_level.some(str => str.includes('datalite'))) {
					if(to.path.includes('/MR')) next('/dashboard')
				}
			// 只能访问 Reports 页面: reports
			else if(access_level.some(str => str.includes('reports')))  {
				const requiredPrefixes = ['/sentimentedge', '/quantedge', '/modeledge', '/tradingedge', '/favorites', '/tags']
				if(to.path.includes('/MR') && requiredPrefixes.some(prefix => to.path.includes(prefix))){next()}
				else next('/MR/sentimentedge')
			}
		 // 只能访问部分页面(report（仅限三类）,strategies, scanner): corelite
			else if(access_level.some(str => str.includes('corelite'))) {
				const requiredPrefixes = ['/sentimentedge', '/quantedge', '/modeledge', '/tradingedge','/favorites', '/tags']
				if(to.path.includes('/MR') && requiredPrefixes.some(prefix => to.path.includes(prefix)) || to.path.includes('/strategy') || to.path.includes('/scannerai')) next()
				else next('/MR/sentimentedge')
			}
			}
				next()
			}
		} else {
			//alert('No permission')
			//window.location.href = loginUrl
			// 这里是判断无cookie情况下进入登录界面，如果是从404

			if (to.path != '/404') {
				store.commit('states/setErrorMessage404', {
					status: 401,
					message: 'You have not logged in and do not have the access permission, Please sign in first'
				})
				next({
					path: '/404'
				})
			} else {
				next()
			}
		}
	})
}
async function initiateCurrentDate() {
	//现在外部实现一个获取当前日期并储存的功能，接触验证屏蔽后移到判断条件内部
	//if(store.state.chart.curDate==''){
	// getCurDate().then(async(res)=>{
	// 	let curDate =res['LastUpdatePickDate']
	// 	await store.dispatch('chart/set_cur_date',curDate).then(() => {console.log('set curdate',curDate)})
	// }).catch(error=>{
	// 	router.push({
	// 		path: '/404',
	// 		query: { mes: error?.response?.status , desc: ' the ScannerAI Page'}
	// 	})
	// })
	//}

	// todo 暂时用于权限验证，所以不判断缓存并跳过请求
	let _res = await getCurDate()
	let curDate = _res['LastUpdatePickDate']
	await store.dispatch('chart/set_cur_date', curDate).then(() => {
		console.log('set curdate', curDate)
	})
}

async function initiateList(pathname) {
	// at the very first beginning, replace all stock name in AllSymbolList with stock name + 'optix'
	// 这个数据基本不会变，存起来
	console.time("🚗 prepare sentiment list for cpm,myidnicator,seasonality");

	// indicator list内存在symbol + Optix的项（AAON Inc对比AAON Optix）,
	// 他们需要在此action内处理并url加上@indicator以区别对应symbol list的同名url， 
	// 和本来就是 index + Optix的项不同(SPY Optix)
	await CIQ.store.dispatch('chart/fetch_indicatorsList')

	let refactoredSentimentList = await fetchDataList('getIndicatorsList')
	refactoredSentimentList = refactoredSentimentList.filter(item => item !== null && item !== undefined && item !== '');
	const refactoredStocksList = await fetchDataList('getStockList')
	const refactoredIndexsList = await fetchDataList('getIndexList')
	let refactoredConcatList = refactoredStocksList.concat(refactoredIndexsList)
	// 耗时一秒而且没有排除项
	// refactoredConcatList = uniqWith(refactoredConcatList, isEqual)


	const storedSentimentList = localStorage.getItem('refactoredSentimentList');
	const storedConcatList = localStorage.getItem('refactoredConcatList');
	if (
		JSON.stringify(refactoredSentimentList) !== storedSentimentList ||
		JSON.stringify(refactoredConcatList) !== storedConcatList 
	) {
		localStorage.setItem('refactoredSentimentList',JSON.stringify(refactoredSentimentList))
		localStorage.setItem('refactoredConcatList',JSON.stringify(refactoredConcatList))
	}

	console.timeEnd("🚗 prepare sentiment list for cpm,myidnicator,seasonality");	

	//	改为了获取列表时请求
	// if (
	// 	store.getters.getFavoriteIndicatorList.length == 0 ||
	// 	store.getters.getFavoriteSymbolList.length == 0
	// ) {
	// 	await store.dispatch('chart/get_favorite')
	// }

	if (pathname == 'ActiveStudies' && store.getters.getSymbollistForecast.length == 0){
		await store.dispatch('chart/get_symbollist_forecast')
	}
}

async function fetchDataList(source) {
	const dataList = store.getters[source]
	const sourceMap = {
		getIndexList: { labelField: 'name', urlField: 'symbol', type: 'Symbol', category:  'category', inception: 'inception'},
		getStockList: { labelField: 'name', urlField: 'stock', type: 'Symbol', category:  'category', inception: 'inception'},
		getIndicatorsList: {
			labelField: 'chart_name',
			urlField: 'url',
			updateField: 'updated',
			type: 'Indicator',
			category:  'category'
		}
	}
	if (dataList.length !== 0 || !dataList) {
		const { labelField, urlField, type } = sourceMap[source]
		// return dataList.map((item) => ({
		// 	label: item[labelField],
		// 	url: item[urlField],
		// 	type
		// }))
		return dataList.map((item) => {
			const obj = {
				label: item[labelField],
				url: item[urlField],
				type
			}
			// if(item.updated === 'Daily') {
			// 	obj.updated = item.updated
			// 	return obj
			// }
			// 不需要限制 timeframe 为 Daily
			if(item.category) obj.category = item.category
			if(item.inception) obj.inception = item.inception
			if(item.updated) {
				obj.updated = item.updated
				return obj
			}
			if(!item.updated && (source === 'getIndexList' || source === 'getStockList')) {
				return obj
			}
		})
	}
		
}

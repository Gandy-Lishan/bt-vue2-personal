/*
	Signal decoding and encoding file
*/

class SignalDecodeIDS {
	constructor() {
		this.ids_dict = [
			this.slow_fast_sl,
			this.eo_ep,
			this.over_bought_sold_bound_period,
			this.ma_category
		]
	}
	slow_fast_sl(val) {
		var re =
			/^MACDSlow(-?0?\d*?\.?\d*?)\/MACDFast(-?0?\d*?\.?\d*?)\/MACDSL(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1) return false
		// var array = val.match(re)
		var data = {
			MACDSlow: RegExp.$1,
			MACDFast: RegExp.$2,
			MACDSL: RegExp.$3
		}
		return data
	}
	eo_ep(val) {
		var re = /^EO(-?0?\d*?\.?\d*?)\/EP(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1) return false
		// var array = val.match(re)
		var data = {
			extreme_optimism: RegExp.$1,
			extreme_pessimism: RegExp.$2
		}
		return data
	}
	over_bought_sold_bound_period(val) {
		var re =
			/^OBB(-?0?\d*?\.?\d*?)\/OSB(-?0?\d*?\.?\d*?)\/Period(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1) return false
		// var array = val.match(re)
		var data = {
			over_bought_bound: RegExp.$1,
			over_sold_bound: RegExp.$2,
			period: RegExp.$3
		}
		return data
	}
	ma_category(val) {
		var re = /^(SMA|EMA)$/
		if (val.search(re) == -1) return false
		// var array = val.match(re)
		var data = {
			ma_category: val
		}
		return data
	}
	decode(val) {
		var tmp
		for (var func in this.ids_dict) {
			tmp = this.ids_dict[func](val)
			// console.log(tmp);
			if (tmp) {
				break
			}
		}
		return tmp
	}
}

// let a = new SignalDecodeIDS();
// a.decode("EO120/EP20")
// a.decode("MACDSlow26/MACDFast12/MACDSL9")
class SignalDecodeSC {
	constructor() {
		this.sc_dict = [
			this.si_period_condition_value,
			this.si_condition_value,
			this.rsi_condition_value,
			this.macd_condition_value,
			this.ma_condition_period,
			this.exit_value_period,
			this.cci_condition_value
		]
	}
	si_condition_value(val) {
		var re = /^SV\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
		var re_ma = /^SV\/(-?0?\d*?\.?\d*?)\/SVMA(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1 && val.search(re_ma) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		if(val.search(re) != -1) return {
			condition: RegExp.$1,
			value: RegExp.$2
		}
		if(val.search(re_ma) != -1) return {
			condition: RegExp.$1,
			value: RegExp.$2
		}
	}
	si_period_condition_value(val) {
		var re = /^SVMA(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			period: RegExp.$1,
			condition: RegExp.$2,
			value: RegExp.$3
		}
		return data
	}
	macd_condition_value(val) {
		var re = /^MACDV\/(-?0?\d*?\.?\d*?)\/((-?0?\d*?\.?\d*?)|MACDSL)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			condition: RegExp.$1,
			value: RegExp.$2
		}
		return data
	}
	ma_condition_period(val) {
		var re =
			/^(SC|MA)(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)\/MA(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		if (RegExp.$2 !== '') {
			var data = {
				ma_period: RegExp.$2,
				condition: RegExp.$3,
				period: RegExp.$4
			}
		} else if (RegExp.$2 === '') {
			var data = {
				condition: RegExp.$3,
				period: RegExp.$4
			}
		}

		return data
	}
	rsi_condition_value(val) {
		var re = /^RSIV\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			condition: RegExp.$1,
			value: RegExp.$2
		}
		return data
	}
	cci_condition_value(val) {
		var re = /^CCIV\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			condition: RegExp.$1,
			value: RegExp.$2
		}
		return data
	}

	exit_value_period(val) {
		var re =
			/^PTE(-?0?\d*?\.?\d*?)\/LSE(-?0?\d*?\.?\d*?)\/TIM(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		// var tdata = this.ts(RegExp.$4)
		// if (!tdata) {
		//     return "The input parameters of Trainling Stop in the Signal Condition maybe error!"
		// }
		var ddata = {
			take_profit: RegExp.$1,
			stop_loss: RegExp.$2,
			time_in_market: RegExp.$3
		}
		// var data = Object.assign(tdata, ddata)
		return ddata
	}

	ts(val) {
		var key, value
		key = val.split(':')[0]
		value = val.split(':')[1]

		var atre_re = /^Period(-?0?\d*?\.?\d*?)\/MULTI(-?0?\d*?\.?\d*?)$/
		var psare_re = /^MAXSTEP(-?0?\d*?\.?\d*?)\/AF(-?0?\d*?\.?\d*?)$/
		if ((key == 'ATRE') & value.search(atre_re)) {
			var data = {
				atr_period: RegExp.$1,
				atr_multiplier: RegExp.$2
			}
		} else if ((key == 'PSARE') & value.search(psare_re)) {
			var data = {
				max_step: RegExp.$1,
				accelaration_factor: RegExp.$2
			}
		} else {
			var data = false
		}
		// var array = val.match(re)

		return data
	}
	decode(val) {
		var tmp

		for (var func in this.sc_dict) {
			tmp = this.sc_dict[func](val)
			// console.log(tmp);
			if (typeof tmp !== 'string') {
				break
			}
		}
		return tmp
	}
}

class SignalCode {
	constructor() {
		this.sc = new SignalDecodeSC()
		this.ids = new SignalDecodeIDS()
		this.backtest_dict = {
			Exit: this.ex,
			SI: this.si,
			TI: this.ti,
			UI: this.ui
			// "IDS": ids.decode,
			// "SC": sc.decode
		}
	}

	si(val) {
		return {
			analysis: 'Sentiment',
			indicator: val
		}
	}
	ui(val) {
		return {
			analysis: 'User',
			indicator: val
		}
	}
	ti(val) {
		return {
			analysis: 'Technical',
			indicator: val
		}
	}
	ex(val) {
		return {
			analysis: 'Exit',
			indicator: val
		}
	}
	re_indicator(val) {
		var re_str = ''
		var val_keys = Object.keys(val)
		if (
			(val_keys.indexOf('analysis') !== -1) &
			(val_keys.indexOf('analysis') !== -1)
		) {
			if (val['analysis'] == 'Sentiment') {
				re_str += 'SI:' + val['indicator'] + ';'
			} else if (val['analysis'] == 'Technical') {
				re_str += 'TI:' + val['indicator'] + ';'
			} else if (val['analysis'] == 'Exit') {
				re_str += 'Exit:' + val['indicator'] + ';'
			} else if(val['analysis'] == 'User') {
				re_str += 'UI:' + val['indicator'] + ';'
			}
		}
		return re_str
	}
	re_ids(val) {
		var val_keys = Object.keys(val)
		var re_str = 'IDS:'
		if (
			val_keys.indexOf('extreme_optimism') !== -1 &&
			val_keys.indexOf('extreme_pessimism') !== -1
		) {
			re_str +=
				'EO' + val['extreme_optimism'] + '/EP' + val['extreme_pessimism']
		} else if (
			val_keys.indexOf('MACDSlow') !== -1 &&
			val_keys.indexOf('MACDFast') !== -1 &&
			val_keys.indexOf('MACDSL') !== -1
		) {
			re_str +=
				'MACDSlow' +
				val['MACDSlow'] +
				'/MACDFast' +
				val['MACDFast'] +
				'/MACDSL' +
				val['MACDSL']
		} else if (val_keys.indexOf('ma_category') !== -1) {
			re_str += val['ma_category']
		} else if (
			val_keys.indexOf('over_bought_bound') !== -1 &&
			val_keys.indexOf('over_sold_bound') !== -1 &&
			val_keys.indexOf('period') !== -1
		) {
			re_str +=
				'OBB' +
				val['over_bought_bound'] +
				'/OSB' +
				val['over_sold_bound'] +
				'/Period' +
				val['period']
		}
		re_str += ';'
		return re_str
	}
	re_sc(val) {
		var re_str = 'SC:'
		var val_keys = Object.keys(val)
		if (val['analysis'] === 'Sentiment' || val['analysis'] === 'User') {
			if (val_keys.indexOf('period') !== -1) {
				re_str +=
					'SVMA' + val['period'] + '/' + val['condition'] + '/' + val['value']
			} else if (val_keys.indexOf('period') === -1) {
				re_str += 'SV/' + val['condition'] + '/' + val['value']
			}
		} else if (val['analysis'] === 'Technical') {
			if (val['indicator'] == 'Moving Average') {
				if (val_keys.indexOf('ma_period') === -1) {
					re_str += 'SC/' + val['condition'] + '/MA' + val['period']
				} else if (val_keys.indexOf('ma_period') !== -1) {
					re_str +=
						'MA' +
						val['ma_period'] +
						'/' +
						val['condition'] +
						'/MA' +
						val['period']
				}
			} else if (val['indicator'] == 'MACD') {
				if (val['value'] == 'MACDSL') {
					re_str += 'MACDV/' + val['condition'] + '/MACDSL'
				} else if (val['value'].toString().search(/(-?0?\d*?\.?\d*?)/) !== -1) {
					re_str += 'MACDV/' + val['condition'] + '/' + val['value']
				}
			} else if (val['indicator'] == 'Commodity Channel Index') {
				re_str += 'CCIV/' + val['condition'] + '/' + val['value']
			} else if (val['indicator'] == 'Relative Strength Index (RSI)') {
				re_str += 'RSIV/' + val['condition'] + '/' + val['value']
			}
		} else if (val['analysis'] === 'Exit') {
			var tmp = {
				take_profit: '',
				stop_loss: '',
				time_in_market: ''
			}
			tmp = Object.assign(tmp, val)
			re_str +=
				'PTE' +
				tmp['take_profit'] +
				'/LSE' +
				tmp['stop_loss'] +
				'/TIM' +
				tmp['time_in_market']
			// re_str += this.re_ts(tmp)
		}
		return re_str
	}
	re_ts(val) {
		var val_keys = Object.keys(val)
		var re_str = '('
		if (
			val_keys.indexOf('atr_period') !== -1 &&
			val_keys.indexOf('atr_multiplier') !== -1
		) {
			re_str += 'Period' + val['atr_period'] + '/MULTI' + val['atr_multiplier']
		} else if (
			val_keys.indexOf('max_step') !== -1 &&
			val_keys.indexOf('accelaration_factor') !== -1
		) {
			re_str += 'MAXSTEP' + val['atr_period'] + '/AF' + val['atr_period']
		}
		re_str += ')'
		return re_str
	}
	encode(val) {
		var s = this.re_indicator(val) + this.re_ids(val) + this.re_sc(val)
		//console.log(s)
		return s
	}
	decode(val) {
		var re = /(TI|SI|Exit|UI){1}:(.*);IDS:(\S*);SC:(\S*)/
		if (val.search(re) !== -1) {
			var d1, d2, d3
			d1 = RegExp.$2
			d2 = RegExp.$3
			d3 = RegExp.$4
			var indicator = this.backtest_dict[RegExp.$1](d1)

			var ids = this.ids.decode(d2)
			var sc = this.sc.decode(d3)
			if (
				typeof sc === 'string' ||
				typeof ids === 'string' ||
				typeof indicator === 'string'
			) {
				tmp = 'The input parameters of the Signal Condition maybe error!'
			} else {
				var tmp = {}
				tmp['ids'] = ids
				tmp['sc'] = sc
				tmp['indicator'] = indicator
				tmp = Object.assign(tmp, indicator)
				tmp = Object.assign(tmp, ids)
				tmp = Object.assign(tmp, sc)
			}
		}
		//console.log(tmp);
		return tmp
	}
}

// var sc = new SignalDecodeSC()
// var ids = new SignalDecodeIDS()
// console.log(ids.decode("EO20/EP80"));
// console.log(sc.decode("SVMA20/3/20"));
// const a = new SignalCode()

///////////////////////////////////////////////////////////////////

class DecodeIDS {
	constructor() {
		this.ids_dict = [this.eo_ep, this.ids_ti]
	}

	eo_ep(val) {
		var re = /^EO(-?0?\d*?\.?\d*?)\/EP(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1) return false
		// var array = val.match(re)
		var data = {
			extreme_optimism: RegExp.$1,
			extreme_pessimism: RegExp.$2
		}
		return data
	}

	ids_ti(val) {
		var data = {
			ids: val
		}
		return data
	}
	decode(val) {
		var tmp
		for (var func in this.ids_dict) {
			tmp = this.ids_dict[func](val)
			// console.log(tmp);
			if (tmp) {
				break
			}
		}
		return tmp
	}
}
class DecodeSC {
	constructor() {
		this.sc_dict = [
			this.si_period_condition_value,
			this.si_condition_value,
			this.blb_lrf_tls,
			this.cci_eri_adx,
			this.macd_eft,
			this.risk_control,
			this.smi,
			this.alli,
			this.ma_condition_period,
			this.sy_condition_value
		]
	}
	si_condition_value(val) {
		var re = /^SV\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
		var re_ma = /^SV\/(-?0?\d*?\.?\d*?)\/SVMA(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1 && val.search(re_ma) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		if(val.search(re) != -1) return {
			comparison: 'SV',
			condition: RegExp.$1,
			value: RegExp.$2,
			period: 1
		}
		if(val.search(re_ma) != -1) return {
			comparison: 'SV',
			condition: RegExp.$1,
			value: 'SVMA',
			period: RegExp.$2
		}
	}
	sy_condition_value(val) {
		var re = /^SV\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			comparison: 'SV',
			condition: RegExp.$1,
			value: RegExp.$2,
		}
		return data
	}
	si_period_condition_value(val) {
		var re = /^SVMA(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			comparison: 'SVMA',
			period: RegExp.$1,
			condition: RegExp.$2,
			value: RegExp.$3
		}
		return data
	}
	macd_eft(val) {
		var re = /^(MACD|MACDH|EFT)\/(-?0?\d*?\.?\d*?)\/((-?0?\d*?\.?\d*?)|SL)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			comparison: RegExp.$1,
			condition: RegExp.$2,
			value: RegExp.$3
		}
		return data
	}
	ma_condition_period(val) {
		var re =
			/^(SO|SH|SL|SC|MA)(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)\/MA(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		if (RegExp.$2 !== '') {
			var data = {
				comparison: RegExp.$1,
				ma_period: RegExp.$2,
				condition: RegExp.$3,
				period: RegExp.$4
			}
		} else if (RegExp.$2 === '') {
			var data = {
				comparison: RegExp.$1,
				condition: RegExp.$3,
				period: RegExp.$4
			}
		}

		return data
	}
	cci_eri_adx(val) {
		var re =
			/^(CCI|ERIH1|ERIH2|PADX|NADX)\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			comparison: RegExp.$1,
			condition: RegExp.$2,
			value: RegExp.$3
		}
		return data
	}
	blb_lrf_tls(val) {
		var re = /^(SO|SH|SL|SC)\/(-?0?\d*?\.?\d*?)\/(HB|MB|LB|LRF|TLS)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			comparison: RegExp.$1,
			condition: RegExp.$2,
			value: RegExp.$3
		}
		return data
	}

	smi(val) {
		var re = /^(K|D)\/(-?0?\d*?\.?\d*?)\/((-?0?\d*?\.?\d*?)|D)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			comparison: RegExp.$1,
			condition: RegExp.$2,
			value: RegExp.$3
		}
		return data
	}

	alli(val) {
		var re =
			/^(SO|SH|SL|SC|JAW|TEETH|LIPS)\/(-?0?\d*?\.?\d*?)\/(JAW|TEETH|LIPS)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		var data = {
			comparison: RegExp.$1,
			condition: RegExp.$2,
			value: RegExp.$3
		}
		return data
	}

	risk_control(val) {
		var re =
			/^PTE(-?0?\d*?\.?\d*?)\/LSE(-?0?\d*?\.?\d*?)\/TIM(-?0?\d*?\.?\d*?)$/
		if (val.search(re) == -1)
			return 'The input parameters of the Signal Condition maybe error!'
		// var array = val.match(re)
		// var tdata = this.ts(RegExp.$4)
		// if (!tdata) {
		//     return "The input parameters of Trainling Stop in the Signal Condition maybe error!"
		// }
		var ddata = {
			take_profit: RegExp.$1,
			stop_loss: RegExp.$2,
			time_in_market: RegExp.$3
		}
		// var data = Object.assign(tdata, ddata)
		return ddata
	}

	decode(val) {
		var tmp

		for (var func in this.sc_dict) {
			tmp = this.sc_dict[func](val)
			// console.log(tmp);
			if (typeof tmp !== 'string') {
				break
			}
		}
		return tmp
	}
}

class Decode {
	constructor() {
		this.sc = new DecodeSC()
		this.ids = new DecodeIDS()
		this.backtest_dict = {
			Exit: this.ex,
			SI: this.si,
			TI: this.ti,
			UI: this.ui,
			SY: this.sy,
			// "IDS": ids.decode,
			// "SC": sc.decode
		}
	}

	si(val) {
		return {
			analysis: 'Sentiment',
			indicator: val
		}
	}

	ui(val) {
		return {
			analysis: 'User',
			indicator: val
		}
	}

	sy(val) {
		return {
			analysis: 'Symbol',
			indicator: val
		}
	}
	ti(val) {
		return {
			analysis: 'Technical',
			indicator: val
		}
	}
	ex(val) {
		return {
			analysis: 'Exit',
			indicator: val
		}
	}

	decode(val) {
		var re = /(TI|SI|Exit|UI|SY){1}:(.*);IDS:(\S*);SC:(\S*)/
		if (val.search(re) !== -1) {
			var d1, d2, d3
			d1 = RegExp.$2
			d2 = RegExp.$3
			d3 = RegExp.$4
			var indicator = this.backtest_dict[RegExp.$1](d1)
			var ids = this.ids.decode(d2)
			var sc = this.sc.decode(d3)
			if (
				typeof sc === 'string' ||
				typeof ids === 'string' ||
				typeof indicator === 'string'
			) {
				tmp = 'The input parameters of the Signal Condition maybe error!'
			} else {
				var tmp = {}
				tmp['ids'] = ids
				tmp['sc'] = sc
				tmp['indicator'] = indicator
				tmp = Object.assign(tmp, indicator)
				tmp = Object.assign(tmp, ids)
				tmp = Object.assign(tmp, sc)
			}
		}
		console.log('decode: ',tmp);
		return tmp
	}
}

class EncodeSI {
	encode(obj) {
		var keys = Object.keys(obj)
		if (!this.check(obj)) return false
		if (obj['comparison'] === 'SV' && obj['value'] !== 'SVMA')
			return (
				'SI:' +
				obj['indicator'] +
				';IDS:EO' +
				obj['extreme_optimism'] +
				'/EP' +
				obj['extreme_pessimism'] +
				';SC:' +
				obj['comparison'] +
				'/' +
				obj['condition'] +
				'/' +
				obj['value']
			)
		else if (obj['comparison'] === 'SVMA' && obj['value'] !== 'SVMA')
			return (
				'SI:' +
				obj['indicator'] +
				';IDS:EO' +
				obj['extreme_optimism'] +
				'/EP' +
				obj['extreme_pessimism'] +
				';SC:' +
				obj['comparison'] +
				obj['period'] +
				'/' +
				obj['condition'] +
				'/' +
				obj['value']
			)
		else if (obj['comparison'] === 'SV' && obj['value'] === 'SVMA') 
				return (
					'SI:' +
					obj['indicator'] +
					';IDS:EO' +
					obj['extreme_optimism'] +
					'/EP' +
					obj['extreme_pessimism'] +
					';SC:' +
					obj['comparison'] +
					'/' +
					obj['condition'] +
					'/' +
					obj['value'] +
					obj['period']
				)
	}
	check(obj) {
		var keys = Object.keys(obj)
		if (keys.indexOf('analysis') === -1) return false

		if (obj['analysis'] !== 'Sentiment') return false

		if (
			keys.indexOf('extreme_optimism') === -1 &&
			keys.indexOf('extreme_pessimism') === -1
		)
			return false
		return true
	}
}

class EncodeUI {
	encode(obj) {
		var keys = Object.keys(obj)
		if (!this.check(obj)) return false
		if (obj['period'] == 1)
			return (
				'UI:' +
				obj['indicator'] +
				';IDS:EO' +
				obj['extreme_optimism'] +
				'/EP' +
				obj['extreme_pessimism'] +
				';SC:' +
				obj['comparison'] +
				'/' +
				obj['condition'] +
				'/' +
				obj['value']
			)
		else if (keys.indexOf('period') !== -1)
			return (
				'UI:' +
				obj['indicator'] +
				';IDS:EO' +
				obj['extreme_optimism'] +
				'/EP' +
				obj['extreme_pessimism'] +
				';SC:' +
				obj['comparison'] +
				obj['period'] +
				'/' +
				obj['condition'] +
				'/' +
				obj['value']
			)
	}
	check(obj) {
		var keys = Object.keys(obj)
		if (keys.indexOf('analysis') === -1) return false

		if (obj['analysis'] !== 'User') return false

		if (
			keys.indexOf('extreme_optimism') === -1 &&
			keys.indexOf('extreme_pessimism') === -1
		)
			return false
		return true
	}
}

// symbol ohlcv encode
class EncodeSY {
	encode(obj) {
		var keys = Object.keys(obj)
		if (!this.check(obj)) return false
		return (
			'SY:' +
			obj['indicator'] +
			';IDS:EO' +
			0 +
			'/EP' +
			0 +
			';SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}
	check(obj) {
		var keys = Object.keys(obj)
		if (keys.indexOf('analysis') === -1) return false

		if (obj['analysis'] !== 'Symbol') return false

		return true
	}
}

class EncodeTI {
	encode(obj) {
		if (!this.check(obj)) return false

		if (obj['ids'] == 'CCI') return this.encode_cci(obj)
		else if (obj['ids'] == 'BLB') return this.encode_blb(obj)
		else if (obj['ids'] == 'MACD') return this.encode_macd(obj)
		else if (obj['ids'] == 'EFT') return this.encode_eft(obj)
		else if (obj['ids'] == 'SMI') return this.encode_smi(obj)
		else if (obj['ids'] == 'ERI') return this.encode_eri(obj)
		else if (obj['ids'] == 'LRF') return this.encode_lrf(obj)
		else if (obj['ids'] == 'ADX') return this.encode_adx(obj)
		else if (obj['ids'] == 'SMA' || obj['ids'] == 'EMA') return this.encode_sma(obj)
		else if (obj['ids'] == 'ALLI') return this.encode_alli(obj)
		else if (obj['ids'] == 'TLS') return this.encode_tls(obj)
	}
	check(obj) {
		var keys = Object.keys(obj)
		if (keys.indexOf('analysis') === -1) return false

		if (keys.indexOf('ids') === -1) return false

		return true
	}
	encode_cci(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:CCI;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}

	encode_blb(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:BLB;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}

	encode_macd(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:MACD;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}

	encode_eft(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:EFT;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}

	encode_smi(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:SMI;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}

	encode_eri(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:ERI;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}

	encode_lrf(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:LRF;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}

	encode_adx(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:ADX;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}
	encode_alli(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:ALLI;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}

	encode_sma(obj) {
		var keys = Object.keys(obj)
		const maType = obj['ids'] == 'SMA' ? 'SMA' : 'EMA'
		if (keys.indexOf('ma_period') === -1)
			return (
				'TI:' +
				obj['indicator'] +
				`;IDS:${maType};SC:` +
				obj['comparison'] +
				'/' +
				obj['condition'] +
				'/MA' +
				obj['period']
			)
		else if (keys.indexOf('ma_period') !== -1)
			return (
				'TI:' +
				obj['indicator'] +
				`;IDS:${maType};SC:` +
				obj['comparison'] +
				obj['ma_period'] +
				'/' +
				obj['condition'] +
				'/MA' +
				obj['period']
			)
	}
	encode_tls(obj) {
		return (
			'TI:' +
			obj['indicator'] +
			';IDS:TLS;SC:' +
			obj['comparison'] +
			'/' +
			obj['condition'] +
			'/' +
			obj['value']
		)
	}
}

class EncodeExit {
	encode(obj) {
		if (!this.check(obj)) return false
		return (
			'Exit:' +
			obj['indicator'] +
			';IDS:;SC:PTE' +
			obj['take_profit'] +
			'/LSE' +
			obj['stop_loss'] +
			'/TIM' +
			obj['time_in_market']
		)
	}

	check(obj) {
		var keys = Object.keys(obj)
		if (keys.indexOf('analysis') === -1) return false
		if ('Risk Control' == obj['analysis']) return false
		if (
			keys.indexOf('take_profit') === -1 &&
			keys.indexOf('time_in_market') === -1
		)
			return false
		return true
	}
}

class Code {
	constructor() {
		this.encode_list = [new EncodeSI(), new EncodeUI(), new EncodeSY(), new EncodeTI(), new EncodeExit()]

		this.de = new Decode()
	}
	decode(s) {
		return this.de.decode(s)
	}
	encode(obj) {
		var tmp = null
		for (var func in this.encode_list) {
			tmp = this.encode_list[func].encode(obj)
			if (tmp) break
		}
		return tmp
	}
}
// var a = new Code()
// console.log(a.decode("UI:aybkn_hs6njn;IDS:EO20/EP80;SC:SVMA20/3/20"))
// a.decode("SI:Smart Money Confidence;IDS:EO20/EP80;SC:SV/3/20")
// a.decode("TI:MA;IDS:EMA;SC:SC/3/MA20")
// a.decode("TI:Moving Average;IDS:SMA;SC:MA5/3/MA20")
// a.decode("TI:MACD;IDS:MACDSlow25/MACDFast25/SL9;SC:MACDV/3/0")
// console.log(a.decode("TI:MACD;IDS:MACDSlow25/MACDFast25/SL9;SC:MACDV/3/MACDSL"))
// a.decode("TI:Commodity Channel Index;IDS:OBB20/OSB80/Period20;SC:CCIV/3/10.0")
// a.decode("TI:Commodity Channel Index;IDS:OBB20/OSB80/Period20;SC:CCIV/4/90.0")
// a.decode("TI:RSI;IDS:OBB200/OSB-200/Period20.000;SC:RSIV/3/-200.00")
// a.decode("TI:RSI;IDS:OBB200/OSB-200/Period20;SC:RSIV/4/200.00")

// console.log(a.decode("Exit:RC;IDS:;SC:PTE20/LSE/TIM180"))
// take_profit: 20; stop_loss: 80
// console.log(a.decode('Exit:RC;IDS:;SC:PTE20/LSE80/TIM'))
// console.log(a.decode('Exit:RC;IDS:;SC:PTE20/LSE80/TIM').sc)
// var tmp = [
//     {
//     'analysis': 'Sentiment',
//     'indicator': 'Smart Money Confidence',
//     'extreme_optimism': '20',
//     'extreme_pessimism': '80',
//     'period': '1',
//     'condition': '3',
//     'value': '20',
// 		'comparison': 'SVMA'
// },
// ]
//{
//     'analysis': 'Sentiment',
//     'indicator': 'Smart Money Confidence',
//     'extreme_optimism': '20',
//     'extreme_pessimism': '80',
//     'condition': '3',
//     'value': '20',
// },{
//     'analysis': 'Technical',
//     'indicator': 'Moving Average',
//     'ma_category': 'EMA',
//     'period': '20',
//     'condition': '3'
// },{
//     'analysis': 'Technical',
//     'indicator': 'Moving Average',
//     'ma_category': 'SMA',
//     'ma_period': '5',
//     'period': '20',
//     'condition': '3'
// },{
//     'analysis': 'Technical',
//     'indicator': 'MACD',
//     'MACDSlow': '25',
//     'MACDFast': '12',
//     'MACDSL': '9',
//     'value': '0',
//     'condition': '3'
// },{
//     'analysis': 'Technical',
//     'indicator': 'MACD',
//     'MACDSlow': '25',
//     'MACDFast': '12',
//     'MACDSL': '9',
//     'value': 'MACDSL',
//     'condition': '3'
// },{
//     'analysis': 'Technical',
//     'indicator': 'Commodity Channel Index',
//     'over_bought_bound': '200',
//     'over_sold_bound': '-200',
//     'value': '200',
//     'condition': '3',
//     'period': '20'
// },{
//     'analysis': 'Technical',
//     'indicator': 'Relative Strength Index',
//     'over_bought_bound': '90',
//     'over_sold_bound': '10',
//     'value': '10',
//     'condition': '3',
//     'period': '20'
// },{
//     "indicator":"RC",
//     'analysis': 'Exit',
//     'take_profit': '20',
//     'time_in_market': '180',
//     'atr_period': '7',
//     'atr_multiplier': '2.5'
// }]
// var tmp = [
// 	{
// 		indicator: 'RC',
// 		analysis: 'Exit',
// 		take_profit: '20',
// 		stop_loss: '80'
// 		// time_in_market: '180'
// 		// 'atr_period': '7',
// 		// 'atr_multiplier': '2.5'
// 	}
// ]
// for (var i in tmp) {
// 	console.log(a.encode(tmp[i]))
// }

// var temp =  {
// 			'analysis': 'User',
// 			'indicator': 'aapl_custom_testHASH9808',
// 			'extreme_optimism': '20',
// 			'extreme_pessimism': '80',
// 			"comparison": 'SV',
// 			'period': '1',
// 			'condition': '3',
// 			'value': '20',
// }

// console.log(a.encode(temp))

// var a = new Code()
// console.log(a.decode("SI:Smart Money Confidence;IDS:EO20/EP80;SC:SVMA20/3/20"))
// console.log(a.decode("SI:Smart Money Confidence;IDS:EO20/EP80;SC:SV/3/20"))
// console.log(a.decode("TI:Moving Average;IDS:SMA;SC:SC/3/MA20"))
// console.log(a.decode("SI:Smart Money Confidence;IDS:EO20/EP80;SC:SV/3/SVMA20"))
// console.log(a.decode("TI:Moving Average;IDS:SMA;SC:MA5/3/MA20"))
// console.log(a.decode("TI:MACD;IDS:MACD;SC:MACD/3/0"))
// console.log(a.decode("TI:MACD;IDS:MACD;SC:MACD/3/SL"))
// console.log(a.decode("TI:MACD;IDS:MACD;SC:MACDH/3/-1.0"))
// console.log(a.decode("TI:Commodity Channel Index;IDS:CCI;SC:CCI/3/-200.00"))
// console.log(a.decode("TI:Relative Strength Index;IDS:CCI;SC:CCI/3/10.0"))
// console.log(a.decode("TI:ADX/DMS;IDS:ADX;SC:PADX/4/0"))
// console.log(a.decode("TI:ADX/DMS;IDS:ADX;SC:NADX/4/0"))
// console.log(a.decode("TI:Elder Ray Index;IDS:ERI;SC:ERIH1/4/0"))
// console.log(a.decode("TI:Elder Ray Index;IDS:ERI;SC:ERIH2/4/0"))
// console.log(a.decode("TI:Bollinger Bands;IDS:BLB;SC:SC/4/HB"))
// console.log(a.decode("TI:Bollinger Bands;IDS:BLB;SC:SC/4/LB"))
// console.log(a.decode("TI:Bollinger Bands;IDS:BLB;SC:SC/4/MB"))
// console.log(a.decode("TI:Linear Reg Forecast;IDS:LRF;SC:SC/4/LRF"))
// console.log(a.decode("TI:MACD;IDS:MACD;SC:MACD/4/0"))
// console.log(a.decode("TI:MACD;IDS:MACD;SC:MACD/4/SL"))
// console.log(a.decode("TI:MACD;IDS:MACD;SC:MACDH/4/0"))
// console.log(a.decode("TI:Ehler Fisher Transform;IDS:EFT;SC:EFT/4/0"))
// console.log(a.decode("TI:Ehler Fisher Transform;IDS:EFT;SC:EFT/4/SL"))
// console.log(a.decode("TI:Stochastic Momentum Index;IDS:SMI;SC:K/4/0"))
// console.log(a.decode("TI:Stochastic Momentum Index;IDS:SMI;SC:D/4/0"))
// console.log(a.decode("TI:Stochastic Momentum Index;IDS:SMI;SC:K/4/D"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:SC/4/JAW"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:SC/4/TEETH"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:SC/4/LIPS"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:JAW/4/TEETH"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:JAW/4/LIPS"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:TEETH/4/JAW"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:TEETH/4/LIPS"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:LIPS/4/JAW"))
// console.log(a.decode("TI:Alligator;IDS:ALLI;SC:LIPS/4/TEETH"))
// console.log(a.decode("Exit:Risk Control;IDS:;SC:PTE30/LSE/TIM180"))
// console.log(a.decode("Exit:Risk Control;IDS:;SC:PTE20/LSE/TIM180"))

// var tmp = [
// 		{
// 			'analysis': 'Sentiment',
// 			'indicator': 'Smart Money Confidence',
// 			'extreme_optimism': '20',
// 			'extreme_pessimism': '80',
// 			'period': '20',
// 			"comparison": 'SV',
// 			'condition': '3',
// 			'value': 'SVMA'
// 		}, 
// 	]
// 	for (var i in tmp) {
// 	console.log(a.encode(tmp[i]))
// 	}
	// {
	// 		'analysis': 'Sentiment',
	// 		'indicator': 'Smart Money Confidence',
	// 		'extreme_optimism': '20',
	// 		'extreme_pessimism': '80',
	// 		"comparison": 'SV',
	// 		'period': '1',
	// 		'condition': '3',
	// 		'value': '20',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Moving Average',
	// 		'ids': 'SMA',
	// 		'comparison': 'SC',
	// 		'period': '20',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Moving Average',
	// 		'ids': 'SMA',
	// 		'comparison': 'MA',
	// 		'ma_period': '5',
	// 		'  ': '20',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'MACD',
	// 		'ids': 'MACD',
	// 		'value': '0',
	// 		'comparison': 'MACD',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'MACD',
	// 		'ids': 'MACD',
	// 		'comparison': 'MACD',
	// 		'value': 'SL',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'MACD',
	// 		'ids': 'MACD',
	// 		'comparison': 'MACDH',
	// 		'value': '-1.0',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Ehler Fisher Transform',
	// 		'ids': 'EFT',
	// 		'comparison': 'EFT',
	// 		'value': 'SL',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Ehler Fisher Transform',
	// 		'ids': 'EFT',
	// 		'comparison': 'EFT',
	// 		'value': '0',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Commodity Channel Index',
	// 		'ids': "CCI",
	// 		'comparison': 'CCI',
	// 		'value': '200',
	// 		'condition': '3',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Stochastic Momentum Index',
	// 		'ids': "SMI",
	// 		'comparison': 'K',
	// 		'value': '0',
	// 		'condition': '3',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Stochastic Momentum Index',
	// 		'ids': "SMI",
	// 		'comparison': 'D',
	// 		'value': '0',
	// 		'condition': '3',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Stochastic Momentum Index',
	// 		'ids': "SMI",
	// 		'comparison': 'K',
	// 		'value': 'D',
	// 		'condition': '3',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'ADX/DMS',
	// 		'ids': "ADX",
	// 		'comparison': 'PADX',
	// 		'value': '200',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'SC',
	// 		'value': 'JAW',
	// 		'condition': '3',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'SC',
	// 		'value': 'TEETH',
	// 		'condition': '3',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'SC',
	// 		'value': 'LIPS',
	// 		'condition': '3',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'JAW',
	// 		'value': 'LIPS',
	// 		'condition': '3',
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'JAW',
	// 		'value': 'TEETH',
	// 		'condition': '3',
	// 	},
	// 	{
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'TEETH',
	// 		'value': 'JAW',
	// 		'condition': '3',
	// 	},
	// 	{
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'TEETH',
	// 		'value': 'LIPS',
	// 		'condition': '3',
	// 	},{
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'LIPS',
	// 		'value': 'JAW',
	// 		'condition': '3',
	// 	},{
	// 		'analysis': 'Technical',
	// 		'indicator': 'Alligator',
	// 		'ids': "ALLI",
	// 		'comparison': 'LIPS',
	// 		'value': 'TEETH',
	// 		'condition': '3',
	// 	},
	// 	{
	// 		'analysis': 'Technical',
	// 		'indicator': 'ADX/DMS',
	// 		'ids': "ADX",
	// 		'comparison': 'NADX',
	// 		'value': '200',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Elder Ray Index',
	// 		'ids': "ERI",
	// 		'comparison': 'ERIH1',
	// 		'value': '0',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Elder Ray Index',
	// 		'ids': "ERI",
	// 		'comparison': 'ERIH2',
	// 		'value': '0',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Bollinger Bands',
	// 		'ids': "BLB",
	// 		'comparison': 'SC',
	// 		'value': 'HB',
	// 		'condition': '3'
	// 	}, {
	// 		'analysis': 'Technical',
	// 		'indicator': 'Bollinger Bands',
	// 		'ids': "BLB",
	// 		'comparison': 'SC',
	// 		'value': 'LB',
	// 		'condition': '3'
	// 	},{
	// 		'analysis': 'Technical',
	// 		'indicator': 'Bollinger Bands',
	// 		'ids': "BLB",
	// 		'comparison': 'SC',
	// 		'value': 'MB',
	// 		'condition': '3'
	// 	},
	// 	{
	// 		'analysis': 'Technical',
	// 		'indicator': 'Linear Reg Forecast',
	// 		'ids': "LRF",
	// 		'comparison': 'SC',
	// 		'value': 'LRF',
	// 		'condition': '3'
	// 	},
	// 	{
	// 		'analysis': 'Technical',
	// 		'indicator': 'Relative Strength Index',
	// 		'ids': "CCI",
	// 		'comparison': 'CCI',
	// 		'value': '10',
	// 		'condition': '3'
	// 	}, {
	// 		"indicator": "Risk Control",
	// 		'analysis': 'Exit',
	// 		'ids': "",
	// 		'take_profit': '20',
	// 		'time_in_market': '180',
	// 		'stop_loss': '10'
	// 	},
	// 	{
	// 		"indicator": "Risk Control",
	// 		'analysis': 'Exit',
	// 		'ids': "",
	// 		'take_profit': '',
	// 		'time_in_market': '180',
	// 		'stop_loss': ''
	// 	}, {
	// 		"indicator": "Risk Control",
	// 		'analysis': 'Exit',
	// 		'ids': "",
	// 		'take_profit': '20',
	// 		'time_in_market': '',
	// 		'stop_loss': '10'
	// 	},
// 	{
// 		analysis: 'Technical',
// 		indicator: 'ATR Trailing Stop',
// 		ids: 'TLS',
// 		value: '10',
// 		condition: '3',
// 		comparison: 'TSL'
// 	}
// ]

// for (var i in tmp) {
// 	console.log(a.encode(tmp[i]))
// }

export default Code

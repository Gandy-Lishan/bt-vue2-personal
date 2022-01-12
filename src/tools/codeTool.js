class SignalDecodeIDS {
    constructor() {
        this.ids_dict = [
            this.slow_fast_sl, 
            this.eo_ep, 
            this.over_bought_sold_bound_period,
            this.ma_category]
    }
    slow_fast_sl(val) {
        var re = /^MACDSlow(-?0?\d*?\.?\d*?)\/MACDFast(-?0?\d*?\.?\d*?)\/MACDSL(-?0?\d*?\.?\d*?)$/
        if (val.search(re) == -1) return false
        // var array = val.match(re)
        var data = {
            "MACDSlow": RegExp.$1,
            "MACDFast": RegExp.$2,
            "MACDSL": RegExp.$3
        }
        return data
    }
    eo_ep(val) {
        var re = /^EO(-?0?\d*?\.?\d*?)\/EP(-?0?\d*?\.?\d*?)$/
        if (val.search(re) == -1) return false
        // var array = val.match(re)
        var data = {
            "extreme_optimism": RegExp.$1,
            "extreme_pessimism": RegExp.$2
        }
        return data
    }
    over_bought_sold_bound_period(val) {
        var re = /^OBB(-?0?\d*?\.?\d*?)\/OSB(-?0?\d*?\.?\d*?)\/Period(-?0?\d*?\.?\d*?)$/
        if (val.search(re) == -1) return false
        // var array = val.match(re)
        var data = {
            "over_bought_bound": RegExp.$1,
            "over_sold_bound": RegExp.$2,
            "period": RegExp.$3
        }
        return data
    }
    ma_category(val) {
        var re = /^(SMA|EMA)$/
        if (val.search(re) == -1) return false
        // var array = val.match(re)
        var data = {
            "ma_category": val
        }
        return data
    }
    decode(val) {
        var tmp;
        for (var func in this.ids_dict) {
            tmp = this.ids_dict[func](val);
            // console.log(tmp);
            if (tmp) {
                break;
            }
        }
        return tmp
    }

};


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
        if (val.search(re) == -1) return "The input parameters of the Signal Condition maybe error!"
        // var array = val.match(re)
        var data = {
            "condition": RegExp.$1,
            "value": RegExp.$2
        }
        return data
    }
    si_period_condition_value(val) {
        var re = /^SVMA(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
        if (val.search(re) == -1) return "The input parameters of the Signal Condition maybe error!"
        // var array = val.match(re)
        var data = {
            "period": RegExp.$1,
            "condition": RegExp.$2,
            "value": RegExp.$3,
        }
        return data
    }
    macd_condition_value(val) {
        var re = /^MACDV\/(-?0?\d*?\.?\d*?)\/((-?0?\d*?\.?\d*?)|MACDSL)$/
        if (val.search(re) == -1) return "The input parameters of the Signal Condition maybe error!"
        // var array = val.match(re)
        var data = {
            "condition": RegExp.$1,
            "value": RegExp.$2,

        }
        return data
    }
    ma_condition_period(val) {
        var re = /^(SCMA|MAMA)(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)\/MA(-?0?\d*?\.?\d*?)$/
        if (val.search(re) == -1) return "The input parameters of the Signal Condition maybe error!"
        // var array = val.match(re)
        if (RegExp.$2 !== "") {
            var data = {
                "ma_period": RegExp.$2,
                "condition": RegExp.$3,
                "period": RegExp.$4,
            }
        } else if (RegExp.$2 === "") {
            var data = {
                "condition": RegExp.$3,
                "period": RegExp.$4,
            }
        }

        return data
    }
    rsi_condition_value(val) {
        var re = /^RSIV\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
        if (val.search(re) == -1) return "The input parameters of the Signal Condition maybe error!"
        // var array = val.match(re)
        var data = {
            "condition": RegExp.$1,
            "value": RegExp.$2,
        }
        return data
    }
    cci_condition_value(val) {
        var re = /^CCIV\/(-?0?\d*?\.?\d*?)\/(-?0?\d*?\.?\d*?)$/
        if (val.search(re) == -1) return "The input parameters of the Signal Condition maybe error!"
        // var array = val.match(re)
        var data = {
            "condition": RegExp.$1,
            "value": RegExp.$2,
        }
        return data
    }

    exit_value_period(val) {
        var re = /^PTE(-?0?\d*?\.?\d*?)\/LSE(-?0?\d*?\.?\d*?)\/TIM(-?0?\d*?\.?\d*?)\/TS\((\S*)\)$/
        if (val.search(re) == -1) return "The input parameters of the Signal Condition maybe error!"
        // var array = val.match(re)
        var tdata = this.ts(RegExp.$4)
        if (!tdata) {
            return "The input parameters of Trainling Stop in the Signal Condition maybe error!"
        }
        var ddata = {
            "take_profit": RegExp.$1,
            "loss_profit": RegExp.$2,
            "time_in_market": RegExp.$3,
        }
        var data = Object.assign(tdata, ddata)
        return data
    }

    ts(val) {
        var key, value
        key = val.split(":")[0]
        value = val.split(":")[1]

        var atre_re = /^Period(-?0?\d*?\.?\d*?)\/MULTI(-?0?\d*?\.?\d*?)$/
        var psare_re = /^MAXSTEP(-?0?\d*?\.?\d*?)\/AF(-?0?\d*?\.?\d*?)$/
        if (key == 'ATRE' & value.search(atre_re)) {
            var data = {
                "atr_period": RegExp.$1,
                "atr_multiplier": RegExp.$2,
            }
        }
        else if (key == "PSARE" & value.search(psare_re)) {
            var data = {
                "max_step": RegExp.$1,
                "accelaration_factor": RegExp.$2,
            }
        } else {
            var data = false
        }
        // var array = val.match(re)

        return data
    }
    decode(val) {
        var tmp;

        for (var func in this.sc_dict) {
            tmp = this.sc_dict[func](val);
            // console.log(tmp);
            if (typeof (tmp) !== 'string') {
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
            "Exit": this.ex,
            "SI": this.si,
            "TI": this.ti,
            // "IDS": ids.decode,
            // "SC": sc.decode
        }
    }

    si(val) {
        return {
            "analysis": "Sentiment",
            "indicator": val
        }
    }
    ti(val) {
        return {
            "analysis": "Technical",
            "indicator": val
        }
    }
    ex(val) {
        return {
            "analysis": "Exit",
            "indicator": val
        }
    }
    re_indicator(val) {
        var re_str = ""
        var val_keys = Object.keys(val)
        if (val_keys.indexOf("analysis") !== -1 & val_keys.indexOf("analysis") !== -1) {
            if (val["analysis"] == "Sentiment") {
                re_str += "SI:" + val["indicator"] + ";";
            } else if (val["analysis"] == "Technical") {
                re_str += "TI:" + val["indicator"] + ";";
            } else if (val["analysis"] == "Exit") {
                re_str += "Exit:" + val["indicator"] + ";";
            }
        }
        return re_str
    }
    re_ids(val) {
        var val_keys = Object.keys(val)
        var re_str = "IDS:"
        if (val_keys.indexOf("extreme_optimism") !== -1 && val_keys.indexOf("extreme_pessimism") !== -1) {
            re_str += "EO" + val["extreme_optimism"] + "/EP" + val["extreme_pessimism"];
        } else if (val_keys.indexOf("MACDSlow") !== -1 && val_keys.indexOf("MACDFast") !== -1 && val_keys.indexOf("MACDSL") !== -1) {
            re_str += "MACDSlow" + val["MACDSlow"] + "/MACDFast" + val["MACDFast"] + "/MACDSL" + val["MACDSL"];
        } else if (val_keys.indexOf("ma_category") !== -1) {
            re_str += val["ma_category"]
        } else if (val_keys.indexOf("over_bought_bound") !== -1 && val_keys.indexOf("over_sold_bound") !== -1 && val_keys.indexOf("period") !== -1) {
            re_str += "OBB" + val["over_bought_bound"] + "/OSB" + val["over_sold_bound"] + "/Period" + val["period"];
        }
        re_str += ";"
        return re_str
    }
    re_sc(val) {
        var re_str = "SC:"
        var val_keys = Object.keys(val)
        if (val["analysis"] === "Sentiment") {
            if (val_keys.indexOf("period") !== -1) {
                re_str += "SVMA" + val["period"] + "/" + val["condition"] + "/" + val["value"];
            } else if (val_keys.indexOf("period") === -1) {
                re_str += "SV/" + val["condition"] + "/" + val["value"]
            }
        } else if (val["analysis"] === "Technical") {
            if (val["indicator"] == "Moving Average") {
                if (val_keys.indexOf("ma_period") === -1) {
                    re_str += "SCMA/" + val["condition"] + "/MA" + val["period"]
                } else if (val_keys.indexOf("ma_period") !== -1) {
                    re_str += "MAMA" + val["ma_period"] + "/" + val["condition"] + "/MA" + val["period"]
                }
            }
            else if (val["indicator"] == "MACD") {
                if (val["value"] == "MACDSL") {
                    re_str += "MACDV/" + val["condition"] + "/MACDSL"
                } else if (val["value"].toString().search(/(-?0?\d*?\.?\d*?)/) !== -1) {
                    re_str += "MACDV/" + val["condition"] + "/" + val["value"]
                }
            }
            else if (val["indicator"] == "Commodity Channel Index") {
                re_str += "CCIV/" + val["condition"] + "/" + val["value"]
            }
            else if (val["indicator"] == "Relative Strength Index") {
                re_str += "RSIV/" + val["condition"] + "/" + val["value"]
            }
        }
        else if (val["analysis"] === "Exit") {
            var tmp = {
                "take_profit":"",
                "loss_profit":"",
                "time_in_market":''
            }
            tmp = Object.assign(tmp,val)
            re_str += "PTE" + tmp["take_profit"] + "/LSE" + tmp["loss_profit"] + "/TIM" + tmp["time_in_market"] + "/TS"
            re_str += this.re_ts(tmp)
        }
        return re_str
    }
    re_ts(val) {
        var val_keys = Object.keys(val)
        var re_str = "("
        if (val_keys.indexOf("atr_period") !== -1 && val_keys.indexOf("atr_multiplier") !== -1) {
            re_str += "Period" + val["atr_period"] + "/MULTI" + val["atr_multiplier"]
        } else if (val_keys.indexOf("max_step") !== -1 && val_keys.indexOf("accelaration_factor") !== -1) {
            re_str += "MAXSTEP" + val["atr_period"] + "/AF" + val["atr_period"]
        }
        re_str += ")"
        return re_str
    }
    encode(val) {
        var s = this.re_indicator(val) + this.re_ids(val) + this.re_sc(val)
        //console.log(s)
        return s
    }
    decode(val) {
        var re = /(TI|SI|){1}:(.*);IDS:(\S*);SC:(\S*)/
        if (val.search(re) !== -1) {
            var d1,d2,d3
            d1 = RegExp.$2
            d2 = RegExp.$3
            d3 = RegExp.$4
            var indicator = this.backtest_dict[RegExp.$1](d1)
            var ids = this.ids.decode(d2)
            var sc = this.sc.decode(d3)
            if (typeof (sc) === "string" || typeof (ids) === "string" || typeof (indicator) === "string") {
                tmp = "The input parameters of the Signal Condition maybe error!"
            } else {
                var tmp = {}
                tmp["ids"] = ids
                tmp["sc"] = sc
                tmp["indicator"] = indicator
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
const a = new SignalCode()

// a.decode("SI:Smart Money Confidence;IDS:EO20/EP80;SC:SVMA20/3/20")
// a.decode("SI:Smart Money Confidence;IDS:EO20/EP80;SC:SV/3/20")
// a.decode("TI:MA;IDS:EMA;SC:SCMA/3/MA20")
// a.decode("TI:Moving Average;IDS:SMA;SC:MAMA5/3/MA20")
// a.decode("TI:MACD;IDS:MACDSlow25/MACDFast25/SL9;SC:MACDV/3/0")
// console.log(a.decode("TI:MACD;IDS:MACDSlow25/MACDFast25/SL9;SC:MACDV/3/MACDSL"))
// a.decode("TI:Commodity Channel Index;IDS:OBB20/OSB80/Period20;SC:CCIV/3/10.0")
// a.decode("TI:Commodity Channel Index;IDS:OBB20/OSB80/Period20;SC:CCIV/4/90.0")
// a.decode("TI:RSI;IDS:OBB200/OSB-200/Period20.000;SC:RSIV/3/-200.00")
// a.decode("TI:RSI;IDS:OBB200/OSB-200/Period20;SC:RSIV/4/200.00")
// var tmp = [
//     {
//     'analysis': 'Sentiment', 
//     'indicator': 'Smart Money Confidence', 
//     'extreme_optimism': '20', 
//     'extreme_pessimism': '80', 
//     'period': '20', 
//     'condition': '3', 
//     'value': '20'
// },{
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
// for (var i in tmp){
//     a.encode(tmp[i])
// }
// var tmp = {
//     "over_bought_bound": 80,
//     "over_sold_bound": 20,
//     "period": 14,
//     "condition": 4,
//     "value": "80",
//     "indicator": "Relative Strength Index",
//     "analysis": "Technical"
// }
// console.log(a.encode(tmp));

export default SignalCode
    

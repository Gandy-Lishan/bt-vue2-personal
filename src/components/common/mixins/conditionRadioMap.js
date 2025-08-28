import { CIQ } from '@/components/common/chart/st-development/js'
let conditionRadio

const conditionRadioMap = (entry, exit, entryType, exitType) => {
  for (var i in entry) {
    criteriaConditionRadioMap(entry[i])
    var cr = CIQ.store.state.form.conditionRadio
    cr[entryType][i] = conditionRadio
    CIQ.store.commit('form/setConditionRadio', cr)
  }
  for (var i in exit) {
    criteriaConditionRadioMap(exit[i])
    var cr = CIQ.store.state.form.conditionRadio
    cr[exitType][i] = conditionRadio
    CIQ.store.commit('form/setConditionRadio', cr)
  }
}
function criteriaConditionRadioMap(criteria_item){
  if (criteria_item.analysis == "Sentiment" || criteria_item.analysis == "User") {
    conditionRadio = 'Indicator Value'
    if (criteria_item.comparison === 'SVMA') {
      conditionRadio = 'Indicator Moving Average'
    }
    if(criteria_item.comparison == 'SV' && criteria_item.value === 'SVMA') {
      conditionRadio = 'Indicator Value '
    }
  }
  if (criteria_item.analysis == "Technical") {
    switch (criteria_item.ids) {
      case "CCI": break;
      case "MACD":
        conditionRadio = conditionRadioMACD(criteria_item); break;
      case "BLB":
        conditionRadio = conditionRadioBLB(criteria_item); break;
      case "EFT":
        conditionRadio = conditionRadioEFT(criteria_item); break;
      case "SMI":
        conditionRadio = conditionRadioSMI(criteria_item); break;
      case "ERI":
        conditionRadio = conditionRadioERI(criteria_item); break;
      case "LRF": break;
      case "ADX":
        conditionRadio = conditionRadioADX(criteria_item); break;
      case "SMA":
      case "EMA":
        conditionRadio = conditionRadioSMA(criteria_item); break;
      case "ALLI":
        conditionRadio = conditionRadioALLI(criteria_item); break;
      case "TLS": break;
      default: break;
    }
  }
}
function conditionRadioMACD(obj) {
  let radio = 'Indicator Value'
  if (obj.value === 'SL' && obj.comparison === 'MACD') {
    radio = 'Indicator Value '
  }
  if (obj.comparison === 'MACDH') {
    radio = 'Indicator Hist'
  }
  if (obj.value !== 'SL' && obj.comparison === 'MACD') {
    radio = 'Indicator Value'
  }
  return radio
}
function conditionRadioBLB(obj) {
  return obj.value
}
function conditionRadioEFT(obj) {
  let radio = 'Indicator Value'
  if (obj.value === 'SL') {
    radio = 'Indicator Value '
  }
  return radio
}
function conditionRadioSMI(obj) {
  let radio = '%K'
  if (obj.value !== 'D' && obj.comparison === 'K') {
    radio = '%K'
  }
  if (obj.value === 'D' && obj.comparison === 'K') {
    radio = '%K '
  }
  if (obj.comparison === 'D') {
    radio = '%D'
  }
  return radio
}
function conditionRadioERI(obj) {
  let radio = 'Indicator hist1'
  if (obj.comparison === 'ERIH1') {
    radio = 'Indicator hist1'
  }
  if (obj.comparison === 'ERIH2') {
    radio = 'Indicator hist2'
  }
  return radio
}
function conditionRadioADX(obj) {
  let radio = '+DI ADX'
  if (obj.comparison === 'PADX') {
    radio = '+DI ADX'
  }
  if (obj.comparison === 'NADX') {
    radio = '-DI ADX'
  }
  return radio
}
function conditionRadioSMA(obj) {
  let radio = ' '
  if (obj.comparison === 'MA') {
    radio = 'Moving Average'
  } else {
    radio = ' '
  }
  return radio
}
function conditionRadioALLI(obj) {
  let radio = 'first'
  if (
    obj.comparison === 'SC' ||
    obj.comparison === 'SO' ||
    obj.comparison === 'SL' ||
    obj.comparison === 'SH'
  ) {
    radio = 'first'
  }
  if (
    obj.comparison === 'TEETH' ||
    obj.comparison === 'JAW' ||
    obj.comparison === 'LIPS'
  ) {
    radio = 'second'
  }
  var _obj = {
    radio: radio,
    radioValue: obj.comparison,
    techValue: obj.value
  }
  return JSON.stringify(_obj)
}


export { conditionRadioMap }
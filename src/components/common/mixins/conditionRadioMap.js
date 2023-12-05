import { CIQ } from '@/components/common/chart/st-development/js'

const conditionRadioMap = (entry, exit) => {
  let conditionRadio
  for (var i in entry) {
    if (entry[i].analysis == "Sentiment" || entry[i].analysis == "User") {
      conditionRadio = 'Indicator Value'
      if (entry[i].comparison === 'SVMA') {
        conditionRadio = 'Indicator Moving Average'
      }
    }
    if (entry[i].analysis == "Technical") {
      switch (entry[i].ids) {
        case "CCI": break;
        case "MACD":
          conditionRadio = conditionRadioMACD(entry[i]); break;
        case "BLB":
          conditionRadio = conditionRadioBLB(entry[i]); break;
        case "EFT":
          conditionRadio = conditionRadioEFT(entry[i]); break;
        case "SMI":
          conditionRadio = conditionRadioSMI(entry[i]); break;
        case "ERI":
          conditionRadio = conditionRadioERI(entry[i]); break;
        case "LRF": break;
        case "ADX":
          conditionRadio = conditionRadioADX(entry[i]); break;
        case "SMA":
          conditionRadio = conditionRadioSMA(entry[i]); break;
        case "ALLI":
          conditionRadio = conditionRadioALLI(entry[i]); break;
        case "TLS": break;
        default: break;
      }
    }
    var cr = CIQ.store.state.form.conditionRadio
    cr['entry'][i] = conditionRadio
    CIQ.store.commit('form/setConditionRadio', cr)
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
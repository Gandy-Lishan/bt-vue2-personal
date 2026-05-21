<template>
  <div :class="{ 'checkbox-with-input': true, 'shift-checkbox-with-input': config['label'] === 'Shift' }">
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'CheckInput' && ((isSymbol && !isShift) || isEOEP || (isSymbol && isShift && showShiftInput))" @change="validateValue(config.value)">{{ config.label }}</el-checkbox>
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'SelectInput' && categories === 'OHLCV'" style="margin-right: 10px;"></el-checkbox>
    <!-- <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'SelectInput'" style="margin-right: 10px;"></el-checkbox> -->
    <el-select :disabled="isDisabled" v-model="MAType" @change="handleSelect(MAType)" placeholder="-Select-" size="mini" v-if="config['type'] == 'SelectInput'" style="margin-right: 5px;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-tooltip effect="dark" placement="top" v-if="MAType == 'amplitude' || MAType=='amplify'">
      <span slot="content">
        Measures intraday price volatility as the percentage difference <br>between today's high and low prices relative to the previous closing price
      </span>
      <i class="fa fa-question-circle right" aria-hidden="true"></i>
    </el-tooltip>
    <div :class="{ 'input-box': true, 'shift-input': config['label'] === 'Shift' }">
      <el-input
      size="mini"
      v-model="value"
      @input="handleInput"
      :disabled="isDisabled"
      :placeholder="config.placeholder"
      :style="{ visibility: inputVisibility }"
      @blur="validateValue(value)"
    ></el-input>
    <div class="error-message" :style="{ visibility: inputVisibility }" >
      <span v-if="config['field'] === 'shift' && showShiftInput">{{ shiftErrMsg }}</span>
      <span v-else>{{ errMsg }}</span>
    </div>
    </div>
    <el-tooltip effect="dark" placement="top" v-if="(isSymbol && isShift && showShiftInput) && config['label'] === 'Shift'" style="margin-left: 5px;">
      <span slot="content">
        Offsets data backward by a specified number of periods (e.g., Shift 5 moves values 5 days back), <br>aligning historical data with current dates for time-based comparisons
      </span>
      <i class="fa fa-question-circle right" aria-hidden="true"></i>
    </el-tooltip>
  </div>
</template>

<script>
import { createPositiveIntegerValidate, createEOEPValidate } from '@/utils/formValidate';
const debounce = require('lodash/debounce')

export default {
  name: 'CheckInput',
  props: {
    config: {
      type: Object,
      required: true,
    },
    isDisabled: Boolean,
    categories: String,
    showShiftInput: Boolean
  },
  data() {
    return {
      value: '',
      showInput: false,
      // inputVisibility: 'hidden', // 初始化时设置为隐藏
      MAType: 'i',
      errMsg: '',
      shiftErrMsg: ''
    };
  },
  computed: {
    _config() {
      return this.config
    },
    isSymbol() {
      return ['Symbol Addition', 'Symbol Ratio', 'Symbol Spread','Indicator Addition', 'Indicator Ratio', 'Indicator Spread',].includes(this.categories)
    },
    isMAOption() {
      return ['MA', 'EMA'].includes(this.MAType)
    },
    options() {
      console.log('lishan options')
      const isSymbol = this.categories?.includes('Symbol') && this.categories !== 'OHLCV'
      const isIndicator = this.categories?.includes('Indicator')
      const symbolOptions = [
        // {
        //   value: 'amplify',
        //   label: 'Amplify',
        //   isSymbol: true
        // },
        {
          value: 'o',
          label: 'Symbol Open',
          isSymbol: true
        },
        {
          value: 'h',
          label: 'Symbol High',
          isSymbol: true
        },
        {
          value: 'l',
          label: 'Symbol Low',
          isSymbol: true
        },
        {
          value: 'c',
          label: 'Symbol Close',
          isSymbol: true
        },
        {
          value: 'roc',
          label: 'Rate Of Change',
          isSymbol: true
        },
        {
          value: 'amplify',
          label: 'Amplitude',
          isSymbol: true
        },
        // {
        //   value: 'i',
        //   label: 'Symbol Value',
        //   isSymbol: true
        // },
        // {
        //   value: 'i',
        //   label: 'Indicator Value'
        // },
        {
          value: 'MA',
          label: 'Simple Moving Average'
        }, {
          value: 'EMA',
          label: 'Exponential Moving Average'
        }
      ]
      // if(category && !['ETF', 'Stock'].includes(category)) {
      //   const options = [
      //   {
      //     value: 'c',
      //     label: 'Symbol Close',
      //     isSymbol: true
      //   },
      //   {
      //     value: 'roc',
      //     label: 'Rate Of Change',
      //     isSymbol: true
      //   },
      //   {
      //     value: 'MA',
      //     label: 'Simple Moving Average'
      //   }, {
      //     value: 'EMA',
      //     label: 'Exponential Moving Average'
      //   }
      //   ]
      //   const isInList = options.find(ele => ele.value === this.MAType)
      //   if(!isInList) this.MAType = options[0].value
      //   return options
      // }
      if(isSymbol) {
        // this.MAType = 'c'
        return symbolOptions
      }
      else if (isIndicator) {
        // this.MAType = 'i'
        return [
          {
            value: 'i',
            label: 'Indicator Value'
          },
          {
            value: 'MA',
            label: 'Simple Moving Average'
          }, {
            value: 'EMA',
            label: 'Exponential Moving Average'
          }
        ]
      }
      if(this.categories === 'OHLCV') {
      //  this.MAType = 'MA'
       return [
          {
            value: 'MA',
            label: 'Simple Moving Average'
          }, {
            value: 'EMA',
            label: 'Exponential Moving Average'
          }
        ]
      }
    },
    isEOEP() {
      return ['Extreme Optimism', 'Extreme Pessimism'].includes(this.config.label)
    },
    inputVisibility() {
      // debugger
      const isShowInput = ['EMA', 'MA', 'roc'].includes(this.MAType) && this.config['label'] !== 'Shift'
      const isShift = this.config['label'] === 'Shift' && this.showShiftInput && this.isSymbol
      const isEOEP = this.config.field === 'extreme_optimism' || this.config.field === 'extreme_pessimism'
      console.log('isShowInput, isShift, isEOEP', isShowInput, isShift, isEOEP)
      if(isShowInput || isShift || isEOEP) return 'visible'
      return 'hidden'
    },
    isShift() {
      return this.config.field == "shift"
    }
  },
  watch: {
    showInput(newValue) {
      // this.validateValue()
      if(this.config.type == 'SelectInput' && (this.isMAOption || this.MAType=='roc' || this.MAType=='amplitude' || this.MAType=='amplify') && this.MAType != 'i'){
        this.$emit('manageMICondStudies',this.value,this.MAType,this.config.field,this.showInput)
      }else if(this.config.field === 'extreme_optimism' && this.config.field === 'extreme_pessimism'){
        this.$emit('handleExtremeLineChange',this.value,this.config.field)
      }else if(this.config.type === 'CheckInput'){
        this.$emit('handleShiftChange',Number(this.value),this.showInput)
      }else if(this.MAType == 'i') {
        this.$emit('manageMICondStudies',this.value,'MA',this.config.field,false)
      }
    },
    // MAType(newValue) {
    //   const isShowInput = ['EMA', 'MA', 'roc'].includes(newValue)
    //   const isShift = this.config['label'] === 'Shift'
    //   if(isShowInput) this.inputVisibility = 'visible';
    //   else {
    //     this.inputVisibility = 'hidden';
    //     this.errMsg = ''
    //     if(isShift) this.shiftErrMsg = ''
    //   }
    // },
    _config: {
      handler(newValue, _) {
        if(Object.keys(newValue).length === 0) return
        // debugger
        console.log('lishan _config', this._config)
        const isSymbol = ['Symbol Addition', 'Symbol Ratio', 'Symbol Spread', 'Indicator Addition', 'Indicator Ratio', 'Indicator Spread'].includes(this.categories)
        const {field, value} = newValue
        if(this.config.type == 'SelectInput') this.showInput = true
        else this.showInput = newValue.checked
        try {
          const _value = value.replace(/\d+/g, "")
          if(isSymbol && ['ma1', 'ma2'].includes(field) && ['o', 'h', 'l', 'c', 'roc', 'amplitude', 'amplify', 'i', 'e'].includes(_value)) {
            this.MAType = _value
          }else if(!isSymbol && this.categories === 'OHLCV' && ['ma1', 'ma2'].includes(field) && (value == '0' || value == '1' || !value)) {
            this.MAType = 'MA'
            this.showInput = false
            this.value = ''
          }else if(!isSymbol && ['ma1', 'ma2'].includes(field) && (Boolean(value))) {
            this.value = value || ''
            this.MAType = 'MA'
            this.showInput = value ? true : false
          }else if(isSymbol && ['ma1', 'ma2'].includes(field) && (Boolean(value))) {
            this.value = value || ''
            this.MAType = 'MA'
            this.showInput = value ? true : false
          }
           else if(!isSymbol && ['ma1', 'ma2'].includes(field) && (!Boolean(value))) {
            this.value = ''
            this.MAType = 'i'
            this.showInput = true
          }
          else {
            this.MAType = newValue.MAType || ''
          }
        } catch (error) {
          
        }
        this.value = newValue.value
        if(typeof newValue.value === 'string' && newValue.value.includes('e'))  {this.value =  newValue.value.toString().replace(/e$/, ''); this.MAType = 'EMA'}
        if(typeof newValue.value === 'string' && newValue.value.includes('i'))  {this.value =  newValue.value.toString().replace(/e$/, ''); this.MAType = 'i'}
        if(typeof newValue.value === 'string' && newValue.value.includes('roc'))  {this.value =  newValue.value.toString().replace(/roc$/, ''); this.MAType = 'roc'}
        if(typeof newValue.value === 'string' && newValue.value.includes('amplify'))  {this.value =  newValue.value.toString().replace(/amplify$/, ''); this.MAType = 'amplify'}
        if(typeof newValue.value === 'string' && newValue.value.includes('amplitude'))  {this.value =  newValue.value.toString().replace(/amplitude$/, ''); this.MAType = 'amplitude'}
      },
      deep: true, // 启用深度监听，监视对象属性的变化
      immediate: true,
    },
    categories: {
      handler(newValue, oldValue) {
        console.log('lishan newValue', newValue)
        console.log('lishan oldValue', oldValue)
        // if(this.symbolOrIndicator(newValue) === 'Symbol') {
        //     this.MAType = 'c'
        //   }
        //   else if(this.symbolOrIndicator(newValue) === 'Indicator') {
        //     this.MAType = 'i'
        //   }else if(newValue === 'OHLCV') {
        //     this.MAType = 'MA'
        //   }else {
        //     this.MAType = ''
        //   }
        /*
        Indicator Spread
        Indicator Ratio
        Indicator Addition
        Indicator Resample
        Symbol Spread
        Symbol Ratio
        Symbol Addition
        Symbol OHLCV
        Weighted Indicator Combination
        */
      }
    }
  },
  methods: {
    symbolOrIndicator(value){
      const isSymbol = ['Symbol Addition', 'Symbol Ratio', 'Symbol Spread'].includes(value)
      const isIndicator = ['Indicator Spread', 'Indicator Ratio', 'Indicator Addition'].includes(value)
      if(isSymbol) return 'Symbol'
      else if(isIndicator) return 'Indicator'
      else if(value === 'OHLCV') return 'MA'
      else return ''
    },
    clearForm() {
      this.showInput = false
      if(this.config.type == 'SelectInput') this.showInput = true
      else this.showInput = false
      this.value = ''
      // this.inputVisibility = 'hidden'
      if(this.symbolOrIndicator(this.categories) === 'Symbol') {
        this.MAType = 'c'
      }
      else if(this.symbolOrIndicator(this.categories) === 'Indicator') {
        this.MAType = 'i'
      }else if(this.categories === 'OHLCV') {
        this.MAType = 'MA'
      }else {
        this.MAType = ''
      }
    },
    saveData() {
      if(this.config.field === 'ma1' || this.config.field === 'ma2') {
        let value = this.value || 0
        const dontSaveMaValue = ['o', 'h', 'l', 'c'].includes(this.MAType)
        if(!this.showInput) value = 0
        else if(this.MAType == 'EMA') value = `${this.value}e`
        else if(this.MAType == 'roc') value = `${this.value}roc`
        else if(this.MAType == 'amplitude') value = `amplitude`
        else if(this.MAType == 'amplify') value = `amplify`
        else if(this.MAType == 'MA') value = this.value
        else if(this.MAType == 'i' && this.categories !== 'OHLCV') value = 'i'
        else if(!this.showInput && this.categories === 'OHLCV') value = 0
        if(dontSaveMaValue) value = 0

        if(!this.isMAOption && this.config['label'] === 'Moving Average') {
          let value = this.MAType
          this.$emit('saveData', `symbol_${this.config.field}`, value)
        }
        this.$emit('saveData', this.config.field, value)
      } else if(this.config.field === 'extreme_optimism' || this.config.field === 'extreme_pessimism') {
        let value = this.showInput ? this.value : 0
        if(!this.showInput) value = 0
        this.$emit('saveData', this.config.field, value)
      }else if(this.config.field === 'shift') {
        debugger
        let value = (this.showInput && this.isSymbol && this.inputVisibility === 'visible') ? this.value : 0
        this.$emit('saveData', `shift`, value)
      }
    },
    handleSelect(val) {
      if((['ma1', 'ma2'].includes(this.config.field) && isNaN(this.value))) {
        this.value = ''
      }
      this.MAType = val
      if(this.config.type == 'SelectInput' && (this.isMAOption || this.MAType=='roc' || this.MAType=='amplitude' || this.MAType=='amplify' || ['o','h','l','c'].includes(this.MAType)) && this.MAType != 'i') this.$emit('manageMICondStudies',this.value,this.MAType,this.config.field,true)
      else if(this.MAType == 'i')  this.$emit('manageMICondStudies',this.value,'MA',this.config.field,false)
    },
    handleInput: debounce(function (val) {
      if(this.config.type == 'SelectInput' && (this.isMAOption || this.MAType=='roc' || this.MAType=='amplitude' || this.MAType=='amplify') && this.MAType != 'i'){
        this.$emit('manageMICondStudies',this.value,this.MAType,this.config.field,this.showInput)
      }else if(this.config.field === 'extreme_optimism' && this.config.field === 'extreme_pessimism'){
        this.$emit('handleExtremeLineChange',this.value,this.config.field)
      }else if(this.config.type === 'CheckInput'){
        this.$emit('handleShiftChange',Number(this.value),this.showInput)
      }else if(this.MAType == 'i') {  
        this.$emit('manageMICondStudies',this.value,'MA',this.config.field,false)
      }
      this.validateValue()
    }, 500),
    validateForm() {
      if(this.showInput) {
        this.validateValue(this.value)
        if(this.errMsg) {
          this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.');
          return false;
        }
        if(this.shiftErrMsg) {
          this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.');
          return false;
        }
      }
      return true
    },
    validateValue() {
      const _config = this._config
      const value = this.value
      if(_config.label == "Extreme Optimism") {
        // 限制小数点后两位
        if(!this.showInput) {this.errMsg = ''}
        else this.errMsg = createEOEPValidate(value)
      }else if(_config.label == "Extreme Pessimism") {
        if(!this.showInput) {this.errMsg = ''}
        else this.errMsg = createEOEPValidate(value)
      }else if(_config.field == "ma1") {
        if(!this.showInput || this.inputVisibility === 'hidden' || this.isDisabled) {this.errMsg = ''}
        else this.errMsg = createPositiveIntegerValidate(value, 0)
      }else if(_config.field == "ma2") {
        if(!this.showInput || this.inputVisibility === 'hidden' || this.isDisabled) {this.errMsg = ''}
        else this.errMsg = createPositiveIntegerValidate(value, 0)
      }else if(this.isSymbol && _config.field == "shift" && this.showShiftInput) {
        if(!this.showInput) {this.shiftErrMsg = ''}
        else this.shiftErrMsg = createPositiveIntegerValidate(value, 0, true)
      }
      console.log('errMsg', this.errMsg)
      console.log('shiftErrMsg', this.shiftErrMsg)
    },
  }
};
</script>

<style lang="less" scoped>
.checkbox-with-input {
  display: flex;
  align-items: center;
}
.input-box{
  width: 100%;
  position: relative;
}
.shift-input {
  width: 35.5%
}
.input {
  visibility: hidden;
}
.el-select.el-select--mini{
  min-width: 220px;
}
.el-checkbox.is-bordered.el-checkbox--medium .el-checkbox__inner, .el-checkbox__inner {
  width: 18px;
  height: 18px;
}
.error-message {
  position: absolute;
  line-height: 1;
  font-size: 10px;
  color: #F56C6C;
  white-space: nowrap;
}
.shift-checkbox-with-input {
  margin-top: 10px;
}
</style>
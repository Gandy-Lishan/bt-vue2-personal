<template>
  <div :class="{ 'checkbox-with-input': true, 'shift-checkbox-with-input': config['label'] === 'Shift' }">
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'CheckInput' && ((isSymbol && !isShift) || isEOEP || (isShift && showShiftInput))" @change="validateValue(config.value)">{{ config.label }}</el-checkbox>
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'SelectInput'" style="margin-right: 10px;"></el-checkbox>
    <el-select :disabled="isDisabled" v-model="MAType" @change="handleSelect" placeholder="-Select-" size="mini" v-if="config['type'] == 'SelectInput'" style="margin-right: 5px;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
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
    indicator_1_category: String,
    indicator_2_category: String,
    showShiftInput: Boolean
  },
  data() {
    return {
      value: '',
      showInput: false,
      // inputVisibility: 'hidden', // 初始化时设置为隐藏
      MAType: 'MA',
      errMsg: '',
      shiftErrMsg: ''
    };
  },
  computed: {
    _config() {
      return this.config
    },
    isSymbol() {
      return ['Symbol Addition', 'Symbol Ratio', 'Symbol Spread'].includes(this.categories)
    },
    isMAOption() {
      return ['MA', 'EMA'].includes(this.MAType)
    },
    options() {
      const isSymbol = this.categories?.includes('Symbol')
      let category
      if(this.config.field === 'ma1') category = this.indicator_1_category
      else if(this.config.field === 'ma2') category = this.indicator_2_category
      const options = [
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
        //   value: 'amplify',
        //   label: 'Amplify',
        //   isSymbol: true
        // },
        {
          value: 'MA',
          label: 'Simple Moving Average'
        }, {
          value: 'EMA',
          label: 'Exponential Moving Average'
        }
      ]
      if(category && !['ETF', 'Stock'].includes(category)) {
        const options = [
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
          value: 'MA',
          label: 'Simple Moving Average'
        }, {
          value: 'EMA',
          label: 'Exponential Moving Average'
        }
        ]
        const isInList = options.find(ele => ele.value === this.MAType)
        if(!isInList) this.MAType = options[0].value
        return options
      }
      if(isSymbol) return options
      return  options.filter(ele => ele.isSymbol !== true) 
    },
    isEOEP() {
      return ['Extreme Optimism', 'Extreme Pessimism'].includes(this.config.label)
    },
    inputVisibility() {
      const isShowInput = ['EMA', 'MA', 'roc'].includes(this.MAType) && this.config['label'] !== 'Shift'
      const isShift = this.config['label'] === 'Shift' && this.showShiftInput && this.isSymbol
      const isEOEP = this.config.field === 'extreme_optimism' && this.config.field === 'extreme_pessimism'
      if(isShowInput || isShift || isEOEP) return 'visible'
      return 'hidden'
    },
    isShift() {
      return this.config.field == "shift"
    }
  },
  watch: {
    showInput(newValue) {
      this.validateValue()
      if(this.config.type == 'SelectInput' && (this.isMAOption || this.MAType=='roc' || this.MAType=='amplitude' || this.MAType=='amplify')){
        this.$emit('manageMICondStudies',this.value,this.MAType,this.config.field,this.showInput)
      }else if(this.config.field === 'extreme_optimism' && this.config.field === 'extreme_pessimism'){
        this.$emit('handleExtremeLineChange',this.value,this.config.field)
      }else if(this.config.type === 'CheckInput'){
        this.$emit('handleShiftChange',Number(this.value),this.showInput)
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
        const {field, value} = newValue
        this.showInput = newValue.checked
        try {
          const _value = value.replace(/\d+/g, "")
          if(this.isSymbol && ['ma1', 'ma2'].includes(field) && ['o', 'h', 'l', 'c', 'roc', 'amplitude', 'amplify'].includes(_value)) {
            this.MAType = _value
          }
          else{this.MAType = 'MA'}
        } catch (error) {
          
        }
        this.value = newValue.value
        if(typeof newValue.value === 'string' && newValue.value.includes('e'))  {this.value =  newValue.value.toString().replace(/e$/, ''); this.MAType = 'EMA'}
        if(typeof newValue.value === 'string' && newValue.value.includes('roc'))  {this.value =  newValue.value.toString().replace(/roc$/, ''); this.MAType = 'roc'}
        if(typeof newValue.value === 'string' && newValue.value.includes('amplify'))  {this.value =  newValue.value.toString().replace(/amplify$/, ''); this.MAType = 'amplify'}
        if(typeof newValue.value === 'string' && newValue.value.includes('amplitude'))  {this.value =  newValue.value.toString().replace(/amplitude$/, ''); this.MAType = 'amplitude'}
      },
      deep: true, // 启用深度监听，监视对象属性的变化
      immediate: true,
    },
    // categories(newValue) {
    //   if(this.isEditState) return
    //   // const isChecked = ['o', 'h', 'l', 'c', 'roc', 'amplitude'].includes(this.MAType)
    //   const isSymbol = newValue.includes('Symbol')
    //   if(isSymbol && (this.config.field === 'ma1' || this.config.field === 'ma2')) this.MAType = 'c'
    //   if(!isSymbol && (['o', 'h', 'l', 'c', 'roc', 'amplitude'].includes(this.MAType))) this.MAType = 'MA'
    //   if(!isSymbol && this.config['label'] === 'Shift' && this.inputVisibility === 'visible') {
    //     this.inputVisibility = 'hidden'
    //     this.showInput = false
    //   }
    // }
  },
  methods: {
    clearForm() {
      this.showInput = false
      this.value = ''
      // this.inputVisibility = 'hidden'
      this.MAType = 'MA'
    },
    saveData() {
      if(this.config.field === 'ma1' || this.config.field === 'ma2') {
        let value = this.showInput ? this.value : 0
        const dontSaveMaValue = ['o', 'h', 'l', 'c'].includes(this.MAType)
        if(!this.showInput) value = 0
        else if(this.showInput && this.MAType == 'EMA') value = `${this.value}e`
        else if(this.showInput && this.MAType == 'roc') value = `${this.value}roc`
        else if(this.showInput && this.MAType == 'amplitude') value = `amplitude`
        else if(this.showInput && this.MAType == 'amplify') value = `amplify`
        else if(this.showInput && this.MAType == 'MA') value = this.value
        if(this.showInput && dontSaveMaValue) value = 0

        if(!this.isMAOption && this.config['label'] === 'Moving Average') {
          let value = this.showInput ? this.MAType : 'c'
          this.$emit('saveData', `symbol_${this.config.field}`, value)
        }
        this.$emit('saveData', this.config.field, value)
      } else if(this.config.field === 'extreme_optimism' || this.config.field === 'extreme_pessimism') {
        let value = this.showInput ? this.value : 0
        if(!this.showInput) value = 0
        this.$emit('saveData', this.config.field, value)
      }else if(this.config.field === 'shift') {
        let value = (this.showInput && this.isSymbol && this.inputVisibility === 'visible') ? this.value : 0
        this.$emit('saveData', `shift`, value)
      }
    },
    handleSelect(val) {
      this.MAType = val
      if(this.config.type == 'SelectInput' && (this.isMAOption || this.MAType=='roc' || this.MAType=='amplitude' || this.MAType=='amplify')) this.$emit('manageMICondStudies',this.value,this.MAType,this.config.field,this.showInput)
    },
    handleInput: debounce(function (val) {
      if(this.config.type == 'SelectInput' && (this.isMAOption || this.MAType=='roc' || this.MAType=='amplitude' || this.MAType=='amplify')){
        this.$emit('manageMICondStudies',this.value,this.MAType,this.config.field,this.showInput)
      }else if(this.config.field === 'extreme_optimism' && this.config.field === 'extreme_pessimism'){
        this.$emit('handleExtremeLineChange',this.value,this.config.field)
      }else if(this.config.type === 'CheckInput'){
        this.$emit('handleShiftChange',Number(this.value),this.showInput)
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
        if(!this.showInput || this.inputVisibility === 'hidden') {this.errMsg = ''}
        else this.errMsg = createPositiveIntegerValidate(value, 0)
      }else if(_config.field == "ma2") {
        if(!this.showInput || this.inputVisibility === 'hidden') {this.errMsg = ''}
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
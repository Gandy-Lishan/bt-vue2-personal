<template>
  <div :class="{ 'checkbox-with-input': true, 'shift-checkbox-with-input': config['label'] === 'Shift' }">
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'CheckInput' && (isSymbol || isEOEP)" @change="validateValue(config.value)">{{ config.label }}</el-checkbox>
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
      :placeholder="config.placeholder"
      :style="{ visibility: inputVisibility }"
      @blur="validateValue(value)"
    ></el-input>
    <div class="error-message">
      <span v-if="config['field'] === 'shift'">{{ shiftErrMsg }}</span>
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
    categories: String
  },
  data() {
    return {
      value: 5,
      showInput: false,
      inputVisibility: 'hidden', // 初始化时设置为隐藏
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
      const isSymbol = this.categories.includes('Symbol')
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
          value: 'MA',
          label: 'Simple Moving Average'
        }, {
          value: 'EMA',
          label: 'Exponential Moving Average'
        }
      ]

      if(isSymbol) return options
      return  options.filter(ele => ele.isSymbol !== true) 
    },
    isEOEP() {
      return ['Extreme Optimism', 'Extreme Pessimism'].includes(this.config.label)
    }
  },
  watch: {
    showInput(newValue) {
      debugger
      if (newValue && ((!this.isSymbol && this.isMAOption && this.config['label'] === 'Moving Average') || (this.isSymbol && this.config['label'] === 'Shift') || this.isEOEP)) {
        this.inputVisibility = 'visible';
      } else {
        this.inputVisibility = 'hidden';
      }
      if(this.config.type == 'SelectInput' && this.isMAOption){
        this.$emit('manageMAStudies',this.value,this.MAType,this.config.field,this.showInput)
      }else if(this.config.field === 'extreme_optimism' && this.config.field === 'extreme_pessimism'){
        this.$emit('handleExtremeLineChange',this.value,this.config.field)
      }
    },
    _config: {
      handler(newValue, _) {
        if(Object.keys(newValue).length === 0) return
        console.log('newValue', newValue)
        debugger
        const {field, value} = newValue
        this.showInput = newValue.checked
        if(this.isSymbol && ['ma1', 'ma2'].includes(field) && ['o', 'h', 'l', 'c', 'v'].includes(value)) {
          this.MAType = newValue.value
        }
        this.value = newValue.value
        if(typeof newValue.value === 'string' && newValue.value.includes('e'))  {this.value =  newValue.value.toString().replace(/e$/, ''); this.MAType = 'EMA'}
      },
      deep: true, // 启用深度监听，监视对象属性的变化
      immediate: true,
    },
    categories(newValue) {
      if(this.isEditState) return
      const isChecked = ['o', 'h', 'l', 'c'].includes(this.MAType)
      const isSymbol = newValue.includes('Symbol')
      if(isSymbol && !isChecked && this.config.field === 'ma1') this.MAType = 'c'
      if(isSymbol && !isChecked && this.config.field === 'ma2') this.MAType = 'o'
      if(!isSymbol && (['o', 'h', 'l', 'c', 'v'].includes(this.MAType))) this.MAType = 'MA'
      if(!isSymbol && this.config['label'] === 'Shift' && this.inputVisibility === 'visible') {
        this.inputVisibility = 'hidden'
        this.showInput = false
      }
    }
  },
  methods: {
    clearForm() {
      this.showInput = false
      this.value = 5
      this.inputVisibility = 'hidden'
      this.MAType = 'MA'
    },
    saveData() {
      if(this.config.field === 'ma1' || this.config.field === 'ma2') {
        let value = this.value
        if(!this.showInput) value = 1
        if(this.showInput && this.MAType == 'EMA') value = `${this.value}e`

        if(this.isSymbol && !this.isMAOption && this.config['label'] === 'Moving Average') {
          let defaultValue = 'c'
          this.$emit('saveData', `symbol_${this.config.field}`, this.MAType || defaultValue)
        }
        this.$emit('saveData', this.config.field, value || 1)
      } else if(this.config.field === 'extreme_optimism' || this.config.field === 'extreme_pessimism') {
        let value = this.value
        if(!this.showInput) value = 0
        this.$emit('saveData', this.config.field, value || 0)
      }else if(this.config.field === 'shift') {
        if(this.isSymbol && this.showInput)  this.$emit('saveData', `shift`, this.value || 0)
      }
    },
    handleSelect(val) {
      this.MAType = val
      this.$emit('manageMAStudies',this.value,this.MAType,this.config.field,this.showInput)
    },
    handleInput: debounce(function (val) {
      if(this.config.type == 'SelectInput'){
        this.$emit('manageMAStudies',this.value,this.MAType,this.config.field,this.showInput)
      }else {
        this.$emit('handleExtremeLineChange',this.value,this.config.field)
      }
    }, 500),
    validateForm() {
      if(this.showInput) {
        if(this.isSymbol && this.config['field'] == 'shift') {
          this.validateShiftValue(this.value)
          if(this.shiftErrMsg) {
            this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.');
            return false
          }
        }else {
          this.validateValue(this.value)
        }
        if(this.errMsg) {
          this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.');
          return false;
        }
      }
      return true
    },
    validateValue() {
      const _config = this._config
      debugger
      const value = this.value
      if(_config.label == "Extreme Optimism") {
        // 限制小数点后两位
        this.errMsg = createEOEPValidate(value)
      }else if(_config.label == "Extreme Pessimism") {
        this.errMsg = createEOEPValidate(value)
      }else if(_config.field == "ma1") {
        this.errMsg = createPositiveIntegerValidate(value, 1)
      }else if(_config.field == "ma2") {
        this.errMsg = createPositiveIntegerValidate(value, 1)
      }else if(_config.field == "shift") {
        this.shiftErrMsg = createPositiveIntegerValidate(value, 0, true)
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
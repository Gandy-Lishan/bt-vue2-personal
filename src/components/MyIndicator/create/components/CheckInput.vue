<template>
  <div class="checkbox-with-input">
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'CheckInput'" @change="validateValue(config.value)">{{ config.label }}</el-checkbox>
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'SelectInput' && !isSymbol" style="margin-right: 10px;"></el-checkbox>
    <el-select
      v-model="symbol"
      size="mini"
      placeholder="-Select-"
      style="margin-right: 5px;"
      v-if="isSymbol && config['type'] == 'SelectInput'"
      >
        <el-option
          v-for="item in symbolConditions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
       </el-option>
      </el-select>
    <el-select :disabled="isDisabled" v-model="MAType" @change="handleSelect" placeholder="-Select-" size="mini" v-if="config['type'] == 'SelectInput'" style="margin-right: 5px;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <div class="input-box">
      <el-input
      size="mini"
      v-show="showInput"
      v-model="value"
      @input="handleInput"
      :placeholder="config.placeholder"
      :style="{ visibility: inputVisibility }"
      @blur="validateValue(value)"
    ></el-input>
    <div class="error-message">{{ errMsg }}</div>
    </div>
    <span style="color: #606266; font-weight: 600; font-size: 12px;margin: 0 2px;" v-if="isSymbol && config['type'] == 'SelectInput'">Shift</span>
    <div class="input-box">
    <el-input
      size="mini"
      v-show="isSymbol && config['type'] == 'SelectInput'"
      v-model="shift"
      :placeholder="config.placeholder"
      @blur="validateShiftValue(shift)"
    ></el-input>
    <div class="error-message">{{ shiftErrMsg }}</div>
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
      value: '5',
      showInput: false,
      inputVisibility: 'hidden', // 初始化时设置为隐藏
      options: [{
          value: 'MA',
          label: 'Simple Moving Average'
        }, {
          value: 'EMA',
          label: 'Exponential Moving Average'
        }],
        symbolConditions: [
          {label: 'Symbol Open', value: 'o'},
          {label: 'Symbol High', value: 'h'},
          {label: 'Symbol Low', value: 'l'},
          {label: 'Symbol Close', value: 'c'},
          {label: 'Symbol Volume', value: 'v'}
        ],
        MAType: 'MA',
        errMsg: '',
        symbol: 'c',
        shift: '',
        shiftErrMsg: ''
    };
  },
  computed: {
    _config() {
      return this.config
    },
    isSymbol() {
      return this.categories.includes('Symbol')
    }
  },
  watch: {
    showInput(newValue) {
      if (newValue) {
        this.inputVisibility = 'visible';
      } else {
        this.inputVisibility = 'hidden';
      }
      if(this.config.type == 'SelectInput'){
        this.$emit('manageMAStudies',this.value,this.MAType,this.config.field,this.showInput)
      }else{
        this.$emit('handleExtremeLineChange',this.value,this.config.field)
      }
    },
    _config: {
      handler(newValue, _) {
        if(Object.keys(newValue).length === 0) return
        console.log('newValue', newValue)
        this.showInput = newValue.checked
        this.value = newValue.value
        if(typeof newValue.value === 'string' && newValue.value.includes('e'))  {this.value =  newValue.value.toString().replace(/e$/, ''); this.MAType = 'EMA'}
      },
      deep: true, // 启用深度监听，监视对象属性的变化
      immediate: true,
    },
    categories: {
      handler(newVal) {
        if(this.categories.includes('Symbol') && this.config['type'] == 'SelectInput') this.showInput = true
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
        if(this.isSymbol && this.config['type'] === 'SelectInput') {
          this.$emit('saveData', `symbol_${this.config.field}`, this.symbol || 'o')
          this.$emit('saveData', `shift_${this.config.field}`, this.shift || 0)
        }
        this.$emit('saveData', this.config.field, value || 1)
      } else if(this.config.field === 'extreme_optimism' || this.config.field === 'extreme_pessimism') {
        let value = this.value
        if(!this.showInput) value = 0
        this.$emit('saveData', this.config.field, value || 0)
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
        this.validateValue(this.value)
        if(this.isSymbol && this.config['type'] == 'SelectInput') {
          this.validateShiftValue(this.shift)
          if(this.shiftErrMsg) {
            this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.');
            return false
          }
        }
        if(this.errMsg) {
          this.popUpMsgBox('Kindly ensure that the form fields are filled correctly.');
          return false;
        }
      }
      return true
    },
    validateValue(value) {
      console.log('value', value)
      console.log('_config', this._config)
      const _config = this._config
      if(_config.label == "Extreme Optimism") {
        // 限制小数点后两位
        this.errMsg = createEOEPValidate(value)
      }else if(_config.label == "Extreme Pessimism") {
        this.errMsg = createEOEPValidate(value)
      }else if(_config.field == "ma1") {
        this.errMsg = createPositiveIntegerValidate(value, 1)
      }else if(_config.field == "ma2") {
        this.errMsg = createPositiveIntegerValidate(value, 1)
      }
    },
    validateShiftValue(value) {
      // 1-252 正整数
      const _config = this._config
      if(_config.field == "ma1") {
        this.shiftErrMsg = createPositiveIntegerValidate(value, 0, true)
      }else if(_config.field == "ma2") {
        this.shiftErrMsg = createPositiveIntegerValidate(value, 0, true)
      }
      console.log(value)
    },
    displayData({shift, symbol}) {
      this.shift = shift
      this.symbol = symbol
    }
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
.input {
  visibility: hidden;
}
.el-select.el-select--mini{
  min-width: 135px;
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
</style>

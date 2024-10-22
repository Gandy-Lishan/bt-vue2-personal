<template>
  <div class="checkbox-with-input">
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'CheckInput'" @change="validateValue(config.value)">{{ config.label }}</el-checkbox>
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'SelectInput'" style="margin-right: 10px;"></el-checkbox>
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
    isDisabled: Boolean
  },
  data() {
    return {
      value: '5',
      showInput: false,
      inputVisibility: 'hidden', // 初始化时设置为隐藏
      options: [{
          value: 'MA',
          label: 'Moving Average'
        }, {
          value: 'EMA',
          label: 'Exponential Moving Average'
        }],
        MAType: 'MA',
        errMsg: ''
    };
  },
  computed: {
    _config() {
      return this.config
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
</style>

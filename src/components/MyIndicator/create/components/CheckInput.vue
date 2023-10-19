<template>
  <div class="checkbox-with-input">
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'CheckInput'">{{ config.label }}</el-checkbox>
    <el-checkbox :disabled="isDisabled" v-model="showInput" v-if="config['type'] == 'SelectInput'" style="margin-right: 10px;"></el-checkbox>
    <el-select :disabled="isDisabled" v-model="MAType" @change="handleSelect" placeholder="-Select-" size="mini" v-if="config['type'] == 'SelectInput'" style="margin-right: 5px;">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
    <el-input
      size="mini"
      v-show="showInput"
      v-model="value"
      @input="handleInput"
      :placeholder="config.placeholder"
      :style="{ visibility: inputVisibility }"
    ></el-input>
  </div>
</template>

<script>
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
      this.$emit('manageMAStudies',this.value,this.MAType,this.config.field,this.showInput)
    },
    _config: {
      handler(newValue, _) {
        if(Object.keys(newValue).length === 0) return
        console.log('newValue', newValue)
        this.showInput = newValue.checked
        this.value = newValue.value
        if(typeof newValue.value === 'string' && newValue.value.includes('e'))  this.value =  newValue.value.toString().replace(/e$/, '');
      },
      deep: true, // 启用深度监听，监视对象属性的变化
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
        if(!this.showInput) this.value = 1
        if(this.showInput && this.MAType == 'EMA') this.value = `${this.value}e`
        this.$emit('saveData', this.config.field, this.value || 1)
      } else if(this.config.field === 'extreme_optimism' || this.config.field === 'extreme_pessimism') {
        if(!this.showInput) this.value = 0
        this.$emit('saveData', this.config.field, this.value || 0)
      }
    },
    handleSelect(val) {
      this.MAType = val
      this.$emit('manageMAStudies',this.value,this.MAType,this.config.field,this.showInput)
    },
    handleInput(val) {
      this.$emit('manageMAStudies',this.value,this.MAType,this.config.field,this.showInput)
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox-with-input {
  display: flex;
  align-items: center;
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
</style>

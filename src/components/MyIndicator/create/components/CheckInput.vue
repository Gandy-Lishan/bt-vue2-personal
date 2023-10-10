<template>
  <div class="checkbox-with-input">
    <el-checkbox v-model="showInput">{{ config.label }}</el-checkbox>
    <el-input
      size="mini"
      v-show="showInput"
      v-model="value"
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
      required: true
    }
  },
  data() {
    return {
      value: '',
      showInput: false,
      inputVisibility: 'hidden', // 初始化时设置为隐藏
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
    },
    _config: {
      handler(newValue, oldValue) {
        if(Object.keys(newValue).length === 0) return
        console.log('newValue', newValue)
        this.showInput = newValue.checked
        this.value = newValue.value
      },
      deep: true, // 启用深度监听，监视对象属性的变化
    },
  },
  methods: {
    saveData() {
      if(this.config.field === 'ma1' || this.config.field === 'ma2') {
        if(!this.showInput) this.value = 1
        this.$emit('saveData', this.config.field, this.value)
      } else if(this.config.field === 'extreme_optimism' || this.config.field === 'extreme_pessimism') {
        if(!this.showInput) this.value = 0
        this.$emit('saveData', this.config.field, this.value)
        
      }
    }
  }
};
</script>

<style lang="less" scoped>
.checkbox-with-input {
  display: flex;
  align-items: center;
}

/* 可选的样式，根据需要自定义 */
.checkbox {
  margin-right: 10px;
}

.input {
  visibility: hidden;
}
</style>

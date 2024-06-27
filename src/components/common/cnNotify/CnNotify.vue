<template>
    <div class="cn_notify">
      <div class="content">
        <i class="el-icon-message-solid"></i>
        {{ msg }}
      </div>
      <div class="footer">
        <el-row class="btnBoxNotify">
          <el-button type="primary" @click="onSubmit">Confirm</el-button>
          <el-button @click="cancle">Cancel</el-button>
        </el-row>
      </div>
    </div>
  </template>
  <script>
  export default {
    name: 'CnNotify',
    props: {
      msg: {
        type: String,
        default: '',
      },
      version: {
        type: String,
        default: '',
      },
    },
    data() {
      return {};
    },
    created() {},
    methods: {
      // 点击确定更新
      onSubmit() {
        sessionStorage.setItem('version', this.version) // 存入版本version
        location.reload() // 刷新
      },
      // 关闭
      cancle() {
        this.$parent.close();
      },
    },
  };
  </script>
  <style lang='scss' scoped>
  .cn_notify {
    .content {
      padding: 20px 0;
    }
    .footer {
      display: flex;
      justify-content: center;
    }
  }
  </style>
  <style lang='scss'>
  .versionNotifyStyle {
    .el-notification__content {
      width: 280px !important;
    }
  }
  </style>./CnNotify.vue
export default {
  data() {
    return {
      isMessageBoxVisible: false,
    };
  },
  methods: {
    popUpMsgBox(msg, duration = 8000) {
      if (!this.isMessageBoxVisible) {
        this.isMessageBoxVisible = true;

        this.$message({
          message: `<strong>${msg}</strong>`,
          center: true,
          dangerouslyUseHTMLString: true,
          showClose: true,
          duration,
          customClass: 'no-icon',
          type: 'warning',
          onClose: () => {
            // 弹窗关闭时重置状态变量
            this.isMessageBoxVisible = false;
          },
        });
      }
    },
  },
};

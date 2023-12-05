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
        const type = !msg.toLowerCase().includes('success') ? 'warning' : 'success'
        this.$message({
          message: `<strong>${msg}</strong>`,
          center: true,
          dangerouslyUseHTMLString: true,
          showClose: true,
          duration,
          customClass: 'no-icon',
          type,
          onClose: () => {
            // 弹窗关闭时重置状态变量
            this.isMessageBoxVisible = false;
          },
        });
      }
    },
  },
};

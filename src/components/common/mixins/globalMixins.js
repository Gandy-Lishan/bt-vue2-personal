export default {
  methods: {
    popUpMsgBox(msg, duration=8000) {
      this.$message({
        message: `<strong>${msg}</strong>`,
        center: true,
        dangerouslyUseHTMLString: true,
        showClose: true,
        duration,
        customClass: 'no-icon',
      });
    },
  },
};

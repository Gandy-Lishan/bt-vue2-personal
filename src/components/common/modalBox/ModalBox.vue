<template>
    <div class="modal" v-if="isOpen" @click.self="close">
      <div class="modal-bg"></div>
      <div class="modal-content">
        <button class="close-button" @click="close">✖</button>
        <slot></slot>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isOpen: false,
      };
    },
    methods: {
      open() {
        this.isOpen = true;
      },
      close() {
        this.isOpen = false;
        this.$emit('close'); // 触发关闭事件
      },
    },
  };
  </script>
  
  <style scoped>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;
  }
  
  .modal-bg {
    position: absolute;
    border: 1px solid #6b72804d;
    background: rgba(52, 64, 84, 0.6);
  }

  .modal-content {
    background: #fff;
    padding: 24px;
    border-radius: 16px;
    position: relative;
    max-width: 893;
    width: 100%;
    box-shadow: 34px 4px 74px -24px #38327c14;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .close-button {
    position: absolute;
    top: 24px;
    right: 24px;
    border: none;
    background: none;
    font-size: 20px;
    cursor: pointer;

    color: #6b7094;
    transition: color .2s;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .close-button:hover{
    color: #642eff;
  }
  </style>
  
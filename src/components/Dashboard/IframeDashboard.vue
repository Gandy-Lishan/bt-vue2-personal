<template>
 <div class="iframe-container">
   <iframe
     id="myIframe"
     :src="externalUrl"
     width="100%"
     height="1300px"
     style="border: none;"
   ></iframe>
 </div>
</template>

<script>
 // 如果运行在 sub.example.com，将看到 sessionId=12345
 localStorage.setItem('cookie', document.cookie);
 const iframe = document.getElementById('myIframe');

 // 确保 iframe 加载完成后操作
 iframe.onload = () => {
   const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

   // 查找并删除 header 元素
   const header = iframeDoc.querySelector('.page-header'); // 假设 header 是要删除的元素
   if (header) {
     header.remove();
   }
 };
export default {
 data() {
   return {
     externalUrl: "https://users.sentimentrader.com/users/", // 要嵌入的外部网站地址
   };
 },
 mounted() {
  // document.cookie
  const header = document.querySelector('.page-header'); if(header) header.remove()
 }
};
</script>
<style lang="less" scoped>
.iframe-container {
 width: 100%;
 height: 100%;
}
</style>
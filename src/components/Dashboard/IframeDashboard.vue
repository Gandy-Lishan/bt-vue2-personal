<template>
 <div class="iframe-container">
   <iframe
     id="myIframe"
     src="https://users.sentimentrader.com/users/"
     width="100%"
     height="1300px"
     style="border: none;"
   ></iframe>
 </div>
</template>

<script>
 // 如果运行在 sub.example.com，将看到 sessionId=12345
 // localStorage.setItem('cookie', document.cookie);

export default {
 data() {
   return {
     externalUrl: "https://users.sentimentrader.com/users/", // 要嵌入的外部网站地址
   };
 },
 mounted() {
  // document.cookie
 const iframe = document.getElementById('myIframe');

 // // 确保 iframe 加载完成后操作
 iframe.onload = () => {
  setTimeout(() => {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const header = iframeDoc.querySelector('.page-header');
    if (header) header.remove();
  }, 1000); // 延迟 100ms
};
 }
}
</script>
<style lang="less" scoped>
.iframe-container {
 width: 100%;
 height: 100%;
}
</style>
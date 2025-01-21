<template>
 <div class="iframe-container">
   <iframe
     :src="externalUrl"
     width="100%"
     height="1300px"
     style="border: none;"
   ></iframe>
 </div>
</template>

<script>
export default {
 data() {
   return {
     externalUrl: "https://users.sentimentrader.com/users/", // 要嵌入的外部网站地址
   };
 },
 mounted() {
  // document.cookie
  // 如果运行在 sub.example.com，将看到 sessionId=12345
  localStorage.setItem('cookie', document.cookie);
 }
};
</script>
<style lang="less" scoped>
.iframe-container {
 width: 100%;
 height: 100%;
}
</style>
<template>
 <div class="row">
   <div class="col-md-12">
     <div v-if="messages.length" class="flashed-messages">
       <div class="row">
         <div class="col-md-12">
           <div
             v-for="(message, index) in messages"
             :key="index"
             :class="`alert alert-${message.category}`"
           >
             <a class="close" title="Close" href="#" @click.prevent="dismissMessage(index)">
               &times;
             </a>
             {{ message.text }}
           </div>
         </div>
       </div>
     </div>
   </div>
 </div>
</template>

<script>
export default {
 name: 'FlashMessage',
 data() {
   return {
     // Example data structure for flashed messages
     messages: [
       { category: "success", text: "Operation completed successfully!" },
       { category: "danger", text: "An error occurred. Please try again." }
     ]
   };
 },
 methods: {
   dismissMessage(index) {
     // Remove the message from the array
     this.messages.splice(index, 1);
   }
 }
};
</script>

<style lang="less" scoped>
/* Add any custom styles here */
@import "./index.less";
</style>
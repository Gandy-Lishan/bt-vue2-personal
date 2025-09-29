<template>
 <div class="indicators-container">
   <h3 style="font-size: 23px; font-weight: 300; margin: 10px 0;">Related Charts</h3>
   <div class="indicator-left" ref="IndicatorTable">
     <template v-for="item in tableInfoList">
       <Table
        v-bind="$attrs"
        :key="item.type"
        :tableInfo="item"
        :ref="item.refName"
        ></Table>
     </template>
   </div>
 </div>
</template>

<script>
import Table from "./Table";

export default {
 name: 'ConstituentConditions',
 data () {
   return {
     tableInfoList: [
       {
         label: 'Constituent Conditions',
         type: 'constituent_conditions',
         refName: 'constituent_conditions_virtual_scroll',
         itemSize: 40,
         keyProp: 'url',
         options: [
           {
             label: 'Constituent Conditions',
             value: 'constituent_conditions',
             type: 'constituent_conditions',
             url: 'constituent_conditions'
           }
         ]
       }
     ],
     displayRow: {}
   }
 },
 components: {
   Table
 }
}
</script>

<style lang="less" scoped>
</style>
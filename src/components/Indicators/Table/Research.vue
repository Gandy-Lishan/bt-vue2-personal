<template>
  <div class="indicators-container">
    <!-- <h3 style="font-size: 23px; font-weight: 300;">This chart has been mentioned in {{ blog_results_length }} blog post(s). The
      posts are listed below.</h3>
    <hr style="border-top: 1px solid #eee; margin: 20px 0"> -->
    <div class="left" ref="IndicatorTable">
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
  name: 'Research',
  data () {
    return {
      tableInfoList: [
        {
          label: 'Research & Blog Posts',
          type: 'research',
          refName: 'researchVirtualScroll',
          itemSize: 40,
          keyProp: 'url',
          options: [
            {
              label: 'Blog Posts',
              value: 'research',
              type: 'research',
              url: 'research'
            }
          ]
        }
      ],
      displayRow: {},
    }
  },
  components: {
    Table
  }
 }
 </script>
 
 <style lang="less" scoped>
 </style>
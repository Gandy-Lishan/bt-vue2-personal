<template>
  <div class="indicators-container">
    <h3 style="font-size: 23px; font-weight: 300;">Related Charts</h3>
    <hr style="border-top: 1px solid #eee; margin: 20px 0">
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
 import { mapGetters } from 'vuex'
 
 export default {
  name: 'Related',
  data () {
    return {
      tableInfoList: [
        {
          label: 'Related Charts',
          type: 'related',
          refName: 'relatedVirtualScroll',
          itemSize: 40,
          keyProp: 'url',
          options: [
            {
              label: 'Related Charts',
              value: 'related',
              type: 'related',
              url: 'related_charts'
            }
          ]
        }
      ],
      displayRow: {}
    }
  },
  computed: {
     ...mapGetters({
       indicatorsListData: 'getIndicatorsPageListData'
     })
   },
  components: {
    Table
  },
  methods: {
  }
 }
 </script>
 
 <style lang="less" scoped>
 </style>
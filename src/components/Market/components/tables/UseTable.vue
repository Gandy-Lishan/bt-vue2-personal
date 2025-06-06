<!-- 使用示例 -->
<template>
 <div>
   <base-table
     title="交易数据分析"
     subtitle="实时数据"
     date-time="2024-03-21"
     assets-info="9 assets × 18 exchanges"
     :filter-tags="[
       { key: 'exchange', label: '交易所', value: 'Binance' },
       { key: 'asset', label: '资产', value: 'BTC' }
     ]"
     :data="tableData"
     :columns="columns"
     :filters="filters"
     :loading="loading"
      :show-operations="true"
     tip-text="这是一个重要提示信息"
     @delete="handleDelete"
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     @remove-tag="handleRemoveTag"
   >
     <!-- 自定义操作按钮 -->
     <template #operations="{ row }">
       <el-button type="text" size="small" @click="handleEdit(row)">
         编辑
       </el-button>
     </template>
   </base-table>
 </div>
</template>

<script>
import BaseTable from './BaseTable.vue'

export default {
 name: 'UseTable', 
 components: {
   BaseTable
 },
 data() {
   return {
     loading: false,
     tableData: [
       {
         id: 1,
         name: '产品 A',
         price: 100,
         image: 'https://example.com/image.jpg',
         change: '+0.77%',
         link: 'https://example.com',
         type: '类型1'
       },
       {
         id: 2,
         name: '产品 B',
         price: 200,
         image: 'https://example.com/image2.jpg',
         change: '-0.88%',
         link: 'https://example.com',
         type: '类型2'
       }
     ],
     columns: [
       { prop: 'id', label: 'ID', width: '80', sortable: true },
       { prop: 'image', label: '图片', type: 'image', width: '100' },
       { prop: 'name', label: '名称', sortable: true },
       { prop: 'price', label: '价格', sortable: true },
       { 
         prop: 'change', 
         label: '涨跌幅', 
         type: 'percentage',
         sortable: true 
       },
       { 
         prop: 'link', 
         label: '链接', 
         type: 'link',
         formatter: (row) => '点击查看'
       }
     ],
     filters: [
       {
         key: 'type',
         placeholder: '请选择类型',
         options: [
           { label: '类型1', value: '类型1' },
           { label: '类型2', value: '类型2' }
         ]
       }
     ]
   }
 },
 methods: {
   handleDelete({ index, row }) {
     this.$confirm('确认删除该记录?', '提示', {
       type: 'warning'
     }).then(() => {
       // 执行删除操作
       this.tableData.splice(index, 1)
       this.$message.success('删除成功')
     }).catch(() => {})
   },
   handleEdit(row) {
     // 处理编辑操作
     console.log('编辑', row)
   },
   handleSizeChange(size) {
     console.log('每页显示条数改变：', size)
   },
   handleCurrentChange(page) {
     console.log('当前页改变：', page)
   },
   handleRemoveTag(tag) {
     // 处理移除 tag 的逻辑
     console.log('移除标签：', tag)
   }
 }
}
</script>
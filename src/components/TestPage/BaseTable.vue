<!-- components/BaseTable.vue -->
<template>
 <div class="base-table-container">
   <!-- 新增：表头区域 -->
   <div class="table-title-section">
     <div class="left-section">
       <h3 class="table-title">{{ title }}</h3>
       <span v-if="subtitle" class="table-subtitle">{{ subtitle }}</span>
     </div>
     <div class="right-section">
       <!-- 时间显示 -->
       <span v-if="dateTime" class="date-time">{{ dateTime }}</span>
       
       <!-- 资产信息 -->
       <span v-if="assetsInfo" class="assets-info">{{ assetsInfo }}</span>
       
       <!-- Filter Tags -->
       <div v-if="filterTags.length" class="filter-tags">
         <el-tag
           v-for="tag in filterTags"
           :key="tag.key"
           closable
           size="small"
           @close="handleRemoveTag(tag)"
         >
           {{ tag.label }}: {{ tag.value }}
         </el-tag>
       </div>
     </div>
   </div>

   <!-- 提示语区域 -->
   <div v-if="showTip" class="table-tip">
     <span>{{ tipText }}</span>
     <i class="el-icon-close" @click="closeTip"></i>
   </div>

   <!-- 搜索和过滤区域 -->
   <div class="table-header">
     <div class="filter-section">
       <el-input
         v-if="showSearch"
         v-model="searchQuery"
         placeholder="请输入搜索内容"
         prefix-icon="el-icon-search"
         @input="handleSearch"
         size="small"
         clearable
       />
       
       <el-select
         v-for="filter in filters"
         :key="filter.key"
         v-model="filterValues[filter.key]"
         :placeholder="filter.placeholder"
         @change="handleFilter"
         clearable
         size="small"
       >
         <el-option
           v-for="option in filter.options"
           :key="option.value"
           :label="option.label"
           :value="option.value"
         />
       </el-select>
     </div>
   </div>

   <!-- 表格主体 -->
   <el-table
     :data="filteredData"
     :height="height"
     :border="border"
     :stripe="stripe"
     v-loading="loading"
     size="small"
     @row-click="handleRowClick"
   >
     <!-- 表格列 -->
     <template v-for="column in columns">
       <el-table-column
         :key="column.prop"
         :prop="column.prop"
         :label="column.label"
         :width="column.width"
         :sortable="column.sortable"
         :align="column.align || 'left'"
       >
         <template slot-scope="scope">
           <!-- 自定义单元格内容 -->
           <div :class="getCellClass(scope.row[column.prop], column)">
             <!-- 图片类型 -->
             <template v-if="column.type === 'image'">
               <el-image
                 :src="scope.row[column.prop]"
                 :preview-src-list="[scope.row[column.prop]]"
                 fit="contain"
                 :style="{ width: column.imageWidth || '50px' }"
               />
             </template>

             <!-- 链接类型 -->
             <template v-else-if="column.type === 'link'">
               <a
                 :href="scope.row[column.prop]"
                 target="_blank"
                 class="table-link"
               >{{ column.formatter ? column.formatter(scope.row) : scope.row[column.prop] }}</a>
             </template>

             <!-- 百分比类型 -->
             <template v-else-if="column.type === 'percentage'">
               <span :class="getPercentageClass(scope.row[column.prop])">
                 {{ scope.row[column.prop] }}
               </span>
             </template>

             <!-- 默认类型 -->
             <template v-else>
               {{ column.formatter ? column.formatter(scope.row) : scope.row[column.prop] }}
             </template>
           </div>
         </template>
       </el-table-column>
     </template>

     <!-- 操作列 -->
     <el-table-column
       v-if="showOperations"
       label="操作"
       :width="operationWidth"
     >
       <template slot-scope="scope">
         <el-button
           v-if="operations.includes('delete')"
           type="text"
           size="small"
           @click="handleDelete(scope.$index, scope.row)"
         >
           删除
         </el-button>
         <slot name="operations" :row="scope.row" :index="scope.$index"></slot>
       </template>
     </el-table-column>
   </el-table>

   <!-- 分页 -->
   <div v-if="showPagination" class="pagination-container">
     <el-pagination
       :current-page.sync="currentPage"
       :page-sizes="pageSizes"
       :page-size.sync="pageSize"
       :total="total"
       layout="total, sizes, prev, pager, next, jumper"
       @size-change="handleSizeChange"
       @current-change="handleCurrentChange"
     />
   </div>
 </div>
</template>

<script>
export default {
 name: 'BaseTable',
 props: {
   // 表格数据
   data: {
     type: Array,
     required: true
   },
   // 列配置
   columns: {
     type: Array,
     required: true
   },
   // 过滤器配置
   filters: {
     type: Array,
     default: () => []
   },
   // 是否显示搜索框
   showSearch: {
     type: Boolean,
     default: true
   },
   // 是否显示分页
   showPagination: {
     type: Boolean,
     default: true
   },
   // 表格高度
   height: {
     type: [String, Number],
     default: null
   },
   // 是否显示边框
   border: {
     type: Boolean,
     default: true
   },
   // 是否显示斑马纹
   stripe: {
     type: Boolean,
     default: true
   },
   // 提示文本
   tipText: {
     type: String,
     default: ''
   },
   // 是否显示操作列
   showOperations: {
     type: Boolean,
     default: false
   },
   // 操作列宽度
   operationWidth: {
     type: String,
     default: '150'
   },
   // 可用的操作类型
   operations: {
     type: Array,
     default: () => ['delete']
   },
   // 是否加载中
   loading: {
     type: Boolean,
     default: false
   },
   // 新增属性
   title: {
     type: String,
     default: ''
   },
   subtitle: {
     type: String,
     default: ''
   },
   dateTime: {
     type: String,
     default: ''
   },
   assetsInfo: {
     type: String,
     default: ''
   },
   filterTags: {
     type: Array,
     default: () => []
   },
   // 新增：是否可点击行
   rowClickable: {
     type: Boolean,
     default: false
   },
   // 新增：行点击跳转的链接字段名
   rowClickUrlField: {
     type: String,
     default: 'url'
   },
 },
 data() {
   return {
     searchQuery: '',
     filterValues: {},
     currentPage: 1,
     pageSize: 10,
     pageSizes: [10, 20, 50, 100],
     showTip: !!this.tipText,
   }
 },
 computed: {
   // 过滤后的数据
   filteredData() {
     let result = [...this.data]

     // 搜索过滤
     if (this.searchQuery) {
       result = result.filter(item => {
         return this.columns.some(column => {
           const value = item[column.prop]
           if (value == null) return false
           return String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
         })
       })
     }

     // 条件过滤
     Object.keys(this.filterValues).forEach(key => {
       const value = this.filterValues[key]
       if (value) {
         result = result.filter(item => item[key] === value)
       }
     })

     // 分页
     if (this.showPagination) {
       const start = (this.currentPage - 1) * this.pageSize
       const end = start + this.pageSize
       return result.slice(start, end)
     }

     return result
   },
   // 总数据量
   total() {
     return this.data.length
   }
 },
 methods: {
   // 处理搜索
   handleSearch() {
     this.currentPage = 1
   },
   // 处理过滤
   handleFilter() {
     this.currentPage = 1
   },
   // 处理删除
   handleDelete(index, row) {
     this.$emit('delete', { index, row })
   },
   // 处理每页条数变化
   handleSizeChange(val) {
     this.pageSize = val
     this.$emit('size-change', val)
   },
   // 处理页码变化
   handleCurrentChange(val) {
     this.currentPage = val
     this.$emit('current-change', val)
   },
   // 关闭提示
   closeTip() {
     this.showTip = false
   },
   // 获取百分比类型的样式类
   getPercentageClass(value) {
     if (!value) return ''
     const num = parseFloat(value)
     if (isNaN(num)) return ''
     return num > 0 ? 'text-success' : num < 0 ? 'text-danger' : ''
   },
   // 获取单元格的样式类
   getCellClass(value, column) {
     return {
       'cell-content': true,
       [column.className]: column.className
     }
   },
   // 新增方法
   handleRemoveTag(tag) {
     this.$emit('remove-tag', tag)
   },
   // 新增：处理行点击
   handleRowClick(row, column, event) {
    debugger
     if (!this.rowClickable) return
     
     // 如果点击的是操作列，不跳转
     if (column.label === '操作') return
     
     // 获取当前行的链接
     const url = row[this.rowClickUrlField]
     if (url) {
       // 跳转到新页面
       window.open(url, '_blank')
     }
     
     // 触发事件
    //  this.$emit('row-click', { row, column, event })
   }
 }
}
</script>

<style lang="less" scoped>
.base-table-container {
 width: 100%;
}

.table-title-section {
 display: flex;
 justify-content: space-between;
 align-items: center;
 margin-bottom: 16px;
 
 .left-section {
   display: flex;
   align-items: center;
   gap: 12px;
   
   .table-title {
     margin: 0;
     font-size: 18px;
     font-weight: bold;
   }
   
   .table-subtitle {
     color: #909399;
     font-size: 14px;
   }
 }
 
 .right-section {
   display: flex;
   align-items: center;
   gap: 16px;
   
   .date-time {
     color: #606266;
     font-size: 14px;
   }
   
   .assets-info {
     color: #409EFF;
     font-weight: 500;
   }
   
   .filter-tags {
     display: flex;
     gap: 8px;
     flex-wrap: wrap;
   }
 }
}

.table-header {
 margin-bottom: 16px;
}

.filter-section {
 display: flex;
 gap: 16px;
 align-items: center;
 flex-wrap: wrap;
}

.table-tip {
 background-color: #f4f4f5;
 padding: 8px 16px;
 margin-bottom: 16px;
 border-radius: 4px;
 display: flex;
 justify-content: space-between;
 align-items: center;
}

.table-tip i {
 cursor: pointer;
}

.pagination-container {
 margin-top: 16px;
 display: flex;
 justify-content: flex-end;
}

.cell-content {
 display: flex;
 align-items: center;
 font-weight: bold;
}

.table-link {
 color: #409EFF;
 text-decoration: none;
 font-weight: bold;
}

.table-link:hover {
 text-decoration: underline;
}

.text-success {
 color: #67C23A;
 font-weight: bold;
}

.text-danger {
 color: #F56C6C;
 font-weight: bold;
}

.table-link:hover {
 text-decoration: underline;
}

.text-success {
 color: #67C23A;
}

.text-danger {
 color: #F56C6C;
}

/deep/ .el-table {
 .cell {
   font-weight: bold;
 }
  
 // 修改表头样式
 th {
   background-color: #303133 !important;  // 使用更深的颜色
   
   .cell {
     color: #ffffff;  // 文字改为白色
     font-weight: bold;  // 表头文字加粗
   }
 }
 
 // 确保表头在 hover 时保持颜色
 th.is-sortable:hover {
   background-color: #404244 !important;  // hover 时略微变亮
 }
 
 // 当列处于排序状态时的样式
 th.ascending,
 th.descending {
   background-color: #404244 !important;
 }
}

/deep/ .el-input--small .el-input__inner {
 margin-left: 0px;
}
</style>
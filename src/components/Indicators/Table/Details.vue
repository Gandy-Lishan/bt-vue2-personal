<template>
  <div class="details">
    <div class="back">
			<span @click="$emit('showDetails', {}, false)"><i class="el-icon-arrow-left"></i>Back to List</span>
		</div>
    <el-collapse  v-model="activeName" accordion>
      <el-collapse-item name="1">
        <template slot="title">
          <h3 class="panel-title">
            Data Access -
            <small><em>For internal use only...no distribution is allowed.</em></small>
          </h3>
        </template>
        <div class="centent">
          <el-button type="primary" size="small" @click="$emit('downloadCSV')">Download CSV File</el-button>
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <h3 class="panel-title">
            Indicator Details and Other Charts
          </h3>
        </template>
        <div class="centent">
          <div class="headerSelect">
            <h4  @click="selectedTitle = 'Detail'" :class="{ 'selected': selectedTitle === 'Detail' }">Indicator Detail</h4>
            <h4  @click="selectedTitle = 'Research'" :class="{ 'selected': selectedTitle === 'Research' }">Research & Blog Posts</h4>
            <h4  @click="selectedTitle = 'Related'" :class="{ 'selected': selectedTitle === 'Related' }">Related Charts</h4>
          </div>
          <div>
            <Construction v-show="selectedTitle === 'Detail'" ref="Construction" :convertedHTML="convertedHTML" :title="title"></Construction>
            <Research v-show="selectedTitle === 'Research'" ref="Research" :blog_results="blog_results"></Research>
            <Related v-show="selectedTitle === 'Related'" ref="Related" :related="related"></Related>
          </div>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Research from "./Research";
import Construction from "./Construction";
import Related from "./Related";
import { getIndicatorsRowData } from '@/service/service'

export default {
  props: {
    row: Object
  },
  name: 'Details',
  data() {
    return {
      activeName: ['1', '2'],
      activeTab: 'first',
      selectedTitle: 'Detail',
      convertedHTML: '',
      title: '',
      blog_results: [],
      related: []
    }
  },
  watch: {
    row: {
      async handler(newValue) {
        if(!newValue.url) return;
        try {
          this.title = newValue.chart_name
          const res = await getIndicatorsRowData(newValue.url)
          let originalData = res?.data
          if(typeof originalData === 'string') {
            originalData = originalData.replace(/NaN/g, 'null')
            originalData = JSON.parse(originalData)
          }
          console.log('originalData', originalData)
          this.blog_results = originalData.blog_results
          this.related = originalData.related
        } catch (error) {
          console.log('error', error)
          return
        }
        const convertToHTML = (text) => {
					// 替换换行符、制表符、大于号、和与号
					text = text.replace(/\\r/g, '<br>')
					text = text.replace(/\\n/g, '<br>')
					text = text.replace(/\\t/g, '&emsp;')
					text = text.replace(/&gt;/g, '>')
					text = text.replace(/&amp;/g, '&')
					text = text.replace(/&rsquo;/g, '\'')
					return text
      	}
        this.convertedHTML = convertToHTML(newValue.description)
      },
      deep: true
    },
    selectedTitle(newValue) {
      if(newValue === 'Research' || newValue == 'Related') {
        
      }
    }
  },
  components: {
    Research,
    Construction,
    Related
  }
}
</script>

<style lang="less" scoped>
.details {
  user-select: text;
  .back {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1rem;
    padding: 10px;
    cursor: pointer;
    background-color: #d9d9d9;
    border-radius: 4px 4px 0px 0px;
    i {
      font-weight: bold;
    }
    span {
      color: #525456;
      font-weight: bold;
      &:hover {
        color: #5b9bd1;
      }
    }
  }
}
.panel-title {
  font-weight: 300;
  margin: 0px 0px 0px 10px;
}
h3 {  
  margin: 0;
  padding: 0;
}
/deep/ .el-collapse-item__header {
  background-color: #c0c4cc5c;
  border-bottom: 1px solid #e0e0e0;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  font-size: 18px;
  color: #666;
  position: relative;
  flex-wrap: wrap;
  height: auto;
}
.el-button.el-button--primary.el-button--small {
  background-color: #67809f;
}
.el-button--text {
  padding: 0px;
}
.centent {
  padding: 15px 15px 0px 15px;
}
.el-collapse-item {
  border: 1px solid #c0c4cc5c;
  border-radius: 3px;
}
.el-collapse-item:first-child {
  margin-bottom: 25px;
}
.headerSelect {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  h4 {
    margin: 0;
    color: #737373;
    cursor: pointer;
    font-size: 15px;
    font-weight: 400;
    padding: 10px 15px;
    &.selected {
      border-bottom: 4px solid #1c5271;
      color: #333;
    }
    &:hover {
      color: #333;
    }
  }
}
.details-container {
  padding: 15px;
  .well {
    font-size: 18px;
    background-color: #eee;
    padding: 10px;
  }
  h4 {
    font-size: 18px;
    margin: 10px 0px 10px 0px;
  }
  p {
    margin: 0 0 10px 0;
    font-size: 15px;
    color: #333;
    font-weight: 400;
  }
}
.convertedHTML p {
    margin: 0 0 10px 0;
    font-size: 15px;
    color: #333;
    font-weight: 400;
}
</style>
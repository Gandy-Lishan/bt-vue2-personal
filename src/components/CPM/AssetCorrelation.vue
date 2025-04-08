<template>
  <div class="page-content-wrapper asset-correlation">
  <!-- <p v-show="date" style="margin-top: 10px"><strong>Correlation matrix of monthly asset returns for the period 01/01/2008 to {{date}}.</strong></p> -->
  <p v-show="datePicks.end_date" style="margin-top: 10px"><strong>Correlation matrix of monthly asset returns for the period
     <el-date-picker
        v-model="datePicks.start_date"
        type="date"
        placeholder="Select Start Date"
        size="small"
        value-format="yyyy-MM-dd"
        :picker-options="startPickerOptions"
      >
      </el-date-picker> 
      to 
      <el-date-picker
        v-model="datePicks.end_date"
        type="date"
        size="small"
        placeholder="Select End Date"
        value-format="yyyy-MM-dd"
        :picker-options="endPickerOptions"
      >
      </el-date-picker>
      </strong>
      <el-button @click="selectDate" type="primary" size="small" style="margin-left: 10px" :loading="loading">View Results</el-button>
    </p>
  <table class="asset-table">
    <thead>
      <tr>
          <th v-for="col in columns" :key="col" :width="col === 'Name' ? '180px' : 'auto'">{{ col }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in data" :key="index" :class="{ stripe: index % 2 === 0 }">
          <td v-for="col in columns" :key="col" :style="getCellStyle(row, col)">
              {{ row[col] }}
          </td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
import { getAssetCorrelation, postAssetCorrelation } from "@/service/service";
import moment from "moment";
import { timestampToTime } from '@/utils'

export default {
  name: 'AssetCorrelation',
  props: {
    data: Array
  },
  data() {
    return {
      fixedColumns: ['Name', 'Ticker'],
      additionalFixedColumns: [
        'Annualized Return',
        'Daily Standard Deviation',
        'Monthly Standard Deviation',
        'Annualized Standard Deviation'
      ],
      datePicks: {
        start_date: '2008-01-01',
        end_date: '',
      },
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      },
      loading: false
    }
  },
  watch: {
		datePicks: {
			handler(newVal) {
			},
			deep: true
		},
	},
  async mounted() {
    const {data} = await getAssetCorrelation()
    this.data = data || []
    this.datePicks.end_date = moment.utc(this.data[0].last_updated).format('YYYY-MM-DD')
  },
  computed: {
    columns() {
      // 获取动态列名（排除固定列和额外固定列）
      if((Array.isArray(this.data) && this.data.length === 0) || !this.data) return []
      const dynamicColumns = Object.keys(this.data[0]).filter(
          key => !this.fixedColumns.includes(key) && !this.additionalFixedColumns.includes(key)
      );
      // 按照接口返回的顺序排列动态列名
      const orderedDynamicColumns = Object.keys(this.data[0]).filter(
          key => dynamicColumns.includes(key)
      ).filter(ele => ele !== 'last_updated')
      // 合并列名：固定列 + 动态列 + 额外固定列
      return [...this.fixedColumns, ...orderedDynamicColumns, ...this.additionalFixedColumns];
    }
  },
  methods: {
    handleDisabledStartDate(time) {
      const today = timestampToTime(new Date())
      const endDay = timestampToTime(new Date(this.datePicks.end_date))
      // 如果endDate取消选择，则startDate可以选择全部
      if(this.datePicks.end_date){
        return timestampToTime(time) >= endDay
      }else{
        return (timestampToTime(time) > today)
      }
    },
    handleDisabledEndDate(time) {
      const today = timestampToTime(new Date())
      const startDay = timestampToTime(new Date(this.datePicks.start_date))
      return (timestampToTime(time) > today) || (timestampToTime(time) <= startDay)
    },
    getCellStyle(row, col) {
        // 固定列和额外固定列不应用颜色渐变
        if (this.fixedColumns.includes(col) || this.additionalFixedColumns.includes(col)) {
            return {};
        }
        const value = row[col];
        if (typeof value !== 'number') return {};
        
        // 负数区间：-1 到 0（白色 → #cdb8b5）
        if (value < 0) {
            const intensity = Math.abs(value); // 取绝对值
            const r = 255 - Math.floor(intensity * (255 - 0xcd));
            const g = 255 - Math.floor(intensity * (255 - 0xb8));
            const b = 255 - Math.floor(intensity * (255 - 0xb5));
            return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
        }
        // 正数区间：0 到 1（白色 → #7296b5）
        else if (value > 0) {
            const r = 255 - Math.floor(value * (255 - 0x72));
            const g = 255 - Math.floor(value * (255 - 0x96));
            const b = 255 - Math.floor(value * (255 - 0xb5));
            return { backgroundColor: `rgb(${r}, ${g}, ${b})` };
        }
        // 零值：白色
        return { backgroundColor: '#ffffff' };
    },
    async selectDate() {
      const {start_date, end_date} = this.datePicks
      if(!start_date || !end_date ) return
      const start = moment(start_date)
      const end = moment(end_date)

      // 判断是否小于 3 个月
      if (end.diff(start, 'months', true) < 3) {
			  this.popUpMsgBox('Please select a longer time period (minimum three months).')
        return
      }
      this.loading = true
      const {data:{code, data}} = await postAssetCorrelation({start_date,end_date})
      console.log('data', data)
      debugger
      if(code == 211 && data) {
        this.data = data?.corr_info || []
        this.loading = false
        return
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    padding: 2px;
    text-align: center;
    border-bottom: 1px solid #ddd;
    font-size: 12px;
    font-weight: 700;
  }
  th {
    font-size: 14px;
  }
  .stripe {
    background-color: #f9f9f9;
  }
  .asset-table {
    border-top: 2px solid #eee;
  }
  /deep/ .el-input--prefix .el-input__inner {
    margin: 0px
  }
</style>
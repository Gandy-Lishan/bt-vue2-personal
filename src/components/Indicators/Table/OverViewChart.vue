<template>
    <div class="overview-container">
        <div class="col-md-12" v-if="Array.isArray(data) && data.length !== 0">
            <template v-for="(row, rowIndex) in Math.ceil(data.length / 3)">
                    <el-row :gutter="20" class="row" :key="rowIndex">
                        <el-col :span="8" :xs="24" :sm="12" :md="8" :lg="8" :xl="8"  v-for="(item, index) in data.slice(rowIndex * 3, (rowIndex + 1) * 3)" :key="index">
                            <SummaryChart :chart="item" v-show="enlarged || (!enlarged && rowIndex == 0)" :enlarged="enlarged"></SummaryChart>
                        </el-col>
                    </el-row>
            </template>
        </div>
        <div class="table-loading" v-else>
            <span>Retrieving Chart Data</span>
            <i class="fa fa-cog fa-spin"></i>
        </div>
    </div>
</template>
<script>
import SummaryChart from "@/components/Dashboard/SummaryChart";
export default {
  name: 'Charts',
  props: {
    filterData: {
        type: Array,
        required: true,
    },
    enlarged: Boolean
  },
  components: {
    SummaryChart
  },
  data() {
    return {
        data: []
    };
  },
  watch: {
    filterData: {
        handler(filterData) {
            console.log('filterData lishan', this.filterData)
            if(Array.isArray(filterData) && filterData.length) this.data = filterData
        },
        deep: true,
        immediate: true
    },
  },
};
</script>
<style lang="less" scoped>
.overview-container {
    margin-top: 50px;
}
.col-md-12 {
    width: 100%;
}
</style>
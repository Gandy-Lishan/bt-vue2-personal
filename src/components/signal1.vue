<template>
  <div>
    <!-- 面包屑导航区域 -->
    <router-view></router-view>
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '#' }">Signals</el-breadcrumb-item>
        <el-breadcrumb-item>System Signals</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 筛选框 -->
      <template>
        <el-tabs v-model="queryInfo.filter" @tab-click="handleClick">
          <el-tab-pane label="all" name="all">
            <!-- all 表格区域 -->
            <el-table :data="signalList" border stripe size="mini">
              <el-table-column
                label=""
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="type"
                prop="type"
                align="center"
                width="80px"
              >
              </el-table-column>
              <el-table-column
                label="analysis basis"
                prop="analysis_basis"
                align="center"
              ></el-table-column>
              <el-table-column
                label="name"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="used indicators"
                prop="used_indicators"
                align="center"
              ></el-table-column>
              <el-table-column
                label="description"
                prop="description"
                align="center"
              ></el-table-column>
              <el-table-column
                label="frequency"
                prop="frequency"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="winrate percentage"
                prop="winrate_percentage"
                align="center"
              ></el-table-column>
              <el-table-column
                label="risk-reward ratio"
                prop="risk_reward_ratio"
                align="center"
              ></el-table-column>
              <el-table-column
              align="center">
                <template>
                <el-button @click="openDialog">open</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 若表格数据过多可以增加分页区域 -->
             <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="long" name="long">
            <!-- long 表格区域 -->
            <el-table :data="signalList" border stripe size="mini">
              <el-table-column
                label=""
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="type"
                prop="type"
                align="center"
                width="80px"
              >
              </el-table-column>
              <el-table-column
                label="analysis basis"
                prop="analysis_basis"
                align="center"
              ></el-table-column>
              <el-table-column
                label="name"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="used indicators"
                prop="used_indicators"
                align="center"
              ></el-table-column>
              <el-table-column
                label="description"
                prop="description"
                align="center"
              ></el-table-column>
              <el-table-column
                label="frequency"
                prop="frequency"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="winrate percentage"
                prop="winrate_percentage"
                align="center"
              ></el-table-column>
              <el-table-column
                label="risk-reward ratio"
                prop="risk_reward_ratio"
                align="center"
              ></el-table-column>
              <el-table-column
              align="center">
                <template>
                <el-button @click="openDialog">open</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 若表格数据过多可以增加分页区域 -->
             <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="short" name="short">
            <!-- short 表格区域 -->
            <el-table :data="signalList" border stripe size="mini">
              <el-table-column
                label=""
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="type"
                prop="type"
                align="center"
                width="80px"
              >
              </el-table-column>
              <el-table-column
                label="analysis basis"
                prop="analysis_basis"
                align="center"
              ></el-table-column>
              <el-table-column
                label="name"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="used indicators"
                prop="used_indicators"
                align="center"
              ></el-table-column>
              <el-table-column
                label="description"
                prop="description"
                align="center"
              ></el-table-column>
              <el-table-column
                label="frequency"
                prop="frequency"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="winrate percentage"
                prop="winrate_percentage"
                align="center"
              ></el-table-column>
              <el-table-column
                label="risk-reward ratio"
                prop="risk_reward_ratio"
                align="center"
              ></el-table-column>
              <el-table-column
              align="center">
                <template>
                <el-button @click="openDialog">open</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 若表格数据过多可以增加分页区域 -->
             <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="longexit" name="longexit">
            <!-- longexit 表格区域 -->
            <el-table :data="signalList" border stripe size="mini">
              <el-table-column
                label=""
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="type"
                prop="type"
                align="center"
                width="80px"
              >
              </el-table-column>
              <el-table-column
                label="analysis basis"
                prop="analysis_basis"
                align="center"
              ></el-table-column>
              <el-table-column
                label="name"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="used indicators"
                prop="used_indicators"
                align="center"
              ></el-table-column>
              <el-table-column
                label="description"
                prop="description"
                align="center"
              ></el-table-column>
              <el-table-column
                label="frequency"
                prop="frequency"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="winrate percentage"
                prop="winrate_percentage"
                align="center"
              ></el-table-column>
              <el-table-column
                label="risk-reward ratio"
                prop="risk_reward_ratio"
                align="center"
              ></el-table-column>
              <el-table-column
              align="center">
                <template>
                <el-button @click="openDialog">open</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 若表格数据过多可以增加分页区域 -->
             <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-tab-pane>
          <el-tab-pane label="shortexit" name="shortexit">
            <!-- shortexit 表格区域 -->
            <el-table :data="signalList" border stripe size="mini">
              <el-table-column
                label=""
                type="index"
                align="center"
              ></el-table-column>
              <el-table-column
                label="type"
                prop="type"
                align="center"
                width="80px"
              >
              </el-table-column>
              <el-table-column
                label="analysis basis"
                prop="analysis_basis"
                align="center"
              ></el-table-column>
              <el-table-column
                label="name"
                prop="name"
                align="center"
              ></el-table-column>
              <el-table-column
                label="used indicators"
                prop="used_indicators"
                align="center"
              ></el-table-column>
              <el-table-column
                label="description"
                prop="description"
                align="center"
              ></el-table-column>
              <el-table-column
                label="frequency"
                prop="frequency"
                align="center"
              >
              </el-table-column>
              <el-table-column
                label="winrate percentage"
                prop="winrate_percentage"
                align="center"
              ></el-table-column>
              <el-table-column
                label="risk-reward ratio"
                prop="risk_reward_ratio"
                align="center"
              ></el-table-column>
              <el-table-column
              align="center">
                <template>
                <el-button @click="openDialog">open</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 若表格数据过多可以增加分页区域 -->
             <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="queryInfo.pagenum"
              :page-sizes="[5, 10, 15, 20]"
              :page-size="queryInfo.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'signal1',
  data() {
    return {
      // 获取signal列表的参数对象
      queryInfo: {
        filter: 'all',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      signalList: [
        {
            type: 'long',
            analysis_basis: "sentiment",
            name: "long signal for short-term trading S&P 500",
            used_indicators: "Short term Combined Model",
            description: "Consider going long the S&P 500 when the Short Term Combined model reading is below -10",
            frequency: "weekly",
            winrate_percentage: "50%",
            risk_reward_ratio: '1/2'
          },
           {
            type: 'long',
            analysis_basis: "sentiment",
            name: "long signal for short-term trading S&P 500",
            used_indicators: "Short term Combined Model",
            description: "Consider going long the S&P 500 when the Short Term Combined model reading is below -10",
            frequency: "weekly",
            winrate_percentage: "50%",
            risk_reward_ratio: '1/2'
          },
          {
            type: 'short',
            analysis_basis: "sentiment",
            name: "long signal for short-term trading S&P 500",
            used_indicators: "Short term Combined Model",
            description: "Consider going long the S&P 500 when the Short Term Combined model reading is below -10",
            frequency: "weekly",
            winrate_percentage: "50%",
            risk_reward_ratio: '1/2'
          },
          {
            type: 'longexit',
            analysis_basis: "sentiment",
            name: "long signal for short-term trading S&P 500",
            used_indicators: "Short term Combined Model",
            description: "Consider going long the S&P 500 when the Short Term Combined model reading is below -10",
            frequency: "weekly",
            winrate_percentage: "50%",
            risk_reward_ratio: '1/2'
          },
          {
            type: 'shortexit',
            analysis_basis: "sentiment",
            name: "long signal for short-term trading S&P 500",
            used_indicators: "Short term Combined Model",
            description: "Consider going long the S&P 500 when the Short Term Combined model reading is below -10",
            frequency: "weekly",
            winrate_percentage: "50%",
            risk_reward_ratio: '1/2'
          }],
      total: 0,
      dialogVisible: false
    }
  },
  created() {
      this.getSignalList()
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    },
    openDialog(){
      this.$router.push('./openDialog')
    },
    async getSignalList() {
      const { data: res } = await this.$http.get('signal', { params: this.queryInfo })
      if(res.meta.status !== 200) {
        return this.$message.error('获取信号列表失败')
      }
      this.signalList = res.data.signalList
      this.total = res.data.total

    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getSignalList
    },
    // 监听页码值改变的事件
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getSignalList
    },
    handleClick(even) {
      console.log(even.name)
      if(this.queryInfo.filter = 'long'){
        const signalLonglist = this.signalList
        for(let i=0;i<signalLonglist.length;i++){
        const result = signalLonglist.findIndex((val) => {
        return val.type ===  'long'
        });
        var longIndexArr = []
        if(result!==-1){
        longIndexArr.push(result)}
        console.log(111)
        }
        console.log(longIndexArr)
      }
    }
  },
}
</script>
<style lang="less" scoped>
</style>

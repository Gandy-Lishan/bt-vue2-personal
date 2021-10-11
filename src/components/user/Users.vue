<template>
  <div>
    <!-- 面包屑导航区域 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>维修成本</el-breadcrumb-item>
      <el-breadcrumb-item>维修情况</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 卡片视图区域 -->
    <el-card>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }"
          >Strategies</el-breadcrumb-item
        >
        <el-breadcrumb-item>System Strategies</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- 搜索与添加区域 -->
      <!-- <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="input3"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">搜索</el-button>
        </el-col>
      </el-row> -->
      <!-- <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="医院名称" prop="username"></el-table-column>
        <el-table-column label="设备编号" prop="email"></el-table-column>
        <el-table-column label="设备类型" prop="mobile"></el-table-column>
        <el-table-column label="月维修次数" prop="role_name"></el-table-column>
        <el-table-column label="维修成本">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作"></el-table-column>
      </el-table> -->
      <el-table :data="systemList" border stripe size="mini">
        <el-table-column
          label="index"
          type="index"
          align="center"
          width="55px"
        ></el-table-column>
        <el-table-column label="favorites" align="center" width="80px">
          <template slot-scope="scope">
            <i v-if="scope.row.favorites" class="el-icon-star-on"></i>
            <i v-else class="el-icon-star-off"></i>
          </template>
        </el-table-column>
        <el-table-column
          label="name"
          prop="name"
          align="center"
        ></el-table-column>
        <el-table-column
          label="used indicators"
          prop="usedIndicators"
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
        ></el-table-column>
        <el-table-column label="action" align="center" width="250px">
          <template slot-scope="scope">
            <el-select
              v-model="scope.row.value"
              clearable
              @change="searchSelect(scope.row.value, scope.$index)"
              placeholder="please select"
            >
              <el-option
                v-for="item in optionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userList: [],
      optionList: [
        {
          value: 0,
          label: 'open'
        },
        {
          value: 1,
          label: 'Add to favorites'
        },
        {
          value: 2,
          label: 'Remove from favorites'
        },
        {
          value: 3,
          label: 'Backtest Strategy'
        }
      ],
      value: '',
      systemList: [
        {
          index: 0,
          name: 'MACD Crossabove',
          usedIndicators: 'MACD',
          description: 'MACD 12MA crossabove 26MA',
          frequency: 'Daily',
          action: 'open',
          value: '',
          favorites: false
        },
        {
          index: 1,
          name: 'RSI Overbought',
          usedIndicators: 'RSI',
          description: 'RSI > 70',
          frequency: 'Weekly',
          action: 'open',
          value: '',
          favorites: false
        },
        {
          index: 2,
          name: 'MACD Crossabove with RSI Overbought',
          usedIndicators: 'MACD+RSI',
          description: 'MACD 12MA crossabove 26MA + RSI>70',
          frequency: 'monthly',
          action: 'open',
          value: '',
          favorites: false
        }
      ],
      total: 0
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听changesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    searchSelect(val, idx) {
      if (val === 1) {
        this.systemList[idx].favorites = true
      }
      if (val === 2) {
        this.systemList[idx].favorites = false
      }
    }
  }
}
</script>
<style lang="less" scoped></style>

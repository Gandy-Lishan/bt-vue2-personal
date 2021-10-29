<template>
  <div>
    <el-table :data="signalList" border stripe size="mini">
      <!-- <el-table-column label="" align="center" prop="id" width="40px"></el-table-column> -->
      <el-table-column label="" align="center" type="index" :index="orderIndex" width="40px">
          <!-- <template slot-scope="scope">
            <div v-text="(page * 10) + scope.$index"></div>
          </template> -->
      </el-table-column>
      <el-table-column
        label="favorite"
        align="center"
        width="70px"
        prop="favorites"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.favorites" @click="addFavorites(scope.row)">
            <i class="el-icon-star-on"></i>
          </span>
          <span v-else @click="addFavorites(scope.row)">
            <i class="el-icon-star-off"></i>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="type" prop="type" align="center" width="80px">
      </el-table-column>
      <el-table-column
        label="analysis basis"
        prop="analysis_basis"
        align="center"
        width="110px"
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
      <el-table-column label="frequency" prop="frequency" align="center" width="100px">
      </el-table-column>
      <!-- <el-table-column
        label="winrate percentage"
        prop="winrate_percentage"
        align="center"
      ></el-table-column>
      <el-table-column
        label="risk-reward ratio"
        prop="risk_reward_ratio"
        align="center"
      ></el-table-column> -->
      <el-table-column align="center" width="100px">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row.id, scope.row)" type="primary"
            >open</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'signalTable',
  props: {
    signalList: Array,
    page: Number
  },
  methods: {
    openDialog(id, row) {
      this.$emit('showDialog', id, row)
    },
    addFavorites(row) {
      row.favorites = !row.favorites
      const addFavoritesData = row
      let vm = this
      //qs.stringify()将对象 序列化成URL的形式，以&进行拼接
      this.$http
          .put(
            '/demo/signal/' + row.id + '/',
            vm.$qs.stringify(addFavoritesData)
          )
          .then((res) => {
            if (res.status == 200){
              this.signalList[row.id].favorites != this.signalList[row.id].favorites
              if(res.data.favorites){
                this.$message.success({
                message: 'Added to my favorite',
                duration: 1000
              })
              }else {
                this.$message.success({
                message: 'Removed to favorites',
                duration: 1000
              })
              }}
          })
          .catch((error) => {
            console.log(error)
          })
    },
    orderIndex(index) {
      if (this.page !== 0){
      return ((this.page-1) * 10) + (index +1)

      }else{
        return (0 * 10) + (index +1)
      }
    }
    // removeFavorites(row) {
    //   this.$emit('removeFavorites', row)
    // },
  }
}
</script>
<style scoped>
</style>
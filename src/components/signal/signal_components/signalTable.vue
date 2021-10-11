<template>
  <div>
    <el-table :data="signalList" border stripe size="mini">
      <el-table-column label="" type="index" align="center"></el-table-column>
      <el-table-column
        label="favorite"
        align="center"
        width="55px"
        prop="favorites"
      >
        <!-- <template slot-scope="scope">
                  <i v-if="scope.row.favorite" class="el-icon-star-on"></i>
                  <i v-else class="el-icon-star-off"></i>
                </template> -->
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
      <el-table-column label="frequency" prop="frequency" align="center">
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
      <el-table-column align="center">
        <template slot-scope="scope">
          <el-button @click="openDialog(scope.row.id, scope.row)"
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
  },
  
  methods: {
    openDialog(id, row) {
      this.$emit('openDialog', id, row)
    },
    addFavorites(row) {
      row.favorites = !row.favorites
      const addFavoritesData = row
      let vm = this
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
              }
            }
          })
          .catch((error) => {
            console.log(error)
          })
      
    },
    removeFavorites(row) {
      this.$emit('removeFavorites', row)
    },
  },
}
</script>
<style scoped>
</style>
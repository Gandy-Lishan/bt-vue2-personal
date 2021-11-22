<template>
<div class="symbolDialog">
  <el-dialog title="symbolList" :visible.sync="symbolDialogVisible" :before-close='closeDialog'>
          <template>
            <!-- <el-radio v-model="radio" @change="checkEntry(scope.row)" :label="scope.row.name">{{ '' }}</el-radio> -->
            <el-select
            @change="changeHandler"
              v-model="value"
              filterable
              remote
              reserve-keyword
              placeholder="please enter symbol name"
              :remote-method="remoteMethod"
              :loading="loading">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>

</el-dialog>
</div>
</template>
<script>
export default {
  props: {
      symbolDialogVisible: Boolean
       },
  name: 'symbolDialog',
  data(){
    return {
        options: [],
        value: {},
        list: [],
        loading: false,
        symbolList: []
    }
  },
  mounted() {
      this.list = this.symbolList.map(item => {
        return { value: `name:${item.stock}`, label: `stock:${item.stock}` };
      });
      //console.log(this.list)
    },
  computed: {
    listSet(){
      return this.symbolList.map(item => {
        return { value: `${item.stock}`, label: `stock:${item.stock}` };
      });
    }
  },
  methods: {

    changeHandler(){

      this.closeDialog()
    },
    async remoteMethod(query) {
        if (query !== '') {
          this.loading = true;
          const res = await this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getStocks?=ABMD',
          {auth:{
            username: 'sentimentrader_backtest_api',
            password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
          }}
          ).then(res => {
            this.symbolList = res.data
          }).catch(error => {
            console.warn(error);
          })
          

          setTimeout(() => {
            this.loading = false;
            this.options = this.listSet.filter(item => {
              return item.value.toLowerCase().indexOf(query.toLowerCase()) > -1 || 
                      item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
            });
          }, 200);
        } else {
          this.options = [];
        }
        //console.log(this.options)
    },
    closeDialog(){
      this.symbolFormdata.symbolName = this.value
    },
    // checkEntry(scope){
    //   this.$emit("setSymbolData",(scope))
    //   this.closeDialog()
    //   this.entryChecked = !this.entryChecked
    // },
    handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.getsymbollist("system")
    }
  }
}
</script>
<style scoped>
</style>
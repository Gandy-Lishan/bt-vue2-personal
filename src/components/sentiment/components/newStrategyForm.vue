<template>
  <el-row :gutter="20">
    <el-col :span="24">
      <div class="mian">
        <div class="signalLeft">
          <el-col :span="8">
            <div class="firstStrategyContainer">
              <div class="strategyContainer">
                <el-form 
                ref="strategyForm"
                :model="strategyData"
                label-position="left"
                >
                  <p>Name/Description:</p>
                  <el-form-item label="Name:" prop="name">
                    <el-input v-model="strategyData.name"  size="mini"></el-input>
                  </el-form-item>
                  <el-form-item label="Description:" prop="description">
                    <el-input
                      v-model="strategyData.description"
                      size="mini"
                      type="textarea"
                      :autosize="{ minRows: 8, maxRows: 8 }"
                      resize="none"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
            <!-- entryForm -->
          <el-col :span="8">
            <div class="strategyContainer">
              <el-form
              ref="entryForm"
              :model="strategyEntryData"
              label-position="left"
              >
                <p>Entry Signal:</p>
                <el-form-item label="Name:" prop="name">
                  <el-input v-model="strategyEntryData.name"  size="mini" disabled></el-input>
                </el-form-item>
                <el-form-item label="Description:" prop="description">
                  <el-input
                    disabled
                    v-model="strategyEntryData.description"
                    size="mini"
                    type="textarea"
                    :autosize="{ minRows: 8, maxRows: 8 }"
                    resize="none"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Type:">
                  <el-input
                    v-model="strategyEntryData.type"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="Frequency:">
                  <el-input
                    v-model="strategyEntryData.frequency"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
        </el-col>

        <!-- exit-form -->
          <el-col :span="8">
            <div class="strategyContainer">
              <el-form
              ref="exitForm"
              :model="strategyExitData"
              label-position="left"
              >
                <p>Exit Signal:</p>
                <el-form-item label="Name:" prop="name">
                  <el-input v-model="strategyExitData.name"  size="mini" disabled></el-input>
                </el-form-item>
                <el-form-item label="Description:" prop="description">
                  <el-input
                    disabled
                    v-model="strategyExitData.description"
                    size="mini"
                    type="textarea"
                    :autosize="{ minRows: 8, maxRows: 8 }"
                    resize="none"
                  ></el-input>
                </el-form-item>
                <el-form-item label="Type:">
                  <el-input
                    v-model="strategyExitData.type"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
                <el-form-item label="Frequency:">
                  <el-input
                    v-model="strategyExitData.frequency"
                    size="mini"
                    disabled
                  ></el-input>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
        </el-col>
        <div class="saveStrategyBtn">
          <el-button type="primary" @click="saveStrategy()">Save Strategy</el-button>
        </div>
        </div>
      </div>
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: {
    strategyEntryData: Object,
    strategyExitData: Object
  },
  data() {
    return {
      strategyData: {
        name: '',
        description: ''
      },
    }
  },
  methods: {
    saveStrategy() {
      const submitStrategyData = {}
      submitStrategyData.name = this.strategyData.name
      submitStrategyData.description = this.strategyData.description
      submitStrategyData.signal_entry = this.strategyEntryData
      submitStrategyData.signal_exit = this.strategyExitData
      submitStrategyData.signal_entry.entryAction = this.strategyEntryData.type
      submitStrategyData.signal_exit.exitAction = this.strategyExitData.type
      var params =
          {name: submitStrategyData.name,
          description: submitStrategyData.description,
          signal_entry: JSON.stringify(submitStrategyData.signal_entry),
          signal_exit: JSON.stringify(submitStrategyData.signal_exit),
          user: ''
          }
      if((this.strategyData.name === '' || this.strategyData.description === '') || (this.strategyData.name === undefined || this.strategyData.description === undefined)){
            this.$message.error({
            message: 'Please enter name or description',
            duration: 1000
          })
          return
      }
      if(this.strategyEntryData.id === undefined){
          this.$message.error({
            message: 'Please select entry signal',
            duration: 1000
          })
           return
      }
      if(this.strategyExitData.id === undefined){
          this.$message.error({
            message: 'Please select exit signal',
            duration: 1000
          })
           return
      }
    const vm = this
    this.$http.post('/demo/strategies/',vm.$qs.stringify(params),{auth:{
        username: 'sentimentrader_backtest_api',
        password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
      }}).then(res => {if(res.status === 201){this.$message.success({
            message: 'The save was successful',
            duration: 1000
          })
          this.$emit("updateStrategylist")
          // eventBus.eventVue.$emit('UpdateMyStrategyList',"aaa")
          }else{this.$message.error({
            message: 'The save failed',
            duration: 1000
          })}}).catch(error => {
      console.warn(error);
      })
    }
  }
}
</script>
<style lang="less" scoped>
.strategyContainer{
  border-radius: 10px;
  padding: 10px;
  flex-grow: 1;
  border: 2px solid #6c6c6c;
}
.firstStrategyContainer .strategyContainer{
  padding: 10px 10px 136px 10px;
}
.saveStrategyBtn .el-button{
  position: relative;
  bottom: 510px;
  left: 1226px;
}
</style>
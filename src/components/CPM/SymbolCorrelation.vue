<template>
  <div class="symbol-correlation">
    <el-form :model="data" size="small" status-icon :rules="rules" ref="Form" class="symbol-correlation-form" label-position="top">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="1. Designated Ticker" prop="benchmark">
            <el-input v-model="data.benchmark" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="2. Start Date" prop="start_date">
            <el-date-picker
              v-model="data.start_date"
              type="date"
              placeholder="- Select Start Date -"
              value-format="yyyy-MM-dd"
              :picker-options="startPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="end_date" label="3. End Date">
              <el-date-picker
                v-model="data.end_date"
                type="date"
                placeholder="- Select End Date -"
                value-format="yyyy-MM-dd"
                :picker-options="endPickerOptions"
              >
              </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="warning" @click="resetForm('Form')" size="small">Clear Form</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="16">
          <el-form-item label="4. Comparison Ticker" prop="comparison_ticker">
            <div class="ticker-select">
              <el-autocomplete
            ref="autocomplete"
						class="inline-input"
						v-model="symbol"
						:fetch-suggestions="querySearch"
						placeholder="Select Ticker"
						@select="
							(item) => {
								getSymbol(item)
							}
						"
					>
						<i slot="prefix" class="el-input__icon el-icon-search"></i>
            <!-- 使用 scoped slot 自定义选项 -->
						<template slot-scope="{ item }">
							<div class="custom-option">
								<span class="symbol-label">{{
									item.url
								}}</span>
								<span class="symbol-url">{{
									item.label
								}}</span>
							</div>
						</template>
					</el-autocomplete>
          <div class="tickerTag">
            <el-tag
            :key="tag"
            size="small"
            v-for="(tag) in stock_comparison"
            :disable-transitions="false"
            closable
            @close="handleClose(tag)"
            effect="dark">
            {{tag}}
          </el-tag>
          </div>
            </div>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="submitForm('Form')" size="small">View Correlation</el-button>
        </el-col>
      </el-row>
      <el-form-item>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {createStateFilter} from '@/utils/globalFunc'
import { timestampToTime } from '@/utils'
import { saveSymbolCorrelation } from "@/service/service";

export default {
  name: 'SymbolCorrelation',
  data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please input the age'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('Please input digits'));
          } else {
            if (value < 18) {
              callback(new Error('Age must be greater than 18'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } else {
          if (this.data.checkPass !== '') {
            this.$refs.Form.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.data.pass) {
          callback(new Error('Two inputs don\'t match!'));
        } else {
          callback();
        }
      };
      return {
        data: {
          start_date: '',
          end_date: '',
          benchmark: '',
        },
        // 自定义动态渲染下拉栏
        searchResults: [],
        currentPage: 1,
        pageSize: 20,
        hasMore: true, // 是否还有更多数据
        stock_comparison: [],
        symbol: '',
        startPickerOptions: {
          disabledDate: this.handleDisabledStartDate
        },
        endPickerOptions: {
          disabledDate: this.handleDisabledEndDate
        },
        rules: {
        }
      };
    },
    computed: {
      symbolList() {
        const data = localStorage.getItem('refactoredConcatList');
        return data ? JSON.parse(data) : [];
      }
    },
    mounted() {
      this.attachScrollListener()
      this.setDate(1)
    },
    methods: {
      setDate(val) {
        this.data.end_date = timestampToTime(new Date());
        const endDate = new Date(this.data.end_date);
        const startDate = new Date(endDate);
        startDate.setMonth(startDate.getMonth() - val)
        this.data.start_date = timestampToTime(startDate);
      },
      handleDisabledStartDate(time) {
        const today = timestampToTime(new Date())
        const endDay = timestampToTime(new Date(this.data.end_date))
        // 如果endDate取消选择，则startDate可以选择全部
        if(this.data.end_date){
          return timestampToTime(time) >= endDay
        }else{
          return (timestampToTime(time) > today)
        }
      },
      handleDisabledEndDate(time) {
        const today = timestampToTime(new Date())
        const startDay = timestampToTime(new Date(this.data.start_date))
        return (timestampToTime(time) > today) || (timestampToTime(time) <= startDay)
      },
    attachScrollListener() {
      const refs = ['autocomplete']; // 要监听的下拉框的 ref 名称

      refs.forEach(refName => {
        const inputDropdown = this.$refs[refName]?.$refs.suggestions?.$el?.childNodes[0]?.childNodes[0]; // 获取下拉框的 DOM
        if (inputDropdown) {
          inputDropdown.addEventListener("scroll", (event) => this.handleDropdownScroll(event, refName));
        }
      });
    },
    async validForm(formName) {
      const validateForm = async (formRef) => {
        return new Promise(resolve => {
          this.$refs[formRef].validate(valid => {
            resolve(valid);
          });
        });
      };
      return await validateForm(formName)
    },
    async saveFormData() {
      if(this.stock_comparison.length === 0) {this.popUpMsgBox('Please select at least one ticker');return}
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Kindly ensure that the form fields are filled correctly')
        return
      }                                     
      const saveData = {
        ...this.data,
        stock_comparison: JSON.stringify(this.stock_comparison)
      }
      return await saveSymbolCorrelation(saveData)
    },
    async submitForm() {
      debugger
      this.btnLoading = true
      let saveRes = null
      try {
        saveRes = await this.saveFormData()
        console.log('saveRes', saveRes)
      } catch (error) {
        this.btnLoading = false
      }
      
     if(!saveRes) { this.btnLoading = false; return}
     const code = saveRes.data.code
     const name = saveRes.data?.data?.name
     const _name = typeof name === 'string' && name ? name : ''
     if(code == 203 && this.processTips) this.popUpMsgBox(`The "${_name}" backtest is running. You can wait or click the "+" button to create a new backtest`)
     if(code == 401) this.popUpMsgBox('Calculate error')
     if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('Save failed, Please try again')}
     if(code == 406) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407) this.popUpMsgBox('Empty backtest list. Please adjust "Filter Criteria" and run again')
      if(code == 200) {
        this.popUpMsgBox(`The "${_name}" is completed successfully`)
      }
      // 只要是错误状态码都要清空 filterList 和 result 数据
      if([400, 401, 404, 403, 406, 407].includes(code)) this.btnLoading = false
    },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      getSymbol(ticker) {
        console.log('ticker', ticker)
        // 往标签数组里面推送
        this.stock_comparison.push(ticker.url);
      },
      querySearch(queryString, cb) {
      var dropdownList = this.dropdownList
      if(!dropdownList || dropdownList.length == 0) {
        dropdownList = this.symbolList
      }
      var results = dropdownList.map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item),
        }))
        .filter(item => item.priority > 0)

      this.searchResults = results.sort((a, b) => b.priority - a.priority)
      this.currentPage = 1;
      this.hasMore = true;
      this.loadMore(cb)
    },
    loadMore(cb) {
      // 根据页码从过滤后的结果中分页
      console.log('paginated results',this.currentPage, this.searchResults.length)
      const paginatedResults = this.searchResults.slice(0, this.currentPage * this.pageSize);
      if(this.currentPage * this.pageSize > this.searchResults.length) this.hasMore = false
      // 将分页后的数据传递给 closure
      cb(paginatedResults);
    },
    handleClose(tag) {
      this.stock_comparison.splice(this.stock_comparison.indexOf(tag), 1)
    },
    }
}
</script>

<style lang="less" scoped>
.symbol-correlation-form {
  /deep/ .el-form-item__label {
    font-weight: 600;
    color: #333;
    width: 100%;
  }
  /deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }
  /deep/ .el-input__inner {
    margin: 0px;
  }
  /deep/ .el-button--warning {
    width: 100%;
    margin-top: 40px;
  }
  /deep/ .el-button--primary {
    width: 100%;
    margin-top: 40px;
  }
  /deep/ .el-form-item__label {
    font-weight: 600;
    color: #333;
  }
  /deep/ .el-button--primary, /deep/ .el-input__inner, /deep/ .el-input-group__append {
    font-weight: 600;
  }
  .el-date-editor.el-input.el-input--mini.el-input--prefix.el-input--suffix.el-date-editor--year {
    width: 100%;
  }
  .el-autocomplete {
    width: 100%;
  }
}
.ticker-select {
  display: flex;
  justify-content: center;
  align-items: center;
}
.custom-option {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between;
}
.symbol-url{
  font-size: 12px;
  margin-right: 10px;
  text-align: center;
  color: #999999;
}
.symbol-label {
  font-weight: 500;
}
.tickerTag{
width: 100%;
height: 30px;
display: flex;
align-items: center;
border-radius: 4px;
border-top: unset;
border: 1px solid #DCDFE6;
background-color: #fff;
.el-tag--small{
  text-align: center;
  width: 100px;
  height: 25px;
  line-height: 25px;
  margin-right: 10px;
  background: #5b9bd1;
  border: 1px solid #5b9bd1;
  font-weight: bold;
}
}
</style>
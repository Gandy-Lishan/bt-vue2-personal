<template>
  <div class="portfolio-form">
      <el-form
      ref="Form"
      :model="data"
      label-position="top"
      size="small"
      @submit.native.prevent
      :rules="rules">
      <el-row :gutter="20">
        <el-col :span="12" :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
          <el-form-item label="1. Name" prop="name" label-width="70px" label-position="top">
            <el-input v-model="data.name" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      </el-form>
    <div class="label-section">
      <p class="label-title" @click.stop="dialogTickerFormVisible = !dialogTickerFormVisible">2. Manage Ticker</p>
      <div v-show="dialogTickerFormVisible">
        <br>
        <el-form size="small" status-icon ref="TickerForm" label-position="top">
          <el-form-item>
            <el-select
              v-model="tickers"
              multiple
              filterable
              @change="onSelectChange"
              :filter-method="handleFilterInput"
              placeholder="- Select Ticker -">
              <el-option
                v-for="item in filteredList"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              >
                <div class="custom-option">
                  <span class="symbol-label">{{ item.url }}</span>
                  <span class="symbol-url">{{ item.name }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      </div>
    </div>
    <br>
    <div class="label-section">
      <p class="label-title" @click.stop="dialogManageColumnsVisible = !dialogManageColumnsVisible">3. Manage Columns</p>
      <div v-show="dialogManageColumnsVisible">
        <br>
        <div class="manage-columns-table">
        <table class="table table-striped">
        <thead class="thead-dark">
          <tr>
            <th scope="col" width="20px"></th>
            <th scope="col" width="30px">Index</th>
            <th scope="col">Indicator</th>
            <th scope="col" width="15px"></th>
          </tr>
        </thead>
        <draggable 
          v-model="manageColumns"
          tag="tbody"
          ghost-class="drag-ghost"
          chosen-class="drag-chosen"
          :move="onMove"
        >
          <tr v-for="(item, index) in manageColumns" :key="index">
            <td style="cursor: pointer;">
              <svg t="1748417870958" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2176" width="10" height="10"><path d="M64.1 194v89.6h896.1V194H64.1z m0 358.4h896.1v-89.6H64.1v89.6z m0 268.9h896.1v-89.6H64.1v89.6z" fill="#2c2c2c" p-id="2177"></path></svg>
            </td>
            <td scope="row">{{ index + 1 }}</td>
            <td class="manage-td">
              <el-select v-model="item.indicator" placeholder="- Select -" size="small">
                <el-option
                  v-for="item in indicatorOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
              <div class="weight-error-message">
                {{ item.indicatorErrMsg }}
              </div>
            </td>
            <td>
              <template>
                <el-button v-if="index === 0" @click="addRow(index)" icon="el-icon-plus" size="mini" type="primary" ></el-button>
                <el-button v-else size="mini" type="primary" icon="el-icon-delete" @click.stop="deleteRow(index)" class="delete-btn" ></el-button> 
              </template>
            </td>
          </tr>
          <td>
          </td>
        </draggable>
        </table>
        </div>
      </div>
    </div>
    <div class="btns">
      <br>
      <br>
      <el-row :gutter="20" type="flex" justify="center">
        <el-col :span="4" :xs="24" :sm="4" :md="4" :lg="4" :xl="4">
          <el-button type="warning" size="small" @click="previewList" :loading="previewLoading">View List</el-button>
        </el-col>
        <!-- <el-col :span="4">
          <el-button type="danger" size="small">Optix HeatMap</el-button>
        </el-col> -->
        <el-col :span="4" :xs="24" :sm="4" :md="4" :lg="4" :xl="4">
          <el-button type="primary" size="small"  @click="submitForm" :loading="btnLoading">Save Watch List</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
    <br>
    <br>
    <br>
    </div>
  </div>
</template>

<script>
import { isJson, timestampToTime } from '@/utils'
import {createStateFilter} from '@/utils/globalFunc'
import { _validatePercentageRule, createPositiveIntegerValidate } from '@/utils/formValidate'
import { postWatchList, getAllWatchlist, updateWatchList, previewWatchlist } from '@/service/service'
const debounce = require('lodash/debounce')
const cloneDeep = require('lodash/cloneDeep')
import draggable from "./vuedraggable";
import { on } from 'events'

export default {
  name: 'Form',
  props: ['parentContext'],
  components: {
   draggable,
  },
  data() {
    return {
      /* WatchList Start */
      dialogTickerFormVisible: true,
      dialogManageColumnsVisible: true,
      // 自定义动态渲染下拉栏
      searchResults: [],
      currentPage: 1,
      pageSize: 20,
      hasMore: true, // 是否还有更多数据
      tickers: [], // 旧的数据
      manageColumns: [
        {indicator: 'Trend Score', bar: 1, indicatorErrMsg: ''},
        {indicator: 'RelTrend Score', bar: 1, indicatorErrMsg: ''},
        {indicator: 'Optix', bar: 1, indicatorErrMsg: ''},
        {indicator: 'ROC', bar: 1, indicatorErrMsg: ''},
      ],
      _dropdownList: [],
      indicatorOptions: [
        {value: 'Trend Score', label: 'Trend Score', inputValue: 1},
        {value: 'RelTrend Score', label: 'RelTrend Score', inputValue: 1},
        {value: 'Optix', label: 'Optix', inputValue: 1},
        {value: 'ROC', label: 'Rate of Change', inputValue: 1},
        {value: 'Optix MA5', label: 'Symbol Optix 5-Day Moving Average', inputValue: 5},
        {value: 'Optix MA10', label: 'Symbol Optix 10-Day Moving Average', inputValue: 10},
        {value: 'Optix MA20', label: 'Symbol Optix 21-Day Moving Average', inputValue: 21},
        {value: 'Optix MA63', label: 'Symbol Optix 63-Day Moving Average', inputValue: 63},
        {value: 'Close MA5', label: 'Symbol Close 5-Day Moving Average', inputValue: 5},
        {value: 'Close MA10', label: 'Symbol Close 10-Day Moving Average', inputValue: 10},
        {value: 'Close MA21', label: 'Symbol Close 21-Day Moving Average', inputValue: 21},
        {value: 'Close MA63', label: 'Symbol Close 63-Day Moving Average', inputValue: 63},
        {value: 'Close MA126', label: 'Symbol Close 126-Day Moving Average', inputValue: 126},
        {value: 'Close MA252', label: 'Symbol Close 252-Day Moving Average', inputValue: 252},
        {value: 'ROC5', label: '5-Day Rate of Change', inputValue: 5},
        {value: 'ROC10', label: '10-Day Rate of Change', inputValue: 10},
        {value: 'ROC21', label: '21-Day Rate of Change', inputValue: 21},
        {value: 'ROC63', label: '63-Day Rate of Change', inputValue: 63},
        {value: 'ROC126', label: '126-Day Rate of Change', inputValue: 126},
        {value: 'ROC252', label: '252-Day Rate of Change', inputValue: 252}
      ],
      btnLoading: false,
      previewLoading: false,
      rules: {
        name: [
          { required: true, message: 'Enter a name', trigger: 'blur' },
          { required: true, message: 'Enter a name', trigger: 'change' }
        ]
      },
      data: {
        name: 'My Watch List'
      },
      rowUrl: null,
      processTips: '',
      percentage: 0,
      filteredList: []      // 根据输入实时更新的排序列表
      /* WatchList End */
    }
  },
  computed: {
    symbolList() {
      const data = localStorage.getItem('refactoredConcatList');
      let _data = data ? JSON.parse(data) : []
      console.log('symbolList', _data)
      _data = _data.map(ele => {
        ele.name = ele.label
        ele.label = ele.url
        ele.value = ele.url
        ele.key = `${ele.name}_${ele.url}`
        return ele
      })
      console.log('symbolList', _data)
      return _data
    },
  },
  mounted() {
    this._dropdownList = this.symbolList
    this.filteredList = this._dropdownList
    this.attachScrollListener()
    this.generateName()
  },
  methods: {
    generateName() {
      const date = new Date()
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      this.data.name = `My Watch List ${year}-${month}-${day} ${hour}:${minute}:${second}`
    },
    resetForm() {
      if((!this.previewLoading && this.btnLoading)) return true
      this.$refs['Form'].clearValidate()
      if(!this.dialogTickerFormVisible) this.dialogTickerFormVisible = true
      if(!this.dialogManageColumnsVisible) this.dialogManageColumnsVisible = true
      this.manageColumns = [
        {indicator: 'Trend Score', bar: 1, indicatorErrMsg: ''},
        {indicator: 'RelTrend Score', bar: 1, indicatorErrMsg: ''},
        {indicator: 'Optix', bar: 1, indicatorErrMsg: ''},
        {indicator: 'ROC', bar: 1, indicatorErrMsg: ''}
      ]
      this.rowUrl = null
      this.tickers = []
      this.generateName()
    },
    async checkDuplicateNames(name) {
        const nameLookupRes = await getAllWatchlist(null, null, name)
        const count = nameLookupRes.data.count
        const nameList = nameLookupRes.data.results
        // 有重名
        if(count != 0) {
          const duplicateItem = nameList.filter(item => item.name == name)
          if(duplicateItem.length) return true
        }
        // 不重名
        return false

    },
    async validForm(formName, unValidateForm) {
      const validateForm = async (formRef) => {
        return new Promise(resolve => {
          this.$refs[formRef].validate(valid => {
            resolve(valid);
          });
        });
      };
      let formValid =  await validateForm(formName)
      if(unValidateForm) formValid = true
      // 校验 Ticker Form 和 Columns
      if(this.tickers.length === 0) {
        if(!this.dialogTickerFormVisible) this.dialogTickerFormVisible = true
        this.popUpMsgBox('Please select at least one ticker');
        return
      }
      const manageColumns = this.manageColumns.map(ele => {
        const isItInTheList = this.indicatorOptions.find(option => option.value === ele.indicator)
        if(!ele.indicator || !isItInTheList) ele.indicatorErrMsg = 'Please select indicator from the dropdown menu'
        else ele.indicatorErrMsg = ''
        return ele
      })
      this.manageColumns = manageColumns

      const isValid = !manageColumns.some(
        (item) => item.indicatorErrMsg
      )
      return formValid && isValid
    },
    async saveFormData() {
      debugger
      const validForm = await this.validForm('Form')
      if(!validForm) {
        this.popUpMsgBox('Please review and correct form errors')
        return
      }
      this.processTips = `Tips: Saving basket...`
      const rowUrl = this.rowUrl
      const name = this.data.name
      if(!rowUrl) {
        const nameChecked = await this.checkDuplicateNames(name)
        if(nameChecked){this.popUpMsgBox(`The Name already exists`); return}
      }
      const manageColumns = this.manageColumns.map(ele => ({indicator: ele.indicator, bar: this.indicatorOptions.find(option => option.value === ele.indicator)?.inputValue || 1}))
      const findDuplicateFlexible = (arr) => {
        const seen = {
          indicator: new Set()
        };
        for (const item of arr) {
          if (item.indicator && seen.indicator.has(item.indicator)) {
            return item
          }
          if (item.indicator) seen.indicator.add(item.indicator)
        }

        return false;
      };
      const findDuplicate = findDuplicateFlexible(manageColumns)
      if(findDuplicate) {
        const duplicateItem = this.indicatorOptions.find(option => option.value === findDuplicate.indicator)
        this.popUpMsgBox(`Duplicate Indicator: ${duplicateItem.label || ''}`)
        return
      }
      this.percentage = 8
      let saveData = {
        ...this.data,
        tickers: JSON.stringify(this.tickers),
        columns: JSON.stringify(manageColumns)
      }
      const formData = {
        tickers: this.tickers,
        columns: manageColumns
      }
      let saveRes
      if(rowUrl) {saveRes = await updateWatchList(rowUrl,saveData)}
      else{saveRes = await postWatchList(saveData)}
      this.processTips = 'Tips: Saving Watch List, Please wait patiently...'
      saveRes.data.data = isJson(saveRes.data.data)?JSON.parse(saveRes.data.data):saveRes.data.data
      let url = saveRes.data?.url
      this.rowUrl = url
      saveRes.formData = formData
      return saveRes
    },
    async submitForm() {
      debugger
     this.btnLoading = true
     this.percentage = 5
      let saveRes = null
      try {
        saveRes = await this.saveFormData()
      } catch (error) {
        this.$emit('clearResults') // 清空 preview, heatmap
        this.btnLoading = false
        this.processTips = ''
        this.percentage = 0
      } finally {
        // 运行成或者失败后刷新列表
        this.$emit('refreshList')
      }
     if(!saveRes) { this.$emit('clearResults');
      this.btnLoading = false; this.processTips = ''; this.percentage = 0; return}
     const code = saveRes.data.code
     if(code == 203) this.popUpMsgBox(`Saving the watch list… You can wait or click the ‘+’ button to create a new one.`)
     if(code == 401) this.popUpMsgBox('Calculate error')
     if(code == 404 || code == 403) {this.rowUrl = null; this.popUpMsgBox('Save failed, Please try again')}
     if(code == 406) {
        const name =  saveRes.data.data.name
        this.popUpMsgBox(`Sorry, ${name} is taken. Please pick another`)
      }
      if(code == 407) this.popUpMsgBox('Empty watch list. Please try again')
      if(code == 211 || code === 213) {
        this.popUpMsgBox(`The Watch List is completed successfully`)
        this.$emit('displayResultsAndFilter', {data: saveRes.data.data, formData: saveRes.formData})
      }
      // 只要是错误状态码都要清空 filterList 和 result 数据
      if([400, 401, 404, 403, 406, 407, 443, 444, 445, 446, 500, 204].includes(code)) {this.popUpMsgBox('No Results Found'); this.$emit('clearResults')}
      this.btnLoading = false
      this.processTips = ''
      this.percentage = 0
    },
    async previewList() {
      debugger
      const validForm = await this.validForm('Form', true)
      if(!validForm) {
        this.popUpMsgBox('Please review and correct form errors')
        return
      }
      this.previewLoading = true
      let res = null
      try {
        const saveData = {
          tickers: JSON.stringify(this.tickers),
        }
      const manageColumns = this.manageColumns.map(ele => ({indicator: ele.indicator, bar: this.indicatorOptions.find(option => option.value === ele.indicator)?.inputValue || 1}))
      const findDuplicateFlexible = (arr) => {
        const seen = {
          indicator: new Set()
        };
        for (const item of arr) {
          if (item.indicator && seen.indicator.has(item.indicator)) {
            return item
          }
          if (item.indicator) seen.indicator.add(item.indicator)
        }

        return false;
      };
      const findDuplicate = findDuplicateFlexible(manageColumns)
      if(findDuplicate) {
        const duplicateItem = this.indicatorOptions.find(option => option.value === findDuplicate.indicator)
        this.popUpMsgBox(`Duplicate Indicator: ${duplicateItem.label || ''}`)
        return
      }
        const formData = {
          tickers: this.tickers,
          columns: manageColumns
        }
        res = await previewWatchlist(saveData)
        res.formData = formData
      } catch (error) {
        this.popUpMsgBox('Failed to view list')
        console.error(error)
      } finally {
        this.previewLoading = false
      }
     const code = res.data.code
     if(code === 215) {
      this.popUpMsgBox(`The Watch List is completed successfully`)
      this.$emit('displayResultsAndFilter', {data: res.data.data, formData: res.formData})
     }
    },
    async displayData(data) {
      debugger
      const row = isJson(data) ? JSON.parse(data) : data
      if(!row) return
      const {url, name, tickers, columns} = row
      this.rowUrl = url
      this.tickers = cloneDeep(tickers)
      this.manageColumns = columns.map(ele => ({...ele, indicatorErrMsg: ''}))
      if(!this.dialogTickerFormVisible) this.dialogTickerFormVisible = true
      if(!this.dialogManageColumnsVisible) this.dialogManageColumnsVisible = true
      this.data = {name}
    },
    checkResLater() {
      //清空 rowUrl
      this.rowUrl = null
      this.btnLoading = false
      this.processTips = ''
      this.percentage = 0
    },
    addRow() {
      if(this.manageColumns.length >= 10) {this.popUpMsgBox(`Up to 10 rows can be added`); return}
      this.manageColumns.push({indicator: '', bar: '', indicatorErrMsg: ''})
    },
    deleteRow(index) {
      this.$emit('deleteManageColumns', {...this.manageColumns[index], index})
      this.manageColumns.splice(index, 1)
    },
    deleteFormTicker(row) {
      debugger
      const findIndex = this.tickers.findIndex(ele => (ele === row.Ticker))
      if(findIndex !== -1) {
        this.tickers.splice(findIndex, 1)
      }
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
    handleDropdownScroll(event, inputType) {
      var self = this;
      const dropdown = event.target;
      // 根据传入的 inputType 访问不同的 ref
      const inputRef = self.$refs[inputType];

      if (
        dropdown.scrollHeight - dropdown.scrollTop - 10 <
        dropdown.clientHeight
      ) {
        // 判断是否有更多数据
        if (!this.hasMore) return;

        // 记录滚动位置
        const currentScrollTop = dropdown.scrollTop;

        self.currentPage++;
        self.loadMore((results) => {
            inputRef.$data.suggestions = results;

            // 恢复滚动位置
            requestAnimationFrame(() => {
                dropdown.scrollTop = currentScrollTop;
            });
        });
      }
    },

    tickerQuerySearch(queryString, cb) {
      debugger
      var dropdownList = this._dropdownList
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
    onMove(evt) {
      // 禁止第一行被拖动
      return evt.draggedContext.index !== 0;
    },
    onSelectChange(val) {
      console.log('val', val)
      if (val.length > 10) {
        this.popUpMsgBox('You can only select up to 10 tickers');
        val.splice(10); // 截断多余的值
      }
      this.$emit('retainFormTicker', val)
    },
    deleteRowURL(url) {
      debugger
      if(this.rowUrl === url) this.rowUrl = null
    },
    handleFilterInput(queryString) {
      const standardizeString = (str) => {
        return String(str).toLowerCase().replace(/[_\s-]+/g, ' ');
      };
      
      const escapeRegExp = (string) => {
        return string.replace(/[.*+?^=${}()|[\]\\]/g, '\\$&');
      };
      
      const fuzzyMatch = (text, query) => {
        const escapedQuery = escapeRegExp(query);
        let regexString = '';
        for (let i = 0; i < escapedQuery.length; i++) {
          const char = escapedQuery[i];
          regexString += char;
          if (i < escapedQuery.length - 1 && /[a-zA-Z0-9]/.test(char)) {
            regexString += '.*?';
          }
        }
        const regex = new RegExp(regexString, 'g');
        return [...text.matchAll(regex)];
      };

      const standardizedQuery = standardizeString(queryString);
      
      const scoredList = this.symbolList.map((item) => {
        const resultValue = item.value || item.name || item.label || item.model_name || '';
        const resultUrl = item.url || item.symbol || '';
        const standardizedValue = standardizeString(resultValue);
        const standardizedUrl = standardizeString(resultUrl);
        
        let score = 0;
        if (!standardizedQuery) score = 9999; // query 为空默认置顶
        else if (standardizedValue === standardizedQuery || standardizedUrl === standardizedQuery) {
          score = 100;
        } else if (standardizedValue.startsWith(standardizedQuery) || standardizedUrl.startsWith(standardizedQuery)) {
          score = 50;
        } else {
          const valMatches = fuzzyMatch(standardizedValue, standardizedQuery).length;
          const urlMatches = fuzzyMatch(standardizedUrl, standardizedQuery).length;
          score = (valMatches + urlMatches) * 5;
        }
        
        return { ...item, _score: score };
      });

    this.filteredList = scoredList
      .filter(i => i._score > 0)
      .sort((a, b) => b._score - a._score);
  }
  },
}
</script>

<style lang="less" scoped>
.portfolio-form {
  padding: 20px 20px 0 20px;
  .error-message {
  position: absolute;
  line-height: 1;
  font-size: 10px;
  color: #F56C6C;
  white-space: nowrap;
  top: 17px
  }
  .weight-error-message {
    position: absolute;
    top: 34px;
    line-height: 1;
    font-size: 10px;
    color: #F56C6C;
    font-weight: 500;
    white-space: nowrap;
    z-index: 10;
  }
  .delete-btn {
    background-color: #f59e0b;
    border: unset;
  }
  .delete-btn:hover {
    background-color: rgb(251, 192, 92);
  }
  /deep/ .el-input .el-input__inner {
    color: #000000;
    background-color: #fbfbfb;
    font-weight: 600
  }
  /deep/ .el-autocomplete {
    width: 100%;
    .el-input--mini .el-input__inner {
      margin-left: 0px;
      font-weight: 600;
      color: #000000;
    }
  }
    /deep/ .el-input-group--append .el-input__inner, .el-input-group__prepend {
      margin-left: 0px;
    }
  /deep/ .el-input.el-input--small {
    width: 100%;
    .el-input__inner {margin-left: 0px;}
  }
  /deep/ .el-input.el-input--mini {
    width: 100%;
    .el-input__inner {margin-left: 0px;}
  }
  /deep/ .el-checkbox__label {
    font-size: 14px;
  }
  /deep/ .el-input-group__append,
  /deep/ .el-input-group__prepend {
    padding: 0 5px;
  }
  /deep/ .el-form-item__label {
    font-weight: 600;
    color: #000000;
    width: 150px;
  }
  /deep/ .el-checkbox__label {
    font-weight: 600;
  }
  /deep/ .el-button--primary {
    font-weight: 600;
  }
  .conditionBox {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .grid-row {
    display: grid;
    grid-template-columns: 2fr 1fr 2fr;
  }
  .main-row {
    padding: 10px 10px 0px 10px;
  }
  .bottom-row {
    padding: 10px 10px 0px 10px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }
  .portfolioTable {
    border-top: 2px solid #dddddd;
  }
  .el-button--primary, .el-button--warning {
    width: 100%;
  }
  .dialog-footer .el-button--primary {
    width: auto;
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }
  .el-form-item.portfolio-check /deep/ .el-form-item__content{
    margin-left: 0px !important;
  }
  ._conditionBox {
    .el-form-item--small.el-form-item, .el-form-item--small.el-form-item {
      margin-bottom: 0px;
      width: 100%;
    }
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .processTips {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 32px;
    margin: 42px 0px 0px 0px;
    font-weight: 600;
    color: #000000;
  }
  .processTipsBox {
    height: 100%;
  /deep/ .el-progress-bar__innerText {
    margin: 0px 5px 1px 5px;
    // color: #ffffff !important;
  }
  /deep/ .el-progress-bar__outer {
    
    height: 100% !important;
    border-radius: 4px;
  }
  /deep/ .el-progress-bar__inner {
    border-radius: 4px;
  }
  /deep/ .el-progress--text-inside .el-progress-bar {
    height: 100%;
  }
  /deep/ .el-progress {
    height: 100%;
  }
  /deep/ .portfolio-form .el-input--suffix .el-input__inner {
    margin-left: 0px;
  }
}

  
.portfolioCheckedBox {
  border-radius: 4px;
  line-height: 28px;
  border-radius: 4px;
  }
  .portfolioCheckedBox a {
    font-weight: 600;
    display: flex;
    align-items: center;
    font-size: 18px;
    padding: 5px 5px 5px 0px
  }
  .portfolioCheckedBox a:hover {
    color: #5b9bd1;
  }
  .des-content {
    margin-top: 10px;
  }
  /deep/ .el-dialog__body {
    padding: 0px 20px;
  }
  /* 自定义样式 */
  .custom-option {
    display: flex;
    align-items: center; /* 垂直居中对齐 */
      .type-label {
        font-size: 11px;
        color: #999999;
        font-weight: 500;
        margin-right: 10px;
        text-align: center;
        margin-left: 5px;
      }
      .item-label {
        font-size: 11px;
        font-weight: 500;
      }
  }
  .processTips {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 32px;
    margin: 42px 0px 0px 0px;
    font-weight: 600;
    color: #000000;
  }
  .processTipsBox {
    height: 32px;
  /deep/ .el-progress-bar__innerText {
    margin: 0px 5px 1px 5px;
    // color: #ffffff !important;
  }
  /deep/ .el-progress-bar__outer {
    height: 32px !important;
    border-radius: 4px;
  }
  /deep/ .el-progress-bar__inner {
    border-radius: 4px;
  }
  /deep/ .el-progress--text-inside .el-progress-bar {
    height: 100%;
  }
  /deep/ .el-progress {
    height: 100%;
  }
}
.processTips {
    height: 100%;
    width: 100%;
    font-size: 14px;
    line-height: 32px;
    margin: 0px;
    font-weight: 600;
    color: #000000;
  }
  .portfolioSelectLabel{
    font-weight: 600;
    color: #000000;
    font-size: 14px;
  }
  .portfolioSelect {
    width: 100%;
    display: flex;
    align-items: center;
    /deep/ .el-input__inner {
       margin-left: 5px;
    }
    /deep/ .el-select {
      width: 100%;
    }
  }
}
.tickerTag{
  width: 100%;
  min-height: 30px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  border-radius: 4px;
  border-top: unset;
  border: 1px solid #DCDFE6;
  background-color: #fff;
  margin-bottom: 18px;
.el-tag--small{
  text-align: center;
  width: 100px;
  height: 25px;
  line-height: 25px;
  margin: 5px;
  background: #5b9bd1;
  border: 1px solid #5b9bd1;
  font-weight: bold;
}
}
/deep/ .el-select {
  width: 100%;
}

.custom-option {
  display: flex;
  align-items: center; /* 垂直居中对齐 */
  justify-content: space-between;
  .symbol-label {
    font-weight: 500;
    margin-right: 10px;
    text-align: center;
    margin-left: 5px;
  }
  .symbol-url {
    font-weight: 500;
    color: #999999;
  }
}
table {
 width: 100%;
 border-collapse: collapse;
}
th, td {
 padding: 2px 2px 10px 2px;
 text-align: center;
 font-size: 12px;
 font-weight: 700;
}
td.manage-td {
  position: relative;
}
th {
 font-size: 14px;
 padding: 5px;
 color: #000000;
}
.stripe {
 background-color: #f9f9f9;
}
.manage-columns-table {
  border: 2px solid #eee;
  border-radius: 5px;
  width: 80%;
  margin: 0 auto;
  padding: 5px;
}
.drag-ghost {
 background-color: #b8daff !important;
 transition: background-color 0.2s ease;
}
.drag-chosen {
 opacity: 0.5;
 background-color: #cce5ff !important;
}
.el-autocomplete {
  width: 100%;
}
.label-section {
  border: 2px solid #dddddd;
  border-radius: 4px;
  padding: 10px;
}
.label-title {
  font-weight: bold;
  font-size: 16px;
  color: #000000;
  cursor: pointer;
  margin: 0px;
}
/deep/ .el-select__tags-text {
  color: #000000;
  font-weight: bold;
}
.el-button--small, .el-button--small.is-round {
  width: 100%;
}
/deep/ .el-tag.el-tag--info {
  width: 100px;
}
/deep/ .el-select .el-tag {
  justify-content: space-around;
}
.el-input.el-input--small.el-input-group.el-input-group--append.valueInput {
  visibility: hidden;
}
.el-input.el-input--small.el-input-group.el-input-group--append.showInput {
  visibility: visible;
}
</style>
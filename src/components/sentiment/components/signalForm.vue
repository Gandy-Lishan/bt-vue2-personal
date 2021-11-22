<template>
<el-row>
  <el-col :span="18">
      <div class="main">
      <div class="signalLeft">
        <div><p>Name/Description:</p></div>
        <div class="signalLeftForm">
          <!-- signal-dialog -->
          <signal-dialog :type="entryType"  :dialogTableVisible="entryDialogTableVisible" @openDialog="openEntryDialog" @setEntryData='setEntryData' ></signal-dialog>
          <signal-dialog :type="exitType"  :dialogTableVisible="exitDialogTableVisible" @openDialog="openExitDialog" @setEntryData='setExitData'></signal-dialog>
          <el-form 
            v-if="signalFormTagName === 'first'"
            ref="entryForm"
            :model="entryData"
            :rules="signalFormRules"
            label-position="left"
          >
          <div class="analysis-basis">
            <el-form-item label="Analysis Basis:" size="mini">
              <el-radio v-model="entryTypeRadio" label="1">sentiment</el-radio>
              <el-radio v-model="entryTypeRadio" label="2">technical</el-radio>
            </el-form-item>
          </div>
          
            <!-- <el-form-item label="Entry" size="mini">
                <el-button class="entryBtn" v-on:click="openEntryDialog" type="success" plain>{{entryFormdata.entry[0].label}}</el-button>
            </el-form-item> -->
            <el-form-item label="Name:" prop="name">
              <el-input v-model="entryData.name"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="entryData.description"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label="Type:" size="mini">
              <div class="selectBox">
                <el-select v-model="entryData.type" @change="selectTypeAction(entryData.type)" placeholder="Please select">
                  <el-option
                    v-for="item in entryFormdata.entryTypeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item> -->
            <el-form-item label="Type" size="mini">
              <div class="selectBox">
                <el-select v-model="entryType" @change="selectEntryAction(entryType)" placeholder="Please select">
                  <el-option
                    v-for="item in entryFormdata.actionEntry"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> 
              </div>
            </el-form-item>
            <el-form-item label="Frequency:" size="mini">
              <!-- <el-input
                v-model="entryData.frequency"
                size="mini"
                disabled
              ></el-input> -->
              <div class="selectBox">
                <el-select v-model="entryData.frequency" @change="selectFrequencyAction(entryData.frequency)" placeholder="Please select">
                  <el-option
                    v-for="item in entryFormdata.frequencyOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
  
        </el-form>
          


          <!-- exitForm -->
          <el-form
            v-else
            ref="exitForm"
            :model="exitData"
            :rules="signalFormRules"
            label-position="left"
          >
          <div class="analysis-basis">
            <el-form-item label="Analysis Basis:" size="mini">
              <el-radio v-model="exitTypeRadio" label="1">sentiment</el-radio>
              <el-radio v-model="exitTypeRadio" label="2">technical</el-radio>
            </el-form-item>
          </div>
            <!-- <el-form-item label="Exit" size="mini">
                <el-button class="entryBtn" v-on:click="openExitDialog" type="success" plain>{{entryFormdata.entry[0].label}}</el-button>
            </el-form-item> -->
            <el-form-item label="Name:" prop="name">
              <el-input v-model="exitData.name"  size="mini"></el-input>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
              <el-input
                v-model="exitData.description"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
              ></el-input>
            </el-form-item>
            
            <el-form-item label="Type" size="mini">
              <div class="selectBox">
                <el-select v-model="exitType" @change="selectExitAction(exitType)" placeholder="Please select">
                  <el-option
                    v-for="(item) in this.$store.state.exitOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <!-- <el-form-item label="Type:" size="mini">
              </el-input>
              <div class="selectBox">
                <el-select v-model="exitData.type" placeholder="Please select">
                  <el-option
                    v-for="item in this.$store.state.customExitType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item> -->
            <el-form-item label="Frequency:" size="mini">
              <!-- <el-input
                v-model="exitData.frequency"
                size="mini"
                disabled
              ></el-input> -->
              <div class="selectBox">
                <el-select v-model="exitData.frequency" @change="selectFrequencyAction(entryData.frequency)" placeholder="Please select">
                  <el-option
                    v-for="item in entryFormdata.frequencyOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="signalRight">
        <el-form label-position="left" label-width="80px">
            <el-form-item label="Used_Indicators:" size="mini">
              <div v-if="signalFormTagName === 'first'" class="searchBox">
                <el-input
                  v-model="indicatorsEntryValue"
                  size="mini" 
                  @input="searchAction($event)"
                  @focus="showSearchList"
                  placeholder="Please enter the indicator"
                >
                <i slot="prefix" class="el-input__icon el-icon-search"                                                                                                                                                                                                                                                                                                                     ></i>
                </el-input>
                <div class="search-content">
                <ul v-show="isSelected" style="height:250px;overflow-y:scroll">
                  <li  class="search-item border-bottom" v-for="(item, index) in indicatorsSearchResults"
                  :key="index"
                  @click="selectEntrySymbol(item.chart_name,item.url)"
                  >
                  {{item.chart_name}}
                  </li>
                </ul>
                </div>
              </div>
              <div v-else class="searchBox">
                <el-input
                  v-model="indicatorsExitValue"
                  size="mini"
                  @input="searchAction($event)"
                  placeholder="Please enter the indicator"
                  @focus="showSearchList"
                >
                <i slot="prefix" class="el-input__icon el-icon-search"                                                                                                                                                                                                                                                                                                                     ></i>
                </el-input>
                <div class="search-content">
                <ul v-show="isSelected" style="height:250px;overflow-y:scroll">
                  <li  class="search-item border-bottom" v-for="(item, index) in indicatorsSearchResults"
                  :key="index"
                  @click="selectExitSymbol(item.chart_name,item.url)">
                  {{item.chart_name}}
                  </li>
                </ul>
                </div>
              </div>
            </el-form-item>
        </el-form>
        <el-form ref="rightForm" label-position="left" label-width="80px" :rules="conditionsFormRules">
          <div v-for="(item, index) in conditionList" :key='index'>
            <!-- 必需 -->
            <el-form-item label="Condition_description:" size="mini">
              <el-input
                v-model="conditionList[index].condition_description"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item label="Parameter:" size="mini">
              <el-radio v-model="parameterRadio" label="1" v-if="conditionList[index].parameter == ''">{{conditionList[index].originParameter}}</el-radio>
              <el-radio v-model="parameterRadio" label="1" v-else>{{conditionList[index].parameter}}</el-radio>
              <el-radio v-model="parameterRadio" label="2">sentiment SMA</el-radio>
            </el-form-item>
            <el-form-item v-if="parameterRadio == '2'" label="MA:" size="mini">
              <div class="selectBox">
                      <el-autocomplete
                      class="inline-input"
                      v-model="maValue"
                      :fetch-suggestions="querySearch"
                      placeholder="Please select/enter MA value"
                      @select="handleSelect"
                      @change="maValueChange"
                    ></el-autocomplete>
              </div>
            </el-form-item>
            <el-form-item  label="Condition:" size="mini">
              <div class="selectBox">
                <el-select @change="getconditionOption(conditionList[index].condition)" v-model="conditionList[index].condition" v-if="parameterRadio == '1'" filterable placeholder="Please select condition">
                      <el-option
                          v-for="(item) in conditions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                </el-select>
                <el-select v-model="conditionsOption" v-else filterable placeholder="Please select condition" @change="getMaconditionOption(conditionsOption)">
                      <el-option
                          v-for="(item) in parameterConditions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item 
              v-if='["Two Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Two Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Three Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0' 
              label="FastMA:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].fast_ma"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Three Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Two Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Three Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="MiddleMA:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].middle_ma"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Two Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Three Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Two Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Three Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="LowMA:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].low_ma"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["MACD CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["MACD CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="MACDFast:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].macd_fast"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["MACD CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["MACD CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="MACDSlow:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].macd_slow"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["MACD CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["MACD CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
              label="MACDSig:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].macd_sig"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["price lower Low"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Accumulation & Distribution Higher"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Price Higher High"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Accumulation & Distribution Lower"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["ATR trailing stop (High）line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["ATR trailing stop (Close) line CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Above Bollinger Upper Band"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Below Bollinger Lower Band"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Band Width Greater"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Band Width Less"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["EMA200 Less"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["EMA200 Greater"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Chandelier Exits CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Chandelier Exits CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["NAsdAQ Composite / S&P 500 Greater"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["S&P 500 Moving Average Greater"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Stay Above Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Stay Below Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Touch Above Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Touch Below Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Breakout Support"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Breakout Resistance"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Upper Band CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Lower Band CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Triple Tap Trend Reversal Divergence"].indexOf(conditionList[index].condition_description) === 0'  
              label="Str_value:" 
              size="mini"
            >
              <el-input
                v-model="conditionList[index].str_value"
                size="mini"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 8 }"
                resize="none"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Parabolic SAR CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Parabolic SAR CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["price lower Low"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Accumulation & Distribution Higher"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Price Higher High"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Accumulation & Distribution Lower"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["ATR trailing stop (High）line CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["ATR trailing stop (Close) line CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["MACD CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["MACD CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Above Bollinger Upper Band"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Below Bollinger Lower Band"].indexOf(conditionList[index].condition_description) === -1 &&     
                    ["Bollinger Band Width Greater"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Bollinger Band Width Less"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["EMA200 Less"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["EMA200 Greater"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Chandelier Exits CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Chandelier Exits CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["NAsdAQ Composite / S&P 500 Greater"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["S&P 500 Moving Average Greater"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Two Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Two Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Three Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Three Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Stop Loss and Take profit"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Stay Above Moving Average"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Stay Below Moving Average"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Touch Above Moving Average"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Touch Below Moving Average"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Breakout Support"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Breakout Resistance"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Bollinger Upper Band CrossBelow"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Bollinger Lower Band CrossAbove"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["Triple Tap Trend Reversal Divergence"].indexOf(conditionList[index].condition_description) === -1 &&
                    ["stay how many days in the market"].indexOf(conditionList[index].condition_description) === -1'
              label="Value:"
              prop="value" 
              size="mini">
              <el-input
                v-model="conditionList[index].value"
                size="mini"
              ></el-input>
            </el-form-item>
            <el-form-item 
              v-if='["Parabolic SAR CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Parabolic SAR CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Bollinger Band Width Less"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["CMFI CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["CMFI CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Moving Average CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Moving Average CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Stay Above Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["Stay Below Moving Average"].indexOf(conditionList[index].condition_description) === 0 ||
                    ["stay how many days in the market"].indexOf(conditionList[index].condition_description) === 0'  
              label="Period:" 
              size="mini">
              <el-input
                v-model="conditionList[index].period"
                size="mini"
              ></el-input>
          </el-form-item>
          <el-form-item 
            v-if='["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["ATR trailing stop (High）line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["ATR trailing stop (Close) line CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Chandelier Exits CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Chandelier Exits CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
            label="ATR_multiplier:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].atr_multiplier"
                size="mini"
              ></el-input>
          </el-form-item>
          <el-form-item 
            v-if='["ATR trailing stop (Close) line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["ATR trailing stop (High）line CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["ATR trailing stop (Close) line CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Chandelier Exits CrossAbove"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Chandelier Exits CrossBelow"].indexOf(conditionList[index].condition_description) === 0'  
            label="ATR_period:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].atr_period"
                size="mini"
              ></el-input>
          </el-form-item>
          <el-form-item 
            v-if='["Above Bollinger Upper Band"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Below Bollinger Lower Band"].indexOf(conditionList[index].condition_description) === 0'   
            label="SD:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].sd"
                size="mini"
              ></el-input>
          </el-form-item>

          <el-form-item 
            v-if='["Parabolic SAR CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Parabolic SAR CrossAbove"].indexOf(conditionList[index].condition_description) === 0'   
            label="Max_step:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].max_step"
                size="mini"
              ></el-input>
          </el-form-item>

          <el-form-item 
            v-if='["Parabolic SAR CrossBelow"].indexOf(conditionList[index].condition_description) === 0 ||
                  ["Parabolic SAR CrossAbove"].indexOf(conditionList[index].condition_description) === 0'   
            label="Acceleration_factor:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].acceleration_factor"
                size="mini"
              ></el-input>
          </el-form-item>

          <el-form-item 
            v-if='["Stop Loss and Take profit"].indexOf(conditionList[index].condition_description) === 0'   
            label="Stop_loss:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].stop_loss"
                size="mini"
              ></el-input>
          </el-form-item>

          <el-form-item 
            v-if='["Stop Loss and Take profit"].indexOf(conditionList[index].condition_description) === 0'   
            label="Take_profit:" 
            size="mini"
          >
              <el-input
                v-model="conditionList[index].take_profit"
                size="mini"
              ></el-input>
          </el-form-item>
          
            <el-form-item v-if="index !== (conditionList.length - 1)" label="Combination:" size="mini">
              <el-radio-group v-model="entryData.combination">
                <el-radio :label="0">AND</el-radio>
                <el-radio :label="1">OR</el-radio>
                <el-radio :label="2">SUM</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </el-col>
    <el-col :span="16">
    <div class="entryBtns" v-if="signalFormTagName === 'first'">
      <el-button type="info" @click="clearEntryFormData">Clear Entry Signal</el-button>
      <el-button type="primary" @click="submitEntryFormData()">Save Entry Signal</el-button>
      <el-button type="warning" v-on:click="openEntryDialog">Load Entry Signal</el-button>
    </div>
    <div class="entryBtns" v-else>
      <el-button type="info">Clear Exit Signal</el-button>
      <el-button type="primary" @click="submitExitFormData()">Save Exit Signal</el-button>
      <el-button type="warning" v-on:click="openExitDialog">Load Exit Signal</el-button>
    </div>
    </el-col>
</el-row>
</template>
<script>
import loginFormateVue from '../../../loginFormate.vue'
import signalDialog from '../../stategy/strategyComponents/signalDialog.vue'
import { throttle } from '../../../tools/throttle.js'
import { mapState, Store } from 'vuex'
import { CIQ } from 'chartiq/st-development/js/entryIndicator'
export default {
  props: { signalFormTagName: String, exitLabel: Array },
  data() {
    return {
      restaurants: [],
      entryData: {},
      exitData: {},
      // Form validation rules
      signalFormRules: {
        name: [
          {
            required: true,
            message: 'Please enter the name of the signal',
            trigger: 'blur',
          },
        ],
        description: [
          {
            required: true,
            message: 'Please enter a description of the signal',
            trigger: 'blur',
          },
        ],
      },
      conditionsFormRules: {
        value: [
          { type: 'number', message: 'Please enter number', trigger: 'blur' },
        ],
      },
      submitEntrycondition: {},
      conditions: [{value: 0,label:'>'}, {value: 1,label:'<'}, {value: 2,label:'CrossAbove'}, {value: 3,label:'CrossBelow'}],
      parameterConditions: [{value: 4, label:'sentiment crossAbove'},{value: 5, label:'sentiment crossBelow'}],
      conditionsOption: '',
      combinations: ['AND', 'OR', 'SUM'],
      conditionList: [
        {
          condition_description: '',
          originParameter: 'sentiment value',
          parameter: '',
          maValue: '',
          condition: '',
          value: '',
        },
      ],
      initialEntryFromData: {},
      initialExitFromData: {},
      maValue: '',
      entryType: 'short',
      exitType: '',
      entryFormdata: {
        entry: [
          {
            label: 'Browse from signal List',
            value: 'Browse from signal List',
          },
        ],
        actionEntry: [
          { label: 'Long', value: 'long' },
          { label: 'Short', value: 'short' },
        ],
        entryTypeOption: [
          { label: 'long', value: 'long'},
          { label: 'short', value: 'short'}
        ],
        frequencyOption: [
          { label: 'daily',value: 'daily' },
          { label: 'weekly',value: 'weekly' },
          { label: 'monthly',value: 'monthly' },
        ],
        valueEntry: '',
        valueExit: '',
        exit: [],
      },
      exitFormData: {
        exitTypeOption: this.$store.state.customExitType
      },
      options: [
        {
          value: 5,
          label: 5,
        },
        {
          value: 10,
          label: 10,
        },
        {
          value: 20,
          label: 20,
        },
        {
          value: 30,
          label: 30,
        },
        {
          value: 60,
          label: 60,
        },
      ],
      entryDialogTableVisible: false,
      exitDialogTableVisible: false,
      entryType: '',
      indicators: [],
      indicatorsName: '',
      timeout:  null,
      parameterRadio: '1',
      entryTypeRadio: '1',
      exitTypeRadio: '1',
      indicatorsList: [],
      indicatorsSearchResults: [],
      indicatorsEntryValue: '',
      indicatorsExitValue: '',
      conditionData: {},
      isSelected: true
    }
  },
  components: {
    'signal-dialog': signalDialog,
  },
  computed: {
    ...mapState(['strategyEntryData','strategyExitData'])
  },
  created() {
    this.getIndicatorsList()
  },
  mounted() {
      this.restaurants = this.loadAll();
    },
  methods: {
    clearFormValidate(){
      this.$nextTick(()=>{
        try{
          this.$refs['entryForm'].clearValidate()      
        }catch(e){
        }  
         try{
          this.$refs['exitForm'].clearValidate() 
        }catch(e){
        }  
        
      })
    },
    // send messages to chartiq
    openEntryDialog() {
      this.entryDialogTableVisible = !this.entryDialogTableVisible
      this.isSelected = false

      this.clearFormValidate()    
    },
    getIndicatorsList() {
      this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
      {auth:{
            username: 'sentimentrader_backtest_api',
            password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
          }}).then( res => {
            this.indicatorsList = res.data 
            this.$store.commit("getIndicatorsList",this.indicatorsList)
          })
    },
    openExitDialog() {
      this.exitDialogTableVisible = !this.exitDialogTableVisible
      this.isSelected = false

      this.clearFormValidate()    
    },
    setEntryData(data) {
      // console.log('data',data);
      // console.log(this.$store.state.indicatorsList);
      let result
      //console.log(data.used_indicators.toString())
      this.$store.state.indicatorsList.forEach((value,index)=>{ 
        if(value.chart_name.toString().indexOf(data.used_indicators.toString())!== -1){
          result = value
        }
      })
      //console.log(result)
      if(result.url !== undefined){
      //console.log('url',result.url)

      this.$store.commit('getEntryIndicators',result.url)

      let indicatorsList = [this.$store.state.indicators.entry,this.$store.state.indicators.exit]
          for(var i=0;i<indicatorsList.length;i++){
            if(indicatorsList[i]==''){
              indicatorsList.splice(i,1)
              i--;
            }
          }
          CIQ.addIndicators(indicatorsList).then(
            this.$message({
                message: 'Loading sucess',
                type: 'success'
              })
          )
      }else{
        return
      }
      let vm = this
      const res =  this.$http.get('/demo/condition/', {
        params: { id: data.id },
      }).then(res =>{
        vm.conditionList = res.data.results
        this.initialEntryFromData.value = res.data.results.value
      })
      vm.entryData = data
      vm.entryType = data.type
      this.initialEntryFromData.name = data.name
      this.initialEntryFromData.description = data.description
      this.indicatorsEntryValue = data.used_indicators
      // window.sessionStorage.setItem('entryData', vm.entryData)
      // this.$refs.entryDataFrom.openDialog(data);
    },
    async setExitData(data) {
      let vm = this

      const res = await this.$http.get('/demo/condition/', {
        params: { id: data.id },
      })
      let result
      this.$store.state.indicatorsList.forEach((value,index)=>{
        if(value.chart_name.toString().indexOf(data.used_indicators.toString())!== -1){
          result = value
        }
      })
      if(result.url !== undefined){

      this.$store.commit('getExitIndicators',result.url)

      let indicatorsList = [this.$store.state.indicators.entry,this.$store.state.indicators.exit]
          for(var i=0;i<indicatorsList.length;i++){
            if(indicatorsList[i]==''){
              indicatorsList.splice(i,1)
              i--;
            }
          }
          // CIQ.addIndicators(indicatorsList).then(
          //   this.$message({
          //       message: 'Loading sucess',
          //       type: 'success'
          //     })
          // )
          CIQ.addIndicators(indicatorsList)
          this.$message({
                message: 'Loading sucess',
                type: 'success'
          })
      }else{
        return
      }

      vm.exitType = data.type
      this.initialExitFromData.name = data.name
      this.initialExitFromData.description = data.description
      this.indicatorsExitValue = data.used_indicators
      this.initialExitFromData.value = res.data.results.value
      this.conditionList = res.data.results
      this.exitData = data
    },
    loadAll() {
      return [
        {"value":'5'},
        {"value":'10'},
        {"value":'15'},
        {"value":'30'},
        {"value":'60'},
      ]
    },
    clearEntryFormData() {
      this.clearFormValidate()    
    },
    async submitEntryFormData() {
      let vm =this
      vm.submitEntrycondition.name = vm.entryData.name
      vm.submitEntrycondition.description = vm.entryData.description
      const analysisBasisArr = ['sentiment','technical']
      // const conditionOptionArr = ['>','<', 'CrossAbove','CrossBelow', 'sentiment crossAbove', 'sentiment crossBelow']
      vm.submitEntrycondition.analysis_basis = analysisBasisArr[vm.entryTypeRadio - 1]
      vm.submitEntrycondition.used_indicators = vm.indicatorsEntryValue
      // vm.submitEntrycondition.type = vm.entryData.entryType
      vm.submitEntrycondition.frequency = vm.entryData.frequency
      vm.conditionList.forEach(item => {
        vm.conditionData.condition_description=item.condition_description
        // this.conditionData.condition = conditionOptionArr.indexOf(item.condition)
        vm.conditionData.condition  = item.condition
        vm.conditionData.value= item.value + ''
        if(vm.parameterRadio == 1){
        if(item.parameter == ''){
          vm.conditionData.parameter= 'sentiment value'
        }else{
          vm.conditionData.parameter = item.parameter
        }}
        if(vm.parameterRadio == 2){
          vm.conditionData.parameter = 'sentiment SMA'
          vm.conditionData.maValue = vm.maValue
          // this.conditionData.condition = conditionOptionArr.indexOf(this.conditionsOption)
        }
      })
      
      // const conditions = vm.conditionList
      const conditions = []
      conditions.push(vm.conditionData)
      // let formData = vm.entryData
      var formData = vm.submitEntrycondition;
      formData.conditions = JSON.stringify(conditions)
      //检查有无改动
        if(conditions['value'] !== ''){
            const {data:res} = await vm.$http.post("/demo/create_signal/",vm.$qs.stringify(formData),{auth:{
              // username: 'sentimentrader_backtest_api',
              // password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
              username: 'demo01',
              password: 'admin123456'
            }})
            if(res.status == 200){
            this.$emit('sendEntryData',formData)
            this.$store.commit('getEntryData',formData)
            this.$emit('getExitLabel', this.entryFormdata.exit)
            this.$message.success({
              message: 'Saved successfully',
              duration: 1000
            })
            // this.$emit('goToExitSignalForm')
            }
        }else{
          this.$message.error({
           message: 'The value of value entered is empty',
           duration: 1000
         })
        }
      
      this.clearFormValidate()    
    },
    async submitExitFormData() {
      let vm =this
      const analysisBasisArr = ['sentiment','technical']
      const submitExitData = {}
      submitExitData.name = vm.exitData.name
      submitExitData.description = vm.exitData.description
      submitExitData.analysis_basis = analysisBasisArr[vm.exitTypeRadio - 1]
      submitExitData.type = vm.exitType
      submitExitData.frequency = vm.exitData.frequency
      submitExitData.used_indicators = vm.indicatorsExitValue
      const conditionData = {}
      vm.conditionList.forEach(item => {
        conditionData.condition_description=item.condition_description
        // this.conditionData.condition = conditionOptionArr.indexOf(item.condition)
        conditionData.condition  = item.condition
        conditionData.value= item.value + ''
        if(vm.parameterRadio == 1){
        if(item.parameter == ''){
          conditionData.parameter= 'sentiment value'
        }else{
          conditionData.parameter = item.parameter
        }}
        if(vm.parameterRadio == 2){
          conditionData.parameter = 'sentiment SMA'
          conditionData.maValue = vm.maValue
          // this.conditionData.condition = conditionOptionArr.indexOf(this.conditionsOption)
        }
      })
      // submitExitData.name = 
      const conditions = []
      conditions.push(conditionData)
      // let formData = vm.entryData
      const formData = submitExitData;
      formData.conditions = JSON.stringify(conditions)
      // let formData = vm.exitData
      // 提交的 ['name','description','value'] 组成的数组 submitFormData
      //检查有无改动
        if(submitExitData['name'] !== ''){
                const {data:res} = await vm.$http.post("/demo/create_signal/",vm.$qs.stringify(formData),{auth:{
                  // username: 'sentimentrader_backtest_api',
                  // password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
                  username: 'demo01',
                  password: 'admin123456'
                }})
                if(res.status === 200){
                this.$emit('sendExitData',vm.exitData)
                this.$store.commit('getExitData', formData)
                this.$message.success({
                  message: 'Saved successfully',
                  duration: 1000
                })
                }
        //  this.$emit('goToStrategyForm')
        this.saveStrategy()
        }else{
          this.$message.error({
           message: 'The save failed',
           duration: 1000
         })
        }

      this.clearFormValidate()    
    },
    saveStrategy() {
      // console.log('strategyentry',this.strategyEntryData);
      // console.log('strategyexit',this.strategyExitData);
      const entryData = this.$store.state.strategyEntryData
      const exitData = this.$store.state.strategyExitData
      const submitStrategyData = {}
      submitStrategyData.name = Math.random().toString(36).slice(-8)
      submitStrategyData.description = Math.random().toString(36)
      submitStrategyData.signal_entry = entryData
      submitStrategyData.signal_exit = exitData
      submitStrategyData.signal_entry.entryAction = entryData.type
      submitStrategyData.signal_exit.exitAction = exitData.type
      var params =
          {name: submitStrategyData.name,
          description: submitStrategyData.description,
          signal_entry: JSON.stringify(submitStrategyData.signal_entry),
          signal_exit: JSON.stringify(submitStrategyData.signal_exit),
          user: ''
          }
      if((params.name === '' || params.description === '') || (params.name === undefined || params.description === undefined)){
            this.$message.error({
            message: 'Please enter name or description',
            duration: 1000
          })
          return
      }
      if(entryData.name === undefined){
          this.$message.error({
            message: 'Please select entry signal',
            duration: 1000
          })
           return
      }
      if(exitData.name === undefined){
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
      }}).then(res => {
        vm.$store.commit('getStrategyId',res.data.id)
        if(res.status === 201){
          this.$emit("updateStrategylist")
          // eventBus.eventVue.$emit('UpdateMyStrategyList',"aaa")
          }else{this.$message.error({
            message: 'The save failed',
            duration: 1000
          })}}).catch(error => {
      console.error(error);
      })
    },
    maValueChange(val){
      this.conditionList.maValue = val
    },
    querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect(item) {
        this.conditionList.maValue = item.value
      },
      searchAction: throttle(function(e) {
        const inputValue = e
        this.indicatorsSearchResults = this.indicatorsList.filter( item => {
          if(item.chart_name.toLowerCase().includes(inputValue.toLowerCase()))
            return item
        })
      }, 500),
      selectEntrySymbol(name,url) {
            this.indicatorsEntryValue = name
            this.$store.commit('getEntryIndicators',url)
            this.isSelected = false

          let indicatorsList = [this.$store.state.indicators.entry,this.$store.state.indicators.exit]
          for(var i=0;i<indicatorsList.length;i++){
            if(indicatorsList[i]==''){
              indicatorsList.splice(i,1)
              i--;
            }
          }
          CIQ.addIndicators(indicatorsList).then(
            this.$message({
                message: 'Loading sucess',
                type: 'success'
              })
          )
         },
      selectExitSymbol(name,url) {
            this.indicatorsExitValue = name
            this.$store.commit('getExitIndicators',url)
            this.isSelected = false

          let indicatorsList = [this.$store.state.indicators.entry,this.$store.state.indicators.exit]
          for(var i=0;i<indicatorsList.length;i++){
            if(indicatorsList[i]==''){
              indicatorsList.splice(i,1)
              i--;
            }
          }
          CIQ.addIndicators(indicatorsList).then(
            this.$message({
                message: 'Loading sucess',
                type: 'success'
              })
          )            
         },
      showSearchList() {
        this.isSelected = true
      },
      hideSearchList() {
        this.isSelected = false
      },
      // getOptionValue
      selectTypeAction(val) {
      // this.entryData.type = val
      this.submitEntrycondition.type = val
      this.$store.commit('getCustomExitType',val)
    },
    selectFrequencyAction(val) {
      // this.entryData.frequency = val
      this.submitEntrycondition.frequency = val
    },
    getconditionOption(val){
      this.conditionData.condition = val
    },
    selectEntryAction(value) {
      this.submitEntrycondition.type = value
      // const data = {
      //   long: [
      //     { label: 'Longexit', value: 'longexit' },
      //     { label: 'Short', value: 'short' },
      //   ],
      //   short: [
      //     { label: 'Shortexit', value: 'shortexit' },
      //     { label: 'Long', value: 'long' },
      //   ],
      // }
      // this.valueEntry = value
      // if (this.valueEntry === 'long') {
      //   this.entryFormdata.exit = data.long
      // } else {
      //   this.entryFormdata.exit = data.short
      // }
      this.$emit('getExitLabel', this.entryFormdata.exit)
      this.$store.commit('getExitOption', value)
    },
    selectExitAction(value) {
      this.submitEntrycondition.exitAction = this.exitType
      this.valueExit = value
    },
    getMaconditionOption(val) {
      this.conditionData.condition = val
    }
  },
}
</script>

<style lang="less" scoped>
.main {
  display: flex;
  margin-top: 20px;
}
.signalLeft {
  margin-right: 20px;
  border: 2px solid #6c6c6c;
  border-radius: 10px;
  flex-grow: 1;
  padding: 10px;

  display: flex;
  flex-direction: column;
}
.signalRight {
  border-radius: 10px;
  padding: 65px 10px 10px 10px;
  flex-grow: 1;
  border: 2px solid #6c6c6c;
}
.signalLeftForm {
  flex: 1;
}
.el-form .el-form-item .el-form-item__label {
  width: 80px !important;
}
.entryBtns button{
  margin: 30px 75px 0px 75px;
}
.search-content{
  z-index: 100;
  position: absolute;
  top: 1.58rem;
  left: 0;
  right: 0;
  bottom: 0;
  width: 286px;
  ul::-webkit-scrollbar {
    display: none;
  }
  ul li{
    list-style: none;
    cursor: pointer;
  }
  ul li:hover{
    background-color: #eee;
  }
}
.search-item{
  background: #fff;
}
.active {
         background-color: 666;
      }
</style>
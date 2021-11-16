<template>
<el-row>
  <el-col :span="18">
      <div class="main">
      <div class="signalLeft">
        <div><p>Name/Description:</p></div>
        <div class="signalLeftForm">
          <!-- signal-dialog -->
          <signal-dialog :type="entryType"  :dialogTableVisible="entryDialogTableVisible" @openDialog="openEntryDialog" @setEntryData='setEntryData'></signal-dialog>
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
              <el-radio v-model="typeRadio" label="1">sentiment</el-radio>
              <el-radio v-model="typeRadio" label="2">technical</el-radio>
            </el-form-item>
          </div>
            <el-form-item label="Action" size="mini">
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
            <el-form-item label="Type:" size="mini">
              <!-- <el-input
                v-model="entryData.type"
                size="mini"
                disabled
              ></el-input> -->
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
              <el-radio v-model="typeRadio" label="1">sentiment</el-radio>
              <el-radio v-model="typeRadio" label="2">technical</el-radio>
            </el-form-item>
          </div>
            <el-form-item label="Action" size="mini">
              <div class="selectBox">
                <el-select v-model="exitType" @change="selectExitAction(exitType)" placeholder="Please select">
                  <el-option
                    v-for="(item, index) in exitLabel"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
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
            <el-form-item label="Type:">
              <el-input
                v-model="exitData.type"
                size="mini"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="Frequency:">
              <el-input
                v-model="exitData.frequency"
                size="mini"
                disabled
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="signalRight">
        <el-form label-position="left" label-width="80px">
            <el-form-item label="Indicators:" size="mini">
              <div v-if="signalFormTagName === 'first'" class="searchBox">
                <el-input
                  v-model="indicatorsEntryValue"
                  size="mini"
                  @input="searchAction($event)"
                  @focus="showSearchList"
                  @blur="hideSearchList"
                  placeholder="Please enter the indicator"
                >
                <i slot="prefix" class="el-input__icon el-icon-search"                                                                                                                                                                                                                                                                                                                     ></i>
                </el-input>
                <div class="search-content">
                <ul v-show="isSelected" style="height:300px;overflow-y:scroll">
                  <li  class="search-item border-bottom" v-for="(item, index) in indicatorsSearchResults"
                  :key="index"
                  @click="selectEntrySymbol(item.chart_name)"
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
                  @blur="hideSearchList"
                >
                <i slot="prefix" class="el-input__icon el-icon-search"                                                                                                                                                                                                                                                                                                                     ></i>
                </el-input>
                <div class="search-content">
                <ul v-show="isSelected" style="height:300px;overflow-y:scroll">
                  <li  class="search-item border-bottom" v-for="(item, index) in indicatorsSearchResults"
                  :key="index"
                  @click="selectExitSymbol(item.chart_name)">
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
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item label="Parameter:" size="mini">
              <el-radio v-model="parameterRadio" label="1">{{conditionList[index].parameter}}</el-radio>
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
                <el-select v-model="conditions[conditionList[index].condition]" v-if="parameterRadio == '1'" filterable placeholder="Please select condiction">
                      <el-option
                          v-for="(item,index) in conditions"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                </el-select>
                <el-select v-model="conditionsOption" v-else filterable placeholder="Please select condiction" >
                      <el-option
                          v-for="(item,index) in parameterConditions"
                          :key="index"
                          :label="item"
                          :value="item">
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
  </el-row>
</template>
<script>
import loginFormateVue from '../../../loginFormate.vue'
import signalDialog from '../../stategy/strategyComponents/signalDialog.vue'
import { throttle } from '../../../tools/throttle.js'
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
      conditions: ['>', '<', 'CrossAbove', 'CrossBelow'],
      parameterConditions: ['sentiment crossAbove','sentiment crossBelow'],
      conditionsOption: '',
      combinations: ['AND', 'OR', 'SUM'],
      conditionList: [
        {
          condition_description: '',
          parameter: '',
          maValue: '',
          condition: '',
          value: '',
        },
      ],
      initialEntryFromData: {},
      initialExitFromData: {},
      maValue: '',
      entryType: '',
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
      typeRadio: '1',
      indicatorsList: [],
      indicatorsSearchResults: [],
      indicatorsEntryValue: '',
      indicatorsExitValue: '',
      isSelected: true
    }
  },
  components: {
    'signal-dialog': signalDialog,
  },
  created() {
    this.getIndicatorsList()
  },
  mounted() {
      this.restaurants = this.loadAll();
    },
  methods: {
    openEntryDialog() {
      this.entryDialogTableVisible = !this.entryDialogTableVisible
      this.isSelected = false
    },
    getIndicatorsList() {
      this.$http.get('https://05kv55a2v9.execute-api.us-east-1.amazonaws.com/dev/getAllSymbols',
      {auth:{
            username: 'sentimentrader_backtest_api',
            password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
          }}).then( res => {
            this.indicatorsList = res.data
          })
    },
    openExitDialog() {
      this.exitDialogTableVisible = !this.exitDialogTableVisible
      this.isSelected = false
    },
    setEntryData(data) {
      let vm = this
      const res =  this.$http.get('/demo/condition/', {
        params: { id: data.id },
      }).then(res =>{
        vm.conditionList = res.data.results
        this.initialEntryFromData.value = res.data.results.value
      })
      vm.entryData = data
      this.initialEntryFromData.name = data.name
      this.initialEntryFromData.description = data.description
      this.indicatorsEntryValue = data.used_indicators
      // window.sessionStorage.setItem('entryData', vm.entryData)
      // this.$refs.entryDataFrom.openDialog(data);
    },
    async setExitData(data) {
      const res = await this.$http.get('/demo/condition/', {
        params: { id: data.id },
      })
      this.initialExitFromData.name = data.name
      this.initialExitFromData.description = data.description
      this.indicatorsExitValue = data.used_indicators
      this.initialExitFromData.value = res.data.results.value
      this.conditionList = res.data.results
      this.exitData = data
    },
    selectEntryAction(value) {
      const data = {
        long: [
          { label: 'Longexit', value: 'longexit' },
          { label: 'Short', value: 'short' },
        ],
        short: [
          { label: 'Shortexit', value: 'shortexit' },
          { label: 'Long', value: 'long' },
        ],
      }
      this.valueEntry = value
      if (this.valueEntry === 'long') {
        this.entryFormdata.exit = data.long
      } else {
        this.entryFormdata.exit = data.short
      }
      this.$emit('getExitLabel', this.entryFormdata.exit)
    },
    selectTypeAction(val) {
      this.entryData.type = val
      console.log(this.entryData.type);
    },
    selectFrequencyAction(val) {
      this.entryData.frequency = val
      console.log(this.entryData.frequency);
    },
    selectExitAction(value) {
      this.valueExit = value
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
      console.log('clear', this.entryData)
    },
    async submitEntryFormData() {
      let vm =this
      const conditions = vm.conditionList
      let formData = vm.entryData
      // 提交的 ['name','description','value'] 组成的数组 submitFormData
      const submitFormData = {};
      submitFormData['name'] = formData.name
      submitFormData['description'] = formData.description
      conditions.forEach((item, index) => {
        submitFormData['value'] = item.value
      })
      //检查有无改动
      if(submitFormData['name'] !== this.initialEntryFromData['name'] && submitFormData['description'] !== this.initialEntryFromData['description']){
        if(submitFormData['value'] !== ''){
                formData.conditions = JSON.stringify(conditions)
                const {data:res} = await vm.$http.post("/demo/create_signal/",vm.$qs.stringify(formData),{auth:{
                  // username: 'sentimentrader_backtest_api',
                  // password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
                  username: 'demo01',
                  password: 'admin123456'
                }})
                this.$emit('sendEntryData',this.entryData)
                this.$emit('getExitLabel', this.entryFormdata.exit)
                this.$message.success({
                  message: 'Saved successfully',
                  duration: 1000
                })
         this.$emit('goToExitSignalForm')
        }else{
          this.$message.error({
           message: 'The value of value entered is empty',
           duration: 1000
         })
        }
      }else {
        this.$message.error({
           message: 'The entered name and discription already exist',
           duration: 1000
         })
      }
    },
    async submitExitFormData() {
      let vm =this
      const conditions = vm.conditionList
      let formData = vm.exitData
      // 提交的 ['name','description','value'] 组成的数组 submitFormData
      const submitFormData = {};
      submitFormData['name'] = formData.name
      submitFormData['description'] = formData.description
      conditions.forEach((item, index) => {
        submitFormData['value'] = item.value
      })
      //检查有无改动
      if(submitFormData['name'] !== this.initialExitFromData['name'] && submitFormData['description'] !== this.initialExitFromData['description']){
        if(submitFormData['value'] !== ''){
                formData.conditions = JSON.stringify(conditions)
                const {data:res} = await vm.$http.post("/demo/create_signal/",vm.$qs.stringify(formData),{auth:{
                  // username: 'sentimentrader_backtest_api',
                  // password: 'TAZcbpTmQVAJW4GW3ZMQA1su0ynjqJJsYo6vfkapx'
                  username: 'demo01',
                  password: 'admin123456'
                }})
                this.$emit('sendExitData',this.exitData)
                this.$message.success({
           message: 'Saved successfully',
           duration: 1000
         })
         this.$emit('goToStrategyForm')
        }else{
          this.$message.error({
           message: 'The value of value entered is empty',
           duration: 1000
         })
        }
      }else {
        this.$message.error({
           message: 'The entered name and discription already exist',
           duration: 1000
         })
      }
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
          if(item.chart_name.includes(inputValue))
            return item
        })
      }, 500),
      selectEntrySymbol(name) {
            this.indicatorsEntryValue = name
            this.$store.commit('getEntryIndicators',name)
            this.isSelected = false
         },
      selectExitSymbol(name) {
            this.indicatorsExitValue = name
            this.$store.commit('getExitIndicators',name)
            this.isSelected = false
         },
      showSearchList() {
        this.isSelected = true
      },
      hideSearchList() {
        this.isSelected = false
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
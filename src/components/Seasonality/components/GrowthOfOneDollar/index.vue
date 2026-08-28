<template>
  <div class="growth-form-container seasonality-form-container">
    <el-form
      ref="growthForm"
      :model="data"
      label-position="top"
      size="mini"
    >
      <div class="growth-container-top top">
        <el-form-item prop="symbol">
          <template slot="label">
            <label>
              1.Symbol
              <el-tooltip effect="dark" placement="top">
                <span slot="content">Choose a stock/index/ETF as symbol.(default:SPX)</span>
                <i class="fa fa-question-circle right" aria-hidden="true"></i>
              </el-tooltip>
            </label>
          </template>
          <SearchAutocomplete
            v-model="symbol"
            @query="querySearch"
            @select="item => handleSelect(item)"
            placeholder="Please select indicator from the dropdown menu"
          />
        </el-form-item>

        <el-form-item label="2.Date Range">
          <template slot="label">
            <label>
              2.Date Range
              <el-tooltip effect="dark" placement="top">
                <span slot="content">
                  Select the start and end years for the selected symbol data. <br />
                  The request uses January 1 for the start year and December 31 for the end year.
                </span>
                <i class="fa fa-question-circle right" aria-hidden="true"></i>
              </el-tooltip>
            </label>
          </template>
          <div class="select-container">
            <div class="startAndEndBox">
              <el-date-picker
                ref="startDatePicker"
                v-model="data.start_date"
                value-format="yyyy"
                type="year"
                align="right"
                :unlink-panels="true"
                range-separator="to"
                placeholder="Start Date"
                :picker-options="startPickerOptions"
              >
              </el-date-picker>
              <span>to</span>
              <el-date-picker
                ref="endDatePicker"
                v-model="data.end_date"
                value-format="yyyy"
                type="year"
                align="right"
                :unlink-panels="true"
                range-separator="to"
                placeholder="End Date"
                :picker-options="endPickerOptions"
              >
              </el-date-picker>
            </div>
          </div>
        </el-form-item>

        <el-form-item prop="entry_day">
          <template slot="label">
            <label>
              3.Start TDY
              <el-tooltip effect="dark" placement="top">
                <span slot="content">Select the trading day number to enter the seasonal window.</span>
                <i class="fa fa-question-circle right" aria-hidden="true"></i>
              </el-tooltip>
            </label>
          </template>
          <el-input
            v-model="data.entry_day"
            placeholder="Please enter Start TDY"
            inputmode="numeric"
            autocomplete="off"
            @input="value => handleTradingDayInput('entry_day', value)"
          >
          </el-input>
        </el-form-item>

        <el-form-item prop="exit_day">
          <template slot="label">
            <label>
              4.End TDY
              <el-tooltip effect="dark" placement="top">
                <span slot="content">Select the trading day number to exit the seasonal window.</span>
                <i class="fa fa-question-circle right" aria-hidden="true"></i>
              </el-tooltip>
            </label>
          </template>
          <el-input
            v-model="data.exit_day"
            placeholder="Please enter End TDY"
            inputmode="numeric"
            autocomplete="off"
            @input="value => handleTradingDayInput('exit_day', value)"
          >
          </el-input>
        </el-form-item>
      </div>
    </el-form>

    <div class="growth-container-bottom bottom">
      <div v-loading="loading" class="growth-chart-wrapper">
        <div :id="chartId" class="growth-chart"></div>
        <div v-if="hasLoaded && !loading && chartData.length === 0" class="growth-empty">
          No data found
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Highcharts from "highcharts"
import Stock from "highcharts/modules/stock"
import Exporting from "highcharts/modules/exporting"
import ExportData from "highcharts/modules/export-data"
import moment from "moment"
import { getSeasonalityData } from "@/service/service"
import { checkProperties } from "@/utils"
import { createStateFilter } from "@/utils/globalFunc"
import { SearchAutocomplete } from "@/components/common"

let highchartsModulesReady = false

export default {
  name: "GrowthOfOneDollar",
  data() {
    const currentYear = new Date().getFullYear()
    return {
      data: {
        symbol: process.env.VUE_APP_DEFAULT_SYMBOL,
        start_date: (currentYear - 20).toString(),
        end_date: currentYear.toString(),
        entry_day: "10",
        exit_day: "50"
      },
      symbol: process.env.VUE_APP_DEFAULT_SYMBOL,
      dropdownList: [],
      chartId: "growthOfOneDollarContainer",
      chart: null,
      chartData: [],
      loading: false,
      hasLoaded: false,
      requestToken: 0,
      fetchTimer: null,
      startPickerOptions: {
        disabledDate: this.handleDisabledStartDate
      },
      endPickerOptions: {
        disabledDate: this.handleDisabledEndDate
      }
    }
  },
  components: {
    SearchAutocomplete
  },
  computed: {
    symbolList() {
      const data = localStorage.getItem("refactoredConcatList")
      return data ? JSON.parse(data) : []
    }
  },
  watch: {
    data: {
      handler() {
        this.scheduleFetchData()
      },
      deep: true
    }
  },
  mounted() {
    this.dropdownList = this.symbolList
    this.loadHighchartsModules()
    this.scheduleFetchData()
  },
  beforeDestroy() {
    window.clearTimeout(this.fetchTimer)
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  },
  methods: {
    loadHighchartsModules() {
      if (highchartsModulesReady) return
      if (typeof Highcharts.stockChart !== "function") Stock(Highcharts)
      if (!Highcharts.Chart.prototype.exportChart) Exporting(Highcharts)
      if (!Highcharts.Chart.prototype.getCSV) ExportData(Highcharts)
      highchartsModulesReady = true
    },
    scheduleFetchData() {
      window.clearTimeout(this.fetchTimer)
      this.fetchTimer = window.setTimeout(() => {
        this.fetchData()
      }, 250)
    },
    async fetchData() {
      if (!this.validateForm()) return
      const requestToken = ++this.requestToken
      this.loading = true

      try {
        const response = await getSeasonalityData(this.buildUrl())
        if (requestToken !== this.requestToken) return

        const rows = this.extractRows(this.extractPayload(response))
        const seriesData = this.normalizeRows(rows)
        this.chartData = seriesData
        this.hasLoaded = true

        if (seriesData.length === 0) {
          this.popUpMsgBox("Not found: Adjust your search criteria for the selected symbol")
        }

        this.$nextTick(() => {
          this.renderChart(seriesData)
        })
      } catch {
        if (requestToken !== this.requestToken) return
        this.chartData = []
        this.hasLoaded = true
        this.$nextTick(() => {
          this.renderChart([])
        })
        this.popUpMsgBox("Not found: Adjust your search criteria for the selected symbol")
      } finally {
        if (requestToken === this.requestToken) {
          this.loading = false
        }
      }
    },
    validateForm() {
      const requiredFields = ["symbol", "start_date", "end_date", "entry_day", "exit_day"]
      if (!checkProperties(this.data, requiredFields)) return false
      if (Number(this.data.start_date) > Number(this.data.end_date)) {
        this.popUpMsgBox("Start year must be less than end year")
        return false
      }
      if (!this.isPositiveInteger(this.data.entry_day) || !this.isPositiveInteger(this.data.exit_day)) {
        this.popUpMsgBox("Start TDY and End TDY should be positive integers")
        return false
      }
      if (Number(this.data.exit_day) < Number(this.data.entry_day)) {
        this.popUpMsgBox("The End TDY must be after the Start TDY")
        return false
      }
      return true
    },
    buildUrl() {
      const params = [
        `start_date=${encodeURIComponent(`${this.data.start_date}-01-01`)}`,
        `end_date=${encodeURIComponent(`${this.data.end_date}-12-31`)}`,
        `ticker=${encodeURIComponent(this.data.symbol)}`,
        `entry_day=${encodeURIComponent(this.data.entry_day)}`,
        `exit_day=${encodeURIComponent(this.data.exit_day)}`
      ]
      return `/dev/seasonality/one_dollar_curve?${params.join("&")}`
    },
    extractPayload(response) {
      if (Array.isArray(response)) return response
      if (!response || typeof response !== "object") return []

      if (response.data !== undefined) {
        const data = response.data
        if (data && typeof data === "object") {
          if (data.data !== undefined) return data.data
          if (data.Data !== undefined) return data.Data
        }
        return data
      }

      if (response.Data !== undefined) return response.Data
      return response
    },
    extractRows(payload) {
      if (Array.isArray(payload)) return payload
      if (typeof payload === "string") return this.extractRowsFromString(payload)
      if (!payload || typeof payload !== "object") return []

      if (this.isDataRow(payload)) return [payload]

      const columnRows = this.extractColumnRows(payload)
      if (columnRows.length > 0) return columnRows

      const preferredKeys = [
        "data",
        "Data",
        "curve",
        "series",
        "result",
        "results",
        "one_dollar_curve",
        "oneDollarCurve"
      ]

      for (const key of preferredKeys) {
        if (payload[key] !== undefined) {
          const rows = this.extractRows(payload[key])
          if (rows.length > 0) return rows
        }
      }

      const keyedRows = this.extractKeyedRows(payload)
      if (keyedRows.length > 0) return keyedRows

      const firstArray = Object.keys(payload)
        .map(key => payload[key])
        .find(value => Array.isArray(value))

      return firstArray || []
    },
    extractRowsFromString(payload) {
      try {
        return this.extractRows(JSON.parse(payload))
      } catch {
        return []
      }
    },
    extractColumnRows(payload) {
      const dateKeys = this.getDateKeys()
      const valueKeys = this.getValueKeys()
      const dateColumn = this.getObjectValue(payload, dateKeys)
      const valueColumn = this.getObjectValue(payload, valueKeys)

      if (!Array.isArray(dateColumn) || !Array.isArray(valueColumn)) {
        if (dateColumn !== undefined && valueColumn !== undefined) {
          return [[dateColumn, valueColumn]]
        }
        return []
      }

      return dateColumn.map((date, index) => [date, valueColumn[index]])
    },
    extractKeyedRows(payload) {
      return Object.keys(payload)
        .map(key => [key, payload[key]])
        .filter(([date, value]) => this.toTimestamp(date) !== null && this.isNumericValue(value))
    },
    isDataRow(row) {
      if (!row || typeof row !== "object" || Array.isArray(row)) return false

      const dateValue = this.getObjectValue(row, this.getDateKeys())
      const pointValue = this.getObjectValue(row, this.getValueKeys())

      return this.toTimestamp(dateValue) !== null && this.isNumericValue(pointValue)
    },
    normalizeRows(rows) {
      return rows
        .map(row => this.normalizeRow(row))
        .filter(Boolean)
        .sort((a, b) => a[0] - b[0])
    },
    normalizeRow(row) {
      const dateKeys = this.getDateKeys()
      const valueKeys = this.getValueKeys()

      let dateValue
      let pointValue

      if (Array.isArray(row)) {
        dateValue = row[0]
        pointValue = row[1]
      } else if (row && typeof row === "object") {
        dateValue = this.getObjectValue(row, dateKeys)
        pointValue = this.getObjectValue(row, valueKeys)

        if (!this.isNumericValue(pointValue)) {
          const dateKeyLookup = dateKeys.map(key => key.toLowerCase())
          const numericKey = Object.keys(row).find(key => {
            return !dateKeyLookup.includes(key.toLowerCase()) && this.isNumericValue(row[key])
          })
          pointValue = numericKey ? row[numericKey] : pointValue
        }
      }

      const timestamp = this.toTimestamp(dateValue)
      const value = Number(pointValue)
      if (timestamp === null || !Number.isFinite(value)) return null

      return [timestamp, Number(value.toFixed(2)), this.getRawDate(dateValue)]
    },
    getDateKeys() {
      return [
        "date",
        "Date",
        "dates",
        "Dates",
        "DT",
        "dt",
        "time",
        "timestamp",
        "trading_date",
        "tradingDate",
        "x"
      ]
    },
    getValueKeys() {
      return [
        "value",
        "Value",
        "values",
        "Values",
        "growth",
        "Growth",
        "The growth of one U.S. dollar",
        "growth_of_one_dollar",
        "growth_of_1_dollar",
        "one_dollar",
        "oneDollar",
        "oneDollarValue",
        "one_dollar_value",
        "dollar",
        "dollar_value",
        "equity",
        "Equity",
        "equity_curve",
        "balance",
        "amount",
        "cumulative",
        "cumulative_return",
        "Cumulative Return",
        "curve",
        "y"
      ]
    },
    getRawDate(value) {
      if (typeof value === "string") return value.trim()
      return ""
    },
    getObjectValue(row, keys) {
      const exactKey = keys.find(key => Object.prototype.hasOwnProperty.call(row, key))
      if (exactKey) return row[exactKey]

      const lowerKey = Object.keys(row).find(rowKey => {
        return keys.some(key => rowKey.toLowerCase() === key.toLowerCase())
      })

      return lowerKey ? row[lowerKey] : undefined
    },
    isNumericValue(value) {
      if (value === null || value === undefined || value === "") return false
      return Number.isFinite(Number(value))
    },
    toTimestamp(value) {
      if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return Date.UTC(value.getFullYear(), value.getMonth(), value.getDate())
      }

      if (typeof value === "number") return this.numberToTimestamp(value)

      if (typeof value === "string") {
        const trimmedValue = value.trim()
        if (/^\d{4}$/.test(trimmedValue)) {
          return Date.UTC(Number(trimmedValue), 0, 1)
        }
        if (/^\d+(\.\d+)?$/.test(trimmedValue)) {
          return this.numberToTimestamp(Number(trimmedValue))
        }
        const parsedDate = moment.utc(trimmedValue)
        return parsedDate.isValid() ? parsedDate.valueOf() : null
      }

      return null
    },
    numberToTimestamp(value) {
      if (!Number.isFinite(value)) return null
      if (value >= 1900 && value <= 3000) return Date.UTC(value, 0, 1)
      if (value > 100000000000) return value
      if (value > 1000000000) return value * 1000
      return null
    },
    renderChart(seriesData) {
      const chartContainer = document.getElementById(this.chartId)
      if (!chartContainer || typeof Highcharts.stockChart !== "function") return

      if (this.chart) {
        this.chart.destroy()
        this.chart = null
      }

      const title = "The growth of one U.S. dollar"
      this.chart = Highcharts.stockChart(this.chartId, {
        chart: {
          height: 400,
          events: {
            load: function() {
              this.renderer
                .image(
                  "https://assets-global.website-files.com/650486dd4239644e595569c1/650486dd4239644e59556a01_ST%20Logo.png",
                  0,
                  0,
                  200,
                  35
                )
                .attr({
                  zIndex: 5,
                  opacity: 0.35
                })
                .add()
                .align(
                  {
                    align: "left",
                    verticalAlign: "bottom",
                    x: 0,
                    y: -35
                  },
                  false,
                  "plotBox"
                )
            }
          }
        },
        title: {
          text: title,
          style: {
            fontWeight: "bold",
            fontFamily: "Arial",
            fontSize: "18px"
          },
          margin: 20
        },
        credits: {
          enabled: false
        },
        exporting: {
          enabled: true,
          buttons: {
            contextButton: {
              menuItems: ["printChart", "downloadPNG", "downloadJPEG", "downloadPDF"]
            }
          }
        },
        rangeSelector: {
          selected: 7,
          inputEnabled: true,
          inputDateFormat: "%Y-%m-%d",
          inputEditDateFormat: "%Y-%m-%d",
          buttons: [
            { type: "ytd", text: "YTD" },
            { type: "year", count: 1, text: "1y" },
            { type: "year", count: 3, text: "3y" },
            { type: "year", count: 5, text: "5y" },
            { type: "year", count: 10, text: "10y" },
            { type: "year", count: 15, text: "15y" },
            { type: "year", count: 20, text: "20y" },
            { type: "all", text: "All" }
          ]
        },
        navigator: {
          enabled: true
        },
        scrollbar: {
          enabled: true
        },
        xAxis: {
          type: "datetime",
          lineColor: "#d9e0e7",
          tickColor: "#d9e0e7"
        },
        yAxis: {
          opposite: true,
          gridLineDashStyle: "Dash",
          gridLineColor: "#e9e9e9",
          title: {
            text: title,
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          },
          labels: {
            formatter: function() {
              return Highcharts.numberFormat(this.value, 2).replace(/\.?0+$/, "")
            },
            style: {
              color: Highcharts.getOptions().colors[1]
            }
          }
        },
        tooltip: {
          formatter: function() {
            const point = this.points && this.points[0] ? this.points[0].point : this.point
            const rawDate = point.rawDate || ""
            const color = point.color || point.series.color
            return `<b>Date: ${rawDate}</b><br/> ${
              point.series.name
            }: $${Highcharts.numberFormat(point.y, 2)}`
          }
        },
        legend: {
          enabled: false
        },
        plotOptions: {
          series: {
            animation: false,
            states: {
              inactive: {
                opacity: 1
              }
            }
          }
        },
        series: [
          {
            type: "line",
            keys: ["x", "y", "rawDate"],
            name: "The growth of one U.S. dollar",
            data: seriesData,
            color: "#76b7e8",
            lineWidth: 2,
            marker: {
              enabled: false
            },
            tooltip: {
              valueDecimals: 2
            }
          }
        ]
      })
    },
    handleDisabledStartDate(time) {
      return time.getFullYear() > Number(this.data.end_date) || time.getFullYear() < 1928
    },
    handleDisabledEndDate(time) {
      return (
        time.getFullYear() > new Date().getFullYear() ||
        time.getFullYear() < 1928 ||
        time.getFullYear() < Number(this.data.start_date)
      )
    },
    isPositiveInteger(value) {
      return /^[1-9]\d*$/.test(String(value))
    },
    normalizePositiveInteger(value) {
      const digits = String(value === null || value === undefined ? "" : value).replace(/\D/g, "")
      if (!digits) return ""
      return digits.replace(/^0+/, "")
    },
    handleTradingDayInput(field, value) {
      const normalizedValue = this.normalizePositiveInteger(value)
      if (this.data[field] !== normalizedValue) {
        this.$set(this.data, field, normalizedValue)
      }
      if (field === "entry_day") {
        this.handleEntryDayChange(normalizedValue)
      }
    },
    handleEntryDayChange(value) {
      const entryDay = Number(value)
      const exitDay = Number(this.data.exit_day)
      if (entryDay > 0 && exitDay > 0 && exitDay < entryDay) {
        this.data.exit_day = String(entryDay)
      }
    },
    querySearch(queryString, cb) {
      let dropdownList = this.dropdownList
      if (!dropdownList || dropdownList.length === 0) {
        dropdownList = this.symbolList
      }

      const results = dropdownList
        .map(item => ({
          ...item,
          priority: createStateFilter(queryString)(item)
        }))
        .filter(item => item.priority > 0)

      cb(results.sort((a, b) => b.priority - a.priority))
    },
    handleSelect(item) {
      this.$nextTick(() => {
        this.symbol = item.url
        this.data.symbol = item.url
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../index.less";

.growth-form-container {
  align-content: start;
  display: grid;
  grid-row-gap: 35px;
  min-height: 660px;
  .growth-container-top {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-column-gap: 10px;
    min-width: 1122px;
  }

  .growth-chart-wrapper {
    position: relative;
    min-height: 422px;
    width: 1122px;
  }

  .growth-chart {
    border: 1px solid #ddd;
    box-sizing: content-box;
    height: 400px;
    padding: 10px;
    width: 1100px;
  }

  .growth-empty {
    position: absolute;
    top: 54%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #999999;
    font-size: 14px;
    pointer-events: none;
  }

  .startAndEndBox {
    justify-content: space-between;
    width: 100%;
  }

  /deep/ .el-form-item__label {
    font-weight: 600;
    color: #000000;
  }

  /deep/ .growth-container-top .el-form-item {
    margin-bottom: 0;
  }

  /deep/ .el-button--primary,
  /deep/ .el-input__inner,
  /deep/ .el-input-group__append {
    font-weight: 600;
  }
}

@media (max-width: 1200px) {
  .growth-form-container {
    padding: 20px 10px;
  }
}
</style>
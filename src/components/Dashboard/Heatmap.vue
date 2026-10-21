<template>
 <div class="col-md-12">
  <div class="page-title" v-show="large">
    <h1 style="padding: 15px 0 15px;">
      Optix Heatmap
    </h1>
  </div>
  <p>The Optix Heatmap shows all of our Optimism Index indicators in a heatmap
   format. Optix readings can be seen by hovering over the heatmap.
   Additionally, if you click a lable or box, you'll be taken to that Optix
   chart.
   <span v-show="!large">To view a larger version of this chart, <a
    href="/dashboard/heatmap"> click here</a>.</span>
          </p>
    <div style="text-align: center; margin-bottom: 20px;">
      Moving Average:
      <div class="btn-group heatmap-moving-average-buttons" role="group">
        <button
          v-for="(averageDays, index) in movingAverages"
          :key="index"
          type="button"
          class="btn grey-cascade"
          :class="{ active: index === selectedMovingAverageIndex }"
          @click="handleMovingAverageClick(index)"
        >
          <i class="fa fa-check"></i> {{ averageDays }} Days
        </button>
      </div>
    </div>
   <div
     id="HM"
     :style="{
       minWidth: large ? '750px' : '500px',
       width: large ? 'auto' : '900px',
       height: '800px',
       margin: '0 auto'
     }"
   ></div>
 </div>
</template>
<!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> -->
<script>
import Highcharts from 'highcharts';
import HighchartsHeatmap from 'highcharts/modules/heatmap';
import HighchartsTreemap from 'highcharts/modules/treemap';
import { isJson } from "@/utils";

// ColorAxis is provided by the heatmap module and is also used by treemaps.
HighchartsHeatmap(Highcharts);
HighchartsTreemap(Highcharts);

export default {
  props: {
    heatmap_data: String,
    large: Boolean
  },
  data() {
    return {
      movingAverages: [0, 3, 5, 10, 20, 50, 100, 200],
      selectedMovingAverageIndex: 0, // Default to the first moving average
    };
  },
  computed: {
    _heatmap_data() {
      return isJson(this.heatmap_data) ? JSON.parse(this.heatmap_data) : this.heatmap_data
    }
  },
  methods: {
    // Format the heatmap data
    formatData(data) {
      
      const thumbnailBase = 'https://d1wrgh3h32hjn2.cloudfront.net/';
      return data.map(item => ({
        name: item[0],
        link: item[1],
        value: item[2],
        colorValue: item[3],
        thumbnail: thumbnailBase + item[1] + '_250.png',
      }));
    },
    
    // Create the Highcharts heatmap
    createHeatMap(data) {
      console.log('data', data)
      const chartContainer = document.getElementById("HM");
      if (!chartContainer) {
        console.error("❌ Highcharts 容器 #HM 未找到");
        return;
      }
      if (!data || data.length === 0) {
        console.error("❌ Heatmap 数据为空");
        return;
      }
      console.log("✅ Highcharts 容器已找到，准备渲染图表...");
      const baseUrl = "/backtester/sr/setup";

      Highcharts.chart('HM', {
        credits: {
          enabled: true,
          text: "SENTIMENTRADER",
          href: '#',
          position: { align: 'right', y: -50 }
        },
        tooltip: {
          style: { fontWeight: 'bold', fontSize: '2em' },
        },
        colorAxis: {
          stops: [
            [0, '#41A317'], // 极端悲观（绿色）
            [0.2, '#89C35C'], // 较强的悲观（浅绿色）
            [0.3, '#99C68E'], // 中等的悲观（淡绿）
            [0.5, '#FFF8DC'], // 中立
            [0.7, '#E18B6B'], // 较强的乐观（橙色）
            [0.8, '#F75D59'], // 极端乐观（红色）
            [0.9, '#FF0000']  // 非常乐观（红色）
          ],
          min: 1,  // 设置最小值
          max: 7, // 设置最大值
          tickInterval: 1,
          labels: {
            step: 6,
            enabled: true,
            formatter: function () {
              return this.value === 1 ? "Extreme Pessimism" : "Extreme Optimism";
            }
          }
        },
        exporting: {
          sourceWidth: 1000,
          sourceHeight: 800,
          style: { fontFamily: "Open Sans , sans-serif" },
          printButton: { enabled: false },
          filename: 'sentimenTrader_Optix_Heatmap',
          EnableImages: true,
          chartOptions: {
            navigator: { enabled: false },
            rangeSelector: { enabled: false },
            scrollbar: { enabled: false },
            chart: { renderTo: 'container', backgroundColor: '#fff', plotBackgroundColor: '#fff' },
          }
        },
        chart: {
          style: { fontFamily: "Open Sans , sans-serif" },
          alignTicks: false,
        },
        plotOptions: {
          series: {
            cursor: 'pointer',
            point: {
              events: {
                click() {
                  if (!this.options.link) {
                    console.warn("❌ 缺少 link，无法跳转");
                    return;
                  }
                  window.open(baseUrl + `?index=${'Unknown'}&indicator=${this.options.link}`, "_self");
                },
                mouseOver(e) {
                  const x = e.target.plotX;
                  const y = e.target.plotY;
                  const offset = document.getElementById('HM').getBoundingClientRect();
                  let pos_left = offset.left + x;
                  if (pos_left > window.innerWidth / 2) pos_left -= 250;
                  let pos_top = offset.top + y - 170;
                  if (pos_top < window.innerHeight / 2) pos_top += 270;
                  const html = `
                    <div class="chart-thumb" style="position: fixed; max-width: 400px; min-width: 400px; top: ${pos_top}px; left: ${pos_left}px; z-index: 1000;">
                      <img src="${this.options.thumbnail}" style="width: 100%; display: block;" onload="$(this).css({'border': '1px solid #c2c2c2', 'box-shadow': '2px 2px 4px #595959'}).show();" />
                    </div>
                  `;
                  document.body.insertAdjacentHTML('afterbegin', html);
                },
                mouseOut() {
                  const thumb = document.querySelector('.chart-thumb');
                  if (thumb) thumb.remove();
                }
              }
            }
          },
          treemap: {
            turboThreshold: 1800 // 设置更高的限制，比如 5000
          }
        },
        series: [{
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          data: data,
          colorKey: 'colorValue',
          dataLabels: { enabled: true, shadow: false }
        }],
        title: { text: 'Optimism Index Heatmap' }
      });
    },
    
    // Handle the selection of a moving average button
    handleMovingAverageClick(index) {
      this.selectedMovingAverageIndex = index;
      const formattedData = this.formatData(this._heatmap_data[index]);
      this.createHeatMap(formattedData);
    },

    // Initialize the component with data
    initializeHeatMap() {
      // Make sure heatmap data is available
      console.log('_heatmap_data', this._heatmap_data)
      if (this._heatmap_data && this._heatmap_data.length > 0) {
        const formattedData = this.formatData(this._heatmap_data[0]);
        console.log('formattedData', formattedData)
        this.createHeatMap(formattedData);
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeHeatMap();
    })
  }
};
</script>
<style lang="less" scoped>
.heatmap-moving-average-buttons {
}

.heatmap-moving-average-buttons .btn {
  margin: 0 5px;
}

.heatmap-moving-average-buttons .active {
  background-color: #007bff;
  color: white;
}

.chart-thumb img {
  width: 100%;
  display: none;
}
@import "./index.less";
</style>

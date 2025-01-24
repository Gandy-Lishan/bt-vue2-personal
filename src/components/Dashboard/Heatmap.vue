<template>
 <div class="col-md-12">
  <p>The Optix Heatmap shows all of our Optimism Index indicators in a heatmap
   format. Optix readings can be seen by hovering over the heatmap.
   Additionally, if you click a lable or box, you'll be taken to that Optix
   chart. To view a larger version of this chart, <a
           href="#"> click here</a>.</p>
   <p>Moving Average:</p>
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
   <div id="HM" style="min-width: 750px; height: 800px; margin: 0 auto"></div>
 </div>
</template>
<script>
import Highcharts from 'highcharts';
import HighchartsTreemap from 'highcharts/modules/treemap';

// Ensure the Highcharts Treemap module is loaded
HighchartsTreemap(Highcharts);

export default {
  data() {
    return {
      heatmapData: [], // This will hold formatted data for Highcharts
      movingAverages: [0, 3, 5, 10, 20, 50, 100, 200],
      selectedMovingAverageIndex: 0, // Default to the first moving average
    };
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
      const baseUrl = "/users/charts/";

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
          min: 0,  // 设置最小值
          max: 10, // 设置最大值
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
                  const href = baseUrl + this.options.link;
                  window.open(href, "_self");
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
                      <img src="${this.options.thumbnail}" style="width: 100%; display: none;" onload="$(this).css({'border': '1px solid #c2c2c2', 'box-shadow': '2px 2px 4px #595959'}).show();" />
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
          }
        },
        series: [{
          type: 'treemap',
          layoutAlgorithm: 'squarified',
          data: data,
          dataLabels: { enabled: true, shadow: false }
        }],
        title: { text: 'Optimism Index Heatmap' }
      });
    },
    
    // Handle the selection of a moving average button
    handleMovingAverageClick(index) {
      this.selectedMovingAverageIndex = index;
      const formattedData = this.formatData(this.heatmapData[index]);
      console.log('formattedData', formattedData)
      const formattedData = [
        { name: "Market A", link: "marketA", value: 67, colorValue: 5 },  // 调整 colorValue 的值
        { name: "Market B", link: "marketB", value: 4, colorValue: 6 },
        { name: "Market C", link: "marketC", value: 7, colorValue: 3 },
        { name: "Market D", link: "marketD", value: 2, colorValue: 2 },
        { name: "Market E", link: "marketE", value: 6, colorValue: 4 }
      ];
      this.createHeatMap(formattedData);
    },

    // Initialize the component with data
    initializeHeatMap() {
      // Make sure heatmap data is available
      if (this.heatmapData && this.heatmapData.length > 0) {
        const formattedData = this.formatData(this.heatmapData[0]);
        this.createHeatMap(formattedData);
      }
    }
  },
  mounted() {
   console.log('heatmap')
   const heatmapData = [
    {
     name: 'A',
     value: 67,
     colorValue: 0.2
    }
];
this.heatmapData = heatmapData
// 假数据解释:
// "Market" (字符串): 市场名称
// "marketX" (字符串): 用于跳转的链接或唯一标识符
// "X" (数字): 市场的得分值，用于决定热力图的颜色 (1-7)
// "Y" (数字): 用于热力图的颜色数值，这里表示一个值的颜色偏移
    // Initialize the heatmap with the data passed from the server (e.g., Django template)
    // this.heatmapData = window.heatmap_data || [];
    this.initializeHeatMap();
  }
};
</script>
<style scoped>
.heatmap-moving-average-buttons {
  margin-bottom: 20px;
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
</style>
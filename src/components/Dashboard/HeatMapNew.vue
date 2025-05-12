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
<!-- <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script> -->
<script>
import Highcharts from 'highcharts';
import HighchartsTreemap from 'highcharts/modules/treemap';

// Ensure the Highcharts Treemap module is loaded
HighchartsTreemap(Highcharts);

export default {
  props: {
    heatmap_data: String
  },
  data() {
    return {
      movingAverages: [0, 3, 5, 10, 20, 50, 100, 200],
      selectedMovingAverageIndex: 0, // Default to the first moving average
    };
  },
  computed: {
    _heatmap_data() {
      return JSON.parse(this.heatmap_data)
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
      const baseUrl = "/users/charts/";

      Highcharts.chart('HM', {
      series: [{
          type: 'treemap',
          layoutAlgorithm: 'stripes',
          alternateStartingDirection: true,
          borderColor: '#fff',
          borderRadius: 6,
          borderWidth: 2,
          dataLabels: {
              style: {
                  textOutline: 'none'
              }
          },
          levels: [{
              level: 1,
              layoutAlgorithm: 'sliceAndDice',
              dataLabels: {
                  enabled: true,
                  align: 'left',
                  verticalAlign: 'top',
                  style: {
                      fontSize: '15px',
                      fontWeight: 'bold'
                  }
              }
          }],
          data: [{
              id: 'A',
              name: 'Nord-Norge',
              color: '#50FFB1'
          }, {
              id: 'B',
              name: 'Trøndelag',
              color: '#F5FBEF'
          }, {
              id: 'C',
              name: 'Vestlandet',
              color: '#A09FA8'
          }, {
              id: 'D',
              name: 'Østlandet',
              color: '#E7ECEF'
          }, {
              id: 'E',
              name: 'Sørlandet',
              color: '#A9B4C2'
          }, {
              name: 'Troms og Finnmark',
              parent: 'A',
              value: 70923
          }, {
              name: 'Nordland',
              parent: 'A',
              value: 35759
          }, {
              name: 'Trøndelag',
              parent: 'B',
              value: 39494
          }, {
              name: 'Møre og Romsdal',
              parent: 'C',
              value: 13840
          }, {
              name: 'Vestland',
              parent: 'C',
              value: 31969
          }, {
              name: 'Rogaland',
              parent: 'C',
              value: 8576
          }, {
              name: 'Viken',
              parent: 'D',
              value: 22768
          }, {
              name: 'Innlandet',
              parent: 'D',
              value: 49391
          },
          {
              name: 'Oslo',
              parent: 'D',
              value: 454
          },
          {
              name: 'Vestfold og Telemark',
              parent: 'D',
              value: 15925
          },
          {
              name: 'Agder',
              parent: 'E',
              value: 14981
          }]
      }],
      title: {
          text: 'Norwegian regions and counties by area',
          align: 'left'
      },
      subtitle: {
          text:
              'Source: <a href="https://snl.no/Norge" target="_blank">SNL</a>',
          align: 'left'
      },
      tooltip: {
          useHTML: true,
          pointFormat:
              'The area of <b>{point.name}</b> is <b>{point.value} km<sup>' +
              '2</sup></b>'
      }
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
<template>
  <div ref="chartContainer"></div>
</template>

<script>
import Highcharts from "highcharts";

export default {
  data() {
    return {
      chart: null,
    };
  },
  mounted() {
    // 创建图表
    this.chart = Highcharts.chart(this.$refs.chartContainer, {
      chart: {
        type: "candlestick", // 使用股票图类型（蜡烛图）
      },
      title: {
        text: "股票图表",
      },
      xAxis: {
        title: {
          text: "Day Of The Month",
        },
        categories: this.getCategories(data),
        plotLines: [
          {
            value: 0,
            color: "gray",
            dashStyle: "dash",
            width: 2,
            zIndex: 4,
            label: {
              text: "0",
            },
          },
        ],
        gridLineWidth: 1,
        gridLineDashStyle: "dash",
      },
      yAxis: [
        {
          title: {
            text: "Average Return",
          },
          min: -0.5,
          max: 0.5,
          tickInterval: 0.1,
          labels: {
            format: "{value}",
          },
          reversed: true,
          plotLines: [
            {
              value: 0,
              color: "gray",
              dashStyle: "dash",
              width: 2,
              zIndex: 4,
              label: {
                text: "0",
              },
            },
          ],
          gridLineDashStyle: "dash",
        },
        {
          title: {
            text: "% Of Time Positive",
          },
          opposite: true,
          min: 0,
          max: 100,
          tickInterval: 10,
          labels: {
            format: "{value}%",
          },
          plotLines: [
            {
              value: 50,
              color: "gray",
              dashStyle: "dash",
              width: 2,
              zIndex: 4,
              label: {
                text: "50%",
              },
            },
          ],
          gridLineDashStyle: "dash",
        },
      ],
      series: [
        {
          type: "candlestick", // 使用蜡烛图
          name: "股票数据",
          data: this.formatCandlestickData(data),
          color: "green", // 设置绿色，可根据条件动态设置
          upColor: "red", // 设置红色，可根据条件动态设置
          lineColor: "blue", // 设置线的颜色
          dataGrouping: {
            groupPixelWidth: 5,
          },
        },
        {
          name: "Average Return",
          type: "spline", // 使用折线图
          data: this.formatData(data),
          lineWidth: 2,
          marker: {
            enabled: false,
          },
          color: "blue",
        },
      ],
      tooltip: {
        shared: true,
        crosshairs: true,
        formatter: function () {
          // 显示 "% Of Time Positive" 和 "Average Return" 的值
          return (
            "Day Of The Month: " +
            this.x +
            "<br>Average Return: " +
            this.points[1].y +
            "<br>% Of Time Positive: " +
            this.points[0].y
          );
        },
      },
    });
  },
  methods: {
    formatCandlestickData(data) {
      return data.map((item) => [
        item[2], // x 值
        item[3], // 开盘价
        item[3], // 最低价
        item[3], // 最高价
        item[1], // 收盘价
      ]);
    },
    formatData(data) {
      return data.map((item) => [item[2], item[1]]);
    },
    getCategories(data) {
      return data.map((item) => item[2]);
    },
  },
};
</script>

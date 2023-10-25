<template>
  <div id="chartContainer"></div>
</template>

<script>
import Highcharts from "highcharts";
import data from "./mock";
export default {
  data() {
    return {
    };
  },
  mounted() {
    const H = Highcharts;

    const categories = data.map((item) => item[2]);

    const chartOptions = {
      chart: {
        type: "column",
        renderTo: "chartContainer",
      },
      title: {
        text: "Seasonality in the SPX",
        style: {
          fontWeight: "bold",
          fontFamily: "Arial",
        },
      },
      subtitle: {
        text: "Month of May",
      },
      xAxis: {
        categories: categories,
        gridLineWidth: 1,
        gridLineDashStyle: "Dash",
        tickPixelInterval: 1,
        title: {
          text: "Day of the month",
        },
      },
      yAxis: [
        {
          gridLineDashStyle: "Dash",
          labels: {
            format: "{value}",
            style: {
              color: H.getOptions().colors[1],
            },
          },
          gridLineWidth: 0,
          title: {
            text: "Average Return",
            style: {
              color: H.getOptions().colors[1],
            },
          },
        },
        {
          tickPositions: Array.from({ length: 11 }, (_, i) => (i * 0.1).toFixed(1)),
          gridLineDashStyle: "Dash",
          labels: {
            format: "{value} %",
            style: {
              color: H.getOptions().colors[1],
            },
          },
          title: {
            text: "% of Time Positive",
            style: {
              color: H.getOptions().colors[1],
            },
          },
          opposite: true,
        },
      ],
      tooltip: {
        shared: true,
      },
      legend: {
        layout: "horizontal",
        verticalAlign: "top",
        align: "right",
        x: -60,
        y: 20,
        floating: true,
        backgroundColor: (H.theme && H.theme.legendBackgroundColor) || "#FFFFFF",
      },
    };

    if (true) {
      chartOptions.yAxis[0].tickPositions = Array.from(
        { length: 11 },
        (_, i) => (i * 0.1).toFixed(1)
      );
    }

    if (true) {
      chartOptions.tooltip.formatter = function () {
        return (
          "<b>Day: " +
          this.x +
          "</b><br/>" +
          "\u25CF " +
          this.points[0].color +
          "Avg Return (%): " +
          this.points[0].y +
          "<br/>" +
          "\u25CF " +
          this.points[1].color +
          "Percent Positive (%) " +
          this.points[1].y
        );
      };
    }

    const chart = H.chart("chartContainer", chartOptions);

    const positiveColor = "#00B050";
    const negativeColor = "#C0504D";

    const tData = data.map((item) => item[1]);
    const dataWithColor = [];

    tData.forEach((value) => {
      const color = value >= 0 ? positiveColor : negativeColor;
      dataWithColor.push({ y: value, color });
    });

    chart.addSeries({
      data: dataWithColor,
      type: "column",
      name: "Average Return",
      yAxis: 0,
      marker: {
        enabled: true,
      },
      dashStyle: "shortdot",
      color: positiveColor,
      plotOptions: {
        zones: [
          {
            value: 0,
            color: negativeColor,
          },
          {
            color: positiveColor,
          },
        ],
      },
    });

    chart.addSeries({
      data: data.map((item) => item[3] * 100),
      type: "line",
      name: "Percent Positive",
      yAxis: 1,
      color: "#01017D",
      marker: {
        enabled: true,
        radius: 5,
        symbol: "diamond",
      },
    });
  },
};
</script>

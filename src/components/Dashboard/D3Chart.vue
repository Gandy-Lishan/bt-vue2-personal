<template>
  <div>
    <svg v-bind:class="chartClass" ref="chartContainer"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  props: {
    chartClass: {
      type: String,
      required: true,
    },
    dataName: {
      type: String,
      required: true,
    },
    middleValue: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      barchartCache: {},
    };
  },
  mounted() {
    this.loadChart(this.dataName, this.renderChart);
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    handleResize() {
      this.loadChart(this.dataName, this.renderChart);
    },
    loadChart(dataName, callback) {
      if (this.barchartCache[dataName]) {
        callback(false, this.barchartCache[dataName]);
      } else {
        d3.json(dataName, (error, data) => {
          if (!error) {
            this.barchartCache[dataName] = data;
            callback(false, this.barchartCache[dataName]);
          }
        });
      }
    },
    renderChart(error, data) {
      if (error) {
        console.error('Error loading chart data');
        return;
      }

      const chartContainer = this.$refs.chartContainer;
      const maxWidth = window.innerWidth >= 1200 ? 575 : window.innerWidth >= 992 ? 435 : window.innerWidth;
      const margin = { top: 0, right: 75, bottom: 0, left: 40 };
      const width = maxWidth - margin.left - margin.right;
      const height = data.length * 20 - margin.top - margin.bottom;

      // x and y convenience functions
      const x = d3.scale.ordinal()
        .rangeRoundBands([0, height], 0.3)
        .domain(data.map(d => d.name));
      const y = d3.scale.linear()
        .range([200, width])
        .domain([
          Math.min(0, d3.min(data, d => d.value)),
          Math.max(100, d3.max(data, d => d.value)),
        ]);

      // Create chart (or replace chart if one is already there)
      d3.select(chartContainer).selectAll("*").remove(); // Clear previous chart
      const chart = d3.select(chartContainer)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      // Render bars
      chart.selectAll('.bar')
        .data(data)
        .enter()
        .append('rect')
        .attr('fill', d => (d.value < this.middleValue ? '#63be7b' : '#da8a8a'))
        .attr('y', d => x(d.name) - 8)
        .attr('x', d => (d.value < this.middleValue ? y(d.value) : y(this.middleValue)))
        .attr('width', d => {
          let mWidth = y(d.value) - y(this.middleValue);
          if (d.value < this.middleValue) {
            mWidth = y(this.middleValue) - y(d.value);
          }
          return mWidth < 0 ? 0 : mWidth;
        })
        .attr('height', x.rangeBand());

      // Render values on bars
      chart.selectAll('.values')
        .data(data)
        .enter()
        .append('text')
        .attr('class', 'values')
        .attr('y', d => x(d.name))
        .attr('x', d => {
          const posX = d.value < this.middleValue ? y(d.value) : y(this.middleValue);
          return d.value < this.middleValue ? posX - 5 : posX + 5;
        })
        .style('text-anchor', d => (d.value < this.middleValue ? 'end' : 'start'))
        .attr('dy', '.35em')
        .text(d => Math.round(d.value));

      // Middle line
      chart.append('line')
        .attr('x1', y(this.middleValue))
        .attr('y1', 5)
        .attr('x2', y(this.middleValue))
        .attr('y2', height - 25)
        .attr('stroke-width', 0.5)
        .attr('stroke', '#d9d9d9');
    },
  },
};
</script>

<style scoped>
/* 添加你的样式 */
</style>

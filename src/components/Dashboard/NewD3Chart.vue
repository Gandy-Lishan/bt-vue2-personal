<template>
 <div class="chart-container">
   <svg :class="chartClass" ref="chartSvg"></svg>
  <!-- 图片弹出框 -->
  <div v-if="hoveredImageUrl" class="hover-image" 
    :style="{ top: imagePosition.top + 'px', left: imagePosition.left + 'px' }">
    <img :src="hoveredImageUrl" alt="Indicator Image">
  </div>
 </div>
</template>

<script>
import * as d3 from "d3";
import { isJson } from "@/utils";

export default {
 name: 'NewD3Chart',
 props: {
   chartClass: {
     type: String,
     required: true
   },
   dataUrl: {
     type: String,
     required: true
   },
   middleValue: {
     type: Number,
     default: 50
   },
   data: String
 },
 data() {
   return {
    showImage: false,
    imageSrc: "",
    imageStyle: {
      position: "fixed",
      top: "0px",
      left: "0px",
      border: "1px solid #ddd",
      background: "white",
      boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
      padding: "5px",
      display: "none",
    },
    hoveredImageUrl: '',
    imagePosition: { top: 0, left: 0 } // 图片位置
   };
 },
 watch: {
   // 当 dataUrl 变化时，重新加载数据
   dataUrl: "loadChart",
 },
 computed: {
  chartData() {
   const data = isJson(this.data) ? JSON.parse(this.data) : this.data
   return data
  }
 },
 mounted() {
   this.loadChart();
   window.addEventListener("resize", this.debouncedResize);
 },
 beforeDestroy() {
   window.removeEventListener("resize", this.debouncedResize);
 },
 methods: {
   async loadChart() {
     try {
      if(!this.dataUrl) return
      // const fetchData = async (url) => {
      //   try {
      //     const response = await fetch(url, {
      //       method: "GET",
      //       headers: {
      //         "Accept": "application/json",
      //         "User-Agent": "Mozilla/5.0" // 伪装成浏览器请求
      //       },
      //       credentials: "include" // 发送 cookies（如果 API 需要登录）
      //     });

      //     if (!response.ok) throw new Error(`HTTP 错误！状态码: ${response.status}`);

      //     const data = await response.json();
      //     console.log("数据加载成功:", data);
      //     return data;
      //   } catch (error) {
      //     console.error("数据请求失败:", error);
      //     return null;
      //   }
      // }
      //  const data = await fetchData(`https://sentimentrader.com${this.dataUrl}.json`);
      //  this.chartData = data;
       this.renderChart();
     } catch (error) {
       console.error("数据加载失败:", error);
     }
   },
   renderChart() {
    console.log('lishan this.chartData', this.chartData)
     if (!this.chartData.length) return;

     // 清空 SVG
     d3.select(this.$refs.chartSvg).selectAll("*").remove();

     // 计算 SVG 宽高
     let max_width = window.innerWidth;
     if (max_width >= 992) max_width = 435;
     if (max_width >= 1200) max_width = 575;

     const margin = { top: 0, right: 75, bottom: 0, left: 40 };
     const width = max_width - margin.left - margin.right;
     const height = this.chartData.length * 22 - margin.top - margin.bottom;

     // x 和 y 轴
     const x = d3.scaleBand()
       .range([0, height])
       .domain(this.chartData.map(d => d.name))
       .padding(0.3);

     const y = d3.scaleLinear()
       .range([200, width])
       .domain([
         Math.min(0, d3.min(this.chartData, d => d.value)),
         Math.max(100, d3.max(this.chartData, d => d.value))
       ]);

     // 创建 SVG
     const svg = d3.select(this.$refs.chartSvg)
       .attr("width", width + margin.left + margin.right)
       .attr("height", height + margin.top + margin.bottom)
       .append("g")
       .attr("transform", `translate(${margin.left}, ${margin.top})`);

     // 指标名称
     if(['short_indicators', 'int_indicators'].includes(this.chartClass)) {
      svg.selectAll(".bar-label")
       .data(this.chartData)
       .enter()
       .append("text")
       .attr("class", "bar-label")
       .attr("y", d => x(d.name))
       .attr("x", 120)
       .style("text-anchor", "end")
       .attr("dy", ".35em")
       .text(d => d.name);
     }else {
      svg.selectAll('.bar-label')
        .data(this.chartData)
        .enter()
        .append('a')
        .attr('class', 'bar-label')
        .attr('xlink:href', d => `/backtester/sr/setup?index=${'Unknown'}&indicator=${d.url}`)
        .append('text')
        .attr('y', d => x(d.name) + x.bandwidth() / 2)
        .attr('x', 120)
        .style('text-anchor', 'end')
        .attr('dy', '.35em')
        .text(d => d.name)
        .on('mouseover', (event, d) => {
          console.log('lishan 触发 event', event, d.url)
          this.hoveredImageUrl = `https://d1wrgh3h32hjn2.cloudfront.net/${d.url}_250.png`; // 生成图片 URL
          this.imagePosition = { 
            top: event.clientY + 30, // 鼠标位置 +10 像素，防止遮挡
            left: event.clientX + 10
          };
        })
        .on('mouseout', () => {
          this.hoveredImageUrl = "";
        });
      // svg.selectAll(".bar-label")
      //  .data(this.chartData)
      //  .enter()
      //  .append("text")
      //  .attr("class", "bar-label")
      //  .attr("y", d => x(d.name))
      //  .attr("x", 120)
      //  .style("text-anchor", "end")
      //  .attr("dy", ".35em")
      //  .text(d => d.name);
     }


     // 数值
     svg.selectAll(".value-text")
       .data(this.chartData)
       .enter()
       .append("text")
       .attr("class", "value-text")
       .attr("y", d => x(d.name))
       .attr("x", d => d.value < this.middleValue ? y(d.value) - 5 : y(d.value) + 5)
       .style("text-anchor", d => d.value < this.middleValue ? "end" : "start")
       .attr("dy", ".35em")
       .text(d => Math.round(parseFloat(d.value)));

     // 中间分隔线
     svg.append("line")
       .attr("x1", y(this.middleValue))
       .attr("y1", 5)
       .attr("x2", y(this.middleValue))
       .attr("y2", height - 25)
       .attr("stroke-width", 0.5)
       .attr("stroke", "#d9d9d9");

     // 柱状条
     svg.selectAll(".bar")
       .data(this.chartData)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("fill", d => d.value < this.middleValue ? "#63be7b" : "#da8a8a")
       .attr("y", d => x(d.name) - 8)
       .attr("x", d => d.value < this.middleValue ? y(d.value) : y(this.middleValue))
       .attr("width", d => Math.abs(y(d.value) - y(this.middleValue)))
       .attr("height", x.bandwidth());
   },
   debouncedResize() {
     this.renderChart();
   },
 }
};
</script>

<style scoped>
.chart-container {
 width: 100%;
 overflow: hidden;
}

.bar-label {
 font-size: 12px;
 fill: #333;
}

.value-text {
 font-size: 10px;
 fill: #666;
}

.bar {
 stroke: #fff;
 stroke-width: 0.5px;
}
.tooltip {
  position: absolute;
  z-index: 200;
  background-color: white;
  border: 1px solid #ccc;
  padding: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
.hover-image {
  position: fixed;
  z-index: 1000;
}

.hover-image img {
  max-width: 300px; /* 控制图片大小 */
  max-height: 300px;
}
</style>
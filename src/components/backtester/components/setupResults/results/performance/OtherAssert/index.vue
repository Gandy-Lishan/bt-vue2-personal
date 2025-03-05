<template>
 <div class="otherIndexContainer">
 <br>
 <div class="page-content-wrapper">
 <table class="tg indexTable">
  <thead>
   <tr>
    <template v-for="(l, i) in ['Index or Asset', ...defaultTableLabels]">
     <th class="tg-0lax" :key="i" v-html="headerKeyMap[l]" :width="l === 'Median % Return' ? '230px' : '100px'"></th>
    </template>
   </tr>
  </thead>
  <!-- <template v-for="(item, index) in medianReturn">
   <tr :key="index">
    <template v-for="(val, key, i) in item">
     <td class="tg-0lax" :key="i" v-if="key !== 'Median % Return'">{{ !isNaN(val) ? val : '' }}</td>
     <td class="tg-0lax" :key="i" v-else>{{ val }}</td>
    </template>
   </tr>
 </template> -->
 <tbody id="table-body"></tbody>
</table>
 </div>
</div>
</template>

<script>
export default {
 name: 'OtherAssert',
 props: {
  OtherAssert: Object,
  rowFrequency: String
 },
data() {
 return {
  headerKeyMap: {
  'Index or Asset': 'Index or Asset',
  '1 Week Later': `1 Week<br/>Later`,
  '2 Weeks Later': '2 Weeks<br/>Later',
  '1 Month Later': '1 Month<br/>Later',
  '2 Months Later': '2 Months<br/>Later',
  '3 Months Later': '3 Months<br/>Later',
  '6 Months Later': '6 Months<br/>Later',
  '9 Months Later': '9 Months<br/>Later',
  '1 Year Later': '1 Year<br/>Later',
  '2 Years Later': '2 Years<br/>Later',
  '3 Years Later': '3 Years<br/>Later',
  },
  defaultTableLabels: [
  '1 Week Later',
  '2 Weeks Later',
  '1 Month Later',
  '2 Months Later',
  '3 Months Later',
  '6 Months Later',
  '1 Year Later'
  ],
  medianReturn: [],
  consistency: [],
 }
},
 methods: {
  prepareData(OtherAssert) {
  const frequency = this.rowFrequency
  switch (frequency) {
   case 'Daily':
    this.defaultTableLabels = [
     '1 Week Later',
     '2 Weeks Later',
     '1 Month Later',
     '2 Months Later',
     '3 Months Later',
     '6 Months Later',
     '1 Year Later'
    ]
    break
   case 'Weekly':
     this.defaultTableLabels = [
     '1 Week Later',
     '2 Weeks Later',
     '1 Month Later',
     '2 Months Later',
     '3 Months Later',
     '6 Months Later',
     '1 Year Later'
    ]
    break
   case 'Monthly':
    this.defaultTableLabels = [
     '1 Month Later',
     '3 Months Later',
     '6 Months Later',
     '9 Months Later',
     '1 Year Later',
     '2 Years Later',
     '3 Years Later'
    ]
    break
   default:
       this.defaultTableLabels = [
     '1 Week Later',
     '2 Weeks Later',
     '1 Month Later',
     '2 Months Later',
     '3 Months Later',
     '6 Months Later',
     '1 Year Later'
    ]
    break
  }
  this.generateTable(OtherAssert)
  },
  generateTable(otherAssert) {
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = ''; // 清空现有数据

  let rowIndex = 0; // 追踪当前行数，确保阴影交替

  Object.entries(otherAssert).forEach(([assetName, data]) => {
    // 1️⃣ 创建资产名称占一行
    const assetRow = document.createElement("tr");
    const assetCell = document.createElement("td");
    assetCell.innerHTML = `<strong>${assetName}</strong>`;
    assetCell.colSpan = 11; // 让它占满整行
    assetRow.appendChild(assetCell);

    // **添加阴影到偶数行**
    if (rowIndex % 2 === 0) {
      assetRow.classList.add("shadow-row");
    }

    tableBody.appendChild(assetRow);
    rowIndex++; // 计数 +1

    // 2️⃣ 创建 % Positive, Mean, Median 行
    Object.entries(data).forEach(([metric, values]) => {
      const row = document.createElement("tr");

      // 第一列：只显示指标名称
      const metricCell = document.createElement("td");
      metricCell.classList.add("asset-td");
      metricCell.innerHTML = metric;
      row.appendChild(metricCell);

      // 剩余列：填充数组数据
      for (let i = 0; i < this.defaultTableLabels.length; i++) {
        const cell = document.createElement("td");
        cell.classList.add("align-center", "bold-text", "asset-td");
        cell.innerHTML = values[i] !== undefined ? values[i] : '-';
        row.appendChild(cell);
      }

      // **添加阴影到偶数行**
      if (rowIndex % 2 === 0) {
        row.classList.add("shadow-row");
      }

      tableBody.appendChild(row);
      rowIndex++; // 计数 +1
    });
  });
},
exportData() {
  const otherAssert = this.OtherAssert;
  let sheetData = [];

  // 直接遍历数据，避免重复的表头
  Object.entries(otherAssert).forEach(([assetName, data]) => {
    // **资产名称单独占一行**
    const assetRow = { "Index or Asset": assetName };
    this.defaultTableLabels.forEach(label => {
      assetRow[label] = ""; // 其余列为空
    });
    sheetData.push(assetRow);

    // **添加 % Positive, Mean, Median 行**
    Object.entries(data).forEach(([metric, values]) => {
      const row = { "Index or Asset": metric }; // 第一列：指标名称

      // 填充数据，确保列数对齐
      for (let i = 0; i < this.defaultTableLabels.length; i++) {
        row[this.defaultTableLabels[i]] = values[i] !== undefined ? values[i] : "-";
      }

      sheetData.push(row);
    });
  });

  return sheetData;
}
}
}
</script>

<style lang="less" scoped>
.page-content-wrapper {
width: 900px;
margin: 0 auto;
}
</style>
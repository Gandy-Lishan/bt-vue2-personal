<template>
  <div class="otherIndexContainer">
		<br>
		<div class="page-content-wrapper">
		<table class="tg indexTable">
		<tbody>
			<tr>
			<template v-for="(l, i) in ['Median % Return', ...defaultTableLabels]">
				<th class="tg-0lax" :key="i" v-html="headerKeyMap[l]"></th>
			</template>
			</tr>
			<template v-for="(item, index) in medianReturn">
				<tr :key="index">
					<template v-for="(val, key, i) in item">
						<td class="tg-0lax" :key="i" :class="`${getColor(val)}`" v-if="key !== 'Median % Return'">{{ val }}</td>
						<td class="tg-0lax" :key="i" v-else>{{ val }}</td>
					</template>
				</tr>
		</template>
		</tbody>
	</table>
	<br>
	<table class="tg indexTable">
		<tbody>
			<tr>
			<template v-for="(l, i) in ['Consistency', ...defaultTableLabels]">
				<th class="tg-0lax" :key="i" v-html="headerKeyMap[l]"></th>
			</template>
			</tr>
			<template v-for="(item, index) in consistency">
				<tr :key="index">
					<template v-for="(val, key, i) in item">
						<td class="tg-0lax" :key="i" :class="`${getConsistencyColor(val)}`" v-if="key !== 'Consistency'">{{ val }}%</td>
						<td class="tg-0lax" :key="i" v-else>{{ val }}%</td>
					</template>
				</tr>
		</template>
		</tbody>
	</table>
		</div>
</div>
</template>

<script>
export default {
  name: 'IndexesInfo',
  props: {
    IndexesInfo: Array,
    rowFrequency: String
  },
	data() {
		return {
			headerKeyMap: {
			'Consistency': 'Consistency',
			'Median % Return': 'Median % Return',
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
			medianReturnMinMax: [],
			consistencyMinMax: []
		}
	},
  methods: {
    prepareData(IndexesInfo) {
      debugger
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
      const transformData = (data, handleKey) =>{
        const _data = []
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const obj = {
                  [handleKey]: key
                }
                data[key][handleKey].forEach((value, index) => {
                    obj[this.defaultTableLabels[index]] = value;
                });

                _data.push(obj);
            }
        }
        return _data
    }
    this.medianReturn = transformData(IndexesInfo, 'Median % Return');
    this.consistency = transformData(IndexesInfo, 'Consistency');
    console.log('medianReturn', this.medianReturn);
    console.log('consistency', this.consistency);
		let medianReturnArray = []
		let consistencyArray = []
		for (const key in IndexesInfo) {
			if (Object.hasOwnProperty.call(IndexesInfo, key)) {
				medianReturnArray = [...medianReturnArray, ...IndexesInfo[key]['Median % Return']]
				consistencyArray = [...consistencyArray, ...IndexesInfo[key]['Consistency']]
			}
		}
		const sortAndDivideArray = (arr) => {
				arr.sort((a, b) => a - b)
				let result = [[], [], [], [], []]
				let chunkSize = Math.ceil(arr.length / 4)
				for (let i = 0; i < arr.length; i++) {
						let chunkIndex = Math.floor(i / chunkSize)
						result[chunkIndex].push(arr[i])
				}
				return result
		}
		this.medianReturnMinMax = sortAndDivideArray(medianReturnArray)
		this.consistencyMinMax = sortAndDivideArray(consistencyArray)
    },
		getColor(value) {
			debugger
			let minMax = this.medianReturnMinMax
			if(!Array.isArray(minMax) || value === undefined)  return ''
			let colors = ['g100', 'g200', 'g300', 'g400', 'g500']; // 颜色数组
			for (let index = 0; index < minMax.length; index++) {
				if(minMax[index].indexOf(value) !== -1) return colors[index]
			}
			return ''
		},
		getConsistencyColor(value) {
			let minMax = this.consistencyMinMax
			if(!Array.isArray(minMax) || value === undefined)  return ''
			let colors = ['g100', 'g200', 'g300', 'g400', 'g500']; // 颜色数组
			for (let index = 0; index < minMax.length; index++) {
				if(minMax[index].indexOf(value) !== -1) return colors[index]
			}
			return ''
		},
		cellStyle({ row, column, rowIndex, columnIndex }) {
			if(columnIndex === 0) return ''
			return `color: ${this.getColor(row[column.property], this.minMax)}`
  	},
		tableRowClassName({row, rowIndex}) {
			console.log('row', row, 'rowIndex', rowIndex)
			for (const key in row) {
				if (Object.hasOwnProperty.call(row, key)) {
					if(key !== 'Median % Return') {
						return `${this.getColor(row[key], this.minMax)}_${rowIndex}` || ''
					}else return ''
				}
			}
		},
		exportData() {
			return {
				medianReturn: this.medianReturn,
				consistency: this.consistency
			}
		}
	}
}
</script>

<style lang="less" scoped>
</style>
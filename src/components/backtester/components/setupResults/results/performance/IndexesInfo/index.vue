<template>
  <div class="otherIndexContainer">
		<br>
		<div class="page-content-wrapper">
		<table class="tg indexTable">
		<tbody>
			<tr>
			<template v-for="(l, i) in ['Median % Return', ...defaultTableLabels]">
				<th class="tg-0lax" :key="i" v-html="headerKeyMap[l]" :width="l === 'Median % Return' ? '230px' : '100px'"></th>
			</template>
			</tr>
			<template v-for="(item, index) in medianReturn">
				<tr :key="index">
					<template v-for="(val, key, i) in item">
						<td class="tg-0lax" :key="i" :class="`${getColor(val)}`" v-if="key !== 'Median % Return'">{{ !isNaN(val) ? displayData(val, 'Median') : '' }}</td>
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
				<th class="tg-0lax" :key="i" v-html="headerKeyMap[l]" :width="l === 'Consistency' ? '230px' : '100px'"></th>
			</template>
			</tr>
			<template v-for="(item, index) in consistency">
				<tr :key="index">
					<template v-for="(val, key, i) in item">
						<td class="tg-0lax" :key="i" :class="`${getConsistencyColor(val)}`" v-if="key !== 'Consistency'">{{ (!isNaN(val) && val !== '') ? `${val}%` : '' }}</td>
						<td class="tg-0lax" :key="i" v-else>{{ val }}</td>
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
			'4 Months Later': '4 Months<br/>Later',
			'5 Months Later': '5 Months<br/>Later',
			'6 Months Later': '6 Months<br/>Later',
			'9 Months Later': '9 Months<br/>Later',
			'1 Year Later': '1 Year<br/>Later',
			'2 Years Later': '2 Years<br/>Later',
			'3 Years Later': '3 Years<br/>Later',
			},
			defaultTableLabels: [
			'1 Month Later',
			'2 Months Later',
			'3 Months Later',
			'4 Months Later',
			'5 Months Later',
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
			const frequency = this.rowFrequency
			switch (frequency) {
				case 'Daily':
					this.defaultTableLabels = [
						'1 Month Later',
						'2 Months Later',
						'3 Months Later',
						'4 Months Later',
						'5 Months Later',
						'6 Months Later',
						'1 Year Later'
					]
					break
				case 'Weekly':
      this.defaultTableLabels = [
						// '1 Week Later',
						// '2 Weeks Later',
						// '1 Month Later',
						// '2 Months Later',
						// '3 Months Later',
						// '6 Months Later',
						// '1 Year Later'
						'1 Month Later',
						'2 Months Later',
						'3 Months Later',
						'4 Months Later',
						'5 Months Later',
						'6 Months Later',
						'1 Year Later'
					]
					break
				case 'Monthly':
					this.defaultTableLabels = [
						// '1 Month Later',
						// '3 Months Later',
						// '6 Months Later',
						// '9 Months Later',
						// '1 Year Later',
						// '2 Years Later',
						// '3 Years Later'
						'1 Month Later',
						'2 Months Later',
						'3 Months Later',
						'4 Months Later',
						'5 Months Later',
						'6 Months Later',
						'1 Year Later'
					]
					break
				default:
        this.defaultTableLabels = [
						// '1 Week Later',
						// '2 Weeks Later',
						// '1 Month Later',
						// '2 Months Later',
						// '3 Months Later',
						// '6 Months Later',
						// '1 Year Later'
						'1 Month Later',
						'2 Months Later',
						'3 Months Later',
						'4 Months Later',
						'5 Months Later',
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
                    obj[this.defaultTableLabels[index]] = (value !== undefined && value !== null && value !== NaN  && value !== 'NaN' && value !== 'null' && value !== 'null%') ? this.displayData(value, 'Consistency') : ''
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
		const splitSortAndDivideArray = (arr) => {
			let positiveNumbers = arr.filter(num => num >= 0)
			let negativeNumbers = arr.filter(num => num < 0)
			positiveNumbers.sort((a, b) => a - b)
			negativeNumbers.sort((a, b) => a - b)
			const divideIntoFiveChunks = (array) => {
					let result = [[], [], [], [], []]
					let chunkSize = Math.ceil(array.length / 5)
					for (let i = 0; i < array.length; i++) {
							let chunkIndex = Math.floor(i / chunkSize)
							result[chunkIndex].push(array[i])
					}
					return result
			}

    // 分别将正数和负数分成五份
    let positiveChunks = divideIntoFiveChunks(positiveNumbers);
    let negativeChunks = divideIntoFiveChunks(negativeNumbers);

    return {
        positive: positiveChunks,
        negative: negativeChunks
    };
}
		this.medianReturnMinMax = splitSortAndDivideArray(medianReturnArray)
		this.consistencyMinMax = splitSortAndDivideArray(consistencyArray)
    },
		getColor(value) {
			let {positive, negative} = this.medianReturnMinMax
			if(!Array.isArray(positive) || !Array.isArray(negative) || value === undefined)  return ''
			let gColors = ['g100', 'g200', 'g300', 'g400', 'g500']
			for (let index = 0; index < positive.length; index++) {
				if(positive[index].indexOf(Number(value)) !== -1) return gColors[index]
			}
			let rColors = ['r100', 'r200', 'r300', 'r400', 'r500']
			for (let index = 0; index < negative.length; index++) {
				if(negative[index].indexOf(Number(value)) !== -1) return rColors[index]
			}
			return ''
		},
		getConsistencyColor(value) {
			let {positive, negative} = this.consistencyMinMax
			if(!Array.isArray(positive) || !Array.isArray(negative) || value === undefined)  return ''
			let gColors = ['g100', 'g200', 'g300', 'g400', 'g500']
			for (let index = 0; index < positive.length; index++) {
				if(positive[index].indexOf(Number(value)) !== -1) return gColors[index]
			}
			let rColors = ['r100', 'r200', 'r300', 'r400', 'r500']
			for (let index = 0; index < negative.length; index++) {
				if(negative[index].indexOf(Number(value)) !== -1) return rColors[index]
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
				_medianReturn: this.medianReturn,
				_consistency: this.consistency
			}
		},
		displayData(data, type) {
			console.log('data', data, 'type', type)
			const numberRegex = /^-?\d+(\.\d+)?$/
			const dateRegex = /^\d{4}-\d{2}-\d{2}$/

			if (numberRegex.test(data)) {
				if(type === 'Median') {
					return parseFloat(data).toFixed(1)
				}else {
					return parseFloat(data)
				}
			} else if (dateRegex.test(data)) {
				return data
			} else if(typeof data == 'string' && data !== 'null' && data !== 'NaN' && data !== 'null%'){
				return data
			}else if(!isNaN(data)){
				return data
			}else {
				return ''
			}
		},
	}
}
</script>

<style lang="less" scoped>
.page-content-wrapper {
	width: 900px;
	margin: 0 auto;
}
@media (max-width: 1200px) {
	.page-content-wrapper {
		width: auto;
	}
}
</style>
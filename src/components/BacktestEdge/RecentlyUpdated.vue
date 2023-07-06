<template>
	<div class="update-container" v-if="isClosed">
		<el-card class="box-card">
			<div slot="header" class="clearfix">
				<div class="top">
					<span class="title">
						<svg
							width="21"
							height="29"
							viewBox="0 0 17 16"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M10.2446 13.0004C10.2446 13.5308 10.0339 14.0395 9.65884 14.4146C9.28377 14.7896 8.77506 15.0004 8.24463 15.0004C7.7142 15.0004 7.20549 14.7896 6.83041 14.4146C6.45534 14.0395 6.24463 13.5308 6.24463 13.0004H10.2446ZM13.2446 12.0004H2.34463C2.1855 12.0004 2.03289 11.9371 1.92036 11.8246C1.80784 11.7121 1.74463 11.5595 1.74463 11.4004C1.74463 11.2412 1.80784 11.0886 1.92036 10.9761C2.03289 10.8636 2.1855 10.8004 2.34463 10.8004H3.24463V7.00036C3.24463 4.58036 4.96463 2.56036 7.24963 2.10036C7.23567 1.96132 7.25101 1.82089 7.29466 1.68814C7.33831 1.55538 7.4093 1.43325 7.50305 1.32962C7.5968 1.22599 7.71123 1.14316 7.83896 1.08647C7.96669 1.02978 8.10488 1.00049 8.24463 1.00049C8.38437 1.00049 8.52257 1.02978 8.6503 1.08647C8.77803 1.14316 8.89246 1.22599 8.98621 1.32962C9.07996 1.43325 9.15095 1.55538 9.19459 1.68814C9.23824 1.82089 9.25359 1.96132 9.23963 2.10036C10.3697 2.33023 11.3857 2.94354 12.1155 3.83648C12.8454 4.72941 13.2443 5.84711 13.2446 7.00036V10.8004H14.1446C14.3038 10.8004 14.4564 10.8636 14.5689 10.9761C14.6814 11.0886 14.7446 11.2412 14.7446 11.4004C14.7446 11.5595 14.6814 11.7121 14.5689 11.8246C14.4564 11.9371 14.3038 12.0004 14.1446 12.0004H13.2446Z"
								fill="#96999F"
							/>
						</svg>
						<span class="notice">Notice</span>
					</span>
					<el-button
						type="text"
						icon="el-icon-close"
						style="color: #666666"
            @click="$emit('click')"
					></el-button>
				</div>
				<div class="btns">
					<el-button type="primary" size="mini" @click="changeNewsType" data-type="Unread">Unread</el-button>
					<el-button size="mini" style="width: 80px" @click="changeNewsType" data-type="All">All</el-button>
				</div>
			</div>
			<div v-if="activeBtn == 'Unread'">
				<div v-for="item in news" :key="item.id" class="news">
					<div class="newsItem" @click="getNewsDetail(item.sectionId)">
						<p>Rencently Updated</p>
						<div class="news-centent">
							<p>{{ item.title }}</p>
							<span class="date">{{ item.date }}</span>
						</div>
						<el-divider></el-divider>
					</div>
				</div>
			</div>
      <div v-else-if="activeBtn == 'All'">
        <div v-for="item in allNews" :key="item.id" class="news">
					<div class="newsItem" @click="getNewsDetail(item.sectionId)">
						<p>Rencently Updated</p>
						<div class="news-centent">
							<p>{{ item.title }}</p>
							<span class="date">{{ item.date }}</span>
						</div>
						<el-divider></el-divider>
					</div>
				</div>
      </div>
		</el-card>
	</div>
</template>

<script>
export default {
  name: 'RecentlyUpdated',
  props: {
    isClosed: {
      type: Boolean
    } 
  },
  data() {
    return {
      activeBtn: 'Unread',
      news: [
        {
          id: 1,
          title: 'Add Symbol OHLCV function',
          date: '2023-06-01',
          sectionId: '1-3'
        },
        {
          id: 2,
          title: 'Add user upload custom indicator function',
          date: '2023-06-01',
          sectionId: '1-6'
        }
      ],
      allNews: [
        {
          id: 1,
          title: 'Add Symbol OHLCV function',
          date: '2023-06-01',
          sectionId: '1-3'
        },
        {
          id: 2,
          title: 'Add user upload custom indicator function',
          date: '2023-06-01',
          sectionId: '1-6'
        }
      ],
    }
  },
  methods: {
    changeNewsType(event) {
      this.activeBtn = event.currentTarget.dataset['type']
    },
    getNewsDetail(sectionId) {
      console.log('sectionId', sectionId)
      this.$router.push('/doc/guide/' + sectionId)
    }
  }
}
</script>

<style lang="less" scoped>
.el-card__header {
	background-color: #f7f9fc;
}
.el-card__body {
	height: 500px;
  overflow-y: auto;
}
.top {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.box-card {
	width: 480px;
}
.title {
	display: flex;
	align-items: center;
	font-size: 15px;
	color: #666666;
	font-weight: 400;
	.notice {
		margin-left: 15px;
	}
}
.btn .el-button:first-child {
	background-color: #5b9bd1;
}
.btn .el-button:last-child {
	width: 100px;
}
.newsItem {
	color: #666666;
	font-size: 14px;
	font-weight: 400;
  cursor: pointer;
	p {
		margin: 0;
		padding: 0;
	}
	.news-centent {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-top: 10px;
		margin-bottom: 20px;
		.date {
			color: #999999;
			font-size: 12px;
		}
	}
}
</style>
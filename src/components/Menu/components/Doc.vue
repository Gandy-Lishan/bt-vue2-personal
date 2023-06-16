<template>
	<div>
		<div class="theme-wrapper">
			<h1 style="color: #00323c">
				<img
					src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAABGpJREFUSA3tVVtoXFUU3fvOI53UlmCaKIFmwEhsE7QK0ipFEdHEKpXaZGrp15SINsXUWvBDpBgQRKi0+KKoFeJHfZA+ED9KKoIU2gYD9UejTW4rVIzm0VSTziPzuNu1z507dibTTjL4U/DAzLn3nL3X2o91ziX6f9wMFdh6Jvbm9nNSV0msViVO6tN1Rm7NMu2OpeJ9lWBUTDxrJbYTS0hInuwciu9eLHlFxCLCZEk3MegsJmZ5K/JD6t7FkFdEvGUo1g7qJoG3MHImqRIn8/nzY1K9UPKKiJmtnUqHVE3Gbuay6vJE/N2FEmuxFjW2nUuE0yQXRRxLiTUAzs36zhZvOXJPdX850EVnnLZkB8prodQoM5JGj7Xk2mvC7JB8tG04Ef5PiXtG0UtxupRQSfTnBoCy554x18yJHI6I+G5Eru4LHmPJZEQsrvPUbMiA8G/WgMK7w7I+ez7++o2ANfbrjvaOl1tFMs+htG3IrZH9/hDX1Pr8Tc0UvH8tcX29KzAgIGcEkINyW5BF9x891hw6VYqgJHEk0huccS7vh3C6gTiODL+26huuBtbct8eZnqLML8PkxGYpuPZBqtqwkSjgc4mB5gbgig5i+y0UDK35LMxXisn9xQtK+nd26gTIHsHe/oblK/b29fUmN/8Y+9jAQrnBp56m1LcDlDp9irKTExSKduXJVWSqdBMA08pEJnEIOB3FPPMybu/oeV8zFeYN3xx576Q6RH+VmplE4ncQV5v+5rzSoyOU7PuEAg8g803PwBJ0CExno/jcMbN8tONYeOmHiuUNryvm3fRUy4tMPVLdAGkUhNWuggGrJcXPv+ouCjz0MKUHz1J2/E8IC9nqTabcxgaBYM0hPhD5Y65FsbxRQKxCQrDjDctW7PUM3HuZunFyifSAqEfuzCp48Il24luWUWZoyJCaPR82jE0+kFA643wRFVni4RYSq3ohJO2pZ7B5dO4xkDWbEpossJPLSrPjYID8rS2UHTlvyNxqIGsg674XJJ7vnh5L7PNwC4hh2sjCI96mzszOTpxLF0T7l88Yz7lAuK6OnL8gXLOnTvpzSb22YG8W7us3jSebFHeeqnXRG1vt+MoUM84LQIBmMsCTAcOauTh0T0l0neQK7m2bLMt2mGxU3HYssS0J2cdv5wljlPsrIuZLAG/2DOZIXgCYT8uMGZN+e2kSirfxZOPCsC0f24nTZzspnVn9VePS1Z5vubmAGGXG8ZFno9Hel0yfA5ZPhF7Dh972BQJ2qCpgH67lmWtBYbvk6sz02wjky2vXyz0XErP/kFB619js1BtwfOV4OPRqOQBjy3Qbk18vigUPPSD5ceHnwck7W9bhAqZdd7SuG7w4/P2F/GaJh8c7e9qgow+Q7cGBo+98WsLkuktFqiZabtXuQTu/Y5ETbR0v7tNSFnvrmu6pjdoan2KjMu8q/Hmj1EfCO2ZGfEIbIXKUlw8qaX9/b2oeSJmFksSeT/Fn0V3nSypChh4Gjh74ybO9aeZ/AN2dwciu2/MhAAAAAElFTkSuQmCC"
				/>Easy to use of BacktestEdge
			</h1>
			<div class="content">
				<p>
					BacktestEdge utilizes the real data of financial&stock market and
					provides users a trading edge by backtesting trading strategies that
					are related to sentiment and technical indicators. Before you actually
					apply your trading strategy into live trading, BacktestEdge will help
					you backtest this strategy with actual result of return, number of
					trades and many other useful data within seconds!
				</p>
				<p>
					This tutorial will teach you how to quickly start using BacktestEdge
					and thanks for reading!
				</p>
				<hr />
				<div class="edit-page">
					<div class="edit-link">
						<a
							href="/doc/guide"
							target="_blank"
							rel="noopener noreferrer"
							>Get Start Now!</a
						>
					</div>
				</div>
			</div>
		</div>
		<div class="theme-wrapper">
			<div class="article-list">
				<div class="article-title">
					<i class="el-icon-date"></i>
					<h2 style="display: inline-block">Recently Updated</h2>
				</div>
			</div>
			<el-card class="box-card" shadow="never">
				<p class="text item">
					<span class="serialNum">01</span>
					<a href="">Add Symbol OHLCV function</a>
					<span class="date">2023-06-11</span>
				</p>
				<hr />
				<p class="text item">
					<span class="serialNum">02</span>
					<a href="">Add user upload custom indicator function</a>
					<span class="date">2023-06-12</span>
				</p>
			</el-card>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
import Footer from "@/components/BacktestEdge/Footer.vue";
export default {
  name: 'DocHome',
  components: {
    Footer
  }
}
</script>

<style lang="less" scoped>
.theme-wrapper {
	max-width: 860px;
	margin: 0 auto;
	padding: 1rem 2.5rem 2rem 2.5rem;
	background-color: #fff;
	margin-top: 1rem;
	border-radius: 20px;
}
.content {
	word-wrap: break-word;
	color: #00323c;
	font-size: 1rem;
}
.theme-wrapper h1 img {
	margin-bottom: -0.2rem;
	margin-right: 0.2rem;
	max-width: 2.2rem;
	max-height: 2.2rem;
}
.edit-page {
	padding-top: 1rem;
	padding-bottom: 1rem;
	overflow: auto;
	max-width: 860px;
	width: fit-content
}
.edit-page .edit-link {
	border: 1px solid rgb(82 214 245);
	border-radius: 10px;
}
.edit-page .edit-link a {
	/* 文字颜色 */
	color: rgb(82 214 245); 
      /* 清除背景色 */
      background: transparent; 
      /* 边框样式、颜色、宽度 */
      border: 2px solid rgb(82 214 245);
      /* 给边框添加圆角 */
      border-radius: 6px; 
      /* 字母转大写 */
      border: none;
      padding: 16px 32px;
      text-align: center;
      display: inline-block;
      font-size: 16px;
      -webkit-transition-duration: 0.4s; /* Safari */
      transition-duration: 0.4s;
      cursor: pointer;
      text-decoration: none;
      text-transform: uppercase;
}
.edit-page .edit-link a:hover {
      background-color: #008CBA;
      color: white;
}
.article-list .article-title i {
	font-size: 1.2rem;
	margin-right: 5px;
}
.article-list .article-title {
	font-size: 1rem;
	color: rgb(0 50 60);
	font-weight: 500;
	opacity: 0.9;
}

.item {
	padding: 18px 0;
	font-size: 1rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	.serialNum {
		font-size: 1.1rem;
		color: #f17229;
		width: 50px;
		text-align: center;
		margin: 0;
		line-height: 45px;
	}
	a {
		color: #00323c;
		flex: 1;
		display: flex;
		height: 45px;
		align-items: center;
		font-weight: normal;
		word-wrap: none;
	}
	.date {
		margin-right: 15px;
		color: #999;
		text-align: right;
		font-size: 0.9rem;
		line-height: 45px;
		word-wrap: none;
	}
}
.footer {
	border: none;
	margin-top: 1rem;
	margin-bottom: 1.5rem;
	border-radius: 20px;
}
hr {
	border: 0;
	border-top: 1px solid #cdcdcd;
}
a {
	font-weight: 500;
	color: #11a8cd;
	text-decoration: none;
}
h1 {
	font-size: 1.9rem;
}
h1,
h2,
h3,
h4,
h5,
h6 {
	font-weight: 600;
	line-height: 1.25;
}
p,
ul,
ol {
	line-height: 1.7;
	font-weight: 400;
}
</style>
<template>
	<div class="doc-container">
		<div class="contents">
			<div class="content">
				<!--指定组件的位置-->
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>3

<script>
export default {
  name: "BBSHeader",
	data() {
		return {
			activeIndex: '1'
		}
	},
	methods: {

		handleSelect(key) {
			this.activeIndex = key
			let path = null
			if(key == '1') {
				path = this.$router.resolve({
					path: '/doc/home'
				}).href
				this.$router.push(path)
			} else if(key == '1-1') {
				path = this.$router.resolve({
					path: '/doc/guide/0'
				}).href
				this.$router.push(path)
			}else if(key == '1-2') {
				path = this.$router.resolve({
					path: '/doc/scanner'
				}).href
				this.$router.push(path)
			}
		}
	}
}
</script>

<style scoped>
.doc-container {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
}
.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 78px;
	background-color: #fff;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
	color: #333333;
	/*吸顶效果*/
	position: fixed;
	z-index: 999;
	top: 0px;
	left: 0;
	right: 0;
}
.box {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
h1 {
	display: flex;
	align-items: center;
	justify-content: space-around;
	font: normal 28px Cookie, Arial, Helvetica, sans-serif;
	padding: 0px 20px;
}
img {
	width: 200px;
	height: 35px;
	margin-left: 20px;
}

nav {
	/* display: flex; */
	/* align-items: center; */
	margin: 0px 40px;
	font: 16px Arial, Helvetica, sans-serif;
}
nav a {
	padding: 0 15px;
	width: 32px;
	text-decoration: none;
	color: #666;
	font-size: 16px;
	font-weight: normal;
	opacity: 0.9;
}

nav a:hover {
	opacity: 1;
}

.active {
	color: #608bd2;
	pointer-events: none;
	opacity: 1;
}

/*搜索框*/

.text {
	height: 22px;
	font-size: 14px;
	border: 1px solid #ccc;
	padding: 3px 16px;
	border-bottom-left-radius: 20px;
	border-top-left-radius: 20px;
}
.text:focus {
	outline: none;
	border-color: rgba(82, 168, 236, 0.8);
	box-shadow: inset 0 2px 2px rgba(0, 0, 0, 0.075),
		0 0 8px rgba(82, 168, 236, 0.6);
}
.button {
	width: 60px;
	height: 30px;
	font-size: 14px;
	margin-right: 35px;
	border: 1px solid #608bd2;
	background-color: #608bd2;
	border-top-right-radius: 20px;
	border-bottom-right-radius: 20px;
}
p {
	margin: 0;
	padding: 0;
}
.el-submenu__title{
	height: 0;
}
.betaNote {
			margin: 1.14rem 0 1.14rem 0px;
			font-style: italic;
			color: #6c6c6c;
			text-align: left;
			font-size: 1.6rem;
			margin: 0px;
			font-weight: lighter;
			color: #333333;
		}
</style>

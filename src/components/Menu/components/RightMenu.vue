<template>
	<div>
		<!-- <div class="right-menu-wrapper">
			<div class="right-menu-margin">
				<div class="right-menu-title">Directory</div>
				<div class="right-menu-content">
					<div class="right-menu-item level2 active">
						<a href="#安装">安装</a>
					</div>
					<div class="right-menu-item level2">
						<a href="#创建版本库-仓库">创建版本库（仓库）</a>
					</div>
					<div class="right-menu-item level2">
						<a href="#添加文件到仓库">添加文件到仓库</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#提交描述规范">提交描述规范</a>
					</div>
					<div class="right-menu-item level2">
						<a href="#版本管理">版本管理</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#提交修改">提交修改</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#查看版本记录">查看版本记录</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#回退版本">回退版本</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#撤销修改">撤销修改</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#删除文件">删除文件</a>
					</div>
					<div class="right-menu-item level2">
						<a href="#远程仓库">远程仓库</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#ssh验证">SSH验证</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#关联远程仓库">关联远程仓库</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#查看远程仓库">查看远程仓库</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#删除远程仓库">删除远程仓库</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#从远程库克隆项目">从远程库克隆项目</a>
					</div>
					<div class="right-menu-item level5">
						<a href="#克隆指定分支">克隆指定分支</a>
					</div>
					<div class="right-menu-item level2">
						<a href="#分支管理">分支管理</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#创建分支">创建分支</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#查看分支">查看分支</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#切换分支">切换分支</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#合并分支">合并分支</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#删除分支">删除分支</a>
					</div>
					<div class="right-menu-item level4">
						<a href="#修改分支名">修改分支名</a>
					</div>
					<div class="right-menu-item level2">
						<a href="#帮助命令">帮助命令</a>
					</div>
					<div class="right-menu-item level2">
						<a href="#参考文档">参考文档</a>
					</div>
				</div>
			</div>
		</div> -->
		<div class="right-menu-wrapper">
			<div class="right-menu-margin">
				<div class="right-menu-title">Directory</div>
				<div class="right-menu-content">
					<div
						v-for="(item, index) in menuItems"
						:key="index"
						:class="{
							'right-menu-item': true,
							level2: item.level == 2,
							level3: item.level == 3,
							active: activeSection === item.id
						}"
					>
						<a :href="item.id" @click.prevent="scrollToSection(item.id)">{{
							item.title
						}}</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		menuItems: {
      type: Array,
      default: () => []
    },
	},
  data() {
    return {
      activeSection: '', // 当前活动的章节
    };
  },
  methods: {
    scrollToSection(id) {
      this.activeSection = id; // 设置当前活动的章节
      const jump = document.getElementById(id);
      if (jump) {
        let title = document.querySelectorAll('h1,h2,h3')
        this.navList = Array.from(title)
        this.navList.forEach((item) => {
          item.style.color = 'rgb(0, 50, 60)'
        })
        jump.style.color = '#5b9bd1'
        const total = jump.offsetTop - 80;
        window.scrollTo({
          top: total,
          behavior: 'smooth', // 平滑滚动
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.right-menu-wrapper {
	width: 220px;
	float: right;
	position: fixed;
	top: 0;
	right: 0;
	font-size: 0.8rem;
	margin-top: 30px;
}
.right-menu-wrapper .right-menu-margin {
	margin-top: 4.6rem;
	border-radius: 3px;
	overflow: hidden;
}
.right-menu-wrapper .right-menu-title {
	padding: 10px 15px 5px 15px;
	background: #fff;
	font-size: 1rem;
  font-weight: 500;
}
.right-menu-wrapper .right-menu-content {
	max-height: 80vh;
	position: relative;
	overflow-y: scroll;
	background: #fff;
	padding: 4px 3px 4px 0;
}
.right-menu-wrapper .right-menu-content .right-menu-item.level2 {
	font-size: 0.8rem;
}
.right-menu-wrapper .right-menu-content .right-menu-item.level3 {
	padding-left: 37px;
}
.right-menu-wrapper .right-menu-content .right-menu-item {
	padding: 4px 15px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
	position: relative;
}
.right-menu-wrapper .right-menu-content .right-menu-item a {
  color:  rgb(0, 50, 60);
	opacity: 0.75;
	display: inline-block;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
.right-menu-wrapper .right-menu-content .right-menu-item.active a {
	color: #11a8cd;
	opacity: 1;
}
.right-menu-wrapper .right-menu-content .right-menu-item a:hover {
  white-space: wrap;
	color: #11a8cd;
}
a {
	font-weight: 500;
	text-decoration: none;
}
</style>
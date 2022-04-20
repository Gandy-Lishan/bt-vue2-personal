<template>
<div class="content-container">
	<div data-v-15d0b2f8 class="content markdown-body override">
		<div class="menu_logo">
			<img
				style="width: 190px; height: 50px"
				src="../../assets/logo.png"
				alt="logo"
			/>
		</div>
		<section data-v-15d0b2f8="">
			<h1>轻松上手 backtest</h1>
			<p>
                在这里，你可以设定回测系统的参数，如初始金额、滑点、开始时间以及结束时间等，然后选择
                不同的股票组合（目前系统只支持单信号）。系统会根据填写的参数模拟真实金融市场
                交易规则进行模型买入、模型卖出，得出交易次数、盈利率等数据。
			</p>
			<p>文档会以图文结合的方式教你如何使用回测系统，现在让我们开始吧！</p>
			<h3>1. 介绍回测系统</h3>
            <h4>1.1 图表部分</h4>
             <blockquote class="video_link">
               <i class="el-icon-video-play"></i>
               <a href="#">图表操作介绍</a>
            </blockquote>
            <img src="../../assets/demo-chart.png" alt="Chart">
            <blockquote>
                <p>
                    <br />
                    图表不仅可以反映股票的走势情况，而且还支持图表界面互动。例如，你可以在图表中添加symbol以及
                    indicator到收藏夹；可以自定义 indicator 的属性，例如极值以及极值曲线的颜色；可以选定 indicator 周期（Daily、Weekly、Monthly）;
                    支持添加以及去除背景网格线、last price标签以及其他视觉辅助工具; 你可以更换图标的主题（Dark、light）;图表下方的 clear chart 可以实现
                    一键清除图表。
                    <br />
                </p>
            </blockquote>
            <h4>1.2 表单部分</h4>
            <img src="../../assets/demo-form.png" alt="Form">
            <blockquote>
                <p>
                    <br />
                    表单部分有四个标签页，Set up Backtest 标签页用于 Backtest 的创建，Backtest History 标签页展示所有创建的回测；Backtest Results 用于展示
                    某个回测的结果；My Favorites 标签页展示添加收收藏夹的回测；Sample Backtest 标签页中我们提供了 30 个实例，你可以通过复制使用。
                    <br />
                </p>
            </blockquote>
			<h3>2. 如何创建回测</h3>
              <blockquote class="video_link">
                <i class="el-icon-video-play"></i>
                <a href="#">回测创建流程演示</a>
              </blockquote>
            <h4>2.1 填写回测的基本信息</h4>
            <img src="../../assets/fill-set-up.png" alt="Backtest Information">
            <blockquote>
                <p>
                    <br />
                    如上图所示，打开 Set up Backtest 标签页，填写回测的基本信息，包括 Starting Capital、Commission、Benchmark、Backtest History...。
                    <br />
                </p>
            </blockquote>
            <h4>2.2 填写进场条件</h4>
            <img src="../../assets/fill-entry.png" alt="Entry Criteria">
            <blockquote>
                <p>
                    <br />
                    如上图所示，在下拉框中选择一个 Sentiment Indicator，填写指标值。
                    为了确保你的指标有收益，我们推荐你填写 Extreme Optimism 和 Extreme Pessimism 之间的值。如果你选的是 Technical Indicators 我们推荐你结合图表，填写
                    极值附近或者两个极值之间的值。
                    <br />
                </p>
            </blockquote>
            
            <h4>2.3 填写退场条件</h4>
            <img src="../../assets/fill-exit.png" alt="Exit Criteria">
            <blockquote>
                <p>
                    <br />
                    如上图所示，你可以在退场条件中使用 Technical Indicator，切换单选框，在 Technical Indicators 的下拉框中选择一个 indicator，填写指标值。
                    <br />
                </p>
            </blockquote>
            <h4>2.4 运行策略并查看结果</h4>
            <img src="../../assets/result-summary.png" alt="Summary">
            <blockquote>
                <p>
                    <br />
                   填写完 Set up Backtest 表单后，点击 Run Backtest 按钮运行并查看结果，运行回测会花费一定的时间，请你耐心等待。回测运行结束之后，会自动跳转
                   到 Backtest Results 标签页展示回测运行成功后的数据。如果你创建的回测没有交易，你可以在 Backtest History 标签页，点击编辑按钮，修改回测的数据，保存后重新运行。
                    <br />
                </p>
            </blockquote>
            <h3>3. 如何添加回测到收藏夹</h3>
            <h4>3.1 打开 Backtest History 标签页</h4>
            <img src="../../assets/history-add-favorite.png" alt="Add To Favorites">
             <blockquote>
                <p>
                    <br />
                    找到刚才创建的名为 "my-first-backtest" 的回测，点击 add to favorites 按钮, 即可将回测添加至收藏夹。
                    <br />
                </p>
            </blockquote>
            <h4>3.2 查看收藏夹中的回测</h4>
            <img src="../../assets/see-favorites.png" alt="View favorites">
             <blockquote>
                <p>
                    <br />
                   打开 My Favorites 标签页即可查看收藏的回测，你可以在这里移除回测收藏、编辑回测以及查看回测结果。
                    <br />
                </p>
            </blockquote>
            <h3>4. 如何使用 Sample Backtests</h3>
              <blockquote class="video_link">
                <i class="el-icon-video-play"></i>
                <a href="#">Sample Backtest的演示视频</a>
              </blockquote>
            <h4>4.1 打开 Sample Backtests 标签页</h4>
             <img src="../../assets/sample-backtests.png" alt="Sample Backtests">
             <blockquote>
                <p>
                    <br />
                   打开 Sample Backtests 标签页, 点击 copy backtest 按钮。
                    <br />
                </p>
            </blockquote>
            <h4>4.2 在 Backtest History 中编辑它</h4>
            <img src="../../assets/copy-backtests.png" alt="Copy Backtests">
             <blockquote>
                <p>
                    <br />
                   打开 Backtest History 标签页, 点击 edit backtest 按钮，对复制的 Sample Backtest 进行编辑。你可以看到部分按钮是不可用的，那是因为所有
                   复制的回测都要编辑以后才能进行查看结果等操作。
                    <br />
                </p>
            </blockquote>
           
		</section>
        <el-aside>
          <div style="margin:0px 0 0 180px;font-size:18px;font-weight:bold;">目录</div>
            <el-tabs @tab-click="handleClick" v-model="activeName" :tab-position="tabPosition" style="height: auto;">
              <el-tab-pane :name="'tab'+index"
              :class="item.lev"
              v-for="(item, index) in navList" 
              :key="index" 
              :label="item.name"></el-tab-pane>
            </el-tabs> 
      </el-aside>
			<div class="footer">
				<p>
					Copyright © 2001 - 2022 Sundial Capital Research, Inc. All rights
					reserved.
				</p>
			</div>
	</div></div>
</template>
<script>
export default {
  data(){
    return{
      activeName:'tab0',
      tabPosition:'right',
      scroll: '',
      navList: [],
    }
  },
   methods: {
      handleClick(tab,event){
        this.jump(tab.index)
      },
      dataScroll: function () {
        this.scroll = document.documentElement.scrollTop || document.body.scrollTop;
      },
      jump(index) {
        let jump = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
        // 获取需要滚动的距离
        let total = jump[index].offsetTop - 80;
        // Chrome
        document.body.scrollTop = total;
        // Firefox
        document.documentElement.scrollTop = total;
        // Safari
        window.pageYOffset = total;
        // $('html, body').animate({
        // 'scrollTop': total
        // }, 400);
      },
      loadScroll: function () {
        let self = this;
        let navs = document.querySelectorAll('.el-tabs__item');
        // var sections = document.getElementsByClassName('section');
        for (var i = self.navList.length - 1; i >= 0; i--) {
          if (self.scroll >= self.navList[i].offsetTop - 120) {
            self.activeName = 'tab'+i
            break;
          }
        }
      },
      selectAllTitle(){
        let title = document.querySelectorAll("h1,h2,h3,h4,h5,h6");
        this.navList = Array.from(title);
          this.navList.forEach(item=>{
            item.name = item.innerHTML
          })
          this.navList.forEach(el => {
          let index = el.localName.indexOf('h');
          el.lev = 'lev'+el.localName.substring(index+1,el.localName.length)
          });
        
      }
    },
    watch: {
      scroll: function () {
        this.loadScroll()
        
      }
    },
    created(){
      
    },
    mounted() {
      // scroll代表滚动条距离页面顶部距离
      window.addEventListener('scroll', this.dataScroll);
      this.selectAllTitle();
      this.$nextTick(() => {
          setTimeout(() => {
           let navs = document.querySelectorAll('.el-tabs__item');
           for(let i=navs.length-1;i>=0;i--){
            // console.log($('#'+navs[i].id))
            // 从lev1到lev5分别添加不同到样式
            document.querySelector('#'+navs[i].id).style.padding="0";
            if(this.navList[i].lev=='lev1'){
              document.querySelector('#'+navs[i].id).style.paddingLeft="20px" ;
            }else if(this.navList[i].lev=='lev2'){
              document.querySelector('#'+navs[i].id).style.paddingLeft="35px" ;
            }else if(this.navList[i].lev=='lev3'){
              document.querySelector('#'+navs[i].id).style.paddingLeft="50px" ;
            }else if(this.navList[i].lev=='lev4'){
              document.querySelector('#'+navs[i].id).style.paddingLeft="65px" ; 
              document.querySelector('#'+navs[i].id).style.fontWeight="400" ; 
            }else if(this.navList[i].lev=='lev5'){
              document.querySelector('#'+navs[i].id).style.paddingLeft="80px" ; 
              document.querySelector('#'+navs[i].id).style.fontWeight="400" ; 
            }
           }
        });
        
      })
    }
}
</script>
<style lang="less" scoped>

.video_link{
  border-radius: 2px;
  padding: 20px;
  background-color: #e7ecf3;
  width: 40rem;
  margin: 24px 0;
  display: flex;
  align-items: center;
}
.video_link i{
  font-size:35px;
}
.video_link a{
  padding-left: 16px;
  color:#486491;
  font-weight: 600;
  text-decoration: none;
}
.content {
	margin: 0 auto 0 310px;
	max-width: 1280px;
	padding: 10px;
	position: relative;
}
.menu_logo {
	position: sticky;
	z-index: 999;
	top: 0;
	width: 100%;
	background: #fff;
}
.footer {
	background: #fff;
	display: flex;
	padding: 16px;
	border-top: 1px solid #e5e7eb;
	margin-top: 50px;
}
.footer p {
	text-align: center;
	color: #9ca3af;
	line-height: 21px;
}
.el-main{
  width:900px;
}
.el-tabs__header.is-right{
  height: 500px !important;
}
.el-aside{
  position: fixed;
  top: 0px;
  left: 0px;
  width: 220px;
  height: auto;
}
.content-container{
    position: relative;
}
</style>
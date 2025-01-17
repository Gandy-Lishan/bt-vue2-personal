<template>
	<div class="favoriteForm_container">
		<el-button
			v-if="isSystem == 'system'"
			@click="runAllBacktest"
			class="fls-btn"
			size="mini"
			>run all backtest</el-button
		>
		<el-tooltip
			class="item"
			effect="dark"
			content="Migrate from backtest engine v1 to backtest engine v2"
			placement="bottom-start"
								>
		<el-button
			v-if="currentPage == 'Favorites'"
			@click="runBTV1Backtest"
			class="fls-btn"
			size="mini"
			>Migrate Backtest </el-button
		></el-tooltip>
		<el-button v-if="currentPage == 'Favorites'" @click="findLastSignal" class="fls-btn" size="mini">Find Last Signal</el-button>
		<div class="searchBox">
			<el-input
				class="search"
				style="width: 30vw"
				size="mini"
				v-model="searchItem"
				placeholder="Search for the name of the backtest"
				@keyup.enter.native="handleQuery"
				clearable 
				@clear="handleQuery"
			>
				<i slot="suffix" class="el-input__icon el-icon-search"></i>
			</el-input>
		</div>
    <el-table
      header-align="center"
      :data="dataList"
      v-loading="loading"
      :element-loading-text="loadTest"
			:default-expand-all="isExpandAll"
      element-loading-spinner="el-icon-loading"
			@sort-change="onSortChange"
			style="width: 100%; height: 100%"
			:row-class-name="tableRowClassName"
			element-loading-background="rgba(0, 0, 0, 0.8)"
			class="BTTable"
    >
    <el-table-column type="index" align="center">
        <template scope="scope">
          <span>{{ (queryInfo.page - 1) * 10 + scope.$index + 1 }}</span>
        </template>
		</el-table-column>
		<el-table-column
				type="expand"
				>
				<template slot-scope="scope">
					<div class="expandArea">
						<div class="descriptionBox" v-if="scope.row.strategy === 'Dual'">
						<div class="entryBox">
							<p style="display: inline-block; margin-right: 10px;">Symbol 1</p>
								<span>
									{{scope.row.symbol}}
								</span>
						</div>
						<div class="exitBox">
							<p style="display: inline-block; margin-right: 10px;">Symbol 2</p>
								<span>
									{{scope.row.symbol2}}
								</span>
						</div>
					</div>
						<div class="descriptionBox"  v-if="scope.row.strategy !== 'Dual'">
						<div class="entryBox">
							<p>Entry Description</p>
							<template
								v-for="(des, index) in scope.row.entry_description"
							>
								<p :key="index">
									<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
									>{{ des.commentDes }}
								</p>
							</template>
						</div>
						<div class="exitBox">
							<p>Exit Description</p>
							<template v-for="(des, index) in scope.row.exit_description">
								<p :key="index">
									<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
									>{{ des.commentDes }}
								</p>
							</template>
						</div>
					</div>
					<div  v-else>
						<div class="descriptionBox">
							<div class="entryBox">
							<p>Entry 1 Description</p>
							<template
								v-for="(des, index) in scope.row.entry_description"
							>
								<p :key="index">
									<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
									>{{ des.commentDes }}
								</p>
							</template>
						</div>
						<div class="exitBox">
							<p>Entry 2 Description</p>
							<template v-for="(des, index) in scope.row.entry2_description">
								<p :key="index">
									<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
									>{{ des.commentDes }}
								</p>
							</template>
						</div>
						</div>
						<div class="descriptionBox">
						<div class="entryBox">
							<p>Exit 1 Description</p>
							<template
								v-for="(des, index) in scope.row.exit_description"
							>
								<p :key="index">
									<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
									>{{ des.commentDes }}
								</p>
							</template>
						</div>
						<div class="exitBox">
							<p>Exit 2 Description</p>
							<template v-for="(des, index) in scope.row.exit2_description">
								<p :key="index">
									<span v-if="index != 0">&emsp;&emsp;{{ index }}.</span
									>{{ des.commentDes }}
								</p>
							</template>
						</div>
					</div>
					</div>
					<div class="urlBox" v-if="currentPage == 'Analyst'">
						<p>Analyst Report URL</p>
						<el-link :underline="false" :href="scope.row.report_url" target="_blank" type="primary">{{scope.row.report_url}}</el-link>
					</div>
					</div>
				</template>
		</el-table-column>
    <template v-for="item in tableCol">
			<el-table-column
        v-if="item.label == 'Type'"
        :prop="item.field"
        :label="item.label"
				:width="item.width"
        :key="item.label"
				show-overflow-tooltip
				align="center">
				<template slot="header">
						<el-tooltip effect="dark" placement="top" style="display: inline">
						<span slot="content" v-html="typeTooltip"></span>
							<el-menu class="el-menu-demo" mode="horizontal" @select="handleSelect">
								<el-submenu index="Strategy">
									<template slot="title">Type</template>
									<el-menu-item index="Strategy">All Symbol Backtest</el-menu-item>
									<el-menu-item index="Single">Single Symbol Backtest(S)</el-menu-item>
									<el-menu-item index="Dual">Dual Symbols Backtest(D)</el-menu-item>
								</el-submenu>
							</el-menu>
						</el-tooltip>
				</template>
				<template slot-scope="scope">
						{{ scope.row.strategy !== 'Dual' ? 'S' : 'D'}}
				</template>
      </el-table-column>
      <el-table-column
        v-if="item.label == 'Name'"
        :label="item.label"
        :prop="item.field"
        :key="item.label"
				:width="item.width"
				show-overflow-tooltip
				align="center">
      </el-table-column>
			<el-table-column
        v-if="item.label == 'Symbol'"
        :label="item.label"
        :prop="item.field"
        :key="item.label"
				:width="item.width"
				class="StrategyCol"
				show-overflow-tooltip
				align="center">
				<template slot-scope="scope">
					<div class="symbolBox">
						<p>{{ getProcessedSymbol(scope.row.symbol) }}</p>
						<p v-if="scope.row.strategy === 'Dual' && scope.row.symbol2" style="">{{ getProcessedSymbol(scope.row.symbol2) }}</p>
					</div>
				</template>
      </el-table-column>
			<el-table-column
				v-if="item.label == 'Entry & Exit'"
				:label="item.label"
				:key="item.label"
				class="StrategyCol"
				align="center">
				<template slot-scope="scope">
					<div class="entryAndExitBox">
					<div class="entryExit">
						<p>{{ scope.row.entry_description[0].commentDes }}</p>
						<p>{{ scope.row.exit_description[0].commentDes }}</p>
					</div>
					<div class="entryExit" v-if="scope.row.strategy === 'Dual'">
						<p>{{ scope.row.entry2_description[0].commentDes }}</p>
						<p>{{ scope.row.exit2_description[0].commentDes }}</p>
					</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				v-if="item.label == 'Period'"
				:key="item.label"
				:label="item.label"
				show-overflow-tooltip
				align="center"
				:width="item.width"
			>
				<template slot-scope="scope">
					<div class="showDate">
						<el-button
							size="mini"
							type="info"
							v-if="scope.row.start_date === '1800-10-01'"
							plain
							>All History</el-button
						>
						<el-button
							size="mini"
							type="info"
							v-if="scope.row.start_date !== '1800-10-01'"
							plain
							>{{ scope.row.start_date }}</el-button
						>
						<el-button
							size="mini"
							type="info"
							v-if="scope.row.start_date !== '1800-10-01'"
							plain
							>{{ scope.row.end_date }}</el-button
						>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				v-if="item.label == 'Timeframe'"
				:label="item.label"
				:key="item.label"
				:width="item.width"
				:prop="item.field"
				show-overflow-tooltip
				align="center"
				>
			</el-table-column>
			<el-table-column
				v-if="item.label == 'Last Signal Date' && currentPage == 'Favorites'"
				:key="item.label"
				:prop="item.field"
				align="center"
				show-overflow-tooltip
				:label="item.label"
				:sortable="item.label == 'Last Signal Date' ? 'custom' : false"
				:sort-orders="['ascending', 'descending', item.field]"
				:width="item.width"
			>
			<template #header>
					<span v-html="item.labelHtml"></span>
			</template>
			<template slot-scope="scope">
					<div class="showDate" v-if="scope.row.strategy !== 'Dual'">
						<el-button size="mini" type="info" plain
							>E: {{ scope.row._last_entry_signal_date ? scope.row._last_entry_signal_date : '' }}</el-button
						>
						<el-button size="mini" type="info" plain
							>X: {{ scope.row._last_exit_signal_date ? scope.row._last_exit_signal_date : '' }}</el-button
						>
					</div>
					<div class="showDate" v-else>
						<el-button size="mini" type="info" plain
							>E1: {{ Array.isArray(scope.row._last_entry_signal_date) ? scope.row._last_entry_signal_date[0] : '' }}</el-button
						>
						<el-button size="mini" type="info" plain
							>X1: {{ Array.isArray(scope.row._last_exit_signal_date) ? scope.row._last_exit_signal_date[0] : '' }}</el-button
						>
						<el-button size="mini" type="info" plain
							>E2: {{ Array.isArray(scope.row._last_entry_signal_date) ? scope.row._last_entry_signal_date[1] : '' }}</el-button
						>
						<el-button size="mini" type="info" plain
							>X2: {{ Array.isArray(scope.row._last_exit_signal_date) ? scope.row._last_exit_signal_date[1] : '' }}</el-button
						>
					</div>
				</template>
			</el-table-column>
			<el-table-column
				v-if="['Total Trades', 'Total Return'].includes(item.label)"
				:key="item.label"
				:width="item.width"
				:prop="item.field"
				show-overflow-tooltip
				align="center"
				:sortable="[
					'Total Trades',
					'Total Return'
				].includes(item.label) ? 'custom' : false"
				:sort-orders="['ascending', 'descending', item.field]"
				>
			<template #header>
					<span v-html="item.labelHtml"></span>
			</template>
			<template slot-scope="scope">
				<span v-if="item.label == 'Total Return'">{{scope.row[item.field] != 0 ? `${scope.row[item.field]}%` : scope.row[item.field]}}</span>
				<span v-else>{{scope.row[item.field]}}</span>
			</template>	
			</el-table-column>

    </template>
		<el-table-column align="center" width="280px">
						<template slot-scope="scope">
							<el-row>
								<el-tooltip
									class="item"
									effect="dark"
									content="rerun backtest"
									placement="bottom-start"
								>
									<el-button
										v-if="['History', 'Favorites'].includes(currentPage)"
										type="success"
										:disabled="getIsBacktestRunningFlagState"
										icon="el-icon-video-play"
										circle
										size="mini"
										@click="rerunBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="add to favorites" 
									v-if="scope.row.favorites == false"
									placement="bottom-start"
								>
									<el-button
										v-if="scope.row.favorites == false && currentPage == 'History'"
										plain
										icon="el-icon-star-off"
										circle
										@click="addToFavorites(scope.row)"
										size="mini"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="remove from favorites"
									v-if="scope.row.favorites == true && ['History', 'Favorites'].includes(currentPage)"
									placement="bottom-start"
								>
									<el-button
										v-if="scope.row.favorites == true"
										type="warning"
										icon="el-icon-star-on"
										circle
										@click="moveToFavorites(scope.row)"
										size="mini"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="edit backtest"
									placement="bottom-start"
								>
								
									<el-button
										v-if="['History', 'Favorites'].includes(currentPage)"
										:disabled="getIsBacktestRunningFlagState"
										type="primary"
										icon="el-icon-edit"
										circle
										size="mini"
										@click="editBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="copy backtest"
									placement="bottom-start"
								>
									<el-button
										v-if="['History', 'Favorites', 'Sample', 'Analyst'].includes(currentPage)"
										:disabled="scope.row.status == 0"
										type="info"
										icon="el-icon-copy-document"
										circle
										size="mini"
										@click="copyBacktest(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="delete backtest"
									placement="bottom-start"
								>
									<el-popconfirm
										v-if="scope.row.favorites == false"
										confirm-button-text="yes"
										cancel-button-text="no"
										icon="el-icon-info"
										icon-color="red"
										title="Are you sure you want to delete it?"
										@confirm="deleteBacktest(scope.row.id)"
									>
										<el-button
											v-if="currentPage == 'History' && scope.row.favorites == false"
											type="danger"
											icon="el-icon-delete"
											circle
											size="mini"
											slot="reference"
										></el-button>
									</el-popconfirm>
									<el-popconfirm
										v-if="scope.row.favorites == true"
										confirm-button-text="yes"
										cancel-button-text="no"
										icon="el-icon-info"
										icon-color="red"
										title="Favorite will also remove the backtest, are you sure delete it?"
										@confirm="deleteBacktest(scope.row.id)"
									>
										<el-button
											v-if="currentPage == 'History' && scope.row.favorites == true"
											type="danger"
											icon="el-icon-delete"
											circle
											size="mini"
											slot="reference"
										></el-button>
									</el-popconfirm>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="view backtest results"
									placement="bottom-start"
								>
									<el-button
										:disabled="scope.row.status == 0 || scope.row.status == 3 || getIsBacktestRunningFlagState"
										type="warning"
										icon="el-icon-view"
										circle
										size="mini"
										@click="viewBacktestResults(scope.row)"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="optimize backtest results"
									placement="bottom-start"
								>
									<el-button
										v-if="['History', 'Favorites'].includes(currentPage) && is_admin"
										:disabled="isOptRuning || scope.row.opted == 1 || scope.row.status == 0 || scope.row.status == 3 || getIsBacktestRunningFlagState"
										type="success"
										circle
										size="mini"
										@click="optimizeBacktest(scope.row)"
									>
									<svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.19586 5.85546H4.42201C4.18466 5.84904 3.95443 5.93687 3.78165 6.09973C3.60887 6.26259 3.50761 6.48724 3.5 6.72455V10.3253C3.50761 10.5626 3.60887 10.7873 3.78165 10.9501C3.95443 11.113 4.18466 11.2008 4.42201 11.1944H5.19586C5.43321 11.2008 5.66345 11.113 5.83623 10.9501C6.00901 10.7873 6.11028 10.5626 6.11789 10.3253V6.72522C6.11045 6.48778 6.00926 6.26296 5.83646 6.09996C5.66366 5.93696 5.43332 5.84904 5.19586 5.85546ZM5.32816 10.3253C5.32764 10.3422 5.32381 10.3587 5.31688 10.3741C5.30995 10.3895 5.30007 10.4033 5.28778 10.4149C5.27549 10.4264 5.26105 10.4355 5.24528 10.4414C5.22951 10.4474 5.21271 10.4502 5.19586 10.4496H4.42201C4.40515 10.4502 4.38836 10.4474 4.37259 10.4414C4.35682 10.4355 4.34238 10.4264 4.33009 10.4149C4.3178 10.4033 4.30791 10.3895 4.30098 10.3741C4.29405 10.3587 4.29022 10.3422 4.28971 10.3253V6.72522C4.29022 6.70836 4.29405 6.69178 4.30098 6.6764C4.30791 6.66103 4.3178 6.64718 4.33009 6.63563C4.34238 6.62408 4.35682 6.61507 4.37259 6.60911C4.38836 6.60314 4.40515 6.60035 4.42201 6.60088H5.19586C5.21271 6.60035 5.22951 6.60314 5.24528 6.60911C5.26105 6.61507 5.27549 6.62408 5.28778 6.63563C5.30007 6.64718 5.30995 6.66103 5.31688 6.6764C5.32381 6.69178 5.32764 6.70836 5.32816 6.72522V10.3253ZM1.75533 7.07403H0.981448C0.736553 7.07508 0.502047 7.1731 0.32925 7.34664C0.156454 7.52018 0.059439 7.7551 0.0594375 8V10.2684C0.059439 10.5133 0.156454 10.7483 0.32925 10.9218C0.502047 11.0953 0.736553 11.1934 0.981448 11.1944H1.7553C2.0002 11.1934 2.23471 11.0953 2.40751 10.9218C2.58031 10.7483 2.67733 10.5133 2.67733 10.2684V8C2.67733 7.7551 2.58031 7.52017 2.40751 7.34663C2.23471 7.17309 2.00023 7.07507 1.75533 7.07403ZM1.88761 10.2684C1.88761 10.3035 1.87367 10.3372 1.84886 10.362C1.82405 10.3868 1.7904 10.4007 1.75532 10.4007H0.981461C0.946377 10.4007 0.91273 10.3868 0.887923 10.362C0.863116 10.3372 0.84918 10.3035 0.84918 10.2684V8C0.849183 7.96492 0.863123 7.93127 0.887933 7.90646C0.912743 7.88165 0.946391 7.86772 0.981476 7.86772H1.75532C1.77269 7.86772 1.78989 7.87114 1.80594 7.87779C1.82199 7.88444 1.83658 7.89418 1.84886 7.90647C1.86115 7.91875 1.87089 7.93334 1.87754 7.94939C1.88419 7.96544 1.88761 7.98264 1.88761 8.00001V10.2684ZM8.63783 4.71187H7.86068C7.61578 4.71292 7.38127 4.81094 7.20847 4.98448C7.03567 5.15803 6.93866 5.39296 6.93866 5.63786V10.2678C6.93866 10.5127 7.03568 10.7476 7.20847 10.9211C7.38127 11.0947 7.61577 11.1927 7.86067 11.1937H8.63454C8.87943 11.1927 9.11394 11.0947 9.28673 10.9211C9.45953 10.7476 9.55655 10.5127 9.55655 10.2678V5.63786C9.55656 5.39353 9.45999 5.15909 9.28791 4.98564C9.11582 4.8122 8.88216 4.71379 8.63783 4.71187ZM8.77013 10.2678C8.77013 10.3029 8.75619 10.3365 8.73138 10.3613C8.70657 10.3861 8.67292 10.4001 8.63783 10.4001H7.86068C7.84331 10.4001 7.82611 10.3966 7.81006 10.39C7.794 10.3833 7.77942 10.3736 7.76714 10.3613C7.75485 10.349 7.74511 10.3344 7.73846 10.3184C7.73181 10.3023 7.72839 10.2851 7.72839 10.2678V5.63787C7.72839 5.60279 7.74233 5.56914 7.76714 5.54433C7.79195 5.51951 7.8256 5.50558 7.86068 5.50558H8.63454C8.66962 5.50558 8.70327 5.51952 8.72808 5.54433C8.75288 5.56914 8.76682 5.60279 8.76682 5.63787L8.77013 10.2678ZM9.40575 0.469537L6.80241 1.16139C6.76531 1.16829 6.73087 1.18544 6.703 1.21088C6.67513 1.23633 6.65492 1.26906 6.64467 1.30539C6.63442 1.34171 6.63453 1.38018 6.64499 1.41644C6.65544 1.45271 6.67583 1.48533 6.70385 1.51061L7.40166 2.14095L5.45643 3.53652L3.97815 2.47827C3.89809 2.42221 3.80273 2.39213 3.70499 2.39213C3.60726 2.39213 3.51189 2.42221 3.43183 2.47827L0.20478 4.79324C0.160407 4.82278 0.122907 4.86152 0.0948238 4.90683C0.0667411 4.95215 0.048733 5.00297 0.0420208 5.05585C0.0353087 5.10874 0.0400499 5.16245 0.0559225 5.21334C0.0717952 5.26423 0.0984276 5.31111 0.134014 5.3508C0.177551 5.39879 0.230783 5.43699 0.290188 5.46288C0.349592 5.48876 0.413816 5.50174 0.478609 5.50094C0.576408 5.50151 0.67193 5.47144 0.751771 5.41496L3.70566 3.29842L5.18392 4.35669C5.26402 4.41266 5.35937 4.44267 5.45709 4.44267C5.5548 4.44267 5.65015 4.41266 5.73025 4.35669L8.02735 2.70844L8.61865 3.2422C8.64796 3.26878 8.68335 3.28775 8.72171 3.29744C8.76008 3.30713 8.80023 3.30724 8.83865 3.29777C8.87706 3.2883 8.91256 3.26953 8.94202 3.24311C8.97148 3.21669 8.99399 3.18344 9.00758 3.14628L9.69677 0.72485C9.70485 0.686298 9.70254 0.646292 9.69007 0.608929C9.6776 0.571565 9.65542 0.538187 9.62582 0.51221C9.59621 0.486234 9.56023 0.468594 9.52156 0.461095C9.48289 0.453597 9.44292 0.45651 9.40575 0.469537Z" fill="white"/>
</svg>
								</el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="copy backtest link"
									placement="bottom-start"
								>
									<el-button
										v-if="currentPage == 'Analyst'"
										:disabled="scope.row.status == 0 || scope.row.status == 3"
										plain
										icon="el-icon-link"
										circle
										size="mini"
										type="success"
										v-copy="scope.row.id"
									></el-button>
								</el-tooltip>
								<el-tooltip
									class="item"
									effect="dark"
									content="Add entry and exit criteria to my signal"
									placement="bottom-start"
									v-if="isButtonVisible"
								>
									<el-button
										v-if="['History', 'Favorites'].includes(currentPage) && isButtonVisible"
										:disabled="getIsBacktestRunningFlagState"
										type="primary"
										icon="el-icon-plus"
										circle
										size="mini"
										@click="addBacktestSignal(scope.row)"
									></el-button>
								</el-tooltip>
							</el-row>
						</template>
		</el-table-column>
		<div slot="empty" style="text-align: left">
			<el-empty image-size="80" description="No Data"></el-empty>
		</div>
    </el-table>
		<el-pagination
				@current-change="handleCurrentChange"
				:current-page="queryInfo.page"
				:page-size="10"
				layout="total, prev, pager, next"
				:total="queryInfo.total"
			>
		</el-pagination>
		<Optimize ref="OPT" @refreshList="refreshList"></Optimize>
	</div>
</template>

<script>
import {
  getHistoryList,
	getSampleList,
  getFavoriteList,
	getAnalystList,
	saveMySignalForm,
	searchIndicator
} from '@/service/service.js'
import {capitalizeFirstLetter, isJson} from '@/utils'
import { getSymbolInfo } from '@/utils/globalFunc'
import { throttle } from 'lodash'
import { CommonMethodsMixin } from "@/components/common/mixins/commonMethodsMixin"
import { copy } from "@/components/common/directives/copyBacktestID"
import { RefreshBus } from "../EventBus/Bus"
import Optimize from "@/components/common/optimizeBT/Optimize.vue";
import { mapGetters } from 'vuex';
import SignalCode from '@/utils/cryptoUtils/codeTool'

export default {
	name: 'Table',
	components: {
		Optimize
	},
	props: {
		tableCol: Array,
		currentPage: String,
		isExpandAll: Boolean,
		loading: Boolean
	},
	mixins: [CommonMethodsMixin],
	data() {
		return {
			dataList: [],
			loadTest: 'Loading...',
			queryInfo: {
				page: 1,
				total: 0
     		},
			searchItem: '',
     		currentSort: {}, // 当前的排序信息
			searchItem: '',
			isButtonVisible: false,
			typeTooltip: "'S' stands for Single Symbol Backtest, and 'D' stands for Dual Symbols Backtest.",
			strategyType: 'Strategy'
		}
	},
	directives: {
		copy
	},
	async created() {

		await this.getDataList(null)
	// 监听事件总线中的 refresh-list 事件
  	// RefreshBus.$on(`refresh-list`, (_) => {
    //   // 在这里执行刷新列表的操作，重新获取数据
    //   this.getDataList(null)
    // })
		this.loading = false
	},
	computed: {
		userRole() {
			return this.$store.state.user.role
		},
		is_admin() {
			return this.$store.state.user.is_admin
		},
		isSystem() {
			return this.$store.state.form.role
		},
		isOptRuning() {
			return this.$refs['OPT'].optimizeState
		},
		...mapGetters(['getIsBacktestRunningFlagState']),
	},
	watch: {
		userRole: {
			handler(newVal) {
			// 获取当前的域名
			const currentDomain = window.location.hostname;
			// 如果当前域名是 devbt2.sentimentrader.com 或 localhost，则将 isButtonVisible 设置为 true
			if ((currentDomain == 'devbt2.sentimentrader.com' || currentDomain == 'localhost')) {
				this.isButtonVisible = true;
			}
			// if (newVal == 'analyst') {
			// 	this.isButtonVisible = true;
			// }
		},
		immediate: true,
		deep: true
		},
	},
	methods: {
		// 处理custom symbol的特殊url显示
		getProcessedSymbol(symbol) {
			if (!symbol) return '';
			const { name, type } = getSymbolInfo(symbol);
			return type === 'custom' ? name : symbol;
		},
		async refreshList() {
			// 重置查询页码并获取数据 History
			if (this.currentPage === 'History') {
				this.queryInfo.page = 1
				await this.getDataList(null)
			}
			if (['Sample', 'Favorites', 'Analyst'].includes(this.currentPage)) {
				this.$router.push('/backtester/list/history')
			}
			this.popUpMsgBox('Optimize successfully')
		},
		optimizeBacktest(data) {
			this.$refs['OPT'].optimizeBacktest(data)
		},
		async getDataList(orderby) {
			let res = null
			try {
				if(this.currentPage == 'History'){
					res = await getHistoryList(this.queryInfo.page, orderby, this.searchItem, this.strategyType)
				}else if(this.currentPage == 'Favorites'){
					res = await getFavoriteList(this.queryInfo.page, orderby, this.searchItem, this.strategyType)
				}else if(this.currentPage == 'Sample'){
					res = await getSampleList(this.queryInfo.page, orderby, this.searchItem, this.strategyType)
				}else if(this.currentPage == 'Analyst'){
					res = await getAnalystList(this.queryInfo.page, orderby, this.searchItem, this.strategyType)
				}
				if (res.status == 200) {
					let data = res.data.results
					const parseJsonOrString = (value) => {
						if (typeof value === 'string') {
								try {
										return JSON.parse(value);
								} catch (error) {
										return [{
												commentDes: value,
												rocCond: {
														newCondition: 3,
														conditionPeriod: 5
												}
										}];
								}
						}
						return value;
					};
					data = data.map((item, index) => {
						if (item.total_return == null || item.total_trader == null) {
							if (isJson(item.result)) {
									const result = JSON.parse(item.result);
									item.total_return = result['Total Trades'];
									item.total_trader = result['Total Return (%)'];
							}
						}
						item.entry_description = parseJsonOrString(item.entry_description);
						item.exit_description = parseJsonOrString(item.exit_description);
						if(item.strategy === 'Dual' && item.entry2_description && item.exit2_description) {
							item.entry2_description = parseJsonOrString(item.entry2_description)
							item.exit2_description = parseJsonOrString(item.exit2_description)
						}
						item._last_entry_signal_date = item.last_entry_signal_date
						item._last_exit_signal_date = item.last_exit_signal_date
						if(item.strategy !== 'Dual' && typeof item._last_entry_signal_date === 'string' && item._last_entry_signal_date === 'None') {
							item._last_entry_signal_date = ''
						}
						if(item.strategy !== 'Dual' && typeof item._last_exit_signal_date === 'string' && item._last_exit_signal_date === 'None') {
							item._last_exit_signal_date = ''
						}
						if(item.strategy === 'Dual' && item._last_entry_signal_date && typeof item._last_entry_signal_date === 'string') {
							item._last_entry_signal_date = item._last_entry_signal_date.split(' ').map(item => {if(item === 'None') {return ''}else{return item}})
						}
						if(item.strategy === 'Dual' && item._last_exit_signal_date && typeof item._last_exit_signal_date === 'string') {
							item._last_exit_signal_date = item._last_exit_signal_date.split(' ').map(item => {if(item === 'None') {return ''}else{return item}})
						}

						return item;
					});

					this.dataList = data
					console.log('data', data)
					this.queryInfo.total = res.data.count
				}
			} catch(error) {
				console.log('报错了', error)
        if(error.response.status === 404) {
          let page = this.queryInfo.page
          const newPage = page != 1 ? page - 1 : 1
          this.handleCurrentChange(newPage)
        }
			}
		},
		tableRowClassName({row, rowIndex}) {
			if (rowIndex%2 === 0) {
			return 'dark-row'
			}
			return ''
		},
		handleCurrentChange(newpage) {
      this.queryInfo.page = newpage
      this.applySort()
    },
		async onSortChange({ column, prop, order }) {
			
			if(this.queryInfo.page != 1) this.queryInfo.page = 1
			/**
		 * 表格排序事件处理函数
		 * @param {object} {column,prop,order} 列数据|排序字段|排序方式
		 */
      if (column.sortable !== 'custom') return
			this.currentSort = {
					prop: prop,
					order: order,
				};
      await this.applySort()
    },
		async applySort() {
      let { prop, order } = this.currentSort;
			console.log('order', order)
			console.log('prop', prop)
      //  order: 升 'ascending' | 降'descending' | 取消升降 null | order: total_return 
      if (order == null || order == prop) {
        // 不排序
        prop = null
      }
      if (order == 'ascending') {
        // 升序排列
        prop = `-${prop}`
      }
			this.getDataList(prop)
		},
		handleQuery: throttle(function() {
			this.getDataList()
		}, 500),
		async handleSelect(type) {
			this.strategyType = type
      let { prop, order } = this.currentSort;
			// 这里先考虑 order 再考虑 strategy
			if (order == null || order == prop) prop = null
      if (order == 'ascending') prop = `-${prop}`
			this.currentSort = {prop, order}
			await this.getDataList(prop)
		},
		async addBacktestSignal(row) {
			// 生成名字并检查有没有重名
			const signalCode = new SignalCode()
			const {strategy, frequency, name, symbol, symbol2} = row
			const saveSignalsTimes = strategy !== 'Dual' ? 2 : 4
			const conditions = []
			const reasons = []
			for (let i = 0; i < saveSignalsTimes; i++) {
				const even = Boolean((i % 2) === 0)
				let criteriaName = (i === 0 && even) ? 'entry' : 'entry2'
				if(!even) criteriaName = i === 1 ? 'exit' : 'exit2'

					const {relation, signals_in_market, delay_bars, score, signals} = isJson(row[criteriaName]) ? JSON.parse(row[criteriaName]) : row[criteriaName]
					const criteria_description = isJson(row[`${criteriaName}_description`]) ? JSON.parse(row[`${criteriaName}_description`]) : row[`${criteriaName}_description`]
					const _description = criteria_description.map((item, i) => {
						if(i === 0) return item.commentDes.replace(/(E|X):.*?[:|;]\s*/, '').replace(/Single Condition\s*/, '')
						else return item.commentDes
					})
					const rocCond = criteria_description.map(item => item.rocCond)
					// const _signals = await signals.map(async item => {
					// 	debugger
					// 	if(typeof item.code === 'string' && !['SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999', 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'].includes(item.code)) {
					// 		const decode = signalCode.decode(item.code)
					// 		if(decode.analysis === 'User') {
					// 			const res = await searchIndicator(decode.indicator)
					// 			console.log('res', res)
					// 		}
					// 	}
					// 	return ({code: item.code})
					// })
					let _signals = []
					for (let index = 0; index < signals.length; index++) {
						const _signalItem = signals[index];
							try {
								if(typeof _signalItem.code === 'string' && !['SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/0/999999', 'SI:Smart Money Confidence;IDS:EO0.7/EP0.3;SC:SV/3/999999'].includes(_signalItem.code)) {
										const decode = signalCode.decode(_signalItem.code)
										if(decode.analysis === 'User') {
											debugger
											const {data} = await searchIndicator(decode.indicator)
											const element = data.results.find(ele => ele.name === decode.indicator)
											if(element) {decode.indicator = element.url}
											_signals.push({code: signalCode.encode(decode)})
										}else if(strategy === 'Dual' && decode.analysis === 'Symbol' && decode.indicator === 'Symbol Ratio') {
											reasons.push('Dual Symbol Backtest with Symbol Ratio is not supported')
											_signals = []
											break
										}
										else {_signals.push({code: _signalItem.code})}
								}
							} catch (error) {
									console.error(`Error processing condition: ${conditions}`, error);
							}
					}
					console.log('_signals', _signals)
					let _symbol = symbol
					if(strategy === 'Dual' && i >= 2) _symbol = symbol2
					const isRickControlAtExit = relation == 0 && criteriaName.startsWith('exit')
					if(isRickControlAtExit) reasons.push('Risk exit criteria are not supported')
					let _name = `${name} ${_symbol} ${capitalizeFirstLetter(criteriaName)}`
					// if(strategy === 'Dual' && i < 2) _name = `${name} ${_symbol} ${capitalizeFirstLetter(criteriaName)}`
					// if(strategy === 'Dual' && i >= 2) _name = `${name} ${_symbol}(2) ${capitalizeFirstLetter(criteriaName)}`
					const condition = {
						...row,
						symbol: _symbol,
						name: _name,
						relation,
						signals_in_market,
						delay_bars,
						score,
						signals:_signals,
						subscribe: 0,
						description: relation === 0 ? [] : _description,
						timeframe: frequency,
						cond: relation === 0 ? [] : rocCond
					}
					if(!isRickControlAtExit && _signals.length !== 0) conditions.push(this.reassignBTAttributes(condition))
			}
			console.log('conditions', conditions)
			if(conditions.length === 0) {
				const reasonsSet = Array.from(new Set([...reasons]))
				if(reasonsSet !== 0) this.popUpMsgBox(`${reasonsSet.join(', ')}`)
				return
			}
			try {
    const results = await Promise.all(
      conditions.map(_condition => saveMySignalForm(_condition))
    );
    console.log('All conditions processed:', results);
				const _results = results.map(res => {if(res.data.code === 211) return res.data.data}).filter(item => item).length
				const _duplicatedResults = results.map(res => {if(res.data.code === 411) return res.data.data}).filter(item => item).length
				const unsuccess = saveSignalsTimes - _results
				if(_duplicatedResults !== 0) reasons.push('Already exist')
				const reasonsSet = Array.from(new Set([...reasons]))
			console.log('reasonsSet', reasonsSet)
			const failMsg = `${unsuccess === 0 ? '' : `${unsuccess} signals not added: ${_duplicatedResults ===  unsuccess ? 'Already exist' : reasonsSet.join(', ')}`}`
				if(_results !== 0) this.popUpMsgBox(`
				${_results} signals have been successfully added.<br/>
			 ${failMsg}
				`)
				else {this.popUpMsgBox(`${unsuccess} signals not added: ${_duplicatedResults ===  unsuccess ? 'Already exist' : reasonsSet.join(', ')}.`)}
  } catch (error) {
    console.error('Error processing conditions:', error);
  }
		},
		reassignBTAttributes(data) {
			debugger
			// use for copy
			data['cond'] = isJson(data['cond']) ? data['cond'] : JSON.stringify(data['cond'])
			data['description'] = isJson(data['description']) ? data['description'] : JSON.stringify(data['description'])
			data['signals'] = isJson(data['signals']) ? data['signals'] : JSON.stringify(data['signals'])
			const selectedProps = [
				'name',
				'symbol',
				'timeframe',
				'signals',
				'score',
				'signals_in_market',
				'relation',
				'start_date',
				'end_date',
				'delay_bars',
				'subscribe',
				'cond',
				'description'
			]
			let backtestParams = Object.assign(
				{},
				...selectedProps.map((prop) => ({ [prop]: data[prop] }))
			)
		console.log('backtestParams', backtestParams)
			return backtestParams
		},
	}
}
</script>

<style lang="less" scoped>
.favoriteForm_container {
	background-color: #fff;
}
.searchBox {
  float: left;
  .search {
		margin: 20px 28px 10px 10px;
	}
}
.showDate {
	display: flex;
	flex-direction: column;
	/deep/.el-button + .el-button {
		margin-left: 0px;
	}
	/deep/ .el-button--mini,
	.el-button--mini.is-round {
		margin-bottom: 5px;
	}
}
/deep/ .el-table .cell {
	padding: 0px 10px 0px 10px;
	word-wrap: break-word;
}
/deep/.el-button + .el-button {
	margin-left: 0px;
}
/deep/ .el-button--mini.is-circle {
	margin-right: 5px;
	margin-bottom: 5px;
}
/deep/ .showDate .el-button--mini,
.el-button--mini.is-round {
	padding: 7px 0px;
}
.el-button--mini.is-circle {
	padding: 7px;
}
.el-table__body-wrapper {
	overflow-x: scroll;
}
.descriptionBox {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	> * {
		flex: 1;
	}
	.entryBox {
		font-weight: 600;
		p:first-child {
			font-weight: 600;
			font-size: 16px;
			color: #99a9bf;
		}
	}
	.exitBox {
		font-weight: 600;
		p:first-child {
			font-size: 16px;
			font-weight: 600;
			color: #99a9bf;
		}
	}
}
.fls-btn {
	float: right;
	color: white;
	background: #5b9bd1;
	width: 200px;
	margin-left: 20px;
	margin: 20px 28px 10px 10px
}
.urlBox p:first-child {
		font-weight: 600;
		color: #99a9bf;
		font-size: 16px;
}
.symbolBox {
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	p{
		height: 100%;
		margin: 0;
		padding: 100% 0;
	}
	p:nth-child(2) {
		border-top: 1px dashed #99a9bf;
	}
}
.entryAndExitBox {
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	p{
		height: 100%;
		margin: 0;
		padding: 5px 0;
	}
	.entryExit:nth-child(2) {
		border-top: 1px dashed #99a9bf;
	}
}
.BTTable /deep/ .el-icon-arrow-down {
	display: block;
}
.BTTable /deep/ .el-menu.el-menu--horizontal {
	border-bottom: none;
}
.BTTable /deep/ .el-menu--horizontal>.el-submenu.is-active .el-submenu__title {
	border-bottom: none;
}
/deep/ .el-button--info.is-plain {
	font-weight: 600;
	color: #606266;
}
/deep/ .el-menu--horizontal>.el-submenu .el-submenu__title {
	color: #333341;
}
</style>
const getters = {
	// form
	getAllSignalArray: state => state.form.run_all_backtest_array,
	getLastSignalArray: state => state.form.last_signal_array,
	getBacktestResult: state => state.form.backtestResult,
	exitFreqGetter: state => state.form.exitFrequency,
	getterBacktestInfo: state => state.form.backtestInfo,
	getterDirection: state => state.form.backtestInfo.direction,
	rowDataForDisplay: state => state.form.rowDataForDisplay,
	cachedBTBasicInfoData: state => state.form.cachedBTBasicInfoData,
	getBacktestZScoreResult: state => state.form.backtestZScoreResult,
	getBacktestSymbol: state => state.form.backtestSymbol,
	getCachedScopedRowDataImmutable: state => state.form.cachedScopedRowDataImmutable,
	getComparisonSymbol: state => state.form.comparisonSymbol,
	// chart
	getExtremeValue: state => state.chart.extremeValue,
	getSpanPeriod: state => state.chart.spanPeriod,
	getMiFormState: state => state.chart.miFormState,
	getMaLikeTech: state => state.chart.maLikeTech,
	getMiBenmarkState: state => state.chart.miBenmark,
	getColorByCriteriaAndIndex: (state) => (criteria, panelIndex) => {	// 返回计算得到的颜色值
		return criteria && criteria.endsWith('2') ?
		  state.chart.ma_color_2[panelIndex % state.chart.ma_color_2.length] :
		  state.chart.ma_color_1[panelIndex % state.chart.ma_color_2.length];
	  },
	getMySymbollist: state => state.chart.mySymbolList,
	getFavIndicatorList: state => state.chart.favIndicatorList,
	getMyIndicatorList: state => state.chart.myIndicatorList,

	// states
	getScannerAIFilterState: state => state.states.scannerai_filter,
	getScannerAIFlagState: state => state.states.scannerai_flag,
	getIsBacktestRunningFlagState: state => state.states.isBacktestRunning_flag,
	getIsRunAllSignalProcessingFlagState: state =>
		state.states.isRunAllSignalProcessing_flag,
	getIsMarkerShownFlagState: state => state.states.isMarkerShown_flag,
	getIsEditFinishFlagState: state => state.states.isEditFinish_flag,
	getBeforeCalculateNewConditions: state => state.states.beforeCalculateNewConditions,
	getSymbolUploadDomActive: state => state.states.symbolUploadDomActive,

	// user
	getIsAdmin: state => state.user.is_admin,
	getRole: state => state.user.role
}
export default getters

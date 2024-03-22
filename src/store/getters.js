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

	// states
	getScannerAIFilterState: state => state.states.scannerai_filter,
	getScannerAIFlagState: state => state.states.scannerai_flag,
	getIsBacktestRunningFlagState: state => state.states.isBacktestRunning_flag,
	getIsRunAllSignalProcessingFlagState: state =>
		state.states.isRunAllSignalProcessing_flag,
	getIsMarkerShownFlagState: state => state.states.isMarkerShown_flag,
	getIsEditFinishFlagState: state => state.states.isEditFinish_flag,
	getBeforeCalculateNewConditions: state => state.states.beforeCalculateNewConditions,

	// user
	getIsAdmin: state => state.user.is_admin,
	getRole: state => state.user.role
}
export default getters

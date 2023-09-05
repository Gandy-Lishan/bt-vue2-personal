const getters = {
	// form
	getAllSignalArray: state => state.form.last_signal_array,
	getLastSignalArray: state => state.form._last_signal_array,
	getBacktestResult: state =>  state.form.backtestResult,
	exitFreqGetter: state => state.form.exitFrequency,
	getterBacktestInfo: state => state.form.backtestInfo,
	getterDirection: state => state.form.backtestInfo.direction,
	resultDataForSetupDisplay: state => state.form.resultDataForSetupDisplay,

	// chart
	getExtremeValue: state => state.chart.extremeValue,
	getSpanPeriod: state => state.chart.spanPeriod,

	// states
	getScannerAIFilterState: state => state.states.scannerai_filter,
	getScannerAIFlagState: state => state.states.scannerai_flag,
	getIsBacktestRunningFlagState: state => state.states.isBacktestRunning_flag,
	getIsFindLastSignalRuningFlagState: state => state.states.isFindLastSignalRuning_flag,
	getIsMarkerShownFlagState: state => state.states.isMarkerShown_flag,
	getIsEditFinishFlagState: state => state.states.isEditFinish_flag,
	getBeforeCalculateNewConditions: state => state.states.beforeCalculateNewConditions,

	// user
	getIsAdmin: state => state.user.is_admin,
	getRole: state => state.user.role,
}
export default getters
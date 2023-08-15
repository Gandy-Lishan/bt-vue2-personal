const getters = {
	getAllSignalArray: state => state.app.last_signal_array,
	getLastSignalArray: state => state.app._last_signal_array,
	getExtremeValue: state => state.app.extremeValue,
	getBeforeCalculateNewConditions: state => state.app.beforeCalculateNewConditions,
	getBacktestResult: state =>  state.app.backtestResult,
	exitFreqGetter: state => state.app.exitFrequency,
	getScannerAIFilterState: state => state.app.scannerai_filter,
	getScannerAIFlagState: state => state.app.scannerai_flag,
	getIsBacktestRunningFlagState: state => state.app.isBacktestRunning_flag,
	getIsFindLastSignalRuningFlagState: state => state.app.isFindLastSignalRuning_flag,
	getIsMarkerShownFlagState: state => state.app.isMarkerShown_flag,
	getIsEditFinishFlagState: state => state.app.isEditFinish_flag,
}
export default getters
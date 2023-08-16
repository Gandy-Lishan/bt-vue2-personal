const getters = {
	// app
	getAllSignalArray: state => state.app.last_signal_array,
	getLastSignalArray: state => state.app._last_signal_array,
	getExtremeValue: state => state.app.extremeValue,
	getBacktestResult: state =>  state.app.backtestResult,
	exitFreqGetter: state => state.app.exitFrequency,

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
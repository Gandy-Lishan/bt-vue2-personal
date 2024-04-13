import { CIQ } from '@/components/common/chart/st-development/js/components'
import {__js_advanced_studies_accumulationDistribution_} from "./advance-studies/accumulationDistribution.js"
import {__js_advanced_studies_cci_} from "./advance-studies/cci.js"
import {__js_advanced_studies_rsi_} from "./advance-studies/rsi.js"
import {__js_advanced_studies_movingAverages_} from "./advance-studies/movingAverages.js"

let extendOverwrite = () => {
if (!CIQ.Studies) {
	console.error(
		"movingAverages feature requires first activating studies feature."
	);
} else {
	/**
	 * 覆写所有calculation function以适配dual symbol的加载逻辑
	 * 这是考虑到了原生chartiq大部分Tech不存在支持在另一个field计算显示的代码
	 * 这块代码不写在STOverwriteStudies是因为生命周期问题不生效
	 */
		CIQ.activateImports(
			__js_advanced_studies_accumulationDistribution_,
			__js_advanced_studies_cci_,
			__js_advanced_studies_rsi_,
			__js_advanced_studies_movingAverages_
		)


	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		"Center of Gravity": {
			name: "Center of Gravity",
			calculateFN: CIQ.Studies.calculateSTCenterOfGravity,
			inputs: { Period: 10, Field: "field" }
		},
		"MA Dev": {
			calculateFN: CIQ.Studies.calculateSTMADev,
			inputs: { "Points Or Percent": ["Percent","Points"] }
		},
	});
}

};
export {extendOverwrite}

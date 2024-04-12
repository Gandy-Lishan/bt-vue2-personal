import { CIQ } from '@/components/common/chart/st-development/js/components'

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
	CIQ.Studies.studyLibrary = CIQ.extend(CIQ.Studies.studyLibrary, {
		// 为了覆盖cci optix,用了小写的cci
		cci: {
			calculateFN: CIQ.Studies.calculateSTCCI,
		},
		"Center of Gravity": {
			calculateFN: CIQ.Studies.calculateSTCenterOfGravity,
		},
		"MA Dev": {
			calculateFN: CIQ.Studies.calculateSTCenterOfGravity,
		},
		"Awesome": {
			calculateFN: CIQ.Studies.calculateSTAwesomeOscillator,
		},
	});
}

};
export {extendOverwrite}

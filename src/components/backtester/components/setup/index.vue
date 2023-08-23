<template>
  <div class="setup">
    <div class="setupBox">
      <BasicInfo></BasicInfo>
  </div>
  <div class="set-up-container">
			<div class="criteria-container">
        <div class="criteria">
        <Criteria
        ref="entryChild"
        :config="setConfig('entry')"
        :direction="direction"
        @getEntryRelation="getEntryRelation"
        @sendEntrySignalIndex="sendEntrySignalIndex"
      ></Criteria>
        </div>
      <div class="divider"></div>
        <div class="criteria">
      <Criteria
        ref="exitChild"
        :config="setConfig('exit')"
        @isOnlyRiskControl="isOnlyRiskControl"
        @getExitRelation="getExitRelation"
        @sendExitSignalIndex="sendExitSignalIndex"
      ></Criteria>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { BasicInfo } from "@/components/backtester/components"
import { Criteria } from "@/components/backtester/components"
import { generateConfig } from "../criteria/config"
export default {
  name: 'SetUp',
  components: {
    BasicInfo,
    Criteria
  },
  data() {
    return {
    }
  },
  methods: {
    setConfig(criteria) {
      return generateConfig(criteria)
    }
  }
}
</script>

<style lang="less" scoped>
.setup {
	padding: 5px;
    background-color: #fff;
    border-radius: 12px;

}

.criteria {
	// margin-left: 40px;
	margin-bottom: 10px;
	flex: 1;
}
.criteria-container {
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #797979;
	align-items: flex-start;
}
@media (min-width: 820px) and (max-width: 1279px) {
	.criteria-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.criteria-container {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.criteria-container  {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #797979;
	}
}
.divider {
	width: 1.5px;
	background-color: #e8e6e6;
	opacity: 0.8;
	margin: 10px;
	align-self: stretch;
}
@media (min-width: 1280px) and (max-width: 1365px) {
	.criteria {
		margin: 0px 10px 10px 10px;
	}
}
@media (min-width: 820px) and (max-width: 1279px) {
	.criteria {
		margin: 0px 40px 10px 40px;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 768px) and (max-width: 819px) {
	.criteria {
		margin: 0px 40px 10px 40px;
		border-bottom: 1px solid #797979;
	}
}
@media (min-width: 375px) and (max-width: 767px) {
	.criteria {
		border-bottom: 1px solid #797979;
	}
	.criteria {
		margin: 0px 0px 10px 0px;
	}
	.criteria-title {
		font-size: 15px;
	}
}

</style>
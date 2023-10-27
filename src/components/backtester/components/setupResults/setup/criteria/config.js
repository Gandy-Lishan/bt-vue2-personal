import { capitalizeFirstLetter } from '@/utils'
// 传入不同的 criteria 生成不同的配置
export function generateConfig(criteria) {
	const capFirstL = capitalizeFirstLetter(criteria)
	const criteriaTitleTPRC = `
  ${
		criteria === 'exit'
			? "4. Only Use Risk Control: If the 'Risk Control at Exit' is set, this option can be chosen to trigger the backtest condition.<br />"
			: ''
	}
`
	const config = {
		criteria: criteria,
		criteriaCapFirstL: capFirstL,
		criteriaTitle: `${capFirstL} Criteria`,
		criteriaTitleTP: `Set the criteria/criterias which trigger the backtest ${criteria}
    criteria.<br />
    Choose one of the three options for ${criteria} criteria:<br />
    1. Single Condition: One condition will trigger the backtest
    condition.<br />
    2. SameBar Multi-Condition: More than one conditions (limit to 5)
    occurring at the same bar,will trigger the backtest condition.<br>
    3. TimeOrder Multi-Condition: More than one conditions (limit to 3)
    occurring within a number of bars,will trigger the backtest
    condition.<br />
    ${criteriaTitleTPRC}
    `,
		scoreTP: `Choose a value to specify how many following conditions will occur
    at the same bar to trigger the backtest condition.<br />
    if choose score 1, meanning if any one condition of the following
    conditions occur the backtest condition is met.<br />
    if choose score 2, meanning if any two of the conditions of the
    following conditions occur the backtest condition is met.<br />
    etc.<br />
    For example:<br />
    If the backtest condition needs to have a "AND" relation of 2
    conditions, set two conditions below and choose score 2.<br />
    If the backtest condition needs to have a "OR" relation of 2
    conditions, set two conditions below and choose score 1.<br />
    etc.<br />`,
		timeLimitTP: `By default, there is no time period restriction. <br/>
    When you select this box, it signifies that you are <br/>
    requiring these conditions to be sequentially met within the entered period. <br/>
    For instance, if you choose to input "5" for the period, <br/>
    it means that if the selected conditions are met in sequence within 5 bars, <br/>
    it indicates you can enter/exit.`,
		periodTP: `Choose a value to specify how many bars within which the
    following conditions will occur in time order to trigger the
    backtest condition.<br />
    if choose period 1, meanning if the following conditions occur at
    the same bar the backtest condition is met.<br />
    if choose period 2, meanning if the following conditions occur
    within two bars the backtest condition is met.<br />
    etc.<br />
    For example:<br />
    If the backtest condition needs to have two consecutive conditions,
    set two conditions below and choose period 2.<br />
    If the backtest condition needs to have two conditions occur within
    3 bars, set two conditions below and choose period 3.<br />
    etc.<br />`,
		DOBTP: `Check this option to delay the specified number of bars to
    enter when the ${criteria} criteria is met.<br />`
	}
	return config
}

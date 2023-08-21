 import { validateURLRule, validateCapitalRule, validateCommissionRule, validateSlippageRule  } from "@/utils/formValidate"
 export const formConfig = {
    formItems:[
        {
            field:'symbol',
            label:'Symbol',
            type:'select',
            placeholder:'enter keywords',
            options: [] // 这个是接口请求下来的列表
        },
        {
            field:'capital',
            label:'Starting Capital',
            type:'input',
            rule:[ { validator: validateCapitalRule, trigger: 'blur' } ]
        },
        {
            field:'commission',
            label:'Commission',
            type:'input',
            rule:[ { validator: validateCommissionRule, trigger: 'blur' } ]
        },
        {
            field:'slippage',
            label:'slippage',
            type:'input',
            rule:[ { validator: validateSlippageRule, trigger: 'blur' } ]
        },
        {
            field:'benchmark',
            label:'User Tag',
            type:'select',
            placeholder:'enter keywords',
            options: [] // 这个是接口请求下来的列表
        },
        {
            field:'user_tag',
            label:'benchmark',
            type:'select',
            placeholder:'— Select User Tag —',
            options: [
                { value: 'client', label: 'Client' },
                { value: 'analyst', label: 'Analyst' },
                { value: 'system', label: 'System' }
            ]
        },
        {
            field:'backtestPeriod',
            label:'Backtest Period',
            type:'select',
            placeholder:'— Select Backtest Period —',
            options: [
                {
                    value: 1,
                    label: '1 Year'
                  },
                  {
                    value: 2,
                    label: '2 Year'
                  },
                  {
                    value: 3,
                    label: '3 Year'
                  },
                  {
                    value: 4,
                    label: '4 Year'
                  },
                  {
                    value: 5,
                    label: '5 Year'
                  },
                  {
                    value: 10,
                    label: '10 Year'
                  },
                  {
                    value: 15,
                    label: '15 Year'
                  },
                  {
                    value: 20,
                    label: '20 Year'
                  },
                  {
                    value: 21,
                    label: 'All History'
                  },
                  {
                    value: 22,
                    label: 'Custom...'
                  }
            ]
        },
        {
            field:'startDate',
            label:'Start Date',
            type:'datePicker',
            placeholder:'— Select Start Date —',
            valueFormat: 'yyyy-MM-dd'
        },
        {
            field:'startDate',
            label:'Start Date',
            type:'input',
            placeholder: '',
        },
        {
            field:'endDate',
            label:'End Date',
            type:'datePicker',
            placeholder:'— Select End Date —',
            valueFormat: 'yyyy-MM-dd'
        },
        {
            field:'endDate',
            label:'End Date',
            type:'input',
        },
        {
            field:'frequency',
            label:'Timeframe',
            type:'select',
            placeholder:'— Select Timeframe —',
            options: [
                { value: 'Daily', label: 'Daily' },
                { value: 'Weekly', label: 'Weekly' },
                { value: 'Monthly', label: 'Monthly' }
            ]
        },
        {
            field:'trade_price',
            label:'Trade Price',
            type:'select',
            placeholder:'— Select Trade Price —',
            options: [
                { value: 0, label: 'Next Open' },
                { value: 1, label: 'Next Close' },
                { value: 2, label: 'Current Close' }
            ]
        },
        {
            field:'isExcludeOO',
            label:'Exclude Overlapping Observations',
            type:'checkbox'
        },
        {
            field:'exclude_oo',
            type:'input'
        },
        {
            field: 'report_url',
            label: 'Report URL',
            validator: validateURLRule
        },
        {
            field:'introduction',
            label:'Introduction',
            type:'textarea',
            placeholder: 'Give the backtest a introduction'
        },
        {
            field:'rules',
            label:'Rules',
            type:'textarea',
            placeholder: 'Give the backtest rules',
        },
        {
            field:'direction',
            label:'Direction',
            type:'radioGroup',
            radioOptions: [
                { label: 'Long', value: 'Long' },
                { label: 'Short', value: 'Short' },
            ]
        },
        {
            field:'isRiskControl',
            label:'Risk Control at Exit',
            type:'checkbox'
        },
        {
            field:'isTakeProfit',
            label:'Take Profit',
            type:'checkbox'
        },
        {
            field:'tp',
            type:'input'
        },
        {
            field:'isStopLoss',
            label:'Stop Loss',
            type:'checkbox'
        },
        {
            field:'sl',
            type:'input'
        },
        {
            field:'isTimeInMarket',
            label:'Time In Market',
            type:'checkbox'
        },
        {
            field:'tim',
            type:'input'
        },

        ],
        labelWidth:'80px',
        labelPosition: 'left',
        size: 'mini',
        colLayout:{
        xl:5,
        lg:8,
        md:12,
        sm:24,
        xs:24
        }
}

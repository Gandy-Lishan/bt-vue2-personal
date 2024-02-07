import Vue from 'vue'
// import locale from 'element-ui/lib/locale/lang/en'
import {
	Pagination,
	Dialog,
	Autocomplete,
	Menu,
	Submenu,
	MenuItem,
	Input,
	InputNumber,
	Radio,
	RadioGroup,
	Checkbox,
	CheckboxButton,
	Select,
	Option,
	Button,
	Table,
	TableColumn,
	DatePicker,
	Popover,
	Tooltip,
	Form,
	FormItem,
	Tabs,
	TabPane,
	Tag,
	Icon,
	Row,
	Col,
	Upload,
	Progress,
	Card,
	Collapse,
	CollapseItem,
	Link,
	Divider,
	Image,
  Loading,
	Message,
	Notification,
	Popconfirm,
	Descriptions,
	Statistic
} from 'element-ui'

Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Autocomplete)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Checkbox)
Vue.use(CheckboxButton)
Vue.use(Select)
Vue.use(Option)
Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(DatePicker)
Vue.use(Popover)
Vue.use(Tooltip)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Tag)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Upload)
Vue.use(Progress)
Vue.use(Card)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Link)
Vue.use(Divider)
Vue.use(Image)
Vue.use(Popconfirm)
Vue.use(Descriptions)
Vue.use(Statistic)
//   Vue.use( ElementUI,{locale} )
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$notify = Notification
Vue.prototype.$message = Message
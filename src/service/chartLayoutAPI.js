import axios from '../axios'
import * as mqs from 'qs'
import { CIQ } from '@/components/common/chart/st-development/js'

/**
 * 获取所有布局的 API (GET 请求)
 * @returns {Promise<Array>}
 */
export const getLayouts = () => {
  const url = `/dev/st_data/user_chart_set/`

  return new Promise((resolve,reject) => {
    axios
			.get(url)
			.then(res => {
				if(res.data.code == 404) {
					resolve([])
				} else resolve(JSON.parse(res.data.data.chart_set))
			})
			.catch(err => {
				reject(err)
			})
  });
};

/**
 * 根据 ID 获取单个布局的 API (GET 请求)
 * @param {string} layoutId - 布局的 ID
 * @returns {Promise<object>}
 */
export const getChartLayoutById = (layoutId) => {
  const url = `/dev/st_data/user_chart_set/`

  return new Promise((resolve, reject) => {
    axios
      .get(url, { params: { id: layoutId } })
      .then(res => {
        if (res.data.code === 200 && res.data.data.chart_set) {
          resolve(res.data.data.chart_set)
        } else {
          reject(new Error('Layout not found'))
        }
      })
      .catch(err => {
        reject(err)
      })
  });
};

/**
 * 更新布局的 API (POST 请求)
 * @param {object} layoutData - 包含 { name: string } 的对象
 * @returns {Promise<object>}
 */
export const updateLayout = (layouts) => {
  const url = `/dev/st_data/user_chart_set/`
	const headers = {
		'Content-Type': 'application/json'
	}
	const formData = new FormData()
	formData.append('chart_set', JSON.stringify(layouts))
	return new Promise((resolve, reject) => {
		axios
			.post(url, formData, { headers, withCredentials: true })
			.then(res => {
				resolve(res)
			})
			.catch(err => {
				reject(err)
			})
	})
};

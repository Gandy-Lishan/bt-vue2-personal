    <template>
        <div class="symbol-uploader">
            <el-upload
                class="upload-demo"
                :action="uploadUrl"
                :on-preview="_handlePreview"
                :on-progress="handleUploadProgress"
                :on-remove="handleRemove"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :http-request="uploadFile"
                :before-upload="beforeUpload"
                :multiple="false"
                :limit="1"
                :on-exceed="handleExceed"
                :file-list="fileList"
                ref="upload"
            >
                <el-button size="mini" type="primary" class="upload-indicator-btn"
                    >Click to upload custom indicator file</el-button
                >
                <div slot="tip" class="el-upload__tip">
                    You can only upload 1 csv file which doesn't exceed 1MB. File names are
                    only allowed to contain English letters, numbers, spaces, and
                    underscores.
                    <el-button type="text" @click="exampleDataVisible = true"
                        >View Example Data</el-button
                    >
                </div>
            </el-upload>

            <el-dialog :title="previewFileName" :visible.sync="previewVisible">
							<el-table
								:data="previewData"
								style="margin-top: 20px; max-height: 400px; overflow-y: auto"
							>
								<el-table-column label="Date" prop="Date"></el-table-column>
								<el-table-column label="Close" prop="Close"></el-table-column>
							</el-table>
							<el-pagination
								small
								@current-change="handleCurrentChange"
								:current-page="previewPage.page"
								:page-size="100"
								layout="total, prev, pager, next"
								:total="previewPage.total"
							>
							</el-pagination>
      </el-dialog>
      <el-dialog
        :title="previewFileName"
        :visible.sync="dialogFormVisible"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
      >
        <el-form
          :model="form"
          class="custom-indicator-form"
          :rules="userIndicatorRules"
          ref="userForm"
        >
          <el-form-item
            label="Indicator Name"
            :label-width="formLabelWidth"
            prop="indicatorName"
          >
            <el-input
              v-model="form.indicatorName"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose"
            >Use the file name directly</el-button
          >
          <el-button
            type="primary"
            @click="handleDialogConfirm('userForm')"
            >Confirm</el-button
          >
        </div>
      </el-dialog>
      <el-dialog
        :title="nonBusinessTitle"
        :visible.sync="nonBusinessDialogVisible"
        :show-close="false"
      >
        <el-card
          class="box-card"
          style="margin-top: 20px; max-height: 400px; overflow-y: auto"
        >
          <div
            v-for="item in nonBusinessDay"
            :key="item"
            class="text item"
          >
            {{ item }}
          </div>
        </el-card>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelBusinessDialogClose">Cancel</el-button>
          <el-button type="primary" @click="confirmBusinessDialogClose"
            >Ignore</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :title="exampleDataTitle"
        :visible.sync="exampleDataVisible"
      >
        <el-table
          :data="exampleData"
          style="margin-top: 20px; max-height: 400px; overflow-y: auto"
        >
          <el-table-column label="Date" prop="Date"></el-table-column>
          <el-table-column label="Close" prop="Close"></el-table-column>
        </el-table>
      </el-dialog>
        </div>
    </template>
    
    <script>
    import SparkMD5 from 'spark-md5'
    import { CIQ } from '@/components/common/chart/st-development/js'
    import {
    csvFileDelete,
    csvFileRead,
    getPairData,
    csvFilePagingRead,
    } from '@/service/service'
    import Papa from 'papaparse'
    import axios from 'axios'
    import {compareArrays, formatStandardTime, capitalizeFirstLetter} from '@/utils'
    import moment from 'moment'

    export default {
        name: 'Uploader',
        data() {
            var validateIndicatorName = (rule, value, callback) => {
                const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
                let _value = value.replace(/\s*/g, "")
                if (!_value && this.indicatorRadio == "Users' Own Indicator") {
                    callback(new Error('Name cannot be empty.'))
                } else if (!reg.test(_value)) {
                    //callback(new Error('It must start with a letter and can only contain letters, numbers, spaces, and underscores.'))
                    callback()
                } else {
                    callback()
                }
            }
            return {
                fileList: [],
                actionUrl: '', // 文件上传的接口地址
                headers: {
                    'Content-Type': 'multipart/form-data'
                }, // 请求头部
                previewVisible: false, // 是否显示预览表格
                previewData: [], // 预览表格的数据
                previewFileName: '',
                previewFileID: '',
                previewPage: {
                    page: 1,
                    total: 0
                },
                cancelToken: null, // 用于保存取消上传请求的取消令牌
                uploadUrl: '/dev/dev/uploadcsvfile/',
                uploadHeaders: {},
                dialogFormVisible: false,
                form: {
                    indicatorName: ''
                },
                formLabelWidth: '120px',
                userIndicatorRules: {
                    indicatorName: [{ validator: validateIndicatorName, trigger: 'blur' }],
                    dialogValid: false
                },
                rawMap: {}, // 文件对象的 raw 属性备份
                file_hash: '',
                nonBusinessTitle: 'Non-trading day schedule in CSV',
                nonBusinessDay: [],
                nonBusinessDialogVisible: false,
                nonBusinessFile: '',
                exampleDataTitle: 'Example Data',
                exampleData: [
                    { Date: '2018-01-02', Close: '54.24' },
                    { Date: '2018-01-03', Close: '46.15' },
                    { Date: '2018-01-04', Close: '53.87' },
                    { Date: '2018-01-05', Close: '62.65' },
                    { Date: '2018-01-08', Close: '51.61' },
                    { Date: '2018-01-09', Close: '49.73' },
                    { Date: '2018-01-10', Close: '52.37' },
                    { Date: '2018-01-11', Close: '58.09' },
                    { Date: '2018-01-12', Close: '62.6' },
                    { Date: '2018-01-16', Close: '50.63' }
                ],
                exampleDataVisible: false,
                typeOptions: [
                    { value: 'Sentiment Indicator', label: 'Sentiment Indicator' },
                    { value: 'Technical Indicator', label: 'Technical Indicator' },
                    { value: 'Symbol OHLCV', label: 'Symbol OHLCV' },
                    { value: "Users' Own Indicator", label: "Users' Own Indicator" }
                ],
                createdIndicatorOptions: []
            }
        },
        methods: {
            uploadFile(file) {
        console.log('文件上传', file)
        const self = this
        let suffix = ''
        // 创建 FormData 对象，将文件添加到 FormData 中

        const formData = new FormData()
        try {
            suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1]
        } catch (error) {
            return
        }
        const name = file.name.replace(`.${suffix}`, '')
        const fileName = name.replace(/\s*/g, "")
        formData.append('name', fileName)
        formData.append('hash', file.hash)
        formData.append('suffix', suffix)
        formData.append('file', file)

        // 创建 CancelToken 实例
        const cancelToken = axios.CancelToken.source()

        // 保存取消令牌，以便在需要终止上传时使用
        // 保存取消令牌，以便在需要终止上传时使用
        self.cancelToken = cancelToken
        // 发送上传请求
        axios
            .post(self.uploadUrl, formData, {
            headers: {
                ...self.uploadHeaders,
                ...{
                cancelToken: cancelToken.token
                }
            },
            onUploadProgress: (event) => {
                // 文件上传进度的处理逻辑
                // self.handleUploadProgress(event, file.uid, self.fileList);
                // const progress = Math.round((event.loaded * 100) / event.total)
                // const curLi =
                // 	self.$refs.upload.$el.querySelector('.el-progress-bar__inner') ||
                // 	null
                // console.log(
                // 	curLi,
                // 	self.$refs.upload.$el.querySelector('.el-progress__text')
                // )
                // self.$refs.upload.$el.querySelector(
                // 	'.el-progress-bar__inner'
                // ).style.width = progress + '%'
                // this.$refs.upload.$el.querySelector('.el-progress__text').innerHTML = this.progress + '%';
                // ...
            }
            })
            .then((response) => {
            CIQ.hideCover()
            CIQ.nprogress.done()

            // 文件上传完成后的处理逻辑
            console.log('文件上传成功', response)
            const { status, error } = response.data
            // self.$store.commit('form/saveUserCustomIndicator', response.data.fileID)
            // 还原文件对象的 raw 属性
            if (status == 200 || status == 201) {
                self.$notify.success({
                title: 'Tips',
                message: 'File uploaded successfully. You can click on the file to preview it.',
                duration: 0
                });
                self.previewFileID = response.data.file_id
                const obj = {}
                obj.index = this.panelIndex
                obj.val = response.data.file_id
                obj.criteriaCF = capitalizeFirstLetter(this.criteria)
                if (self.criteria.startsWith('entry')) {
                self.$store.commit(`form/saveUsersOwnFileHash`, obj)
                }
                if (self.criteria.startsWith('exit')) {
                self.$store.commit(`form/saveUsersOwnFileHash`, obj)
                }
                let fileObj = {}
                fileObj.index = self.panelIndex
                fileObj.val = {
                data: response.data,
                criteria: self.criteria,
                index: self.panelIndex
                }
                self.$emit('userUploadFileContent', fileObj)
                // self.handleUsersOwnIndicatorSelect(response.data)
                // let valObj = {}
                // valObj.value = this.si.userIndicator
                // valObj.index = this.panelIndex
                // self.$emit('getIndicatorVal', valObj)
            } else {
                return Promise.reject(error)
            }
            // ...
            })
            .catch((error) => {
            CIQ.hideCover()
            CIQ.nprogress.done()
            // 文件上传出错的处理逻辑
            console.log('文件上传失败', error)
            // 清空文件列表
            self.$refs.upload.clearFiles()
            self.fileList = []
            self.$notify.warning({
                title: 'Tips',
                message: 'File upload failed.',
                duration: 0
            });

            // ...
            })
        },
        handleUploadSuccess(response, file, fileList) {
        // 上传成功回调
        console.log('上传成功回调：', response)
        // 更新文件列表中对应文件的状态为成功
        // this.fileList.forEach((item) => {
        // 	if (item.uid === file.uid) {
        // 		item.progress = 100 // 进度设置为 100
        // 		item.status = 'success' // 状态设置为成功
        // 	}
        // })
        },
        handleUploadError(error, file, fileList) {
            // 上传失败回调
            console.log('上传失败：', error)
            this.dialogFormVisible = false
            this.$refs.upload.clearFiles()
            this.fileList = []
            // 更新文件列表中对应文件的状态为
            },
            async handleRemove(file, fileList) {
            console.log('处理删除', file)
            // 备份文件对象的 raw 属性
            this.rawMap[file.uid] = this.rawMap[file.uid] || file.raw
            // 发送请求删除服务器上的文件
            const hash = this.file_hash || file.hash
            const fileID = file.name.replace('.csv', '') + 'HASH' + hash
            if (!hash) { this.$refs.upload.clearFiles(); this.fileList = []; return }
            try {
                await csvFileDelete(fileID)
                console.log('删除成功')
                const index = this.fileList.indexOf(file)
                if (index !== -1) {
                this.fileList.splice(index, 1)
                }
                this.$refs.upload.clearFiles();
                this.fileList = []

                //this.clearUserOwnIndicatorSelect()
            } catch (error) {
                console.log('删除失败', error)
            }
        },
        handlePreview(file) {
        CIQ.addCover('Parsing the file....')
        CIQ.nprogress.start()
        const fileContent = atob(file.raw.split(',')[1]) // 解码 Base64 数据
        Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            complete: (result) => {
            // 获取解析后的数据
            const data = result.data
            // 更新预览表格的数据
            this.previewData = data
            this.previewFileName = file.name
            // 显示预览表格
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.previewVisible = true
            },
            error: (error) => {
            // 解析错误时的处理逻辑
            console.error('解析错误:', error)
            this.$notify.warning({
                title: 'Tips',
                message: 'File parsing error, unable to preview.',
                duration: 0
            });
            CIQ.hideCover()
            CIQ.nprogress.done()
            }
        })
        },
        async _handlePreview(file) {
        // CIQ.addCover('Parsing the file....')
        // CIQ.nprogress.start()
        // const fileContent = atob(file.raw.split(',')[1]) // 解码 Base64 数据
        // Papa.parse(fileContent, {
        //   header: true,
        //   skipEmptyLines: true,
        //   complete: (result) => {
        //     // 获取解析后的数据
        //     const data = result.data
        //     // 更新预览表格的数据
        //     this.previewData = data
        //     this.previewFileName = file.name
        //     // 显示预览表格
        //     CIQ.hideCover()
        //     CIQ.nprogress.done()
        //     this.previewVisible = true
        //   },
        //   error: (error) => {
        //     // 解析错误时的处理逻辑
        //     console.error('解析错误:', error)
        //     this.popUpMsgBox('File parsing error, unable to preview.')
        //     CIQ.hideCover()
        //     CIQ.nprogress.done()
        //   }
        // })

        CIQ.addCover('Parsing the file....')
        CIQ.nprogress.start()
        const str = this.previewFileID
        const page = this.previewPage.page
        const startIndex = str.indexOf('HASH')
        const endIndex = startIndex + 4 // 假设 "HASH" 的长度为 4
        if (startIndex !== -1) {
            const beforeHash = str.substring(0, startIndex)
            const afterHash = str.substring(endIndex)
            await this.getPreviewList(beforeHash, afterHash, page)
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.previewVisible = true
        }
        },
        handleExceed(files, fileList) {
        this.$notify.warning({
            title: 'Tips',
            message: 'Only single indicator files can be uploaded.',
            duration: 0
        });
        return false
        },
        async beforeUpload(file) {
        CIQ.addCover('File verification in progress...')
        CIQ.nprogress.start()
        if (!file.raw) {
            const reader = new FileReader()
            reader.onload = (event) => {
            file.raw = event.target.result
            }
            reader.readAsDataURL(file)
        }
        console.log('上传前', file)
        // 备份文件对象的 raw 属性
        this.rawMap[file.uid] = this.rawMap[file.uid] || file.raw
        if (!/(CSV)/i.test(file.type)) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
            title: 'Tips',
            message: 'The uploaded file must be in CSV format.',
            duration: 0
            });
            return Promise.reject('The uploaded file must be in CSV format.')
        }
        const reg = /^[a-zA-Z][a-zA-Z0-9_]*$/
        let fileName = file.name.replace(/\s*/g, "")
        if (!reg.test(fileName.replace('.csv', ''))) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
            title: 'Tips',
            message: 'The file name must start with a letter and can only contain letters, numbers, spaces, and underscores.',
            duration: 0
            });
            return Promise.reject('The file name must start with a letter and can only contain letters, numbers, spaces,and underscores.')
        }
        if (file.size === 0) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
            title: 'Tips',
            message: 'Empty files cannot be uploaded.',
            duration: 0
            });
            return Promise.reject('Empty files cannot be uploaded.')
        }
        // 限制文件上传大小 1M
        if (file.size > 1 * 1024 * 1024) {
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
            title: 'Tips',
            message: 'The uploaded file cannot exceed 1MB.',
            duration: 0
            });
            return Promise.reject('The uploaded file cannot exceed 1MB.')
        }
        try {
            try {
            await this.validateCSV(file)
            await this.handleParseResult(this.csvContent, file)
            } catch (error) {
                console.log(error)
            throw Error()
            }
            this.form.indicatorName = file.name.replace('.csv', '')
            this.fileList.push(file)
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.dialogFormVisible = true
        } catch (error) {
            console.log('error', error)
            this.dialogFormVisible = false
            CIQ.hideCover()
            CIQ.nprogress.done()
            return Promise.reject(error)
        }
        return false
        },
        handleUploadProgress(event, uid, fileList) {
        // 上传进度回调
        let { loaded, total } = event
        const progress = (loaded / total) * 100
        this.fileList = fileList.map((item) => {
            console.log(item.uid)
            if (item.uid === uid) {
            item.progress = progress
            }
        })
        // const progress = Math.round(event.percent);
        // 自定义方式展示进度条
        // this.$refs.upload.$el.querySelector('.el-progress-bar__inner').style.width = progress + '%';
        },
        handleDialogClose() {

        CIQ.addCover('File upload in progress...')
        CIQ.nprogress.start()
        console.log('弹窗关闭')
        this.$refs['userForm'].resetFields()
        this.dialogFormVisible = false
        const file = this.fileList[this.fileList.length - 1]
        this.uploadFile(file)
        },
        handleDialogConfirm(formName) {

        CIQ.addCover('Uploading file...')
        CIQ.nprogress.start()
        this.$refs[formName].validate((valid) => {
            if (valid) {
            console.log('this.fileList', this.fileList)
            this.fileList.map((item) => {
                const oldFileName = item.name
                const _indicatorName = this.form.indicatorName.replace(/\s*/g, "")
                const newFileName = oldFileName.replace(
                oldFileName.replace('.csv', ''),
                _indicatorName
                )
                const file = this.fileList[this.fileList.length - 1]
                console.log('弹窗确认')
                const blob = file.slice(0, file.size, file.type)
                const newFile = new File([blob], newFileName, { type: file.type })
                newFile.uid = file.uid
                newFile.hash = this.file_hash
                this.fileList.splice(-1, 1, newFile)
                this.dialogValid = true
                this.dialogFormVisible = false
                this.uploadFile(newFile)
            })
            // this.$refs.upload.submit()
            return
            } else {
            CIQ.hideCover()
            CIQ.nprogress.done()
            }
        })
        },
        cancelIndicatorName(formName) {
        this.$refs[formName].resetFields()
        this.dialogFormVisible = false
        },
        async validateCSV(file) {
        const self = this
        return await new Promise((resolve, reject) => {
            // 限制字段
            let isDateFormat = true
            let isNumFormat = true
            let isNotEmpty = true
            self.csvContent = []
            const reader = new FileReader()
            reader.onload = (e) => {
            const content = e.target.result
            const hash = SparkMD5.hashBinary(reader.result)
            file.hash = hash
            self.file_hash = hash
            const rows = content.trim().split('\n')
            const headers = rows[0].trim().split(',')
            const lines = content.split('\n')
            // 获取 CSV 文件的字段顺序
            const fieldOrder = lines[0].trim().split(',')
            const isOrdered = this.validateCSVFieldOrder(fieldOrder)
            if (!isOrdered) {
                CIQ.hideCover()
                CIQ.nprogress.done()
                return reject(new Error('CSV field order is incorrect.'))
            }

            // 判断表头和表内容是否都存在
            if (
                headers.length === 0 ||
                (headers.length !== 0 && rows.length === 1)
            ) {
                isNotEmpty = false
            }
            // 使用 PapaParse 解析 CSV 文件内容
            const errorRow = []
            const result = Papa.parse(content, {
                header: true, // 指定是否将第一行作为字段名
                skipEmptyLines: true,
                trimHeaders: true, // 去除表头中每个字段的空格
                trimRows: true, // 去除数据行中每个字段的空格
                step: function (row) {
                const error = {}
                const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/
                const dateColumnIndex = 'Date'
                for (const key in row.data) {
                    if (Object.hasOwnProperty.call(row.data, key)) {
                    row.data[key] = row.data[key].trim()
                    }
                }
                // const trimmedRow = row.data.map((value) => value.trim())
                const dateCell = row.data[dateColumnIndex]
                const numFormatRegex = /^-?\d+(\.\d{1,})?$/
                const numColumnIndex = 'Close' // Change this to the index of the column you want to check
                const numCell = row.data[numColumnIndex]
                if (!dateFormatRegex.test(dateCell)) {
                    console.log('日期格式校验失败', dateCell)
                    error.Date = dateCell
                    error.Close = numCell
                    isDateFormat = false
                    errorRow.push(error)
                    // parser.pause()
                    return
                }
                if (!numFormatRegex.test(numCell)) {
                    console.log('数字格式校验失败')
                    error.Date = dateCell
                    error.Close = numCell
                    errorRow.push(error)
                    isNumFormat = false
                    // parser.pause()
                    return
                }
                errorRow.push(error)
                self.csvContent.push(row)
                // parser.resume()
                },
                complete: function () {
                // resolve(csvContent)
                },
                error: (error) => {
                reject(error)
                }
            })
            // 进行字段校验
            const isVerified = this.validateFields(errorRow)
            if (
                isVerified &&
                isOrdered &&
                isDateFormat &&
                isNumFormat &&
                isNotEmpty
            ) {
                // this.progress = 0 // 每次上传前重置进度为0
                // this.fileList.push({
                // 	uid: file.uid,
                // 	name: file.name,
                // 	progress: 0, // 进度初始化为 0
                // 	status: 'uploading' // 状态设置为上传中
                // })
                // this.form.indicatorName = file.name.replace('.csv', '')
                // this.fileList.push(file)
                // this.dialogFormVisible = true
                resolve(file)
            } // 校验通过，允许上传
            if (!isNotEmpty) {
                CIQ.hideCover()
                CIQ.nprogress.done()
                this.$notify.warning({
                title: 'Tips',
                message: 'Uploaded CSV file is empty. Ensure table header and content are present.',
                duration: 0
                });
                return reject(
                new Error('Uploaded CSV file is empty. Ensure table header and content are present.')
                )
            }
            if (!isVerified) {
                CIQ.hideCover()
                CIQ.nprogress.done()
                return reject(new Error('CSV field validation failed.'))
            }
            if (!isDateFormat) {
                CIQ.hideCover()
                CIQ.nprogress.done()
                this.$notify.warning({
                title: 'Tips',
                message: 'Date column in the file has an incorrect format. It should be in yyyy-MM-dd format, like 2023-04-20.',
                duration: 0
                });
                return reject(
                new Error(
                    `Date column in the file has an incorrect format. It should be in yyyy-MM-dd format, like 2023-04-20.`
                )
                )
            }
            if (!isNumFormat) {
                CIQ.hideCover()
                CIQ.nprogress.done()
                this.$notify.warning({
                title: 'Tips',
                message: 'Close column in the file has an incorrect format. It must be a numerical value, such as 45.55.',
                duration: 0
                });
                return reject(
                new Error(
                    `Close column in the file has an incorrect format. It must be a numerical value, such as 45.55.`
                )
                )
            }
            }
            reader.readAsText(file)
        })
        },
        validateFields(_data) {
        const data = _data.filter(item => Object.keys(item).length)
        if (data.length > 0) {
            // 如果有错误，显示错误信息 生成表格行的 HTML
            const tableRows = data.map(item => `
            <tr>
                <td>${item.Date}</td>
                <td>${item.Close}</td>
            </tr>
            `).join('');

            // 生成完整的 HTML 片段，包括表头和动态生成的行
            const tableHTML = `
            <div>
                <p>Data format is wrong in these rows. Correct before re-uploading.</p>
                <table border="1" style="width: 100%; text-align: center">
                <tr>
                    <th>Date</th>
                    <th>Close</th>
                </tr>
                ${tableRows}
                </table>
            </div>
            `;

            // 使用 $message 显示 HTML
            this.$notify.warning({
            title: 'Incorrect Data Format in Rows',
            dangerouslyUseHTMLString: true,
            message: tableHTML,
            duration: 0
            });
            return false
        }
        return true
        },
        validateCSVFieldOrder(fieldOrder) {
        // 在这里进行 CSV 字段顺序校验的逻辑
        const orderedValues = ['Date', 'Close'] // 规定顺序
        for (let i = 0; i < fieldOrder.length - 1; i++) {
            const currentIndex = orderedValues.indexOf(fieldOrder[i])
            const nextIndex = orderedValues.indexOf(fieldOrder[i + 1])
            // 首先名称存在，再判断顺序
            if (
            currentIndex !== -1 &&
            nextIndex !== -1 &&
            currentIndex > nextIndex
            ) {
            this.$notify.warning({
                title: 'Tips',
                message: 'Field order validation failed.',
                duration: 0
            });
            return false
            }
            if(currentIndex == -1 || nextIndex == -1) {
            this.$notify.warning({
                title: 'Tips',
                message: 'File header is missing or incorrect. It should be: [Date, Close].',
                duration: 0
            });
            return false
            }
        }
        return true
        },
        async handleParseResult(data, file) {
        console.log('处理过的结果', data)
        // 按照时间排序
        const sortedRows = data.sort(
            (a, b) => moment(a.data.Date) - moment(b.data.Date)
        )
        // 获取 Date 列的数据
        const dateData = sortedRows.map((row) => row.data.Date)
        // 计算时间间隔
        const startDate = dateData[0]
        const endDate = dateData[dateData.length - 1]
        console.log('🚀',this.$store)
        debugger
        const frequency = this.$store.state.form.backtestInfo.frequency.toLowerCase()
        if (frequency !== 'daily') {
            this.$notify.warning({
            title: 'Tips',
            message: 'Only daily CSV files can be uploaded. Please set the timeframe to Daily and try uploading again.',
            duration: 0
            });
            return Promise.reject(
            `Only daily CSV files can be uploaded. Please set the timeframe to Daily and try uploading again.`
            )
        }
        const symbol = this.$store.state.form.backtestSymbol || process.env.VUE_APP_DEFAULT_SYMBOL
        const res = await getPairData(startDate, endDate, frequency, symbol)
        const pairDataDate = res.data.map((item) => {
            const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/
            if (dateRegex.test(item.DT)) {
            const dateObj = new Date(item.DT)
            const formattedDate = dateObj.toISOString().slice(0, 10)
            return formattedDate
            } else {
            console.log('Invalid date format')
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
                title: 'Tips',
                message: 'Invalid date format.',
                duration: 0
            });
            return Promise.reject(`Invalid date format.`)
            }
        })
        // const pairStartDate = pairDataDate[0]
        // const pairEndDate = pairDataDate[pairDataDate.length - 1]
        // const filteredArr = dateData.filter(date => date >= pairStartDate && date <= pairEndDate);
        //  const filteredArr = dateData
        const isDiffDateArr = compareArrays(dateData, pairDataDate)
        if (isDiffDateArr === true) {
            // 用户上传的 Date 和 pairData 的 Date 一致
            return Promise.resolve(true)
        } else {
            const diffDateArr = Array.from(new Set(isDiffDateArr))
            CIQ.hideCover()
            CIQ.nprogress.done()
            this.$notify.warning({
            title: 'Tips',
            message: 'Only daily CSV files can be uploaded. Please ensure that the CSV file does not contain non-trading days such as weekends and public holidays.',
            duration: 0
            });
            console.log('上传的 CSV 中, 以下时间是非交易日', diffDateArr)
            this.nonBusinessDay = diffDateArr
            this.nonBusinessFile = file
            this.nonBusinessDialogVisible = true
            return Promise.reject(
            `Only daily CSV files can be uploaded. Please ensure that the CSV file does not contain non-trading days such as weekends and public holidays.`
            )
        }
        },
        cancelBusinessDialogClose() {
        this.nonBusinessDialogVisible = false
        },
        confirmBusinessDialogClose() {
        this.nonBusinessDialogVisible = false
        const file = this.nonBusinessFile
        const csvData = file.raw
        const csvContent = csvData.split(';base64,').pop();
        const decodedData = atob(csvContent);
        const parsedData = this.parseCSV(decodedData);
        console.log('解析的数据', parsedData)
        const filteredData = parsedData.filter((row) => !this.nonBusinessDay.includes(row.Date));
        console.log('filteredData', filteredData)

        function convertToCSV(dataArray) {
            const headers = Object.keys(dataArray[0]);
            const rows = dataArray.map((row) => headers.map((header) => row[header]));
            const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
            // return `data:text/csv;base64,${btoa(csvContent)}`;
            return csvContent
        }

        const filteredCsvData = convertToCSV(filteredData);
        const base64Data = btoa(filteredCsvData); // 编码为 Base64
        const rawValue = `data:text/csv;base64,${base64Data}`;
        const filteredFile = new File([filteredCsvData], `${file.name}`, { type: 'text/csv' });
        filteredFile.raw = rawValue;
        filteredFile.uid = file.uid;
        filteredFile.hash = file.hash;
        console.log('file', file)
        console.log('filteredFile', filteredFile)
        this.form.indicatorName = filteredFile.name.replace('.csv', '')
        this.fileList.push(filteredFile)
        console.log(this.fileList)
        CIQ.hideCover()
        CIQ.nprogress.done()
        this.dialogFormVisible = true
        },
        parseCSV(csvData) {
        const rows = csvData.split('\n');
        const headers = rows[0].split(',');
        const data = [];

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row.length === headers.length) {
            const rowData = {};
            for (let j = 0; j < headers.length; j++) {
                rowData[headers[j]] = row[j];
            }
            data.push(rowData);
            }
        }

        return data;
        },
        async autoFillUserIndicator(data) {
        this.indicatorRadio = "Users' Own Indicator"
        let userIndicator = data.file_name
        this.si.userIndicator = userIndicator

        const response = await csvFileRead(userIndicator, data.hash)

        // 还原文件对象的 raw 属性
        const index = this.panelIndex
        const obj = {}
        obj.index = index
        obj.val = response.data.data.file_id
        obj.criteriaCF = capitalizeFirstLetter(this.criteria)
        this.$emit('getIndicatorUrl', {
            index: index,
            url: response.data.data.file_id
        })
        console.log('还原文件对象的 raw 属性', obj)
        if (this.criteria.startsWith('entry')) {
            this.$store.commit(`form/saveUsersOwnFileHash`, obj)
        }
        if (this.criteria.startsWith('exit')) {
            this.$store.commit(`form/saveUsersOwnFileHash`, obj)
        }
        const res = response.data.data.csv_content
        let fileData = []
        try {
            fileData = res.map((item) => ({
            Date: formatStandardTime(item.DT).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            Close: item.indicator_Close
            }))

            const csvData =
            'Date,Close\n' +
            fileData.map((item) => `${item.Date},${item.Close}`).join('\n')
            const base64Data = btoa(csvData) // 编码为 Base64
            const rawValue = `data:text/csv;base64,${base64Data}`
            const file = new File([csvData], `${userIndicator}.csv`, {
            type: 'text/csv'
            })
            file.raw = rawValue
            this.fileList.splice(-1, 1, file)
        } catch (error) {
            console.log('error', error)
        }

        },
        async handleCurrentChange(newpage) {
        this.previewPage.page = newpage
        const str = this.previewFileID
        const startIndex = str.indexOf('HASH')
        const endIndex = startIndex + 4 // 假设 "HASH" 的长度为 4
        if (startIndex !== -1) {
            const beforeHash = str.substring(0, startIndex)
            const afterHash = str.substring(endIndex)
            await this.getPreviewList(beforeHash, afterHash, newpage)
        }
        },
        async getPreviewList(name, hash, page) {
        const response = await csvFilePagingRead(name, hash, page)
        const res = response.data
        if (res.status == 200) {
            const csv_content = res.data.csv_content
            this.previewData = csv_content.map((item) => ({
            Date: formatStandardTime(item.DT).toLocaleDateString('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            Close: item.indicator_Close
            }))
            this.previewPage.total = res.data.total_rows
        }
        }
        }
    }
    </script>
    <style lang="less" scoped>
    .upload-demo {
        display: flex;
        flex-direction: row-reverse;
    // position: absolute;
    // top: 28px;
    min-height: 85px;
    }
    .upload-demo {
        flex-direction: column;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
        border-left: 1px solid #dcdfe6;
        border-right: 1px solid #dcdfe6;
        border-bottom: 1px solid #dcdfe6;
        padding: 5px;
    }
    .upload-indicator-btn {
        width: 100%;
    }
    .el-upload__tip {
    line-height: 15px;
    }
    </style>
    
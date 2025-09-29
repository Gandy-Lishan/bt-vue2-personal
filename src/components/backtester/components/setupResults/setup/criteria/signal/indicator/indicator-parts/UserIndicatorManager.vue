<template>
	<el-form-item label="Indicator">
	  <div class="user-indicator-wrapper">
		<SearchAutocomplete
		  v-model="selectedValue"
		  placeholder="Search for my indicator"
		  :disabled="isUploadDisabled"
		  @select="handleSelect"
		  @clear="handleClear"
		  clearable
		/>
		<el-upload
		  ref="upload"
		  :action="uploadUrl"
		  :http-request="uploadFile"
		  :before-upload="beforeUpload"
		  :disabled="isSearchDisabled"
		  :file-list="fileList"
		  :limit="1"
		>
		  <el-button>Click to upload</el-button>
		  <div slot="tip" class="el-upload__tip">...</div>
		</el-upload>
	  </div>
	</el-form-item>
  </template>
  
  <script>
  export default {
	props: {
	  isBtChartReady: Boolean,
	},
	data() {
	  return {
		selectedValue: '',
		fileList: [],
		// ... 其他上传相关的 data (从原组件迁移)
	  };
	},
	computed: {
		isUploadDisabled() {
			return !this.isBtChartReady || this.fileList.length > 0;
		},
		isSearchDisabled() {
			return !this.isBtChartReady || this.selectedValue !== '';
		}
	},
	methods: {
	  handleSelect(item) {
		this.$emit('indicator-selected', {
		  type: 'user',
		  value: item.file_name,
		  url: item.file_id,
		  updated: item.updated,
		});
	  },
	  handleClear() {
		this.selectedValue = '';
		this.$emit('indicator-cleared');
	  },
	  // 所有 upload 相关的方法 (uploadFile, beforeUpload, 等) 从原组件迁移到这里
	  // 上传成功后，同样调用 this.$emit('indicator-selected', ...)
	  uploadFile(file) {
		// ... 上传逻辑
		// 成功后:
		// this.$emit('indicator-selected', { type: 'user', ... });
	  }
	},
  };
  </script>
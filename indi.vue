<template>
  <div>
    <div class="indicator-container sentiBox">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Sentiment Indicator"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="sentimentIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
              ref="sentiInput"
							prefix-icon="el-icon-search"
							class="inline-input"
							clearable
							v-model="si.sentimentIndicator"
							:disabled="!(indicatorRadio === 'Sentiment Indicator')"
							:fetch-suggestions="indicatorSentimentSearch"
							placeholder="Input the sentiment indicator"
							@select="handleSentimentSelect"
              @clear="clearSentimentSelect"
							highlight-first-item
						></el-autocomplete>
						<!-- <div class="dropdown">
							<div @click="myFunction" class="dropbtn" id="dropbtn">{{category}}</div>
							<div ref="myDropdown" id="myDropdown" class="dropdown-content">
								<div @click="selectCategory">all</div>
								<div @click="selectCategory">model</div>
								<div @click="selectCategory">model2</div>
								<div @click="selectCategory">model3</div>
							</div>
						</div> -->
					</div>
				</el-form-item>
			</div>
			<div class="indicator-container techBox">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Technical Indicator"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="technicalIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
              ref="techInput"
							:disabled="!(indicatorRadio === 'Technical Indicator')"
							class="inline-input"
							clearable
							prefix-icon="el-icon-search"
							v-model="si.technicalIndicator"
							:fetch-suggestions="indicatorTechnicalSearch"
							placeholder="Input the technical indicator"
							@select="handleTechnicalSelect"
              @clear="clearTechnicalSelect"
						></el-autocomplete>
						<el-tooltip effect="dark" placement="top">
							<span slot="content"
								>Hint: To change the indicator settings<br />Right click the
								indicator in the above chart and select "Edit Setting"
							</span>
							<i class="el-icon-info" style="margin-left: 5px"></i>
						</el-tooltip>
					</div>
				</el-form-item>
			</div>
			<div class="indicator-container symbolBox">
				<el-form-item>
					<el-radio
            ref="symbolInput"
						v-model="indicatorRadio"
						label="Symbol OHLCV"
						@change="changeIndicatorChecked"
            @clear="clearSymbolSelect"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="symbolIndicator">
					<el-select
						v-model="si.symbolIndicator"
						placeholder="Select Symbol Open/High/Low/Close/Volume"
						:disabled="!(indicatorRadio === 'Symbol OHLCV')"
						@change="handleSymbolSelect"
					>
						<el-option
							v-for="item in symbolConditions"
							:key="item.value"
							:label="item.obj.label"
							:value="item.obj"
						>
						</el-option>
					</el-select>
				</el-form-item>
			</div>
			<div
				class="indicator-container sentiBox"
				v-show="indicatorRadio !== 'Users\' Own Indicator'"
			>
				<el-form-item>
					<el-radio v-model="indicatorRadio" label="Users' Own Indicator" @change="changeIndicatorChecked">
					</el-radio>
				</el-form-item>
				<el-form-item prop="userIndicator">
					<div class="indicatorSearchBox">
						<el-autocomplete
							prefix-icon="el-icon-files"
							:disabled="!(indicatorRadio === 'Users\' Own Indicator')"
							class="inline-input"
							clearable
							v-model="si.userIndicator"
							placeholder="Select Users' Own Indicator File."
						></el-autocomplete>
						<!-- <el-tooltip effect="dark" placement="top">
              <i class="iconfont icon-wenhao"></i>
            </el-tooltip> -->
					</div>
				</el-form-item>
			</div>
			<div class="indicator-container customBox" v-show="indicatorRadio === 'Users\' Own Indicator'">
				<el-form-item>
					<el-radio
						v-model="indicatorRadio"
						label="Users' Own Indicator"
						@change="changeIndicatorChecked"
					>
					</el-radio>
				</el-form-item>
				<el-form-item prop="userIndicator" class="indicator-form-item">
					<div class="indicatorSearchBox">
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
							:disabled="!(indicatorRadio === 'Users\' Own Indicator')"
						>
							<el-button
								size="small"
								type="primary"
								class="upload-indicator-btn"
								>Click to upload custom indicator file</el-button
							>
							<div slot="tip" class="el-upload__tip">
								You can only upload 1 csv file which doesn't exceed 1MB. File
								names are only allowed to contain English letters, numbers,
								spaces, and underscores.
								<el-button type="text" @click="exampleDataVisible = true"
									>View Example Data</el-button
								>
							</div>
						</el-upload>
					</div>
				</el-form-item>
			</div>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
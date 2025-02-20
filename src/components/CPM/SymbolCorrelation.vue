<template>
  <div class="symbol-correlation">
    <el-form :model="data" size="small" status-icon :rules="rules" ref="ruleForm" class="symbol-correlation-form" label-position="top">
      <el-row :gutter="24">
        <el-col :span="8">
          <el-form-item label="1. Designated Ticker" prop="designated_ticker">
            <el-input v-model="data.designated_ticker" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="3. Start Date" prop="start_date">
            <el-date-picker
              v-model="data.start_date"
              type="date"
              placeholder="- Select Start Date -"
              value-format="yyyy-MM-dd"
              :picker-options="startPickerOptions"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="end_date" label="4. End Date">
              <el-date-picker
                v-model="data.end_date"
                type="date"
                placeholder="- Select End Date -"
                value-format="yyyy-MM-dd"
                :picker-options="endPickerOptions"
              >
              </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="5. Age" prop="age">
            <el-input v-model.number="data.age"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">Submit</el-button>
        <el-button @click="resetForm('ruleForm')">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { span } from 'chartiq/js/standard';

export default {
  name: 'SymbolCorrelation',
  data() {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('Please input the age'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('Please input digits'));
          } else {
            if (value < 18) {
              callback(new Error('Age must be greater than 18'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password'));
        } else {
          if (this.data.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please input the password again'));
        } else if (value !== this.data.pass) {
          callback(new Error('Two inputs don\'t match!'));
        } else {
          callback();
        }
      };
      return {
        data: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>

<style lang="less" scoped>
.symbol-correlation-form {
  /deep/ .el-form-item__label {
    font-weight: 600;
    color: #333;
  }
}
</style>
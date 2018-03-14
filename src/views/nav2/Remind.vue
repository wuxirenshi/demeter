<template v-model="addFormVisible">
    <el-form :model="addForm" label-width="120px" :rules="formRules" ref="addForm"
             style="margin:20px;width:90%;min-width:600px;">
        <el-form-item prop="name">
            <MDinput name="name" v-model="addForm.name">项目名称</MDinput>
        </el-form-item>

        <el-row>
            <el-col :span="8">
                <el-form-item label="APPID" prop="appid">
                    <el-input resize="none" type="textarea" v-model="addForm.appid"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="待测分支" labelWidth="200px">
                    <el-input resize="none" type="textarea" v-model="addForm.develop"></el-input>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row>
            <el-col :span="12">
                <el-form-item label="PR链接">
                    <el-input resize="none" type="textarea" v-model="addForm.pr" :min="0" :max="200"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="PRD链接">
                    <el-input resize="none" type="textarea" v-model="addForm.prd" :min="0" :max="200"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="功能列表">
                    <el-input resize="none" v-model="addForm.feature" type="textarea" :min="0" :max="200"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="变更列表">
                    <el-input resize="none" v-model="addForm.change" type="textarea" :min="0" :max="200"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="已知问题列表">
                    <el-input resize="none" v-model="addForm.problem" type="textarea" :min="0" :max="200"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="自测项描述">
                    <el-input resize="none" v-model="addForm.describe" type="textarea" :min="0" :max="200"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="冒烟测试">
                    <el-input resize="none" v-model="addForm.smoke" type="textarea" :min="0" :max="200"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="备注">
                    <el-input resize="none" v-model="addForm.remarks" type="textarea" :min="0" :max="200"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="单元测试覆盖情况" labelWidth="150px" prop="percent">
                    <el-select v-model="addForm.percent" placeholder="请选择">
                        <el-option v-for="item in per_options()" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item prop="environ" label="已发布环境">
                    <el-select width="200px" v-model="addForm.environ" multiple placeholder="请选择" ref="toggle" @change="toggle">
                        <el-option v-for="item in env_options" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="8">
                <el-form-item label="测试截止时间">
                    <el-date-picker
                            v-model="addForm.deadline"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="pickerOptions"
                            value-format="timestamp">
                    </el-date-picker>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="8">
                <el-form-item label="收件人" prop="receiver">
                    <el-select
                            class="underline"
                            v-model="addForm.receiver"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入邮箱关键词"
                            :remote-method="searchUsers"
                            :loading="loading">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <span style="float: right; color: #8492a6; font-size: 15px;">{{ item.value }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="16">
                <el-form-item label="抄送">
                    <el-select
                            class="underline"
                            v-model="addForm.product_email"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入邮箱关键词"
                            :remote-method="searchUsers"
                            :loading="loading"
                            ref="cc_toggle"
                            @change="cc_toggle">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            <span style="float: left">{{ item.label }}</span>
                            <span style="float: right; color: #8492a6; font-size: 15px;margin-right: 20px">{{ item.value }}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item>
            <el-button type="primary" @click.native="addSubmit">提交</el-button>
            <el-button type="primary" @click.native="saveSubmit">保存</el-button>
            <el-button @click.native="$router.go(-1)">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {saveRemind, getUser, commitRemind} from '../../api/api';
    import ElRadioGroup from "../../../node_modules/element-ui/packages/radio/src/radio-group";
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
    import MDinput from '../../components/MDinput';
    import ElInput from "../../../node_modules/element-ui/packages/input/src/input";

    export default {
        components: {ElInput, ElFormItem, ElCol, ElRow, ElRadioGroup, MDinput},
        data() {
            return {
                loading2: false,
                options: [],
                env_options: [{
                    value: 'Alpha',
                    label: 'Alpha'
                }, {
                    value: 'Alta',
                    label: 'Alta'
                }, {
                    value: 'Altb',
                    label: 'Altb'
                }],
                formRules: {
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
                    ],
                    appid: [
                        { required: true, message: '请输入项目Appid', trigger: 'blur'}
                    ],
                    receiver: [
                        { required: true, message: '请选择测试人员'}
                    ],
                    environ: [
                        { required: true, message: '请选择发布环境' }
                    ],
                    percent: [
                        { required: true, message: '请填写覆盖率情况' }
                    ],
                },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                list: [],
                loading: false,
                user_id: JSON.parse(localStorage.getItem('user')).id,
                addFormVisible: false,
                addLoading: false,
                addForm: {
                    name: '',
                    pr: '',
                    appid: '',
                    prd: '',
                    receiver: '',
                    feature: '',
                    change: '',
                    problem: '',
                    describe: '',
                    deadline: '',
                    percent: '',
                    environ: [],
                    remarks: '',
                    develop: '',
                    smoke: '',
                    product_email: '',
                },
            }
        },
        methods: {
            toggle() {
                if (this.$refs.toggle.visible){
                    this.$refs.toggle.toggleMenu();
                }
            },
            cc_toggle() {
                if (this.$refs.cc_toggle.visible){
                    this.$refs.cc_toggle.toggleMenu();
                }
            },
            per_options(){
                let rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start);
                let option = rangeArray(1, 101).map((num) => {
                    if (num === 101) {
                        return {value: '前端项目忽略', label: '前端项目忽略'}
                    }
                    return {value: num + '%', label: num + '%'}
                });
                return option.reverse();
            },

            searchUsers (qs) {
                if (qs !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        let para = {kw: qs};
                        getUser(para).then(ret => {
                            let users = ret.data;
                            this.list = users.map(item => {
                                return { value: item['email'], label: item['user_name'] };
                            });
                            this.options = this.list.filter(item => {
                                return item.value.toLowerCase()
                                        .indexOf(qs.toLowerCase()) > -1;
                            });
                        });
                    }, 200);
                } else {
                    this.options = [];
                }
            },
            isNumber: function (o) {
                return Object.prototype.toString.call(0) === "[object Number]"
            },
            isDate: function (o) {
                return Object.prototype.toString.call(0) === "[object Date]"
            },

            saveSubmit() {
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗?', '提示', {}).then(() => {
                            this.loading2 = true;
                            let para = Object.assign({}, this.addForm);
                            para.user_id = this.user_id;
                            if (this.isDate(this.addForm.deadline)) {
                                para.deadline = this.addForm.deadline.getTime();
                            }
                            para.environ = JSON.stringify(para.environ);
                            para.product_email = JSON.stringify((para.product_email));
                            saveRemind(para).then((res) => {
                                if (res.code === 500) {
                                    this.$message({
                                        message: res.msg,
                                        type: 'warning',
                                    });
                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: 'success',
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.$router.go(-1)
                                }
                            });
                        }).catch(e => {
                            console.log(e)
                        })
                    }
                })
            },
            addSubmit(){
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗?', '提示', {}).then(() => {
                            let para = Object.assign({}, this.addForm);
                            para.user_id = this.user_id;
                            if (this.isNumber(this.addForm.deadline)){
                                para.deadline = new Date(this.addForm.deadline).getTime()
                            }
                            if (this.isDate(this.addForm.deadline)) {
                                para.deadline = this.addForm.deadline.getTime();
                            }
                            para.environ = JSON.stringify(para.environ);
                            para.product_email = JSON.stringify((para.product_email));
                            commitRemind(para).then((res) => {
                                if (res.code === 500) {
                                    this.$message({
                                        message: res.msg,
                                        type: 'warning',
                                    });
                                } else {
                                    this.$message({
                                        message: res.msg,
                                        type: 'success',
                                    });
                                    this.$refs['addForm'].resetFields();
                                    this.$router.go(-1)
                                }
                            });
                        }).catch(e => {
                            console.log(e)
                        })
                    }
                })
            }
        },
        mounted() {
            if (this.$route.params.editForm) {
                this.addForm = this.$route.params.editForm;
                localStorage.setItem('addForm', JSON.stringify(this.addForm));
            }

            let addForm = JSON.parse(localStorage.getItem('addForm'));
            if (addForm) {
                this.addForm = addForm;
            }
            console.log(addForm)
        }
    }
</script>

<style>
    .underline {
        width: 100%;
        border-bottom: 1px solid #bfcbd9;
    }

    .underline .el-input__inner {
        border: 0;
    }

</style>
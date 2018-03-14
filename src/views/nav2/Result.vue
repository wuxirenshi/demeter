<template>
    <el-form :model="responseForm" label-width="100px" :rules="formRules" ref="responseForm"
             style="margin:20px;width:80%;min-width:600px;">
        <el-form-item label="项目名称">
            <span class="span_name">{{responseForm.name}}</span>
        </el-form-item>
        <el-form-item label="测试结论" prop="result">
            <el-radio-group v-model="responseForm.result">
                <el-radio-button label="测试通过"></el-radio-button>
                <el-radio-button label="测试不通过"></el-radio-button>
            </el-radio-group>
        </el-form-item>
        <el-row>
            <el-col :span="12">
                <el-form-item label="测试工具">
                    <el-input type="textarea" resize="none" v-model="responseForm.tool"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="测试用例说明">
                    <el-input type="textarea" resize="none" v-model="responseForm.explain"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="测试环境" prop="environ">
                    <el-select width="200px" v-model="responseForm.environ" multiple placeholder="请选择" ref="toggle" @change="toggle">
                        <el-option v-for="item in env_options" :key="item.value" :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="测试类型">
                    <el-input v-model="responseForm.type"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="bug列表">
                    <el-input type="textarea" resize="none" v-model="responseForm.bug"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="备注">
                    <el-input type="textarea" resize="none" v-model="responseForm.remarks"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <el-form-item label="抄送">
                    <el-select
                            class="underline"
                            v-model="responseForm.cc_email"
                            multiple
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入邮箱关键词"
                            :remote-method="searchUsers"
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
            <el-col :span="8">
                <el-form-item>
                    <el-upload
                            class="upload-demo"
                            action="/demeter/api/report/upload"
                            multiple
                            :disabled="true"
                            ref="upload"
                            :auto-upload="false"
                            :file-list="fileList">
                        <el-button size="small" type="primary" :disabled="true">上传报告</el-button>
                    </el-upload>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item>
            <el-button type="primary" @click.native="commitSubmit">提交</el-button>
            <el-button @click.native="$router.go(-1)">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import {getRemindListPage, saveReport, commitReport, getUser} from '../../api/api';
    import ElCol from "element-ui/packages/col/src/col";
    import ElRow from "element-ui/packages/row/src/row";

    export default {
        components: {ElCol, ElRow}, data(){
            return {
                fileList: [],
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
                filters: {
                    name: '',
                    report_email: JSON.parse(localStorage.getItem('user')).email,
                    test_user: JSON.parse(localStorage.getItem('user')).user_name,
                },
                page: 1,
                reports: [],
                listLoading: false,
                responseForm: {
                    name: '',
                    result: '测试通过',
                    type: '',
                    explain: '',
                    environ: [],
                    tool: '',
                    bug: '',
                    remarks: '',
                    cc_email: '',
                },
                proposeForm: null,
                disableSelect: false,
                formRules: {
                    result: [
                        {required: true, message: '请选择测试结论', trigger: 'blur'}
                    ],
                    environ: [
                        {required: true, message: '请选择测试环境'}
                    ]
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

//            commitSubmit() {
//                if (this.$refs.upload.uploadFiles.length) {
//                    this.$refs.upload.submit();
//                }
//                else {
//                    this.Submit()
//                }
//            },

            commitSubmit: function () {
                this.$refs.responseForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗?', '提示', {}).then(() => {
                                let para = Object.assign({}, this.responseForm);
                                para.environ = JSON.stringify(para.environ);
                                para.cc_email = JSON.stringify((para.cc_email));
                                commitReport(para).then(res => {
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
                                        this.$refs['responseForm'].resetFields();
                                        this.$router.go(-1);
                                    }
                                })

                            }
                        ).catch(e => {
                            console.log(e)
                        })
                    }
                })
            }
        },
        mounted() {
            if (this.$route.params.remindForm){
                this.responseForm.name = this.$route.params.remindForm.name;
                localStorage.setItem('responseForm', JSON.stringify(this.responseForm));
            }
            else if (localStorage.getItem('responseForm')){
                this.responseForm = JSON.parse(localStorage.getItem('responseForm'));
            }
            else {
                this.$router.push('/dashboard')
            }
        }
    }
</script>

<style>
    .span_name {
        font-size: 20px;
        color: #5e7382;
        font-style: inherit;
    }

    .underline {
        width: 100%;
        border-bottom: 1px solid #bfcbd9;
    }

    .underline .el-input__inner {
        border: 0;
    }
</style>
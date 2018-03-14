<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters" ref="filters">
                <el-col>
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="filters.name" placeholder="项目名称"></el-input>
                    </el-form-item>
                    <el-form-item label="开发" prop="promoter">
                        <el-input v-model="filters.promoter" placeholder="开发人员"></el-input>
                    </el-form-item>
                    <el-form-item label="测试" prop="receiver">
                        <el-input v-model="filters.receiver" placeholder="测试人员"></el-input>
                    </el-form-item>
                </el-col>
                <el-col>
                    <el-form-item label="任务状态" prop="status">
                        <el-select v-model="filters.status" placeholder="任务状态">
                            <el-option
                                    v-for="item in status_options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="日期" prop="date">
                        <el-date-picker
                                width="100"
                                v-model="filters.date"
                                type="daterange"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                value-format="timestamp">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="getRemindsByFilters">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="resetFilters">重置</el-button>
                    </el-form-item>
                </el-col>
            </el-form>
        </el-col>

        <el-table :data="reminds" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="index" width="60" label=" ">
            </el-table-column>
            <el-table-column prop="date_time" label="开始时间" width="120">
            </el-table-column>
            <el-table-column label="主题" min-width="200">
                <template slot-scope="scope">
                    <el-button type="text" v-on:click="handleCheck(scope.row)">{{scope.row.name}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="remind_user" label="开发" width="120">
            </el-table-column>
            <el-table-column prop="receiver_name" label="测试" width="100">
            </el-table-column>
            <el-table-column prop="group_name" label="开发组" width="120" sortable>
            </el-table-column>
            <el-table-column label="任务状态" width="140">
                <template slot-scope="scope">
                    <el-tooltip content="提测邮件是否已发送" placement="top">
                        <el-tag :type="scope.row.remind_time | timeFilter">{{scope.row.remind_time | nameFilter}}</el-tag>
                    </el-tooltip>
                    <el-tooltip content="是否回复测试报告" placement="top">
                        <el-tag :type="scope.row.is_report | tagFilter">{{scope.row.is_report | reportFilter}}</el-tag>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <el-dialog title="提测信息" :visible.sync="CheckFormVisible" :close-on-click-modal="false">
            <el-form ref="checkForm" :model="checkForm" label-width="100px" style="width:80%;min-width:600px;">
                <el-form-item label="项目名称:">
                    <span v-model="checkForm.name">{{ checkForm.name }}</span>
                </el-form-item>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="APPID:"  class="el-row-h">
                            <span>{{ checkForm.appid }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <template v-if="checkForm.pr === ''">
                            <el-form-item label="PR链接:" >
                                <span>{{ nothing }}</span>
                            </el-form-item>
                        </template>
                        <template v-else>
                            <el-form-item label="PR链接:" >
                                <a :href="checkForm.pr">
                                    <span>{{ checkForm.pr  }}</span>
                                </a>
                            </el-form-item>
                        </template>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <template v-if="checkForm.prd === ''">
                            <el-form-item label="PRD链接:" >
                                <span>{{ nothing }}</span>
                            </el-form-item>
                        </template>
                        <template v-else>
                            <el-form-item label="PRD链接:" >
                                <a :href="checkForm.prd">
                                    <span>{{ checkForm.prd  }}</span>
                                </a>
                            </el-form-item>
                        </template>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="功能列表:">
                            <span v-html="checkForm.feature" class="span-h">{{ checkForm.feature || nothing }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="变更列表:">
                            <span v-html="checkForm.change" class="span-h">{{ checkForm.change || nothing }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="已知问题列表:">
                            <span v-html="checkForm.problem" class="span-h">{{ checkForm.problem || nothing }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row >
                    <el-col :span="24">
                        <el-form-item label="自测项描述:">
                            <span v-html="checkForm.describe" class="span-h">{{ checkForm.describe|| nothing }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop="environ" label="已发布环境:">
                            <span>{{ checkForm.environ }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单元测试覆盖情况:" labelWidth="150px">
                            <span>{{ checkForm.percent }}</span>
                        </el-form-item>
                    </el-col>

                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="备注:">
                            <span v-html="checkForm.remarks" class="span-h">{{ checkForm.remarks || nothing }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </section>
</template>

<script>
    import {getRemindListPage, getUser, removeRemind, getRemindsByFilters, getGroup} from '../../../api/api';
    import ElCol from "element-ui/packages/col/src/col";

    export default {
        components: {ElCol}, name: 'articleDetail',
        props: {
            type: {
                type: String,
                default: 'CN'
            }
        },
        data() {
            return {
                page: 1,
                CheckFormVisible: false,
                group_option: [],
                listLoading: false,
                reminds: [],
                total: 0,
                editForm: null,
                status_options: [
                    {
                        value: 1,
                        label: '完成'
                    },
                    {
                        value: 0,
                        label: '未完成'
                    },
                ],
                sels: [],
                nothing: '无',
                checkForm: [],
                filters: {
                    name: '',
                    receiver: '',
                    promoter: '',
                    date: '',
                    group: '',
                    status: ''
                },
            }
        },
        filters: {
            statusFilter(status) {
                const statusMap = {
                    published: 'success',
                    draft: 'gray',
                    deleted: 'danger'
                };
                return statusMap[status]
            },
            timeFilter(times) {
                if(times>0) return 'success';
                else return 'gray'
            },
            nameFilter(times) {
                if(times>0) return '已提测';
                else return '未提测'
            },
            reportFilter(is_report) {
                if(is_report) return '已回复';
                else return '未回复'
            },
            tagFilter(is_report) {
                if(is_report) return 'success';
                else return 'warning'
            }
        },
        created() {
            this.getReminds();
//            this.getGroup();
        },
        methods: {
            resetFilters(){
                this.$refs['filters'].resetFields();
                this.getReminds();
//                this.getGroup();
            },
            getGroup(){
                let para = Object.assign({});
                getGroup(para).then(res => {
                    const groups = res.data;
                    this.group_option = groups.map(res => ({value: res.id, label:res.group_name}))
                })
            },

            handleCurrentChange(val) {
                this.page = val;
                if (
                    this.filters.name && this.filters.receiver && this.filters.promoter
                    && this.filters.date && this.filters.group && this.filters.status
                )
                    this.getReminds();
                else {
                    this.getRemindsByFilters();
                }
            },

            operateRemindsListBr(data) {
                if(data !== null)
                {
                    data.change = data.change.replace(/\n/g,"<br/>");
                    data.feature = data.feature.replace(/\n/g,"<br/>");
                    data.problem = data.problem.replace(/\n/g,"<br/>");
                    data.remarks = data.remarks.replace(/\n/g,"<br/>");
                    data.describe = data.describe.replace(/\n/g,"<br/>");
                }
                return data;
            },

            handleCheck(row) {
                this.checkForm = Object.assign({}, row);
                this.checkForm = this.operateRemindsListBr(this.checkForm);
                this.CheckFormVisible = !this.CheckFormVisible;
            },

            getReminds: function () {
                let para = {
                    page: this.page,
                    name: this.filters.name,
                    receiver: this.filters.receiver,
                };
                this.listLoading = true;
                getRemindListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.reminds = res.data.reminds;
                    this.listLoading = false;
                });
            },
            //获取用户列表
            getRemindsByFilters(){
                let para = {
                    page: this.page,
                    name: this.filters.name,
                    promoter: this.filters.promoter,
                    receiver: this.filters.receiver,
                    group: this.filters.group,
                    status: this.filters.status,
                };
                if (this.filters.date){
                    para.from_time = this.filters.date[0];
                    para.to_time = this.filters.date[1];
                }
                this.listLoading = true;
                getRemindsByFilters(para).then((res) => {
                    this.total = res.data.total;
                    this.reminds = res.data.reminds;
                    this.listLoading = false;
                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            },
        }
    }
</script>
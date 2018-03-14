<template>
    <div class="dashboard-editor-container">

        <panel-group
                @handleSetLineChartData="handleSetLineChartData"
                :agents_number="agents.total"
                :records_number="records.total"
                :settled_number="settled.total">
        </panel-group>

        <div :hidden="agents_hidden">
            <h3>代办任务</h3>
            <el-table :data="agents.reminds" highlight-current-row
                      @selection-change="selsChange">
                <el-table-column type="index" width="60" label=" ">
                </el-table-column>
                <el-table-column prop="date_time" label="开始时间" width="120">
                </el-table-column>
                <el-table-column label="项目名称" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="text" v-on:click="handleCheck(scope.row)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="remind_user" label="开发" width="100">
                </el-table-column>
                <el-table-column prop="group_name" label="开发组" width="120" sortable>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleReply(scope.$index, scope.row)">回复</el-button>
                        <el-button type="danger" :disabled="true" size="small" @click="handleReject(scope.$index, scope.row)">拒绝</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="拒绝原因" :visible.sync="dialogFormVisible">
                <el-form :model="reject_reason">
                    <el-form-item>
                        <el-input v-model="reject_reason.reason" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="handleConfirm">确 定</el-button>
                </div>
            </el-dialog>

            <el-col :span="24" class="self_bar">
                <el-pagination layout="prev, pager, next" @current-change="handleAgentsChange" :page-size="20" :total="agents.total" style="float:right;">
                </el-pagination>
            </el-col>
        </div>

        <div :hidden="records_hidden">
            <h3>提测记录</h3>
            <el-table :data="records.reminds" highlight-current-row
                      @selection-change="selsChange">
                <el-table-column type="index" width="60" label=" ">
                </el-table-column>
                <el-table-column prop="date_time" label="开始时间" width="120">
                </el-table-column>
                <el-table-column label="项目名称" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="text" v-on:click="handleCheck(scope.row)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="receiver_name" label="测试" width="100">
                </el-table-column>
                <el-table-column prop="group_name" label="开发组" width="120" sortable>
                </el-table-column>
                <el-table-column label="状态" width="140">
                    <template slot-scope="scope">
                        <el-tooltip content="提测邮件是否已发送" placement="top">
                            <el-tag :type="scope.row.remind_time | timeFilter">{{scope.row.remind_time | nameFilter}}</el-tag>
                        </el-tooltip>
                        <el-tooltip content="是否回复测试报告" placement="top">
                            <el-tag :type="scope.row.is_report | tagFilter">{{scope.row.is_report | reportFilter}}</el-tag>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleEdit(scope.$index, scope.row)"
                                   >编辑</el-button>
                        <el-button type="text" size="small" @click="handleDel(scope.$index, scope.row)"
                                   :disabled="scope.row.remind_time>0">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-col :span="24" class="self_bar">
                <el-pagination layout="prev, pager, next" @current-change="handleRecordsChange" :page-size="20" :total="records.total" style="float:right;">
                </el-pagination>
            </el-col>
        </div>

        <div :hidden="settled_hidden">
            <h3>完成任务</h3>
            <el-table :data="settled.reminds" highlight-current-row
                      @selection-change="selsChange">
                <el-table-column type="index" width="60" label=" ">
                </el-table-column>
                <el-table-column label="完成时间" width="120">
                    <template slot-scope="scope">
                        <label>{{scope.row.finish_time ? scope.row.finish_time : scope.row.date_time}}</label>
                    </template>
                </el-table-column>
                <el-table-column label="项目名称" min-width="200">
                    <template slot-scope="scope">
                        <el-button type="text" v-on:click="handleCheck(scope.row)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="remind_user" label="开发" width="100">
                </el-table-column>
                <el-table-column prop="group_name" label="开发组" width="120" sortable>
                </el-table-column>
            </el-table>

            <el-col :span="24" class="self_bar">
                <el-pagination layout="prev, pager, next" @current-change="handleSettleChange" :page-size="20" :total="settled.total" style="float:right;">
                </el-pagination>
            </el-col>
        </div>

    </div>
</template>

<script>
    import PanelGroup from './components/PanelGroup'
    import {getRemindListPage, getUser, removeRemind} from '../../api/api';
    import ElInput from "../../../node_modules/element-ui/packages/input/src/input";

    export default {
        name: 'dashboard-admin',
        components: {
            ElInput, PanelGroup,
        },
        data() {
            return {
                reject_reason: {
                    reason: '',
                    remind_id: 0,
                },
                dialogFormVisible: false,
                loading: true,
                agents_hidden: false,
                records_hidden: true,
                settled_hidden: true,
                page: 1,
                agents: {
                    reminds: [],
                    total: 0,
                },
                settled: {
                    reminds: [],
                    total: 0,
                },
                records:{
                    reminds: [],
                    total: 0,
                },
                filters: {
                    receiver: JSON.parse(localStorage.getItem('user')).email,
                    user_id: JSON.parse(localStorage.getItem('user')).id,
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
            this.getAgentsReminds();
            this.getSettledReminds();
            this.getRecordsReminds();
        },
        methods: {
            handleConfirm(){
                this.dialogFormVisible = false;
                console.log(this.reject_reason)
            },
            handleReject(index, row){
                this.reject_reason.remind_id = row.id;
                this.dialogFormVisible = true;
            },
            handleAgentsChange(val) {
                this.page = val;
                this.getAgentsReminds();
            },

            handleSettleChange(val) {
                this.page = val;
                this.getSettledReminds();
            },

            handleRecordsChange(val) {
                this.page = val;
                this.getRecordsReminds();
            },

            handleReply(index, row) {
                this.remindForm = Object.assign({}, row);
                this.remindForm.environ = JSON.parse(this.remindForm.environ);
                this.$router.push({ name:'报告模版', params: {remindForm: this.remindForm} })
            },

            handleEdit: function (index, row) {
                this.editForm = Object.assign({}, row);
                this.editForm.environ = JSON.parse(this.editForm.environ);
                try {
                    this.editForm.product_email = JSON.parse(this.editForm.product_email);
                }catch(err){
                    this.editForm.product_email = [this.editForm.product_email];
                }
                this.$router.push({ name:'任务模版', params: {editForm: this.editForm} })
            },

            handleDel(index, row) {
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.listLoading = true;
                    let para = {id: row.id};
                    removeRemind(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getRecordsReminds();
                    });
                }).catch(() => {

                });
            },

            selsChange: function (sels) {
                this.sels = sels;
            },

            handleSetLineChartData(type) {
                if (type === 'agents') {
                    this.agents_hidden = false;
                    this.settled_hidden = this.records_hidden = !this.agents_hidden;
                    this.loading = false;
                }
                if (type === 'settled') {
                    this.settled_hidden = false;
                    this.agents_hidden = this.records_hidden = !this.settled_hidden;
                }
                if (type === 'records') {
                    this.records_hidden = false;
                    this.agents_hidden = this.settled_hidden = !this.records_hidden;
                }
                if (type === 'tasks') {
                    localStorage.removeItem('addForm');
                    this.$router.push('/remind')
                }
            },
            getRecordsReminds(){
                let para = {
                    page: this.page,
                    user_id: this.filters.user_id,
                };
                getRemindListPage(para).then((res) => {
                    this.records = res.data;
                });
            },
            getSettledReminds(){
                let para = {
                    page: this.page,
                    receiver: this.filters.receiver,
                    is_report: 1,
                    order_by: 'finish_time',
                };
                getRemindListPage(para).then((res) => {
                    this.settled = res.data;
                });
            },
            getAgentsReminds(){
                let para = {
                    page: this.page,
                    receiver: this.filters.receiver,
                    is_report: 0,
                    remind_time: 1,
                };
                getRemindListPage(para).then((res) => {
                    this.agents = res.data;
                });
            },
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .dashboard-editor-container {
        padding: 20px;
        background-color: rgb(240, 242, 245);
        .chart-wrapper {
            background: #fff;
            padding: 16px 16px 0;
            margin-bottom: 32px;
        }
    }

    .self_bar {
        background: white;
        padding: 10px;
        margin: 20px 0;
    }

    h3 {
        margin-top: 0;
        background-color: white;
        margin-bottom: 10px;
        padding: 10px;
        color: #0190fe;
        font-size: 15px;
        border-bottom: 1px solid #c0ccda;
        display: -webkit-box;
        display: flex;
        -webkit-box-pack: justify;
        justify-content: space-between;
    }
</style>

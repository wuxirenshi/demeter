<template>
    <section>
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
            <el-form :inline="true" :model="filters">
                <el-form-item label="项目名称">
                    <el-input v-model="filters.name" placeholder="项目名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" v-on:click="getReportsByName">查询</el-button>
                </el-form-item>
            </el-form>
        </el-col>

        <el-table :data="reports" highlight-current-row v-loading="listLoading" @selection-change="selsChange"
                  style="width: 100%;">
            <el-table-column type="index" width="60" label=" ">
            </el-table-column>
            <el-table-column prop="date_time" label="完成时间" width="120">
            </el-table-column>
            <el-table-column label="主题" min-width="200">
                <template slot-scope="scope">
                    <el-button type="text" v-on:click="handleReport(scope.row)">{{scope.row.remind_name}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="result" label="测试结论" width="120">
            </el-table-column>
            <el-table-column prop="test_user" label="测试" width="100">
            </el-table-column>
            <el-table-column prop="remind_user" label="开发" width="100">
            </el-table-column>
            <el-table-column label="报告状态" width="120">
                <template slot-scope="scope">
                    <el-tag :type="scope.row.is_report | reportFilter">{{scope.row.is_report | resultFilter}}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <!--工具条-->
        <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
            </el-pagination>
        </el-col>

        <el-dialog title="测试报告" :visible.sync="reportFormVisible" :close-on-click-modal="false">
            <el-form :model="reportForm" label-width="100px" style="margin:20px;width:80%;min-width:600px;">
                <el-form-item label="项目名称" prop="remind_name">
                    <span>{{ reportForm.remind_name }}</span>
                </el-form-item>
                <el-form-item label="测试结论" prop="result">
                    <span>{{ reportForm.result }}</span>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="测试工具">
                            <span>{{ reportForm.tool }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="测试用例说明">
                            <span>{{ reportForm.explain }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="测试环境">
                            <span>{{ reportForm.environ }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="测试类型">
                            <span>{{ reportForm.type }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="bug列表">
                            <span>{{ reportForm.bug }}</span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注">
                            <span>{{ reportForm.remarks }}</span>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-dialog>
    </section>
</template>

<style>
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 100px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 30%;
    }
</style>

<script>
    import {getReportListPage, removeReport, sendReport} from '../../api/api';
    import ElDialog from "../../../node_modules/element-ui/packages/dialog/src/component";

    export default {
        components: {ElDialog}, data(){
            return {
                filters: {
                    name: '',
                    report_email: ''
                },
                nothing: '无',
                reports: [],
                page: 1,
                total: 0,
                listLoading: false,
                editForm: null,
                reportForm: [],
                reportFormVisible: false,
            }
        },
        filters: {
            reportFilter(is_report){
                if (is_report) return 'success';
                else return 'gray'
            },
            resultFilter(is_report){
                if (is_report) return '完结';
                else return '未发送'
            },
        },
        methods: {
            handleReport(row){
                this.reportFormVisible = true;
                this.reportForm = Object.assign({}, row);
            },
            is_reporter(row) {
                let user = JSON.parse(localStorage.getItem('user'));
                let report_email = row.report_email;
                return user.email === report_email;
            },

            handleCurrentChange(val) {
                this.page = val;
                this.getReports();
            },

            deleteReport(index, row){
                this.$confirm('确认删除该记录吗?', '提示', {
                    type: 'warning'
                }).then(() => {
                    let para = {id: row.id};
                    removeReport(para).then((res) => {
                        this.listLoading = false;
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.getReports();
                    });
                }).catch(() => {

                });
            },

            editReport(index, row) {
                this.editForm = Object.assign({}, row);
                this.editForm.environ = JSON.parse(this.editForm.environ);
                this.$router.push({ name:'测试报告创建', params: {editForm: this.editForm} })
            },

            getReportsByName(){
                let para = {
                    page: this.page,
                    name: this.filters.name,
                };
                this.listLoading = true;
                getReportListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.reports = res.data.reports;
                    this.listLoading = false;
                });
            },
            getReports() {
                let para = {
                    page: this.page,
                };
                this.listLoading = true;
                getReportListPage(para).then((res) => {
                    this.total = res.data.total;
                    this.reports = res.data.reports;
                    this.listLoading = false;
                });
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
        },
        mounted() {
            this.getReports()
        }
    }
</script>
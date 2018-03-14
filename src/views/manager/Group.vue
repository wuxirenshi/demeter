<template>
    <el-row>
        <el-col :span="16">
            <el-tabs activeName="group">
                <el-tab-pane label="小组信息" name="group">
                    <el-table
                            :data="tableData"
                            highlight-current-row
                            style="width: 100%">
                        <el-table-column type="index" width="60" label=" ">
                        </el-table-column>
                        <el-table-column label="用户组" min-width="180">
                            <template  slot-scope="scope">
                                <el-input v-show="scope.row.edit" size="small" v-model="scope.row.group_name"></el-input>
                                <span v-show="!scope.row.edit">{{ scope.row.group_name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="组邮箱" width="220">
                            <template  slot-scope="scope">
                                <el-input v-show="scope.row.edit" size="small" v-model="scope.row.group_email"></el-input>
                                <span v-show="!scope.row.edit">{{ scope.row.group_email }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="170">
                            <template slot-scope="scope">
                                <el-button
                                        v-show='!scope.row.edit'
                                        type="primary"
                                        @click='scope.row.edit=true'>编辑</el-button>
                                <el-button
                                        v-show='scope.row.edit'
                                        type="success"
                                        @click='complete(scope.row)'
                                        style="margin-left: 0">完成</el-button>
                                <el-button
                                        v-show='!scope.row.edit'
                                        type="danger"
                                        @click="handleDelete(scope.row)">删除</el-button>
                                <el-button
                                        v-show='scope.row.edit'
                                        type="warning"
                                        @click="scope.row.edit=false">取消</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="小组添加">
                    <el-form :model="groupForm" ref="groupForm" label-width="100px"
                             class="demo-ruleForm">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="组名" prop="group_name">
                                    <el-input v-model="groupForm.group_name"
                                              auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="邮箱" prop="group_email">
                                    <el-input v-model="groupForm.group_email"
                                              auto-complete="off"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('groupForm')">提交</el-button>
                            <el-button @click="resetForm('groupForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
    import {getDepartment, addGroup, getGroup, deleteGroup} from '../../api/api';
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    import ElForm from "../../../node_modules/element-ui/packages/form/src/form";
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item";
    export default {
        components: {ElFormItem, ElForm, ElCol, ElRow}, data() {
            return {
                groupForm: {
                    group_name: '',
                    group_email: '',
                },
                tableData: [],
                options: [],
                value: ''
            };
        },
        methods: {
            getGroup(){
                let para = Object.assign({});
                getGroup(para).then(res => {
                    this.tableData = res.data.map(v => {
                        v.edit = false;
                        return v
                    });
                })
            },
            complete(row){
                row.edit = false;
                addGroup(row).then(res => {
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
                        this.$refs['userForm'].resetFields();
                        this.getUsers();
                    }
                }).catch();
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let para = Object.assign({}, this.groupForm);
                        addGroup(para).then(res => {
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
                                this.$refs['groupForm'].resetFields();
                                this.getGroup();
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleDelete(row) {
                this.$confirm('此操作将删除小组及组内用户, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteGroup(row.id).then(res => {
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
                                this.getGroup();
                            }
                        }
                    )
                })
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
        },
        mounted() {
            this.getGroup();
        }
    }
</script>
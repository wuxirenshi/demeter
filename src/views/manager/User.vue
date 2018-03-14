<template>
    <el-row>
        <el-col :span="16">
            <el-tabs activeName="user">
                <el-tab-pane label="用户" name="user">
                    <el-table :data="users"
                              highlight-current-row
                              @selection-change="selsChange"
                              style="width: 100%;">
                        <el-table-column type="index" width="60" label=" ">
                        </el-table-column>
                        <el-table-column label="用户名" min-width="100">
                            <template slot-scope="scope">
                                <el-input v-show="scope.row.edit" size="small" v-model="scope.row.user_name"></el-input>
                                <span v-show="!scope.row.edit">{{ scope.row.user_name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="邮箱" width="220">
                            <template slot-scope="scope">
                                <el-input v-show="scope.row.edit" size="small" v-model="scope.row.email"></el-input>
                                <span v-show="!scope.row.edit">{{ scope.row.email }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="用户组" width="150" sortable>
                            <template slot-scope="scope">
                                <span>{{ scope.row.group_name }}</span>
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
                                        style="margin-left: 0"
                                        @click='complete(scope.row)'>完成</el-button>
                                <el-button
                                        v-show='!scope.row.edit'
                                        type="danger"
                                        @click="deleteUser(scope.row)">删除</el-button>
                                <el-button
                                        v-show='scope.row.edit'
                                        type="warning"
                                        @click="scope.row.edit=false" >取消</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-col :span="24" class="toolbar">
                        <el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
                        </el-pagination>
                    </el-col>
                </el-tab-pane>
                <el-tab-pane label="用户信息添加">
                    <el-form :model="userForm" :label-width="formLabelWidth" ref="userForm">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item prop="user_name" label="用户名">
                                    <el-input v-model="userForm.user_name"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item prop="email" label="邮箱" :rules="email_rule">
                                    <el-input v-model="userForm.email"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item prop="user_group" label="用户组">
                            <el-select v-model="userForm.group_id" placeholder="请选择用户组">
                                <el-option v-for="item in user_group_option" :key="item.value" :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="dialogFormVisible = false">取 消</el-button>
                            <el-button type="primary" @click="submitUser">确 定</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </el-col>
    </el-row>
</template>
<script>
    import {addUser, getUser, deleterUser, getGroup} from '../../api/api';
    import ElRow from "element-ui/packages/row/src/row";
    import ElCol from "element-ui/packages/col/src/col";
    export default {
        components: {ElCol, ElRow}, data() {
            return {
                modify: false,
                email_rule: [
                    {required: true, message: '请输入邮箱地址', trigger: 'blur'},
                    {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change'}
                ],
                filters: {
                    name: '',
                },
                user_group_option: [],
                users: [{
                    id: '',
                    user_name: '',
                    email: '',
                    user_group: '',
                    create_user: '',
                }],
                userForm: {
                    user_name: '',
                    email: '',
                    group_id: '',
                },
                total: 0,
                page: 1,
                formLabelWidth: '120px'
            }
        },
        filters: {
            groupFilter(value){
                if(value===1) return '测试组';
                else if(value===2) return '产品组';
            }
        },
        methods: {
            complete(row){
                row.edit = false;
                addUser(row).then(res => {
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

            handleCurrentChange(val){
                this.page = val;
                this.getUsers();
            },
            getGroup(){
                let para = Object.assign({});
                getGroup(para).then(res => {
                    const groups = res.data;
                    this.user_group_option = groups.map(res => ({value: res.id, label:res.group_name}))
                })
            },
            getUsers(){
                let para = {page: this.page};
                getUser(para).then(res => {
                    this.users = res.data.users.map(v => {
                        v.edit = false;
                        return v
                    });
                    this.total = res.data.total;
                })
            },
            deleteUser(row){
                this.$confirm('确认删除此用户?', '提示', {}).then(() => {
                    deleterUser(row.id).then(res => {
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
                            this.getUsers();
                        }
                    })
                });
            },
            submitUser(){
                this.$refs.userForm.validate((valid) => {
                    console.log(this.userForm)
                    if (valid) {
                        this.$confirm('确认提交吗?', '提示', {}).then(() => {
                            let para = Object.assign({}, this.userForm);
                            addUser(para).then(res => {
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
                        })
                    }
                })
            },
            resetDialog() {
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        this.$refs['userForm'].resetFields();
                    }
                })
            },
            selsChange: function (sels) {
                this.sels = sels;
            }
        },
        mounted() {
            this.getGroup();
            this.getUsers();
        }
    }
</script>
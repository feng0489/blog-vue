<template>
    <div class="add-admin">
        <div class="header-tages">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/lst' }">管理员列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{nowBread}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="form" :model="form"  label-width="80px">
            <el-form-item label="账 号">
                <el-input style="width: 200px;" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="密 码">
                <el-input style="width: 200px;" v-model="form.pass"></el-input>
            </el-form-item>
            <el-form-item>
                <input type="hidden" v-model="form.id"></input>
                <input type="hidden" v-model="form.type"></input>
                <el-button type="primary"  @click="onSubmit">确认提交</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        name:'home',
        data(){
            return{
                username:"",
                nowBread:'管理员添加',
                form: {
                    id:'',
                    name: '',
                    pass: '',
                    type: 0,

                }
            }
        },
        created:function (){
            if(this.$route.params.ID){
                this.form.id=this.$route.params.ID
            }
            if(this.$route.params.username){
                this.form.name=this.$route.params.username
            }
            if(this.$route.params.type){
                this.form.type=this.$route.params.type
            }
            if(this.$route.params.nowBread){
                this.nowBread=this.$route.params.nowBread
            }
        },
        methods: {
            onSubmit() {
                if(this.form.type===0){//新增
                    let _this = this;
                    this.$http.get("/api/admin/add",{
                        params: {
                            username: this.form.name,
                            password: this.form.pass,

                        }
                    }).then((response) => {
                        let res =response.body;
                        if(res.code === '200'){

                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                            this.$router.push({name:"管理员列表"})

                        }else{
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }

                    }).catch(error => {
                        console.log(error);
                        if(error){
                            this.$message.error("网络异常，请稍候重试");
                        }

                    });
                }else{//修改
                    this.$http.get("/api/admin/up",{
                        params: {
                            id: this.form.id,
                            username: this.form.name,
                            password: this.form.pass,

                        }
                    }).then((response) => {
                        let res =response.body;
                        if(res.code === '200'){
                            this.$message({
                                message: '修改成功！',
                                type: 'success'
                            });

                        }else{
                            this.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }

                    }).catch(error => {
                        console.log(error);
                        if(error){
                            this.$message.error("网络异常，请稍候重试");
                        }

                    });
                }
            }
        },

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .add-admin{
        text-align:left;
    }
    .header-tages{
        margin-top: 15px;
        margin-bottom: 50px;
        line-height: 60px;
        font-size: 14px;
    }
</style>

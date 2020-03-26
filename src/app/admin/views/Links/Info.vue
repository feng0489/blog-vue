<template>
    <div class="add-admin">
        <div class="header-tages">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/links/lst' }">栏目列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{nowBread}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="form" :model="form"  label-width="80px">
            <el-form-item label="标 题">
                <el-input style="width: 200px;" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="地 址">
                <el-input style="width: 200px;" v-model="form.url"></el-input>
            </el-form-item>
            <el-form-item label="描 述">
                <el-input style="width: 200px;" v-model="form.desc"></el-input>
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
                catename:"",
                nowBread:'友情链接添加',
                form: {
                    id:'',
                    title: '',
                    url: '',
                    desc: '',
                    type: 0,

                }
            }
        },
        created:function (){
            if(this.$route.params.ID){
                this.form.id=this.$route.params.ID
            }
            if(this.$route.params.title){
                this.form.title=this.$route.params.title
            }
            if(this.$route.params.url){
                this.form.url=this.$route.params.url
            }
            if(this.$route.params.desc){
                this.form.desc=this.$route.params.desc
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
                    this.$http.get("/api/admin/links/add",{
                        params: {
                            title: this.form.title,
                            url: this.form.url,
                            desc: this.form.desc,

                        }
                    }).then((response) => {
                        let res =response.body;
                        if(res.code === '200'){

                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                            this.$router.push({name:"友情链接"})

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
                    this.$http.get("/api/admin/links/up",{
                        params: {
                            id: this.form.id,
                            title: this.form.title,
                            url: this.form.url,
                            desc: this.form.desc,

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

<template>
    <div class="add-admin">
        <div class="header-tages">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item :to="{ path: '/admin/article/lst' }">文章列表</el-breadcrumb-item>
                <el-breadcrumb-item>{{nowBread}}</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <el-form ref="form" :model="form"  label-width="80px">

            <el-form-item label="标 题">
                <el-input style="width: 50%;" v-model="form.title"></el-input>
            </el-form-item>

            <el-form-item label="作 者">
                <el-input style="width: 50%;" v-model="form.author"></el-input>
            </el-form-item>

            <el-form-item label="关键字">
                <el-input style="width: 50%;" v-model="form.keywords"></el-input>
            </el-form-item>

            <el-form-item label="描 述">
                <el-input style="width: 50%;" v-model="form.desc"></el-input>
            </el-form-item>

            <el-form-item label="缩略图">
                <el-upload
                        class="avatar-uploader"
                        :action=uploadURL
                        name="pic"
                        ref="upload"
                        :with-credentials="true"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :on-error="handleAvatarFalse"
                        :before-upload="beforeAvatarUpload"
                        >
                    <img v-if="form.pic" :src="form.pic" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>

            <el-form-item label="栏 目">
                <el-select v-model="form.cateid" placeholder="请选择">
                    <el-option
                            v-for="item in cates"
                            :key="item.id"
                            :label="item.catename"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="推 荐">
                <el-radio v-model="form.state" :label="0">不推荐</el-radio>
                <el-radio v-model="form.state" :label="1">推荐</el-radio>
                <!--: label=“1”，表示label的值为数字1，即期待数据值为数字-->
                <!--label=“1”，表示label的值为字符串1，即期待的数据值为字符串1-->

            </el-form-item>

            <el-form-item label="内 容">
                <quill-editor
                        v-model="form.content"
                        ref="myQuillEditor"
                        style="width: 50%;height: 550px;margin-bottom: 100px;"
                        :options="quillOption"
                        @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                        @change="onEditorChange($event)">
                </quill-editor>
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
    import quillConfig from "../../utils/quill-config";
    import axios from 'axios'
    export default {
        name:'home',
        data(){
            return{
                username:"",
                nowBread:'文章添加',
                form: {
                    id:'',
                    title: '',//标题
                    author: '',//作者
                    keywords: '',//关键字
                    desc: '',//描述
                    pic: '',//缩略图
                    cateid: '',//栏目id
                    state: 0,//是否推荐
                    content: '',//文章内容
                    type: 0,//0新增，1修改

                },
                cates:[],
                uploadURL:'http://tp5.com:8136/index/upload/pic',
                quillOption: quillConfig,
            }
        }
        ,computed: {
            editor() {
                return this.$refs.myQuillEditor.quill;
            },
        },
        created:function (){
            this.initCates();
            if(this.$route.params.ID){
                let id=this.$route.params.ID;
                if(id>0){
                    var self = this;
                    axios.get('/api/admin/article/find',{params: {id: id}})
                        .then((response) => {
                            let res = response.data;
                            console.log(res);
                            if(res.code ==="200"){

                                self.form=res.data;
                            }else{
                                self.$message({
                                    message: res.msg,
                                    type: 'warning'
                                });
                            }
                        }).catch((error) => {
                            if(error){
                                self.$message({
                                    message: '网络异常，请稍候重试！',
                                    type: 'warning'
                                });
                            }
                        })
                }

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
                    this.$http.get("/api/admin/article/add",{
                        params: {
                            title: this.form.title,
                            author: this.form.author,
                            desc: this.form.desc,
                            keywords: this.form.keywords,
                            content: this.form.content,
                            pic: this.form.pic,
                            state: this.form.state,
                            cateid: this.form.cateid,
                        }
                    }).then((response) => {
                        let res =response.body;
                        if(res.code === '200'){

                            this.$message({
                                message: '添加成功！',
                                type: 'success'
                            });
                            this.$router.push({name:"文章列表"})

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
                    this.$http.get("/api/admin/article/up",{
                        params: {
                            id: this.form.id,
                            title: this.form.title,
                            author: this.form.author,
                            desc: this.form.desc,
                            keywords: this.form.keywords,
                            content: this.form.content,
                            pic: this.form.pic,
                            state: this.form.state,
                            cateid: this.form.cateid,

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
            },
            onEditorBlur(){}, // 失去焦点事件
            onEditorFocus(){}, // 获得焦点事件
            onEditorChange(){
                //console.log({'诶更新的内容':'msg'},this.form.content);
            }, // 内容改变事件
            initCates:function () {
                this.$http.get("/api/admin/cate/all").then((response) => {
                    let res =response.body;
                    if(res.code === '200'){
                        this.cates= res.data;
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
            },
            handleAvatarSuccess(res, file) {
                if(res.code==='200'){
                    this.form.pic = res.data;
                }else {
                    this.$message.error('网络异常，请稍后重试');
                }

            },
            handleAvatarFalse(err, file, fileList){
               if(err){
                   this.$message.error('网络异常，请稍后重试');
               }
            },
            beforeAvatarUpload(file) {
                //const isJPG = file.type === 'image/jpeg/gif';
                const isLt2M = file.size / 1024 / 1024 < 2;
                const isJPG=1;
                // if (!isJPG) {
                //     this.$message.error('上传头像图片只能是 JPG 格式!');
                // }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 2MB!');
                }
                return isJPG && isLt2M;
            },


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
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>

<template>

    <div class="grid-content bg-purple">
        <div class="el-table">



            <div class="header-tages" v-if="catename" style=" margin-left:1%;margin-bottom: 30px;">
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item @click="findByKeyword('')">首页</el-breadcrumb-item>
                    <el-breadcrumb-item :to="{ path: '/articles/'+cateid }">{{catename}}</el-breadcrumb-item>
                </el-breadcrumb>
            </div>


            <div class="xnews2" v-for="(vo, index) in lst.info" :key="vo.id">
                <div class="pic">
                    <a href="javascript:" @click="articleInfo(vo.id)"><img :src="vo.pic"
                                                                           alt="vo.title">
                    </a>
                </div>
                <div class="dec">
                    <h3><a href="javascript:" @click="articleInfo(vo.id)">{{vo.title}}</a></h3>
                    <p>作者：{{vo.author}}</p>
                    <div class="time">发布时间：{{vo.create_time}}</div>
                    <div class="time">
                            <span v-for="(keyword, index) in vo.keywords">
                                <!--<a href="http://127.0.0.1:8136'/index.php/index/search/index?keywords=生活'">{{keyword}}</a>-->
                                <a href="javascript:" @click="findByKeyword(keyword)" style="color: #4e4e4e">{{keyword}}</a>
                                <!--<a href="http://127.0.0.1:8136'/index.php/index/search/index?keywords=娱乐'">娱乐</a>-->
                            </span>

                    </div>
                </div>
            </div>

            <div class="page-center">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next"
                        :total="total">
                </el-pagination>
            </div>
        </div>
    </div>

</template>


<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                lst: [],
                currentPage: 1,//当前页
                pageSize: 8,//每页条数
                total: 0,//总条数
                cateid: 0,
                catename: '',
                tages:[],
                hotlinks:[],
                recoms:[],
            };
        },
        created: function () {
            if (this.$route.params.id) {
                this.cateid = this.$route.params.id;
                this.findcatName( this.cateid);
            }

            this.doList();

        },
        watch: {
            '$route': function (to, from) {
                // console.log(this.$route.params.id)
                this.cateid = this.$route.params.id;
                this.findcatName(this.cateid);
                this.doList();

            }
        },
        methods: {

            doList: function () {
                this.$http.get("/api/articles/lst", {
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                        cateid: this.cateid,
                    }
                }).then((response) => {
                    let res = response.body;
                    if (res.code === '200') {

                        this.lst = res.data;
                        this.total = res.data.total;
                        this.currentPage = res.data.page;
                        this.pageSize = res.data.pageSize
                    } else {
                        this.$message.error(res.msg);
                    }

                }).catch(error => {
                    if (error) {
                        this.$message.error("网络异常，请稍候重试");
                    }

                });


            },
            findcatName (id) {
                if(id>0){
                    var self = this;
                    axios.get('/api/cates/find',{params: {id: id}})
                        .then((response) => {
                            let res = response.data;
                            if(res.code ==="200"){
                                self.catename=res.data.catename;
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
            },
            findByKeyword(keyword){
                this.cateid=keyword;
                this.catename=keyword;
                this.doList();
            },

            articleInfo(id){
                var self = this;
                axios.get('/api/articles/upOfClick',{params: {id: id}})
                    .then((response) => {
                        let res = response.data;
                        if(res.code ==="200"){
                            self.$router.push({name:"articleInfoById",params:{id:id}})
                        }else{
                            self.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                    })
            },

            handleSizeChange(val) {
                this.currentPage = val;
                this.doList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.doList();
            },


        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>


    .page-center {
        text-align: center;
    }

    .el-table .warning-row {
        background: oldlace;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }

    .el-pagination {
        margin-top: 30px;
        /*background: #c7d3d4;*/
        line-height: 60px;
    }

    .header-tages {
        margin-top: 15px;
        margin-bottom: 10px;
        line-height: 60px;
        font-size: 18px;
    }

    .el-tooltip__popper {
        max-width: 20%;
    }

    .el-tooltip__popper, .el-tooltip__popper.is-dark {
        background: #f5f5f5 !important;
        color: #303133 !important;
    }

    .xnews2 {
        width: 750px;
        border-bottom: 1px solid #e5e5e5;
        clear: both;
        overflow: hidden;
        padding-bottom: 30px;
        margin-bottom: 30px;
        margin-left: 1%;
        text-align: left;
    }

    .xnews2 h3 {
        font: 21px/1.2 "微软雅黑", "黑体";
        height: 30px;
        overflow: hidden;
        font-weight: 400;
        width: 510px;
        white-space: nowrap;
        -o-text-overflow: ellipsis;
        text-overflow: ellipsis;
    }

    .xnews2 h3 b {
        font-weight: 400
    }

    .xnews2 .pic {
        width: 230px;
        height: 200px;
        overflow: hidden;
        float: left
    }

    .xnews2 .pic img {
        max-width: 230px;
        width: expression(width>230?"230px":true);
        border: 0px;
    }

    .xnews2 .dec {
        float: right;
        width: 500px;
        overflow: hidden;
        color: #8c8c8c;
        font-size: 12px;
        line-height: 22px
    }

    .xnews2 .dec h3 {
        height: 30px;
        overflow: hidden;
        font-weight: 400;
        font-size: 20px
    }

    .xnews2 .dec h3 a {
        color: #222;
    }

    .xnews2 .dec p {
        padding-top: 15px;
        font-size: 14px
    }

    .xnews2 .time {
        font-size: 12px;
        color: #bbb;
        padding-top: 10px;
    }

    .xnews2 .time a {
        background-color: #f2f2f2;
        border: 1px solid #e8e8e8;
        display: inline-block;
        height: 24px;
        line-height: 24px;
        padding: 0 10px;
        border-radius: 10px;
        margin-top: 10px;
        margin-right: 10px;
        color: #999;
    }

    .xnews2 .time a:hover {
        color: #cc002c
    }
    .tag-group_info{
        margin-top: 30px;
        margin-bottom: 30px;
        margin-left: 1%;
    }
    .tag-group_info .el-tag{
        margin-right: 10px;
    }
    .recom-links{
        margin-top: 60px;
    }
</style>

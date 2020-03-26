<template>

    <el-container>
        <!--头部导航-->
        <el-header>
            <el-row :gutter="20">
                <el-col :span="4"><div class="grid-content bg-purple" style="background-color: #c2ccd4"></div></el-col>
                <el-col :span="20"><div class="grid-content bg-purple">
                    <el-menu
                            router
                            :default-active="activeIndex"
                             class="el-menu-demo"
                             mode="horizontal"
                             background-color="#c2ccd4"
                             align="center"
                             @select="handleSelect">
                        <el-menu-item index="/">首页</el-menu-item>

                        <el-menu-item  v-for = "item in cates" :index="'/articles/'+item.id.toString()" >{{item.catename}}
                        </el-menu-item>
                    </el-menu>


                </div></el-col>
            </el-row>

        </el-header>
        <!--中心内容-->
        <el-main>

            <el-row :gutter="20">

                <!--左边空位empty-->
                <el-col :span="4">
                    <div class="grid-content bg-purple"></div>
                </el-col>

                <!--文章中心-->
                <el-col :span="11">
                    <!--热门标签-->
                    <div class="tag-group_info" >
                        <span class="tage_txt">热门标签：</span>
                        <span class="el-tag el-tag--plain" v-for="(vo, index) in tages">
                         <!--<a :href="'/articles/'+vo.tagname">{{vo.tagname}}</a>-->
                             <a href="javascript:" @click="findByKeyword(vo.tagname)" style="color: #4e4e4e">{{vo.tagname}}</a>
                        </span>
                    </div>
                    <!--文章内容-->
                    <router-view />
                </el-col>

                <!--右边标签-->
                <el-col :span="5">
                    <div class="grid-content bg-purple" style="background-color: white">
                        <!--热门点击-->
                        <div class="hot-links">
                            <el-table
                                    :data="hotlinks"
                                    style="width: 100%"
                                    :header-cell-style="getRowClass"
                                    :row-class-name="hotArtsRowClass">
                                <el-table-column
                                        prop="title"
                                        label="热门点击">
                                    <template slot-scope="scope">
                                        <a href="javascript:" @click="articleInfo(scope.row.id)" style="color: #4e4e4e">{{scope.row.title}}</a>

                                    </template>
                                </el-table-column>
                            </el-table>

                        </div>

                        <!--推荐阅读-->
                        <div class="recom-links">
                            <el-table
                                    :data="recoms"
                                    style="width: 100%"
                                    :header-cell-style="getRowClass"
                                    :row-class-name="hotArtsRowClass">
                                <el-table-column
                                        prop="title"
                                        label="推荐阅读">
                                    <template slot-scope="scope">
                                        <a href="javascript:" @click="articleInfo(scope.row.id)" style="color: #4e4e4e">{{scope.row.title}}</a>

                                    </template>
                                </el-table-column>
                            </el-table>

                        </div>

                    </div>
                </el-col>
                <!--右边空位empty-->
                <el-col :span="4">
                    <div class="grid-content bg-purple"></div>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
    import axios from 'axios'
    export default {
        data() {
            return {
                isCollapse: true,
                activeIndex: '0',
                cateId:0,
                cates:[],
                cateid: 0,
                catename: '',
                tages:[],
                hotlinks:[],
                recoms:[]
            };
        },
        created:function (){
            this.allCate();
            this.alltages();
            this.hotArts();
            this.recomArts();
        },

        methods: {
            allCate:function(){
                var self = this;
                axios.get('/api/cates/all')
                    .then((response) => {
                        let res = response.data;
                        if(res.code ==="200"){

                            self.cates=res.data;
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
            },
            findByKeyword(keyword){
                this.$router.push({name:"articlesList",params:{id:keyword}})
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
            alltages(){
                var self = this;
                axios.get('/api/cates/tages')
                    .then((response) => {
                        let res = response.data;
                        if(res.code ==="200"){
                            self.tages =res.data;
                        }else{
                            self.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                    })
            },
            hotArts(){
                var self = this;
                axios.get('/api/articles/hots')
                    .then((response) => {
                        let res = response.data;
                        if(res.code ==="200"){
                            self.hotlinks=res.data;
                        }else{
                            self.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                    })
            },
            recomArts(){
                var self = this;
                axios.get('/api/articles/recoms')
                    .then((response) => {
                        let res = response.data;
                        if(res.code ==="200"){
                            self.recoms=res.data;
                        }else{
                            self.$message({
                                message: res.msg,
                                type: 'warning'
                            });
                        }
                    })
            },
            hotArtsRowClass({row, rowIndex}) {
                if (rowIndex === 1) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }
                return '';
            },
            getRowClass ({ row, column, rowIndex, columnIndex }) {
                if (rowIndex === 0) {
                    return 'background:#c7d3d4;line-height:30px;'
                } else {
                    return ''
                }
            },
            handleSelect(key, keyPath) {
                //this.$router.go(0)


            },


        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >
  .el-header, .el-footer {
    /*background-color: #B3C0D1;*/
    background-color: #c2ccd4;
    color: #333;
    text-align: center;
    line-height: 60px;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
    line-height: 200px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }

  .el-row {
      margin-bottom: 20px;
      &:last-child {
           margin-bottom: 0;
       }
  }
  .el-col {
      border-radius: 4px;
  }
  .bg-purple-dark {
      background: #99a9bf;
  }
  .bg-purple {
      background: #d3dce6;
  }
  .bg-purple-light {
      background: #e5e9f2;
  }
  .grid-content {
      border-radius: 4px;
      min-height: 36px;
  }
  .row-bg {
      padding: 10px 0;
      background-color: #f9fafc;
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

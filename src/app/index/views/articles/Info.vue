<template>
    <div class="art-info">
        <div style="font-size: larger;text-align: center">{{art.title}}</div>
        <div class="spread">
            <span class="writor">发布时间：{{art.create_time}}</span>
            <span class="writor">编辑：{{art.author}}</span>
            <span class="writor">标签：

                 <span v-for="(keyword, index) in art.keywords">
                     <a href="javascript:" @click="findByKeyword(keyword)" style="color: #4e4e4e">{{keyword}}</a>
                  </span>

            </span>
            <span class="writor">热度：{{art.click}}</span>
        </div>
        <el-divider></el-divider>
        <div class="content">

            <p v-html='art.content'></p>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name:'articles',
        data(){
            return{
                art:{},
                articleId:0,

            }
        },
        created:function (){
            if(this.$route.params.id){
                this.articleId = this.$route.params.id;
                this.articleInfo()
            }

        },
        watch: {
            '$route': function (to, from) {
                //console.log("watchid:"+this.$route.params.id)
                this.articleId = this.$route.params.id;
                this.articleInfo()
            }
        },
        methods: {
            articleInfo(){
                var self = this;
                axios.get('/api/articles/find',{params: {id: this.articleId}})
                    .then((response) => {
                        let res = response.data;
                        if(res.code ==="200"){
                            self.art=res.data;
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
        },

    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .art-info{
        background-color: white;
    }
    .spread {
        text-align: center;
        height: 14px;
        line-height: 14px;
        margin-top: 15px;

    }
    .spread .writor {
        font-size: 12px;
        color: #ccc;
        margin-right: 10px;
        font-family: "微软雅黑";

    }
    .spread .writor a{
        margin-right: 10px;
    }
    .content{
        background-color: white;
    }
</style>

<template>

    </div>
    <div class="el-table">
        <div class="header-tages">
            <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ path: '/admin' }">首页</el-breadcrumb-item>
                <el-breadcrumb-item>文章列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="search_input"> <el-button type="success" @click="addNew()">添加文章</el-button><el-input v-model="cateName" maxlength="13" style="width: 350px;height: 30px;margin-left: 20px; " placeholder="输入文章标题"></el-input> <el-button @click="doSearch()" type="primary">搜索</el-button>
        </div>
        <el-table
                :data="lst.info"
                :row-class-name="diffColor"
                 style="width: 100%"
                :header-cell-style="getRowClass"
                :show-overflow-tooltip="true"
        >
            <el-table-column
                    fixed
                    prop="id"
                    label="id"
            >
            </el-table-column>
            <el-table-column
                    prop="title"
                    label="标题"
            >
            </el-table-column>

            <el-table-column
                    prop="author"
                    label="作者"
            >
            </el-table-column>
            <!--<el-table-column-->
                    <!--prop="state"-->
                    <!--label="是否推荐"-->
                    <!--:formatter="formatState"-->
            <!--&gt;-->
            <!--</el-table-column>-->

            <el-table-column
                    prop="state"
                    label="是否推荐"
            >
                <template slot-scope="scope">
                    <span v-if="scope.row.state==0">不推荐</span>
                    <span v-if="scope.row.state==1" style="color: #0acf97">推荐</span>

                </template>

            </el-table-column>

            <el-table-column
                    prop="pic"
                    label="缩略图"
            >
                <template slot-scope="scope">
                   <img :src="scope.row.pic"  min-width="70" height="70"/>
                </template>
            </el-table-column>

            <el-table-column
                    prop="catename"
                    label="栏目"
            >
            </el-table-column>

            <el-table-column
                    fixed="right"
                    label="操作"
            >
                <template slot-scope="scope">
                    <el-button
                            @click.native.prevent="editRow(scope.$index, lst.info)"
                            type="info"
                            icon="el-icon-edit">
                    </el-button>
                    <el-button
                            @click.native.prevent="deleteRow(scope.$index, lst.info)"
                            type="warning"
                            icon="el-icon-delete">

                    </el-button>
                </template>
            </el-table-column>
        </el-table>

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
</template>


<script>
    export default {
        data() {
            return {
                msg:"管理员管理",
                lst:[],
                currentPage: 1,//当前页
                pageSize:15,//每页条数
                total:0,//总条数
                cateName:'',


            };
        },
        created:function (){
            this.doList();
        },

        methods: {

            doList:function () {
                this.$http.get("/api/admin/article/lst",{
                    params: {
                        page: this.currentPage,
                        pageSize: this.pageSize,
                        cateName: this.cateName,
                    }
                }).then((response) => {
                    let res =response.body;
                    if(res.code === '200'){

                        this.lst = res.data;
                        this.total = res.data.total;
                        this.currentPage = res.data.page;
                        this.pageSize = res.data.pageSize
                    }else{
                        this.$message.error(res.msg);
                    }

                }).catch(error => {
                    if(error){
                        this.$message.error("网络异常，请稍候重试");
                    }

                });



            },
            deleteRow(index, rows) {

                let info = rows[index];
                this.$http.get("/api/admin/article/del",{
                    params: {
                        id: info.id,

                    }
                }).then((response) => {
                    let res =response.body;
                    if(res.code === '200'){
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        rows.splice(index, 1);
                    }else{
                        this.$message({
                            message: res.msg,
                            type: 'warning'
                        });
                    }

                }).catch(error => {
                    if(error){
                        this.$message.error("网络异常，请稍候重试");
                    }

                });


            },
            addNew:function(){
                this.$router.push({name:"文章添加"})
            },
            editRow(index, rows){
                let info = rows[index];
                if(info){
                    // this.$router.push({path:"/admin/edit",query:{ID:info.id,username:info.username,type:1}})
                    this.$router.push({name:"文章修改",params:{ID:info.id,type:1,nowBread:'文章修改'}})
                }
            },
            diffColor({row, rowIndex}) {
                if ((rowIndex-1)%2 ===0) {
                    return 'warning-row';
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
            handleSizeChange(val) {
                this.currentPage = val;
                this.doList();
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.doList();
            },
            doSearch:function () {
                this.doList();
            },
            formatState:function(row, column, cellValue){
                if (cellValue === 1){
                    return '推荐';
                }else if (cellValue === 0){
                    return '不推荐';
                }
            },

        },
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style >

    .el-table .warning-row {
        background: rgb(230, 234, 240);

    }

    .page-center{
        text-align: center;
    }

    .el-pagination {
        margin-top: 30px;
        /*background: #c7d3d4;*/
        line-height: 60px;
    }
    .search_input{
        line-height: 60px;
        width: 50%;

    }
    .header-tages{
        margin-top: 15px;
        margin-bottom: 10px;
        line-height: 60px;
        font-size: 18px;
    }
    .el-tooltip__popper{
        max-width:20%;
    }
    .el-tooltip__popper,.el-tooltip__popper.is-dark{
        background:#f5f5f5 !important;
        color: #303133 !important;
    }

</style>

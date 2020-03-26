<template>

  <el-container>

        <el-menu
                router
                default-active="1"
                class="el-menu-vertical-demo"
                @open="handleOpen"
                @close="handleClose"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b"
                :collapse="isCollapse">

            <el-menu-item index="/admin">
                <i class="el-icon-s-home"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-submenu index="1">
                <template slot="title">
                    <i class="el-icon-s-custom"></i>
                    <span>后台管理</span>
                </template>
                <el-menu-item index="/admin/lst">管理员列表</el-menu-item>
                <el-menu-item index="/admin/add">管理员添加</el-menu-item>
            </el-submenu>

            <el-submenu index="2">
                <template slot="title">
                    <i class="el-icon-price-tag"></i>
                    <span>栏目管理</span>
                </template>
                <el-menu-item index="/admin/cat/lst">栏目列表</el-menu-item>
                <el-menu-item index="/admin/cat/add">栏目添加</el-menu-item>
            </el-submenu>

            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-tickets"></i>
                    <span>文章管理</span>
                </template>
                <el-menu-item index="/admin/article/lst">文章列表</el-menu-item>
                <el-menu-item index="/admin/article/add">文章添加</el-menu-item>
            </el-submenu>

            <el-submenu index="4">
                <template slot="title">
                    <i class="el-icon-link"></i>
                    <span>友情链接</span>
                </template>
                <el-menu-item index="/admin/links/lst">连接列表</el-menu-item>
                <el-menu-item index="/admin/links/add">连接添加</el-menu-item>
            </el-submenu>

            <el-submenu index="5">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>系统设置</span>
                </template>
                <!--<el-menu-item index="/admin/sys">基础设置</el-menu-item>-->
                <el-menu-item index="/admin/sys/tags">标签列表</el-menu-item>
                <el-menu-item index="/admin/sys/tags/add">标签添加</el-menu-item>
            </el-submenu>

        </el-menu>
      <el-container>
          <el-radio-group v-model="isCollapse" style="margin-top: 14px;position:absolute;" size="mini">
              <el-radio-button :label="false">展开</el-radio-button>
              <el-radio-button :label="true">收起</el-radio-button>
          </el-radio-group>
      <el-header>我是博客</el-header>
      <el-main>

        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
    export default {
        data() {
            return {
                isCollapse: false,//false 展开，true 收起
            };
        },
        methods: {
            handleOpen(key, keyPath) {
                //console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
               // console.log(key, keyPath);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>

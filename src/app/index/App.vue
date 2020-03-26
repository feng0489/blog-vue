<template>
  <div id="app">
      <Index />
  </div>
</template>

<script>
import Index from './views/index/Index.vue'


export default {
  name: 'app',
  components: {
      Index

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;

}
.el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: left;
    line-height: 30px;
}
a{ text-decoration:none}
</style>

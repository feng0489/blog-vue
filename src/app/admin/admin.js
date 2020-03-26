import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import router from './router/router'
import ElementUI from 'element-ui';
import VueResource from 'vue-resource';
import VueQuillEditor from 'vue-quill-editor'



import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import 'element-ui/lib/theme-chalk/index.css';


Vue.config.productionTip = false;

Vue.use(VueRouter);
Vue.use(ElementUI);
Vue.use(VueResource);
Vue.use(VueQuillEditor);



new Vue({
    router,
  render: h => h(App),
}).$mount('#app')

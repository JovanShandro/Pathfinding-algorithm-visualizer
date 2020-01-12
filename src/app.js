import Vue from 'vue';
import App from './App.vue';
import VueRouter from "vue-router";
import routes from './router/routes';
import './style.css'; 

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  mode: "history"
});

new Vue({
    render: (el) => el(App),
    router,
}).$mount('#app');
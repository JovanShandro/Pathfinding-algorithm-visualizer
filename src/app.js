import Tooltip from "@adamdehaven/vue-custom-tooltip";
import Vue from "vue";
import VueRouter from "vue-router";
import Vuex from "vuex";
import App from "./App.vue";
import "./index.css";
import routes from "./routes";
import boardStore from "./store";

Vue.use(Tooltip, {
  color: "#000",
  background: "#fff",
});
Vue.use(VueRouter);
Vue.use(Vuex);

const store = new Vuex.Store({
  ...boardStore,
});

const router = new VueRouter({
  routes,
  mode: "history",
});

new Vue({
  render: (el) => el(App),
  router,
  store,
}).$mount("#app");

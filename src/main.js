
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import VueCookies from 'vue-cookies'
import 'element-ui/lib/theme-chalk/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import routes from './routes'
import 'font-awesome/css/font-awesome.min.css'
import Icon from 'vue-svg-icon/Icon.vue';

Vue.component('icon', Icon);

Vue.use(ElementUI, { size: 'small' });
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueCookies);

const router = new VueRouter({
    routes
});

const cookies = VueCookies;

router.beforeEach((to, from, next) => {
    let cookies = VueCookies.get('token');
    if (cookies) {
        if (to.path === '/login') {
            next('/');
        }
        else if (to.path === '/') {
            next('/dashboard')
        }
        else {
            next();
        }
    }
    else {
        if (to.path === '/login') {
            next();
        }
        else {
            next('/login');
        }
    }
});

new Vue({
    router,
    cookies,
    store,
    render: h => h(App)
}).$mount('#app');


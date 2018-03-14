import Login from './views/Login'
import NotFound from './views/404'
import Home from './views/Home'
import Report from './views/nav2/Report'
import Remind from './views/nav2/Remind'
import Result from './views/nav2/Result'
import Echarts from './views/charts/echarts'
import PassRate from './views/regression/PassRate'
import User from './views/manager/User'
import Group from './views/manager/Group'
import Propose from './views/propose/Propose'
import Dashboard from './views/dashboard/index'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'fa fa-tasks',
        leaf: true,
        children: [
            {path: '/dashboard', component: Dashboard, name: '任务中心'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '任务管理',
        iconCls: 'fa fa-id-card-o',
        children: [
            {path: '/propose', component: Propose, name: '测试任务'},
            {path: '/report', component: Report, name: '测试报告'},
            {path: '/remind', component: Remind, name: '任务模版', hidden: true},
            {path: '/result', component: Result, name: '报告模版', hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '单元测试覆盖率',
        iconCls: 'fa fa-bar-chart',
        children: [
            {path: '/echarts', component: Echarts, name: '覆盖率曲线'}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '自动化测试',
        iconCls: 'fa fa-connectdevelop',
        children: [
            {path: '/pass_rate', component: PassRate, name: '回归通过率'},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'fa fa-user',
        children: [
            {path: '/user', component: User, name: '用户信息'},
            {path: '/group', component: Group, name: '小组信息'},
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: {path: '/404'}
    },
];
export default routes;
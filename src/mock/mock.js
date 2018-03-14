import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Users, Info, Reports } from './data/user';
let _Users = Users;
let _Info = Info;
let _Reports = Reports;

export default {
    /**
     * mock bootstrap
     */
    bootstrap() {
        let mock = new MockAdapter(axios);

        // mock success request
        mock.onGet('/success').reply(200, {
            msg: 'success'
        });

        // mock error request
        mock.onGet('/error').reply(500, {
            msg: 'failure'
        });

        //登录
        mock.onPost('/login').reply(config => {
            let {username, password} = JSON.parse(config.data);
            return new Promise((resolve, reject) => {
                let user = null;
                setTimeout(() => {
                    let hasUser = LoginUsers.some(u => {
                        if (u.username === username && u.password === password) {
                            user = JSON.parse(JSON.stringify(u));
                            user.password = undefined;
                            return true;
                        }
                    });

                    if (hasUser) {
                        resolve([200, {code: 200, msg: '请求成功', user}]);
                    } else {
                        resolve([200, {code: 500, msg: '账号或密码错误'}]);
                    }
                });
            });
        });

        //发送邮件
        mock.onGet('/send').reply(config => {
            let {id} = config.params;
            let info = _Info.filter(u => u.id===id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        info: info
                    }])
                })
            })
        });

        //获取用户列表
        mock.onGet('/user/list').reply(config => {
            let {name} = config.params;
            let mockUsers = _Users.filter(user => {
                if (name && user.name.indexOf(name) === -1) return false;
                return true;
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        users: mockUsers
                    }]);
                });
            });
        });

        //获取用户列表（分页）
        mock.onGet('/user/listpage').reply(config => {
            let {page, name} = config.params;
            let mockUsers = _Users.filter(user => {
                if (name && user.name.indexOf(name) === -1) return false;
                return true;
            });
            let total = mockUsers.length;
            mockUsers = mockUsers.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
            alert(123);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        users: mockUsers
                    }]);
                });
            });
        });
        //获取测试报告列表（分页）
        mock.onGet('/report/listpage').reply(config => {
            let {page, name} = config.params;
            let mockReports = _Reports.filter(report => {
                if (name && report.name.indexOf(name) === -1) return false;
                return true;
            });
            let total = mockReports.length;
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        reports: mockReports
                    }]);
                });
            });
        });
        //获取用户列表（分页）
        mock.onGet('/info/listpage').reply(config => {
            let {page, name} = config.params;
            let mockInfos = _Info.filter(info => {
                if (name && info.name.indexOf(name) === -1) return false;
                return true;
            });
            let total = mockInfos.length;
            mockInfos = mockInfos.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        infos: mockInfos
                    }]);
                });
            });
        });
        //获取提测过的信息
        mock.onGet('/testinfo/listpage').reply(config => {
            let {page, name} = config.params;
            let mockInfos = _Info.filter(info => {
                if (name && info.name.indexOf(name) === -1) return false;
                return true;
            });
            let total = mockInfos.length;
            mockInfos = mockInfos.filter(u => u.number !== 0);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        total: total,
                        testinfos: mockInfos
                    }]);
                });
            });
        });
        //删除用户
        mock.onGet('/user/remove').reply(config => {
            let {id} = config.params;
            _Users = _Users.filter(u => u.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                });
            });
        });

        //删除提测用户
        mock.onGet('/info/remove').reply(config => {
            let {id} = config.params;
            _Info = _Info.filter(u => u.id !== id);
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                });
            });
        });
        //批量删除用户
        mock.onGet('/user/batchremove').reply(config => {
            let {ids} = config.params;
            ids = ids.split(',');
            _Users = _Users.filter(u => !ids.includes(u.id));
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '删除成功'
                    }]);
                });
            });
        });

        //编辑用户
        mock.onGet('/user/edit').reply(config => {
            let {id, name, addr, age, birth, sex} = config.params;
            _Users.some(u => {
                if (u.id === id) {
                    u.name = name;
                    u.addr = addr;
                    u.age = age;
                    u.birth = birth;
                    u.sex = sex;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                });
            });
        });

        //编辑提测
        mock.onGet('/info/edit').reply(config => {
            let {id, name, pr, appid, prd, email, funlist, change, problem, describe, percent, env, remarks, develop} = config.params;
            _Info.some(u => {
                if (u.id === id) {
                    u.name = name;
                    u.pr = pr;
                    u.appid = appid;
                    u.prd = prd;
                    u.email = email;
                    u.funlist = funlist;
                    u.change = change;
                    u.problem = problem;
                    u.describe = describe;
                    u.percent = percent;
                    u.env = env;
                    u.remarks = remarks;
                    u.develop = develop;
                    return true;
                }
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '编辑成功'
                    }]);
                });
            });
        });

        //新增用户
        mock.onGet('/user/add').reply(config => {
            let {name, addr, age, birth, sex} = config.params;
            _Users.push({
                name: name,
                addr: addr,
                age: age,
                birth: birth,
                sex: sex
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                });
            });
        });

        mock.onGet('/report/add').reply(config => {
            let {name, appid, prd, result, type, explain, environ, tool, bug, remarks} = config.params;
            _Reports.push({
                name: name,
                appid: appid,
                prd: prd,
                result: result,
                type: type,
                explain: explain,
                environ: environ,
                tool: tool,
                bug: bug,
                remarks: remarks,
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        meg: '测试报告发送成功'
                    }]);
                })
            });
        });

        //新增提测项目
        mock.onGet('/info/add').reply(config => {
            let {name, pr, appid, prd, email, funlist, change, problem, describe, percent, env, remarks, develop} = config.params;
            _Info.push({
                name: name,
                pr: pr,
                appid: appid,
                prd: prd,
                email: email,
                funlist: funlist,
                change: change,
                problem: problem,
                describe: describe,
                percent: percent,
                env: env,
                remarks: remarks,
                develop: develop
            });
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([200, {
                        code: 200,
                        msg: '新增成功'
                    }]);
                });
            });
        });

    }
};
import Mock from 'mockjs';
const LoginUsers = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
        name: '张某某'
    },
    {
        id: 2,
        username: 'xiaodong.xu02@ele.me',
        password: '123456',
        avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
        name: '徐晓东'
    }
];

const Users = [];

const Info = [
    {
        id: 1,
        name: '做一个测试',
        email: 'xiaodong.xu02@ele.me',
        date_time: '1970',
        number: 1,
        appid: 'zeus.eos',
        pr: '',
        prd: '',
        funlist: '',
        change: '',
        problem: '',
        describe: '',
        percent: '',
        env: '',
        remarks: '',
        develop: '',
    }
];

const Reports = [];

for (let i = 0; i < 86; i++) {
    Users.push(Mock.mock({
        id: Mock.Random.guid(),
        name: Mock.Random.cname(),
        addr: Mock.mock('@county(true)'),
        'age|18-60': 1,
        birth: Mock.Random.date(),
        sex: Mock.Random.integer(0, 1)
    }));
}

export {LoginUsers, Users, Info, Reports};

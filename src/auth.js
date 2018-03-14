import {requestLogin} from './api/api.js'

export default{
    data: {
        authenticated: false
    },
    login(context, loginParams){
        requestLogin(loginParams).then(data => {
            let {msg, code, employee} = data;
            if (code !== 200) {
                context.$message({
                    message: msg,
                    type: 'error'
                });
            } else {
                let expireDays = 24 * 60 * 60 ;
                context.$cookies.set('token', '123456', expireDays);
                localStorage.setItem('user', JSON.stringify(employee));
                context.$router.push({path: '/'});
            }
        }, function (err) {
            console.log(err + "," + err.body.message);
        })
    },
}
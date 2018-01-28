import React from 'react';
import LoginForm from './Login.js';
import './login.less';

const Login = (props) => {
    return (
        <div className="login">
            <h1>
                <span style={{'color': '#108ee9'}}>智慧</span>
                <span style={{'color': '#fff'}}>水务</span>
            </h1>
            <LoginForm />
        </div>
    );
}
export default Login;

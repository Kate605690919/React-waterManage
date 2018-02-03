import React from 'react';
import LoginForm from './Login.js';
import './login.less';

const Login = (props) => {
    return (
        <div className="login">
            <h1>
                <span>智慧</span>
                <span>水务</span>
            </h1>
            <LoginForm />
        </div>
    );
}
export default Login;

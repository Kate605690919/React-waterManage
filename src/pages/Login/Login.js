import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import util from '../../util/util';
// import { location } from 'react-router/lib/PropTypes';

const FormItem = Form.Item;

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        let formData = util.objToStr(values);
        // let xhr = new XMLHttpRequest();
        // xhr.onreadystatechange = () => {
        //   if (xhr.readyState === 4) {
        //     if((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        //       alert(xhr.responseText);
        //       let headers = xhr.getAllResponseHeaders();
        //       console.log(headers);
        //     } else {
        //       alert('Request was unsuccessful: ' + xhr.status);
        //     }
        //   }
        // }
        // xhr.open('post', 'http://localhost:64915/home/Login',true);
        // xhr.withCredentials = true;
        // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // xhr.send(formData);
        
        util.fetch_Post({
          url: 'http://localhost:64915/home/Login',
          data: formData,
          token: util.getSessionStorate('token'),
          success: (res, headers) => {
            if (res) {
              util.setSessionStorate('username',headers.get('username'));
              util.setSessionStorate('useruid', headers.get('useruid'));
              util.setSessionStorate('token', headers.get('access_token'));
              util.setSessionStorate('permission', res);
              window.location.hash = '#/device';
            }
          } 
        })
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名!' }],
          })(
            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
            )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: '请输入密码!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
            )}
        </FormItem>
        <FormItem>
          {/* {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )} */}
          {/* <a className="login-form-forgot" href="">Forgot password</a> */}
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          {/* Or <a href="">register now!</a> */}
        </FormItem>
      </Form>
    );
  }
}

const LoginForm = Form.create()(NormalLoginForm);

export default LoginForm;
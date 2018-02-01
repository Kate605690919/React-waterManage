import React from 'react';
import { Form, Input, Button, message } from 'antd';
import util from '../util/util';

const FormItem = Form.Item;
class UpdateForm extends React.Component{
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const useruid = util.getSessionStorate('useruid');
                const origialPassword = values.password;
                const resetPassword = values.newPassword;
                this.fetch_Post({
                    url: 'http://localhost:2051/Home/ResetPassword',
                    // url: 'http://rap2api.taobao.org/app/mock/5151/POST/Home/ResetPassword',
                    data: `uid=${useruid}&origialPassword=${origialPassword}&resetPassword=${resetPassword}`,
                    success: (res) => {
                        if(res){
                            message.success('修改成功！');
                            this.props.form.resetFields();
                        } else{
                            message.error('原始密码不正确，修改失败，请重试！');
                            this.props.form.resetFields();
                        }
                    }
                })
            }
        });
    }
    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('newPassword')) {
          callback('两次输入密码不一致！');
        } else {
          callback();
        }
    }
    fetch_Post({url, data, success}){
		fetch(url, {
			method: 'POST',
			headers: {"Content-Type": "application/x-www-form-urlencoded"},
			body: data
		}).then((response) => {
			if (response.status !== 200) {
				throw new Error('Fail to get response with status ' + response.status);
			}
			response.json().then((res) => {
				success(res);
			}).catch((error) => {
				console.error(error);
			});
		}).catch((error) => {
			console.error(error);
		});
	}
    render(){
        const { getFieldDecorator } = this.props.form;
        const divStyle = {
            padding: '50px 20%'
        }
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 14,
                offset: 6,
              },
            },
        };
        return (
            <div style={divStyle}>
                <h1>修改密码</h1>
                <Form onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem {...formItemLayout} label="原始密码">
                    {getFieldDecorator('password', {
                        rules: [{
                            required: true, message: '请输入原始密码！'
                        }]
                    })(
                        <Input type="password" />
                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="新密码">
                    {getFieldDecorator('newPassword', {
                        rules: [{
                            required: true, message: '请输入新密码！'
                        },{
                            min: 3, message: '密码不得少于3位'
                        }]
                    })(
                        <Input type="password" />
                    )}
                    </FormItem>
                    <FormItem {...formItemLayout} label="确认密码">
                    {getFieldDecorator('confirmPassword', {
                        rules: [{
                            required: true, message: '请再次输入新密码！'
                        },{
                            validator: this.checkPassword
                        }]
                    })(
                        <Input type="password" />
                    )}
                    </FormItem>
                    <FormItem {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">提交修改</Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

const PasswordUpdateApp = Form.create()(UpdateForm);
export default PasswordUpdateApp;
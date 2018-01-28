import React from 'react';
import {Form, Input, Radio, Button } from 'antd';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const labelData = [
    {
        id: 1,
        key: "FM_Code",
        name: '流量计编码',
        type: 'text',
        value: ''
    },
    {
        id: 2,
        key: "FM_AlarmNumber",
        name: '报警号码',
        type: 'text',
        value: ''
    },
    {
        id: 3,
        key: 'FM_AlarmThreshold',
        name: '报警阈值',
        type: 'text',
        value: ''
    },
    {
        id: 4,
        key: 'FM_AlarmTimeOut',
        name: '超时阈值',
        type: 'text',
        value: ''
    },
    {
        id: 5,
        key: 'FM_AlarmMode',
        name: '报警模式',
        type: 'radio',
        value: '',
        option: [
            {
                name: '自动',
                value: 1
            },
            {
                name: '默认',
                value: 0
            }
        ]
    },
    {
        id: 6,
        key: 'FM_Class',
        name: '用户类型',
        type: 'radio',
        value: '',
        option: [
            {
                name: '手抄流量计',
                value: 1
            },
            {
                name: '普通',
                value: 0
            }
        ]
    },
    {
        id: 7,
        key: 'FM_Description',
        name: '流量计描述',
        type: 'text',
        value: ''
    },
    {
        id: 8,
        key: 'FM_BatteryAlarmThreshold',
        name: '设备电池报警阈值',
        type: 'text',
        value: ''
    },
    {
        id: 9,
        key: 'FM_ModemAlarmThreshold',
        name: '通信电池报警阈值',
        type: 'text',
        value: ''
    },
    {
        id: 10,
        key: 'FM_Enable',
        name: '是否可用',
        type: 'radio',
        value: '',
        option: [
            {
                name: '是',
                value: 1
            },
            {
                name: '否',
                value: 0
            }
        ]
    },
    {
        id: 11,
        key: 'FM_DeviceAlarmNumber',
        name: '流量计手机号码',
        type: 'text',
        value: ''
    }
]
class NewForm extends React.Component{
    constructor(props){
        super(props);
    }

    state = {
        data: []
    }
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                this.props.onAddSubmit(values);
            } else{
                console.log('error');
            }
        })
    }
    // checkConfirm(rule, value, callback){
    //     const form = this.props.form;
    //     if(value && this.state.confirmDirty){
    //         form.validateFields(['confirm', {force: true}]);
    //     }
    //     callback();
    // }
    render(){
        const { getFieldDecorator } = this.props.form;

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
                span: 16,
                offset: 6,
              },
            },
          };
        let FormList = labelData.map(function(item){
            if(item.type === 'text'){
                return (
                    <FormItem {...formItemLayout} key={item.id} label={item.name}>
                    {getFieldDecorator(item.key, {
                        rules: [{
                            required: true, message: `${item.name}为必填项！`
                        }]
                    })(
                        <Input />
                    )} 
                    </FormItem>
                );
            } else if(item.type === 'radio'){
                return (
                    <FormItem {...formItemLayout} key={item.id} label={item.name}>
                    {getFieldDecorator(item.key, {
                        rules: [{
                            required: true, message: `${item.name}为必选项！`
                        }]
                    })(
                        <RadioGroup>
                        {item.option.map((op) => (<Radio value={op.value}>{op.name}</Radio>))}
                        </RadioGroup>
                    )}    
                    </FormItem>
                )
            } else {
                return (
                    <FormItem {...formItemLayout} key={item.id} label={item.name}>
                        
                    </FormItem>
                )
            }
        });
        return (
            <Form onSubmit = {this.handleSubmit.bind(this)}>
                {FormList}
                <FormItem {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit">提交</Button>
                </FormItem>
                {/* <FormItem {...formItemLayout} label="编码">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="报警号码">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="报警阈值">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="超时阈值">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="报警模式">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="用户类型">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="流量计描述">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="设备电池报警阈值">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="通信电池报警阈值">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="是否可用">
                    <Input />
                </FormItem>
                <FormItem {...formItemLayout} label="流量计手机号码">
                    <Input />
                </FormItem> */}
            </Form>
        )
    }
}

const AddForm = Form.create()(NewForm);
export default AddForm;
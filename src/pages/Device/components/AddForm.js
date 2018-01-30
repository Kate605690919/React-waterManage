import React from 'react';
import {Form, Input, Radio, Button, Cascader, Steps, message, Row, Col } from 'antd';
import util from '../../../util/util';
import WaterMap from './WaterMap';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
class NewForm extends React.Component{
    state = {
        current: 0,   //步骤条
    }
    componentWillUnmount(){
        util.setSessionStorate('lng', null);
        util.setSessionStorate('lat', null);
    }
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                const areaId = values.areaUid[values.areaUid.length - 1];
                values.areaUid = areaId;
                const lng = util.getSessionStorate('lng');
                const lat = util.getSessionStorate('lat');
                Object.assign(values, lng, lat);
                this.props.onAddSubmit(values);
                util.setSessionStorate('lng', null);
                util.setSessionStorate('lat', null);
            } else{
                message.error('提交失败，请重试！')
            }
        })
    }
    next(){
        const labelData = this.props.labelData;
        const mapLableData = labelData.filter((item) => item.type === 'map');
        let lng = mapLableData[0].key;
        let lat = mapLableData[1].key;
        const { getFieldValue, validateFieldsAndScroll } = this.props.form;
        // validateFields([lng, lat], (error, values))
        validateFieldsAndScroll([lng, lat], (err, values) => {
            if(!err){
                const lngValue = getFieldValue(lng);
                const latValue = getFieldValue(lat);
                util.setSessionStorate('lng', {[lng]: lngValue});
                util.setSessionStorate('lat', {[lat]: latValue});
                const current = this.state.current + 1;
                this.setState({current });
            }
        })
        
	}
	prev(){
		const current = this.state.current - 1;
        this.setState({current});
        // const LngLat = util.getSessionStorate('LngLat');
        // this.props.form.setFieldsValue(LngLat);
    }
    handleMap(point){
        const labelData = this.props.labelData;
        const mapLableData = labelData.filter((item) => item.type === 'map');
        let lng = mapLableData[0].key;
        let lat = mapLableData[1].key;
        this.props.form.setFieldsValue({
            [lng] : point.lng,
            [lat]:  point.lat
        })
        util.setSessionStorate('lng', {[lng]: point.lng});
        util.setSessionStorate('lat', {[lat]: point.lat});
    }
    render(){
        const { getFieldDecorator } = this.props.form;
        const labelData = this.props.labelData;
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
        // const tailFormItemLayout = {
        //     wrapperCol: {
        //       xs: {
        //         span: 24,
        //         offset: 0,
        //       },
        //       sm: {
        //         span: 16,
        //         offset: 6,
        //       },
        //     },
        //   };
        const { current } = this.state;
        // const displayRender = (labels, selectedOptions) => labels.map((label, i) => {
        //     const option = selectedOptions[i];
        //     return <span key={option.id}>{option.text} /</span>
        // });
        let FormList = labelData.map(function(item){
            let content = null;
            if(item.type === 'text'){
                if(item.key.indexOf('DeviceAlarmNumber') !== -1){
                    content = getFieldDecorator(item.key, {
                        rules: [{
                            required: true, message: `${item.name}为必填项！`
                        },{
                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入有效的手机号码！'
                        }]
                    })(
                        <Input />
                    );
                } else if(item.key.indexOf('Description') !== -1){
                    content = getFieldDecorator(item.key, {
                        rules: [{
                            required: false
                        }]
                    })(
                        <Input />
                    );
                } else{
                    content = getFieldDecorator(item.key, {
                        rules: [{
                            required: true, message: `${item.name}为必填项！`
                        }]
                    })(
                        <Input />
                    );
                }
                // return (
                //     <FormItem {...formItemLayout} key={item.id} label={item.name}>
                //     {getFieldDecorator(item.key, {
                //         rules: [{
                //             required: true, message: `${item.name}为必填项！`
                //         }]
                //     })(
                //         <Input />
                //     )} 
                //     </FormItem>
                // );
            } else if(item.type === 'radio'){
                content = getFieldDecorator(item.key, {
                    rules: [{
                        required: true, message: `${item.name}为必选项！`
                    }]
                })(
                    <RadioGroup key={item.option.name}>
                    {item.option.map((op) => (<Radio key={op.name} value={op.value}>{op.name}</Radio>))}
                    </RadioGroup>
                );   
                // return (
                //     <FormItem {...formItemLayout} key={item.id} label={item.name}>
                //     {getFieldDecorator(item.key, {
                //         rules: [{
                //             required: true, message: `${item.name}为必选项！`
                //         }]
                //     })(
                //         <RadioGroup>
                //         {item.option.map((op) => (<Radio value={op.value}>{op.name}</Radio>))}
                //         </RadioGroup>
                //     )}    
                //     </FormItem>
                // )
            } else if(item.type === 'cascader'){
                //将区域树的key进行修改
                const areaTree = util.getSessionStorate('areatree');
                let str = JSON.stringify(areaTree);
                str = str.replace(/id/g, 'value');
                str = str.replace(/text/g, 'label');
                const areas = JSON.parse(str);
                content = getFieldDecorator(item.key, {
                    // initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                    rules: [{ type: 'array', required: true, message: `${item.name}为必填项！`}],
                  })(
                    <Cascader options={areas} changeOnSelect placeholder="选择区域"/>
                  );
            } else{
                return null;
            }
            return (
                <FormItem {...formItemLayout} key={item.id} label={item.name}>
                    {content}
                </FormItem>
            )
        });
        //从缓存中读取经纬度，如果缓存中没有，则取默认值
        const lng = util.getSessionStorate('lng');
        const lat = util.getSessionStorate('lat');
        const dLng = this.props.defaultLngLat.lng;
        const dLat = this.props.defaultLngLat.lat;
        const lngValue = (lng !== null) ? Object.values(lng)[0]||dLng : dLng;
        const latValue = (lat !== null) ? Object.values(lat)[0]||dLat : dLat;
        const mapLabelData = labelData.filter((item) => item.type === 'map');
        const renderMap = (mapLabel) => {
            const key = mapLabel.key;
            if(key.indexOf('Lng') !== -1){
                return (
                    <FormItem {...formItemLayout} label={mapLabel.name}>
                    {getFieldDecorator(key, {
                        rules: [{
                            required: true, message: `${mapLabel.name}为必填项！`
                        }],
                        initialValue: lngValue
                    })(
                        <Input />
                    )}
                    </FormItem>
                )
            } else if(key.indexOf('Lat') !== -1){
                return (
                    <FormItem {...formItemLayout} label={mapLabel.name}>
                    {getFieldDecorator(key, {
                        rules: [{
                            required: true, message: `${mapLabel.name}为必填项！`,
                        }],
                        initialValue: latValue
                    })(
                        <Input />
                    )}
                    </FormItem>
                )
            }
        }
        let MapList = (mapLabelData) => {
            return (
                <div>
                    <Row>
                        <Col xs={18} sm={12} key={1}>
                            {renderMap(mapLabelData[0])}
                        </Col>
                        <Col xs={18} sm={12} key={2}>
                            {renderMap(mapLabelData[1])}
                        </Col>
                    </Row>
                    <WaterMap defaultLng={lngValue} defaultLat={latValue} handleChange={this.handleMap.bind(this)} />
                </div>
            )
        };
        const steps = [{
            title: '选择地点',
            render: () => {
                return (
                    <div>
                        {MapList(mapLabelData)}
                    </div>
                )
            }
        },{
            title: '基本信息',
            render: () => {
                return (
                    <div>
                        {FormList}
                    </div>
                )
            }
        }];
        return (
            <Form onSubmit = {this.handleSubmit.bind(this)}>
                <Steps style={{padding: '20px 20%'}} current={current}>
					{steps.map(item => <Step key={item.title} title={item.title} />)}
			    </Steps>
				<div>
                    {steps[this.state.current].render()}
				</div>
				<div style={{marginTop: '24px'}}>
                    {
						this.state.current > 0
						&&
						<Button onClick={() => this.prev()}>
							上一步
						</Button>
					}
					{
						this.state.current < steps.length - 1
						&&
						<Button style={{ marginLeft: 8}} type="primary" onClick={() => this.next()}>下一步</Button>
                    }
                    {
                        this.state.current === steps.length - 1
                        &&
                        <Button style={{ marginLeft: 8}} type="primary" htmlType="submit">提交</Button>
                    }
					
				</div>
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
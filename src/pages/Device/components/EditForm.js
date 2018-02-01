import React from 'react';
import {Form, Input, Radio, Button, Cascader, Steps, message, Row, Col } from 'antd';
import util from '../../../util/util';
import WaterMap from './WaterMap';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Step = Steps.Step;
class NewForm extends React.Component{
    state = {
        current: 0,   //步骤条状态
        loading: false  //保存按钮加载状态
    }
    componentWillUnmount(){
        util.setSessionStorate('editlng', null);
        util.setSessionStorate('editlat', null);
    }
    handleSubmit(e){
        //提交修改表单数据
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if(!err){
                const areaId = values.areaUid[values.areaUid.length - 1];
                values.areaUid = areaId;
                const lng = util.getSessionStorate('editlng');
                const lat = util.getSessionStorate('editlat');
                Object.assign(values, lng, lat);
                this.props.onEditSubmit(values);
                util.setSessionStorate('editlng', null);
                util.setSessionStorate('editlat', null);
            } else{
                message.error('请正确修改！')
            }
        })
    }
    next(){
        const labelData = this.props.labelData;
        const mapLableData = labelData.filter((item) => item.type === 'map');
        let lng = mapLableData[0].key;
        let lat = mapLableData[1].key;
        const { getFieldValue, validateFieldsAndScroll } = this.props.form;
        validateFieldsAndScroll([lng, lat], (err, values) => {
            if(!err){
                const lngValue = getFieldValue(lng);
                const latValue = getFieldValue(lat);
                util.setSessionStorate('editlng', {[lng]: lngValue});
                util.setSessionStorate('editlat', {[lat]: latValue});
                const current = this.state.current + 1;
                this.setState({current });
            }
        })
        
	}
	prev(){
		const current = this.state.current - 1;
        this.setState({current});
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
        util.setSessionStorate('editlng', {[lng]: point.lng});
        util.setSessionStorate('editlat', {[lat]: point.lat});
    }
    //获取所属区域本身和父级区域id，作为Cascader的初始值
    getAreas(){
        //因为区域id只有一个，所以要从区域树查找它的父级区域
        debugger;
        const aid = this.props.areaid;
        const areatree = util.getSessionStorate('areatree');
        const findArea = (areaid, tree) => {
            let arr = [];
            //先判断当前节点的id是否等于要查找的id
            if(tree.id === areaid){
                arr = arr.concat(tree.id);
                return arr;
            } else if(tree.children){
                //有子节点就继续找
                for(let i = 0; i < tree.children.length; i++){
                    let res = findArea(areaid, tree.children[i]);
                    if(res){
                        arr = arr.concat(tree.id);
                        arr = arr.concat(res);
                        return arr;
                    }
                }
            } else{
                //没有子节点
                return false;
            }
        }
        let res = [];
        for(var i = 0; i < areatree.length; i++){
            res = findArea(aid, areatree[i]);
            if(res){
                return res;
            }
        }
        return res;
    }
    //post方法封装
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
        const labelData = this.props.labelData;
        const data = this.props.meterData;
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
        const { current } = this.state;
        const checkCode = (rule, value, callback) => {
            //验证编码是否可用
            const target = labelData.filter((item) => item.key.indexOf('Code') !== -1)[0];
            const metertype = target.key;
            const originalValue = data[metertype];
            if(originalValue !== value){
                let validateURL = null;
                if(metertype.indexOf('FM') !== -1){
                    validateURL = 'http://localhost:2051/FlowMeter/ValidateFlowMeterCode';
                    // validateURL = 'http://rap2api.taobao.org/app/mock/5151/POST/FlowMeter/ValidateFlowMeterCode';
                } else if(metertype.indexOf('PM') !== -1){
                    validateURL = 'http://localhost:2051/PressureMeter/ValidatePressureMeterCode'
                } else if(metertype.indexOf('QM') !== -1){
                    validateURL = 'http://localhost:2051/QualityMeter/ValidateQualityMeterCode';
                }
                if(validateURL !== null){
                    this.fetch_Post({
                        url: validateURL,
                        data: `${metertype}=${value}`,
                        success: (res) => {
                            if(res){
                                callback();
                            } else{
                                callback('该编码已经存在');
                            }
                        }
                    })
                }
            } else{
                callback();
            }
        }
        const areaData = this.getAreas();
        console.log(areaData);
        let FormList = labelData.map(function(item){
            let content = null;
            const prop = item.key;
            const value = data[prop];
            if(item.type === 'text'){
                if(item.key.indexOf('DeviceAlarmNumber') !== -1){
                    content = getFieldDecorator(item.key, {
                        rules: [{
                            required: true, message: `${item.name}为必填项！`
                        },{
                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/, message: '请输入有效的手机号码！'
                        }],
                        initialValue: value
                    })(
                        <Input />
                    );
                } else if(item.key.indexOf('Description') !== -1 || item.key.indexOf('AlarmTimeOut') !== -1){
                    content = getFieldDecorator(item.key, {
                        rules: [{
                            required: false
                        }],
                        initialValue: value
                    })(
                        <Input />
                    );
                } else if(item.key.indexOf('Code') !== -1){
                    content = getFieldDecorator(item.key, {
                        rules: [{
                            required: true, message: `${item.name}为必填项！`
                        },{
                            validator: checkCode
                        }],
                        initialValue: value
                    })(
                        <Input />
                    );
                } else{
                    content = getFieldDecorator(item.key, {
                        rules: [{
                            required: true, message: `${item.name}为必填项！`
                        }],
                        initialValue: value
                    })(
                        <Input />
                    );
                }
            } else if(item.type === 'radio'){
                content = getFieldDecorator(item.key, {
                    rules: [{
                        required: true, message: `${item.name}为必选项！`
                    }],
                    initialValue: value
                })(
                    <RadioGroup key={item.option.name}>
                    {item.option.map((op) => (<Radio key={op.name} value={op.value}>{op.name}</Radio>))}
                    </RadioGroup>
                );   
            } else if(item.type === 'cascader'){
                //将区域树的键名进行修改，id改为value,text改为label
                const areaTree = util.getSessionStorate('areatree');
                let str = JSON.stringify(areaTree);
                str = str.replace(/id/g, 'value');
                str = str.replace(/text/g, 'label');
                const areas = JSON.parse(str);
                content = getFieldDecorator(item.key, {
                    rules: [{ type: 'array', required: true, message: `${item.name}为必填项！`}],
                    initialValue: areaData
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
        //步骤一：选择地点（经度和纬度）
        let lngValue;
        let latValue;
        const mapLabelData = labelData.filter((item) => item.type === 'map');
        const renderMap = (mapLabel) => {
            const key = mapLabel.key;
            if(key.indexOf('Lng') !== -1){
                lngValue = data[key];
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
                latValue = data[key];
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
                    <WaterMap mapname="editmap" defaultLng={lngValue} defaultLat={latValue} handleChange={this.handleMap.bind(this)} />
                </div>
            )
        };
        const steps = [{
            title: '修改地点',
            render: () => {
                return (
                    <div>
                        {MapList(mapLabelData)}
                    </div>
                )
            }
        },{
            title: '编辑信息',
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
                        <Button style={{ marginLeft: 8}} loading={this.state.loading} type="primary" htmlType="submit">保存</Button>
                    }
					
				</div>
            </Form>
        )
    }
}

const EditForm = Form.create()(NewForm);
export default EditForm;
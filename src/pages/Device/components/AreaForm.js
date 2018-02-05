import React from 'react'
import WaterMap from './WaterMap';
import { Form, Input, Button, Col, Row, TreeSelect, Radio } from 'antd';
import util from '../../../util/util';

const FormItem = Form.Item;
const TreeNode = TreeSelect.TreeNode;
const RadioGroup = Radio.Group;

const renderTreeNodes = (data) => {
    return data.map((item) => {
        //dataRef的数据如何使用：因为dataRef是props，给这个treeNode绑定点击事件,onselect事件即可，然后读取自身的这个dataRef即可？之后绑定的时候试一试
        if (item.children) {
            return (
                <TreeNode title={item.text} key={item.id} value={item.id} dataRef={item.id}>
                    {renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode {...item} dataRef={item} />;
    });
};

class RegistrationForm extends React.Component {
    // state = {
    //     lng: this.props.data.Ara_Lng,
    //     lat: this.props.data.Ara_Lat,
    // };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.handleSubmit(values);
            }
        });

    }

    // map
    handleMap(point) {
        this.props.form.setFieldsValue({
            'Ara_Lng': point.lng,
            'Ara_Lat': point.lat
        })
    }
    render() {
        const data = this.props.data;
        const { getFieldDecorator } = this.props.form;

        const treeData = util.getLocalStorate('areatree');
        const TreeNodes = renderTreeNodes(treeData);
        const parentUid = util.getAreas(data.Ara_UId)[0];
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label="选择父节点区域">
                    {getFieldDecorator('Ara_Up', {
                        initialValue: parentUid,
                        rules: [{
                            required: true, message: '请选择区域!'
                        }, {
                            validator: (rule, value, callback) => {
                                let name = util.getLocalStorate('area_Modi_Name');
                                let parentAreaUid = value || parentUid;
                                util.fetch_Post({
                                    url: 'http://localhost:2051/area/CheckAddAreaName',
                                    data: `name=${name}&parentUid=${parentAreaUid}`,
                                    success: (res) => {
                                        if (res) {
                                            callback();
                                        } else {
                                            callback('该区域名称已存在！');
                                        }
                                    }
                                });
                            }
                        }],
                    })(
                        <TreeSelect
                            showSearch
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                            placeholder="请选择区域"
                            allowClear
                            treeDefaultExpandAll
                            onChange={(val, label) => {
                                util.setLocalStorate('areaUid_Modi_Parent', val);
                            }
                            }
                        >
                            {TreeNodes}
                        </TreeSelect>
                        )}
                </FormItem>
                <FormItem label="区域名称">
                    {getFieldDecorator('Ara_Name', {
                        initialValue: data.Ara_Name,
                        rules: [{
                            required: true, message: 'Please input your password!',
                        }, {
                            validator: (rule, value, callback) => {
                                let areaUid = util.getLocalStorate('areaUid');
                                let parentAreaUid = util.getLocalStorate('areaUid_Modi_Parent');
                                if(!parentAreaUid) {
                                    parentAreaUid = parentUid;
                                }
                                util.fetch_Post({
                                    url: 'http://localhost:2051/area/CheckModifyAreaName',
                                    data: `name=${value}&parentUid=${parentAreaUid}&areaUid=${areaUid}`,
                                    success: (res) => {
                                        if (res) {
                                            callback();
                                        } else {
                                            callback('该区域名称已存在！');
                                        }
                                    }
                                });
                            }
                        }],
                    })(
                        <Input onChange={(e)=>{
                            util.setLocalStorate('area_Modi_Name', e.target.value);
                        }}/>
                        )}
                </FormItem>
                <FormItem label="区域描述">
                    {getFieldDecorator('Ara_Description', {
                        initialValue: data.Ara_Description,
                        rules: [{
                            required: true, message: '请输入区域描述!',
                        }],
                    })(
                        <Input />
                        )}
                </FormItem>
                <FormItem label="是否可用">
                    {getFieldDecorator('Ara_Enable', {
                        initialValue: '1',
                        rules: [{
                            required: true, message: '请选择一个类型!',
                        }],
                    })(
                        <RadioGroup>
                            <Radio value="0">不可用</Radio>
                            <Radio value="1">可用</Radio>
                        </RadioGroup>
                        )}
                </FormItem>
                <Row>
                    <Col className="deviceTree" xs={12} style={{ 'marginBottom': '15px' }} >
                        <FormItem label="经度">
                            {getFieldDecorator('Ara_Lng', {
                                initialValue: data.Ara_Lng,
                                rules: [{
                                    required: true, message: 'Please input your E-mail!',
                                }],
                            })(
                                <Input type="number" />
                                )}
                        </FormItem>
                    </Col>
                    <Col className="deviceTree" xs={12} style={{ 'marginBottom': '15px' }} >
                        <FormItem label="纬度">
                            {getFieldDecorator('Ara_Lat', {
                                initialValue: data.Ara_Lat,
                                rules: [{
                                    required: true, message: 'Please input your E-mail!',
                                }],
                            })(
                                <Input type="number" />
                                )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col className="deviceTree" xs={24} style={{ 'marginBottom': '15px' }} >
                        <WaterMap mapname="editmap" defaultLng={this.props.defaultLng} defaultLat={this.props.defaultLat} handleChange={this.handleMap.bind(this)} />
                    </Col>
                </Row>
                <FormItem>
                    <Button type="primary" htmlType="submit">提交</Button>
                </FormItem>
            </Form>
        );
    }
}

const AreaForm = Form.create()(RegistrationForm);

export default AreaForm;
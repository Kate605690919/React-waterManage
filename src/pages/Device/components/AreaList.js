import React from 'react'
import { Table, Popconfirm, Input, message, TreeSelect, Button, Modal, Form, Icon, Radio, Col, Row } from 'antd';
import util from '../../../util/util';
import WaterMap from './WaterMap';
import AreaForm from './AreaForm';

const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// const Option = Select.Option;
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
const CollectionCreateForm = Form.create()(
    (props) => {
        const treeData = util.getLocalStorate('areatree');
        const TreeNodes = renderTreeNodes(treeData);
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        const parentUid = util.getAreas(util.getLocalStorate('areaUid'))[0];
        const handleMap = (point) => {
            props.form.setFieldsValue({
                'Ara_Lng': point.lng,
                'Ara_Lat': point.lat
            })
        }
        return (
            <Modal
                visible={visible}
                title="添加区域"
                okText="添加"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <FormItem label="选择父节点区域">
                        {getFieldDecorator('Ara_Up', {
                            initialValue: parentUid,
                            rules: [{
                                required: true, message: '父节点区域!'
                            }],
                        })(
                            <TreeSelect
                                showSearch
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                placeholder="Please select"
                                allowClear
                                treeDefaultExpandAll
                            >
                                {TreeNodes}
                            </TreeSelect>
                            )}
                    </FormItem>
                    <FormItem label="区域名称">
                        {getFieldDecorator('Ara_Name', {
                            rules: [{
                                required: true, message: 'Please input your password!',
                            }],
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem label="区域描述">
                        {getFieldDecorator('Ara_Description', {
                            rules: [{
                                required: true, message: 'Please input your password!',
                            }],
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem label="是否可用">
                        {getFieldDecorator('Ara_Enable', {
                            initialValue: '1',
                            rules: [{
                                required: true, message: 'Please input your password!',
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
                            <WaterMap mapname="editmap" defaultLng={props.defaultLng} defaultLat={props.defaultLat} handleChange={handleMap} />
                        </Col>
                    </Row>
                </Form>
            </Modal>
        );
    }
);
class AreaList extends React.Component {
    constructor(props) {
        super(props);

        this.permissionFM = util.getSessionStorate('permission').AreaManage;
        // this.permissionFM = false;

        this.columns = [{
            title: '编码',
            dataIndex: 'Ara_Code',
            width: '15%'
        }, {
            title: '区域名称',
            dataIndex: 'Ara_Name',
            width: '15%'
        }, {
            title: '描述',
            dataIndex: 'Ara_Description',
            width: '20%'
        }, {
            title: '经度',
            dataIndex: 'Ara_Lng',
            width: '20%'
        }, {
            title: '纬度',
            dataIndex: 'Ara_Lat',
            width: '15%'
        },];
        if (this.permissionFM) {
            this.columns.push({
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    const { editable } = record;
                    return (
                        <div className="editable-row-operations">
                            {
                                editable ?
                                    <span>
                                        <a onClick={() => this.save(record.Ara_UId)}>保存</a>
                                        <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.Ara_UId)}>
                                            <a>取消</a>
                                        </Popconfirm>
                                    </span>
                                    :
                                    <span>
                                        {/* <a onClick={() => this.edit(record.pressuremeter.PM_UId)}>编辑</a> */}
                                        {/* 这里将表格中的单元格编辑改为可以修改设备所有信息 */}
                                        {/* <a onClick={() => this.edit(record.Ara_UId)}>修改</a> */}
                                        <a onClick={() => this.bindFlowMeter(record.Ara_UId)}>修改区域</a>
                                        <Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.Ara_Id)}>
                                            <a>删除</a>
                                        </Popconfirm>
                                    </span>
                            }
                        </div>
                    );
                },
            });
        }
        this.cacheData = this.props.cacheData;
    }

    state = {
        data: [this.props.tableData],
        pagination: {},
        loading: false,
        count: this.props.tableData.length,
        visible: false,
        detailLoading: false,
        visibleFM: false,
        confirmLoadingFM: false,
        transferData: [],
        targetKeys: [],
    }
    componentWillReceiveProps(nextProps) {
        let { tableData, loading, pagination, cacheData } = nextProps;
        this.cacheData = cacheData;
        this.setState({
            data: [tableData],
            loading,
            pagination,
            count: [tableData].length
        });
    }

    // 删除客户
    delete(Id) {
        message.loading('删除中...', 0);
        const that = this;
        util.fetch_Post({
            url: 'http://localhost:2051/area/DeleteArea',
            data: `id=${Id}`,
            success: (res) => {
                message.destroy();
                if (res) {
                    const areaUid = util.getLocalStorate('areaUid');// 当前areaTree所选中区域Uid
                    message.success('删除成功！');
                    that.props.renderTable(areaUid);// 从父组件处获取数据
                }
                else {
                    message.error('删除失败，请重试！');
                }
            }
        })
    }
    // 绑定流量计
    bindFlowMeter(key) {
        util.setLocalStorate('currentKey', key);
        // const newData = [...this.state.data];
        // let target = newData.filter(item => key === item.Uid)[0];
        this.setState({ visibleFM: true });

    }

    // 添加客户模态框
    showModal = () => {
        this.setState({
            visible: true,
        });
    }
    handleCancel = () => {
        this.setState({ visible: false });
    }
    handleCreate = () => {
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            message.loading('添加中...,请稍后', 0);
            let formData = util.objToStr(values);
            util.fetch_Post({
                url: 'http://localhost:2051/area/AddArea',
                data: `${formData}&parentAreaUid=${values.Ara_Up}`,
                success: (res) => {
                    message.destroy();
                    if (res) message.success('添加成功！请跳转到添加区域查看');
                    else message.error('添加失败，请重试！');
                }
            })
            form.resetFields();
            this.setState({ visible: false });
        });
    }
    saveFormRef = (form) => {
        this.form = form;
    }
    // 绑定流量计Modal
    handleCancelFM = () => {
        this.setState({
            visibleFM: false,
            transferData: [],
            targetKeys: [],
        });
    }
    handleOk = (values) => {
        const newData = {};
        Object.assign(newData, this.state.data[0], values)
        const dataFM = util.objToStr(newData);
        debugger;
        util.fetch_Post({
            url: 'http://localhost:2051/area/ModifyArea',
            data: dataFM,
            success: (res) => {
                if (res) {
                    message.success('修改成功！');
                    this.setState({ data: dataFM, visibleFM: false });
                }
                else {
                    message.error('修改失败，请重试！');
                }
            }
        })
    }
    render() {
        return (
            <div className="ClientList">
                {this.permissionFM ? (
                    <Button type="primary" onClick={this.showModal}>添加区域</Button>
                ) : null}
                {this.permissionFM ? (
                    <div>
                        <CollectionCreateForm
                            defaultLng={this.state.data[0] ? this.state.data[0].Ara_Lng : null}
                            defaultLat={this.state.data[0] ? this.state.data[0].Ara_Lat : null}
                            ref={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            onCreate={this.handleCreate}
                        />
                        <Modal title="修改区域"
                            visible={this.state.visibleFM}
                            onOk={this.handleOk}
                            confirmLoading={this.state.confirmLoadingFM}
                            onCancel={this.handleCancelFM}
                            footer={null}
                        >
                            <AreaForm mapname="editmap"
                                defaultLng={this.state.data[0] ? this.state.data[0].Ara_Lng : null}
                                defaultLat={this.state.data[0] ? this.state.data[0].Ara_Lat : null}
                                data={this.state.data[0]}
                                handleSubmit={this.handleOk.bind(this)} />
                            {/* <WaterMap mapname="editmap" defaultLng={this.state.data[0] ? this.state.data[0].Ara_Lng : null} defaultLat={this.state.data[0] ? this.state.data[0].Ara_Lat : null} handleChange={this.handleMap.bind(this)} /> */}
                        </Modal>
                    </div>
                ) : null}
                <Table rowKey={data => data.Ara_UId}
                    dataSource={this.state.data}
                    columns={this.columns}
                    loading={this.state.loading}
                />
            </div>
        )
    }
}

export default AreaList;
import React from 'react'
import { Table, Popconfirm, Input, message, TreeSelect, Button, Modal, Form, Card, Col } from 'antd';
import util from '../../util/util';
const TreeNode = TreeSelect.TreeNode;
const FormItem = Form.Item;

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
const EditableCell = ({ editable, value, onChange, column }) => {
    if (editable) {
        if (column === 'area.Ara_Name') {
            let treeData = util.getLocalStorate('areatree');
            let TreeNodes = renderTreeNodes(treeData);
            return (
                <TreeSelect
                    showSearch
                    style={{ width: 150 }}
                    value={value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="Please select"
                    allowClear
                    treeDefaultExpandAll
                    onChange={(val, label) => {
                        util.setLocalStorate('areaUid_New', val);
                        return onChange(label);
                    }
                    }
                >
                    {TreeNodes}
                </TreeSelect>
            )
        } else {
            return <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />

        }
    } else {
        return (<div>{value}</div>);
    }
};
const CollectionCreateForm = Form.create()(
    (props) => {
        const treeData = util.getLocalStorate('areatree');
        const TreeNodes = renderTreeNodes(treeData);
        const { visible, onCancel, onCreate, form } = props;
        const { getFieldDecorator } = form;
        return (
            <Modal
                visible={visible}
                title="添加职员"
                okText="添加"
                onCancel={onCancel}
                onOk={onCreate}
            >
                <Form layout="vertical">
                    <FormItem label="职员名">
                        {getFieldDecorator('Member_Name', {
                            rules: [{ required: true, message: '请输入职员名!' }],
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem label="所属区域">
                        {getFieldDecorator('Member_AreaUid', {
                            rules: [{ required: true, message: '请选择区域!' }],
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
                    <FormItem label="真实姓名">
                        {getFieldDecorator('Member_RealName')(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="电话号码">
                        {getFieldDecorator('Member_Phone')(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="备注">
                        {getFieldDecorator('Member_Memo')(
                            <Input />
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
);
class Role extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
            title: '职员名',
            dataIndex: 'Name',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'Name'),
        }, {
            title: '所属区域',
            dataIndex: 'area.Ara_Name',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'area.Ara_Name'),
        }, {
            title: '职位',
            dataIndex: 'roles',
            width: '15%',
            render: (text, record) => this.renderColumns(text, record, 'roles'),
        }, {
            title: '电话号码',
            dataIndex: 'Phone',
            width: '20%',
            render: (text, record) => this.renderColumns(text, record, 'Phone'),
        }, {
            title: '备注',
            dataIndex: 'Memo',
            width: '20%',
            render: (text, record) => this.renderColumns(text, record, 'Memo'),
        }, {
            title: '操作',
            dataIndex: 'operation',
            render: (text, record) => {
                const { editable } = record;
                return (
                    <div className="editable-row-operations">
                        {
                            editable ?
                                <span>
                                    <a onClick={() => this.save(record.Uid)}>保存</a>
                                    <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.Uid)}>
                                        <a>取消</a>
                                    </Popconfirm>
                                </span>
                                :
                                <span>
                                    <a onClick={() => this.edit(record.Uid)}>编辑</a>
                                    <a onClick={() => this.delete(record.Id)}>删除</a>
                                    <a onClick={() => this.resetPassword(record.Uid)}>重置密码</a>
                                </span>
                        }
                    </div>
                );
            },
        }];

        this.cacheData = this.props.cacheData;
        this.save = this.save.bind(this);
        // this.expandDetail = this.expandDetail.bind(this);
        util.fetch({
            url: 'http://localhost:2051/roles/GetAllRoles',
            success: (res) => {
                this.setState({
                    data: res,
                    loading: false
                })
            }
        })
    }

    state = {
        data: [],
        pagination: {},
        loading: true,
        visible: false,
        detailLoading: false,
        visibleFM: false,
        confirmLoadingFM: false,
        transferData: [],
        targetKeys: [],
    }

    // 表格的删和改
    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.Uid)[0];

        if (target) {
            eval(`target.${column}= value`);
            this.setState({ data: newData });
        }
    }
    renderColumns(text, record, column) {
        return (
            <EditableCell
                editable={record.editable}
                value={text}
                onChange={value => this.handleChange(value, record.Uid, column)}
                column={column}
            />
        );
    }

    edit(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.Uid)[0];
        if (target) {
            target.editable = true;
            util.setLocalStorate('areaUid_New', target.area.Ara_UId);
            this.setState({ data: newData });
        }
    }
    save(key) {
        message.loading('保存中...', 0);
        const that = this;
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.Uid)[0];
        // 当前areaTree所选中区域Uid
        const areaUid = util.getLocalStorate('areaUid');
        // 流量计所属区域Uid
        const areaUid_New = util.getLocalStorate('areaUid_New') || areaUid;
        if (target) {
            delete target.editable;
            util.fetch_Post({
                url: 'http://localhost:2051/staff/ModifyClient',
                data: `Member_Name=${target.Name ? target.Name : ''}&Member_RealName=${target.RealName ? target.RealName : ''}
				&Member_Phone=${target.Phone ? target.Phone : ''}&Member_Memo=${target.Memo ? target.Memo : ''}
				&Member_AreaUid=${areaUid_New}&Member_UserUid=${target.Uid ? target.Uid : ''}`,
                success: (res) => {
                    message.destroy();
                    if (res) {
                        message.success('修改成功！');
                        that.props.renderTable(areaUid);// 从父组件处获取数据
                    }
                    else {
                        message.error('修改失败，请重试！');
                        that.setState({ data: newData });
                        that.cacheData = JSON.parse(JSON.stringify(newData));
                    }
                }
            })
        }
    }
    cancel(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.Uid)[0];
        if (target) {
            util.setLocalStorate('areaUid', target.area.Ara_UId);
            util.setLocalStorate('areaUid_New', target.area.Ara_UId);
            Object.assign(target, this.cacheData.filter(item => key === item.Uid)[0]);
            delete target.editable;
            this.setState({ data: newData });
        }
    }
    // 删除客户
    delete(Id) {
        const that = this;
        message.loading('删除中...', 0);
        util.fetch_Post({
            url: `http://localhost:2051/staff/DeleteClient`,
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
    // 重置密码
    resetPassword(Uid) {
        message.loading('重置密码中...', 0);
        util.fetch_Post({
            url: `http://localhost:2051/staff/ResetClientPassword`,
            data: `uid=${Uid}`,
            success: (res) => {
                message.destroy();
                if (res) {
                    message.success('重置密码成功！');
                }
                else {
                    message.error('重置密码失败，请重试！');
                }
            }
        })
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
        const that = this;
        // 当前areaTree所选中区域Uid
        const areaUid = util.getLocalStorate('areaUid');
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            if (!values.Member_AreaUid) {
                return message.error('请选择所属区域！');
            }
            message.loading('添加中...,请稍后', 0);
            let formData = util.objToStr(values);
            util.fetch_Post({
                url: 'http://localhost:2051/staff/AddClient',
                data: formData,
                success: (res) => {
                    message.destroy();
                    if (res) {
                        message.success('添加成功！请跳转到添加区域查看');
                        that.props.renderTable(areaUid);// 从父组件处获取数据
                    }
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
    render() {
        return (
            <Col className="Role" xs={24} style={{'padding': '20px'}}>
                <Card>
                    <Button type="primary" onClick={this.showModal}>添加职员</Button>
                    <CollectionCreateForm
                        ref={this.saveFormRef}
                        visible={this.state.visible}
                        onCancel={this.handleCancel}
                        onCreate={this.handleCreate}
                    />
                    <Table rowKey={data => data.Uid}
                        dataSource={this.state.data}
                        columns={this.columns}
                        loading={this.state.loading}
                    />
                </Card>
            </Col>
        )
    }
}
export default Role;
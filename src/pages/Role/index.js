import React from 'react'
import { Table, Popconfirm, Input, message, TreeSelect, Button, Modal, Form, Card, Col } from 'antd';
import util from '../../util/util';
import './Role.less';
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
        return <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
    } else {
        return (<div>{value}</div>);
    }
};
const CollectionCreateForm = Form.create()(
    (props) => {
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
                        {getFieldDecorator('Ir_Name', {
                            rules: [{ required: true, message: '请输入职位名!' }],
                        })(
                            <Input />
                            )}
                    </FormItem>
                    <FormItem label="描述">
                        {getFieldDecorator('Ir_Description', {
                            rules: [{ required: true, message: '请输入描述名!' }],
                        })(
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
        this.permissionFM = util.getSessionStorate('permission').RoleManage;
        // this.permissionFM = false;

        this.columns = [{
            title: '职位名',
            dataIndex: 'Ir_Name',
            width: '30%',
            render: (text, record) => this.renderColumns(text, record, 'Ir_Name'),
        }, {
            title: '描述',
            dataIndex: 'Ir_Description',
            width: '40%',
            render: (text, record) => this.renderColumns(text, record, 'Ir_Description'),
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
                                        <a onClick={() => this.save(record.Ir_UId)}>保存</a>
                                        <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.Ir_UId)}>
                                            <a>取消</a>
                                        </Popconfirm>
                                    </span>
                                    :
                                    <span>
                                        <a onClick={() => this.edit(record.Ir_UId)}>编辑</a>
                                        <a onClick={() => this.delete(record.Ir_Id)}>删除</a>
                                    </span>
                            }
                        </div>
                    );
                },
            })
        }
        this.cacheData = this.props.cacheData;
        this.save = this.save.bind(this);

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
    componentDidMount() {
        this.renderTable();
    }
    renderTable() {
        const that = this;
        util.fetch({
            url: 'http://localhost:2051/roles/GetAllRoles',
            success: (res) => {
                that.setState({
                    data: res,
                    loading: false
                })
            }
        })
    }
    // 表格的删和改
    handleChange(value, key, column) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.Ir_UId)[0];

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
                onChange={value => this.handleChange(value, record.Ir_UId, column)}
                column={column}
            />
        );
    }
    edit(key) {
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.Ir_UId)[0];
        if (target) {
            target.editable = true;
            this.setState({ data: newData });
        }
    }
    save(key) {
        message.loading('保存中...', 0);
        const that = this;
        const newData = [...this.state.data];
        const target = newData.filter(item => key === item.Ir_UId)[0];
        if (target) {
            delete target.editable;
            const formData = util.objToStr(target);
            util.fetch_Post({
                url: 'http://localhost:2051/roles/ModifyRole',
                data: formData,
                success: (res) => {
                    message.destroy();
                    if (res) {
                        message.success('修改成功！');
                        that.renderTable();
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
        const target = newData.filter(item => key === item.Ir.UId)[0];
        if (target) {
            Object.assign(target, this.cacheData.filter(item => key === item.Ir_UId)[0]);
            delete target.editable;
            this.setState({ data: newData });
        }
    }
    // 删除客户
    delete(Id) {
        const that = this;
        message.loading('删除中...', 0);
        util.fetch_Post({
            url: `http://localhost:2051/roles/DeleteRole`,
            data: `id=${Id}`,
            success: (res) => {
                message.destroy();
                if (res) {
                    message.success('删除成功！');
                    that.renderTable();
                }
                else {
                    message.error('删除失败，请重试！');
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
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            message.loading('添加中...,请稍后', 0);
            let formData = util.objToStr(values);
            util.fetch_Post({
                url: 'http://localhost:2051/roles/AddRole',
                data: formData,
                success: (res) => {
                    message.destroy();
                    if (res) {
                        message.success('添加成功！');
                        that.renderTable();
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
            <Col className="Role" xs={24} style={{ 'padding': '20px' }}>
                <Card>
                    {this.permissionFM ? (
                        <div>
                            <Button type="primary" onClick={this.showModal}>添加职位</Button>
                            <CollectionCreateForm
                                ref={this.saveFormRef}
                                visible={this.state.visible}
                                onCancel={this.handleCancel}
                                onCreate={this.handleCreate}
                            />
                        </div>
                    ) : null}
                    <Table rowKey={data => data.Ir_UId}
                        dataSource={this.state.data}
                        columns={this.columns}
                        loading={this.state.loading}
                        pagination={{ pageSize: 8 }}
                    />
                </Card>
            </Col>
        )
    }
}
export default Role;
import React from 'react'
import { Table, Input, Popconfirm, message, Button, Modal } from 'antd';
import util from '../../../util/util';
import AddForm from './AddForm';
import EditForm from './EditForm';


const EditableCell = ({ editable, value, onChange }) => (
	<div>
		{editable
			? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
			: value
		}
	</div>
);
const flowmeterLabelData = [
	{
		id: 0,
		key: 'areaUid',
		name: '区域选择',
		type: 'cascader',
		value: ''
	},
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
                value: 2
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
    // {
    //     id: 10,
    //     key: 'FM_Enable',
    //     name: '是否可用',
    //     type: 'radio',
    //     value: '',
    //     option: [
    //         {
    //             name: '是',
    //             value: 1
    //         },
    //         {
    //             name: '否',
    //             value: 0
    //         }
    //     ]
    // },
    {
        id: 11,
        key: 'FM_DeviceAlarmNumber',
        name: '流量计手机号码',
        type: 'text',
        value: ''
	},
	{
		id: 12,
		key: 'FM_Lng',
		name: '经度',
		type: 'map',
		value: ''
	},
	{
		id: 13,
		key: 'FM_Lat',
		name: '纬度',
		type: 'map',
		value: ''
	}
]

class FMList extends React.Component {
    constructor(props) {
		super(props);
        this.FMColumns = [{
			title: '流量计编码',
			dataIndex: 'flowmeter.FM_Code',
			width: '15%',
			render: (text, record) => <a href={`#/flowmeter/detail/uid=${record.flowmeter.FM_UId}`}>{text}</a>,
		}, {
			title: '描述',
			dataIndex: 'flowmeter.FM_Description',
			width: '20%',
			render: (text, record) => this.renderColumns(text, record, 'flowmeter.FM_Description')
		}, {
			title: '区域',
			dataIndex: 'area.Ara_Name',
			width: '20%',
		}, {
			title: '更新',
			dataIndex: 'flowmeter.FM_FlowCountLast',
			width: '15%',
			render: (text, record) => {
				let result = null;
				if(text){
					result = util.dateFormat(text, 7);
				}
				return result;
			}
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
									<a onClick={() => this.save(record.flowmeter.FM_UId)}>保存</a>
									<Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.flowmeter.FM_UId)}>
										<a>取消</a>
									</Popconfirm>
								</span>
								:
								<span>
									{/* <a onClick={() => this.edit(record.flowmeter.FM_UId)}>编辑</a> */}
									{/* 这里将表格中的单元格编辑改为可以修改设备所有信息 */}
									<a onClick={() => this.allEdit(record.flowmeter.FM_UId)}>修改</a>
									<Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.flowmeter.FM_UId)}>
										<a>删除</a>
									</Popconfirm>
								</span>
						}
					</div>
				);
			},
		}];
		this.cacheData = this.props.cacheData;
    }
    
	state = {
        data: this.props.tableData,
		pagination: {},
		loading: false,
		visible: false,       //添加设备模态框是否可见
		finishAdd: false,     //是否完成添加设备
		editModalVisible: false,   //修改设备模态框是否可见
		finishEdit: false,         //是否完成或取消修改
    }
    componentWillReceiveProps(nextProps) {
		let {tableData, loading, pagination, cacheData} = nextProps;
        this.cacheData = cacheData;
        this.setState({
            data: tableData,
            loading,
            pagination,
        });
    }
    renderColumns(text, record, column) {
		return (
			<EditableCell
				editable={record.editable}
				value={text}
				onChange={value => this.handleChange(value, record.flowmeter.FM_UId, column)}
			/>
		);
	}

	//编辑单元格
	handleChange(value, key, column) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if (target) {
			eval(`target.${column}=value`);
			this.setState({ data: newData });
		}
	}
	edit(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if (target) {
			target.editable = true;
			this.setState({ data: newData });
		}
	}

	//可修改设备所有信息
	allEdit(key){
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if(target){
			this.editTarget = target.flowmeter;
			this.AraId = target.area.Ara_UId;
			this.setState({
				editModalVisible: true,
				finishEdit: false
			})
		}
	}
	handleEditModalCancel(){
		this.setState({
			editModalVisible: false,
		});
	}
	//模态框完全关闭后回调函数
	onClose(){
		this.setState({
			finishEdit: true
		});
	}
	handleEdit(newFlowData){
		this.fetch_Post({
			url: 'http://localhost:2051/FlowMeter/ModifyFlowMeter',
			data: util.objToStr(newFlowData),
			success: (res) => {
				if(res){
					message.success('修改成功！');
					this.setState({
						editModalVisible: false,
						finishEdit: true
					})
					//重新加载
					this.props.onAddDevice();
				} else{
					message.error('修改失败，请重试！');
				}
			}
		})
	}

	save(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if (target) {
			delete target.editable;
			this.fetch_Post({
				url: 'http://localhost:2051/FlowMeter/ModifyFlowMeter',
				// data: `FM_Code=${target.flowmeter.FM_Code}&FM_Description=${target.flowmeter.FM_Description}
				// &FM_UId=${target.flowmeter.FM_UId}&FM_Id=${target.flowmeter.FM_Id}`,
				data: util.objToStr(target.flowmeter),
				success: (res) => {
					console.log(res);
					if(res) message.success('修改成功！');
					else message.error('修改失败，请重试！');
				}
			})
			this.setState({ data: newData });
			this.cacheData = JSON.parse(JSON.stringify(newData));
		}
	}
	cancel(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if (target) {
			Object.assign(target, this.cacheData.filter(item => key === item.flowmeter.FM_UId)[0]);
			delete target.editable;
			this.setState({ data: newData });
		}
	}

	delete(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if(target){
			this.fetch_Post({
				url: 'http://localhost:2051/FlowMeter/DeleteFlowMeter',
				// data: `&FM_UId=${target.flowmeter.FM_UId}&FM_Id=${target.flowmeter.FM_Id}`,
				data: util.objToStr(target.flowmeter),
				success: (res) => {
					console.log(res);
					if(res) message.success('删除成功！');
					else message.error('删除失败，请重试！');
				}
			});
			this.setState({ data: newData.filter(item => item.flowmeter.FM_UId !== key) });
		}
	}

	showModal(){
		this.setState({
			visible: true,
			finishAdd: false
		});
	}
	//添加流量计
	handleAdd(newFlowData){
		this.fetch_Post({
			url: 'http://localhost:2051/FlowMeter/AddFlowMeter',
			data: util.objToStr(newFlowData),
			success: (res) => {
				if(res){
					message.success('添加成功！');
					this.setState({
						visible: false,
						finishAdd: true
					})
					//重新加载
					this.props.onAddDevice();
				} else{
					message.error('添加失败，请重试！');
					this.setState({
						visible: false,
					})
				}
			}
		})
	}
	handleModalCancel(){
		this.setState({
			visible: false,
		});
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
    render() {
        return (
			<div>
				<div style={{paddingLeft: '20px', paddingBottom: '10px'}}>
					<Button type="primary" onClick={this.showModal.bind(this)}>添加流量计</Button>
				</div>
				
				<Modal width="60%"
					title="添加流量计"
					visible={this.state.visible}
					confirmLoading = {this.state.finishAdd}
					onCancel = {this.handleModalCancel.bind(this)}
					footer = {null}
				>
				{this.state.finishAdd ?
					null
					:
					<AddForm labelData={flowmeterLabelData} onAddSubmit={this.handleAdd.bind(this)} defaultLngLat={this.props.defaultLngLat}/>
				}
				</Modal>

				{
					this.state.finishEdit ?
					null
					:
					<Modal width="60%"
					title="修改流量计"
					visible={this.state.editModalVisible}
					confirmLoading = {this.state.finishEdit}
					onCancel = {this.handleEditModalCancel.bind(this)}
					footer = {null}
					afterClose={()=> this.onClose()}
					maskClosable={false}
					>
					<EditForm labelData={flowmeterLabelData} onEditSubmit={this.handleEdit.bind(this)} meterData={this.editTarget} areaid={this.AraId}/>
					</Modal>
				}
				<Table rowKey={data => data.flowmeter.FM_UId}
                dataSource={this.state.data}
                columns={this.FMColumns}
                loading={this.state.loading}
            	/>
			</div>
        )
    }
}
export default FMList;
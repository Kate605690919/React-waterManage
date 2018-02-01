import React from 'react'
import { Table,Input, Popconfirm, message, Button, Modal } from 'antd';
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
const pressuremeterLabelData = [
	{
		id: 0,
		key: 'areaUid',
		name: '区域选择',
		type: 'cascader',
		value: ''
	},
    {
        id: 1,
        key: "PM_Code",
        name: '压力计编码',
        type: 'text',
        value: ''
    },
    // {
    //     id: 2,
    //     key: "PM_AlarmNumber",
    //     name: '报警号码',
    //     type: 'text',
    //     value: ''
    // },
    // {
    //     id: 3,
    //     key: 'PM_AlarmThreshold',
    //     name: '报警阈值',
    //     type: 'text',
    //     value: ''
    // },
    // {
    //     id: 4,
    //     key: 'PM_AlarmTimeOut',
    //     name: '超时阈值',
    //     type: 'text',
    //     value: ''
    // },
    // {
    //     id: 5,
    //     key: 'PM_AlarmMode',
    //     name: '报警模式',
    //     type: 'radio',
    //     value: '',
    //     option: [
    //         {
    //             name: '自动',
    //             value: 1
    //         },
    //         {
    //             name: '默认',
    //             value: 0
    //         }
    //     ]
    // },
    // {
    //     id: 6,
    //     key: 'PM_Class',
    //     name: '用户类型',
    //     type: 'radio',
    //     value: '',
    //     option: [
    //         {
    //             name: '手抄压力计',
    //             value: 2
    //         },
    //         {
    //             name: '普通',
    //             value: 0
    //         }
    //     ]
    // },
    {
        id: 7,
        key: 'PM_Description',
        name: '压力计描述',
        type: 'text',
        value: ''
    },
    // {
    //     id: 8,
    //     key: 'PM_BatteryAlarmThreshold',
    //     name: '设备电池报警阈值',
    //     type: 'text',
    //     value: ''
    // },
    // {
    //     id: 9,
    //     key: 'PM_ModemAlarmThreshold',
    //     name: '通信电池报警阈值',
    //     type: 'text',
    //     value: ''
    // },
    // {
    //     id: 10,
    //     key: 'PM_Enable',
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
    // {
    //     id: 11,
    //     key: 'PM_DeviceAlarmNumber',
    //     name: '压力计手机号码',
    //     type: 'text',
    //     value: ''
	// },
	{
		id: 12,
		key: 'PM_Lng',
		name: '经度',
		type: 'map',
		value: ''
	},
	{
		id: 13,
		key: 'PM_Lat',
		name: '纬度',
		type: 'map',
		value: ''
	}
]
class PMList extends React.Component {
    constructor(props) {
		super(props);
        this.PMColumns = [{
			title: '压力计编码',
			dataIndex: 'pressuremeter.PM_Code',
			width: '15%',
			render: (text, record) => <a href={`#/pressuremeter/detail/pmUid=${record.pressuremeter.PM_UId}`}>{text}</a>,
		}, {
			title: '描述',
			dataIndex: 'pressuremeter.PM_Description',
			width: '20%',
			render: (text, record) => this.renderColumns(text, record, 'pressuremeter.PM_Description')			
		}, {
			title: '区域',
			dataIndex: 'area.Ara_Name',
			width: '20%'
		}, {
			title: '更新',
			dataIndex: 'status.PMS_UpdateDt',
            width: '15%',
			render: (text, record) => util.dateFormat(text, 7)
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
									<a onClick={() => this.save(record.pressuremeter.PM_UId)}>保存</a>
									<Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.pressuremeter.PM_UId)}>
										<a>取消</a>
									</Popconfirm>
								</span>
								:
								<span>
									{/* <a onClick={() => this.edit(record.flowmeter.FM_UId)}>编辑</a> */}
									{/* 这里将表格中的行编辑改为可以修改设备所有信息 */}
									<a onClick={() => this.allEdit(record.pressuremeter.PM_UId)}>修改</a>
									<Popconfirm title="Sure to delete?" onConfirm={() => this.delete(record.pressuremeter.PM_UId)}>
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
		visible: false,
		finishAdd: false,
		editModalVisible: false,
		finishEdit: false,
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
				onChange={value => this.handleChange(value, record.pressuremeter.PM_UId, column)}
			/>
		);
	}
	handleChange(value, key, column) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.pressuremeter.PM_UId)[0];
		if (target) {
			eval(`target.${column}=value`);
			this.setState({ data: newData });
		}
	}
	edit(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.pressuremeter.PM_UId)[0];
		if (target) {
			target.editable = true;
			this.setState({ data: newData });
		}
	}
	//可修改设备所有信息
	allEdit(key){
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.pressuremeter.PM_UId)[0];
		if(target){
			this.editTarget = target.pressuremeter;
			this.AraId = target.area.Ara_UId;
			this.setState({
				editModalVisible: true,
				finishEdit: false,
			})
		}
	}
	handleEditModalCancel(){
		this.setState({
			editModalVisible: false,
			finishEdit: true
		});
		// const hide = () => {
		// 	console.log(this);
		// 	this.setState({
		// 		finishEdit: true
		// 	});
		// }
		// setTimeout(hide, 200);	
	}
	onClose(){
		this.setState({
			finishEdit: true
		})
	}
	handleEdit(newMeter){
		// this.setState({
		// 	finishEdit: true
		// })
		this.fetch_Post({
			url: 'http://localhost:2051/PressureMeter/ModifyPressureMeter',
			data: util.objToStr(newMeter),
			success: (res) => {
				if(res){
					message.success('修改成功！');
					this.setState({
						editModalVisible: false,
						finishEdit: true
					})
					//重新加载
					this.props.onAddDevice();
					// this.setState({
					// 	visible: false,
					// 	finishAdd: false
					// })
				} else{
					message.error('修改失败，请重试！');
					this.setState({
						editModalVisible: false,
					})
				}
			}
		})
	}
	save(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.pressuremeter.PM_UId)[0];
		if (target) {
			delete target.editable;
			console.log(target);
			this.fetch_Post({
				url: 'http://localhost:2051/PressureMeter/ModifyPressureMeter',
				data: `PM_Code=${target.pressuremeter.PM_Code}&PM_Description=${target.pressuremeter.PM_Description}
				&PM_Id=${target.pressuremeter.PM_Id}`,
				success: (res) => {
					console.log(res);
					if(res) message.success('修改成功！');
					else message.error('修改失败，请重试！');
				}
			})
			this.setState({ data: newData });
			// this.cacheData = newData.map(item => ({ ...item }));
			this.cacheData = JSON.parse(JSON.stringify(newData));			
		}
	}
	cancel(key) {
        const newData = [...this.state.data];
		const target = newData.filter(item => key === item.pressuremeter.PM_UId)[0];
		if (target) {
			Object.assign(target, this.cacheData.filter(item => key === item.pressuremeter.PM_UId)[0]);
			delete target.editable;
			this.setState({ data: newData });
		}
	}
	delete(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.pressuremeter.PM_UId)[0];
		if(target){
			this.fetch_Post({
				url: 'http://localhost:2051/PressureMeter/DeletePressureMeter',
				data: `&PM_UId=${target.pressuremeter.PM_UId}`,
				success: (res) => {
					if(res) message.success('删除成功！');
					else message.error('删除失败，请重试！');
				}
			})
			this.setState({ data: newData.filter(item => item.pressuremeter.PM_UId !== key) });			
		}
	}
	showModal(){
		this.setState({
			visible: true,
			confirmAddLoading: false
		});
	}
	//添加压力计
	handleAdd(newPressureData){
		this.setState({
			confirmAddLoading: true
		})
		this.fetch_Post({
			url: 'http://localhost:2051/PressureMeter/AddPressureMeter',
			data: util.objToStr(newPressureData),
			success: (res) => {
				if(res){
					message.success('添加成功！');
					this.setState({
						visible: false,
						confirmAddLoading: false
					})
					//重新加载
					this.props.onAddDevice();
					// this.setState({
					// 	visible: false,
					// 	confirmAddLoading: false
					// })
				} else{
					message.error('添加失败，请重试！');
					this.setState({
						visible: false,
						confirmAddLoading: false
					})
				}
			}
		})
		// const newItem = [];
		// const newData = [newItem, ...this.state.data];
		// this.setState({
		// 	data: newData
		// });
		// fetch_Post
	}
	handleModalCancel(){
		this.setState({
			visible: false,
		});
	}
	// post方法封装
	fetch_Post({ url, data, success }) {
		fetch(url, {
			method: 'POST',
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
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
					<Button type="primary" onClick={this.showModal.bind(this)}>添加压力计</Button>
				</div>
				<Modal width="60%"
					title="添加压力计"
					visible={this.state.visible}
					// onOk = {this.handleAdd.bind(this)}
					confirmLoading = {this.state.confirmAddLoading}
					onCancel = {this.handleModalCancel.bind(this)}
					footer = {null}
				>
				{this.state.confirmAddLoading ?
					<h3 style={{textAlign: 'center'}}>
						<Button type="primary" shape="circle" loading></Button>
						<span>压力计添加中</span>
					</h3>
					:
					<AddForm labelData={pressuremeterLabelData} onAddSubmit={this.handleAdd.bind(this)} defaultLngLat={this.props.defaultLngLat}/>
				}
				</Modal>

				{this.state.finishEdit ?
					null
					:
					<Modal width="60%"
					title="修改压力计"
					visible={this.state.editModalVisible}
					confirmLoading = {this.state.finishEdit}
					onCancel = {this.handleEditModalCancel.bind(this)}
					footer = {null}
					afterClose={()=> this.onClose()}
					maskClosable={false}
					>
				
					<EditForm labelData={pressuremeterLabelData} onEditSubmit={this.handleEdit.bind(this)} meterData={this.editTarget} areaid={this.AraId}/>
					</Modal>
				}
				<Table rowKey={data => data.pressuremeter.PM_UId}
                dataSource={this.state.data}
                columns={this.PMColumns}
                loading={this.state.loading}
            	/>
			</div>
        )
    }
}
export default PMList;
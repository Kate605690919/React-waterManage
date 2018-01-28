import React from 'react'
import { Table,Input, Popconfirm, message, Button } from 'antd';
import util from '../../../util/util';


const EditableCell = ({ editable, value, onChange }) => (
	<div>
		{editable
			? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
			: value
		}
	</div>
);
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
									<a onClick={() => this.edit(record.pressuremeter.PM_UId)}>编辑</a>
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
	//添加压力计
	add(){

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
            <Table rowKey={data => data.pressuremeter.PM_UId}
                dataSource={this.state.data}
                columns={this.PMColumns}
                loading={this.state.loading}
            />
        )
    }
}
export default PMList;
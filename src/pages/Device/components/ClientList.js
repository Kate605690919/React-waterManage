import React from 'react'
import { Table, Popconfirm, Input, message, Select } from 'antd';
import util from '../../../util/util';

const Option = Select.Option;

const EditableCell = ({ editable, value, onChange, column }) => {
	if (editable) {
		if (column === 'area.Ara_Name') {
			let data = util.getSessionStorate('areatree');
			let res = [];
			function formatTree(data) {
				data.forEach((item)=>{
					res.push({value: item.id, text: item.text});
					if(item.children.length > 0) {
						formatTree(item.children);
					}
				});
				return res;
			}
			function findText(key) {
				let res = data.filter((item) => key===item.value);
				return res[0].text;
			}
			data = formatTree(data);
			let options = data.map(d => <Option key={d.value}>{d.text}</Option>);
			return (
				<Select
					showSearch
					style={{ width: 200 }}
					placeholder="Select a person"
					optionFilterProp="children"
					value={value}
					filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
					onChange={(val) => {
						util.setSessionStorate('areaUid', val);
						let text = findText(val);
						 return onChange(text);}}
				>
					{options}
				</Select>
			)
		} else {
			return <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
			
		}
	} else {
		return (<div>{value}</div>);
	}
};

class ClientList extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [{
			title: '客户名',
			dataIndex: 'Name',
			width: '15%',
			render: (text, record) => {
				if (record.editable) return this.renderColumns(text, record, 'Name');
				else return (<a href={`#/client/detail/uid=${record.Uid}`}>{text}</a>);
			},
		}, {
			title: '真实姓名或公司名',
			dataIndex: 'RealName',
			width: '15%',
			render: (text, record) => this.renderColumns(text, record, 'RealName'),
		}, {
			title: '所属区域',
			dataIndex: 'area.Ara_Name',
			width: '15%',
			render: (text, record) => this.renderColumns(text, record, 'area.Ara_Name'),
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
									<Popconfirm title="确定取消?" onConfirm={() => this.cancel(record.Uid)}>
										<a>取消</a>
									</Popconfirm>
								</span>
								:
								<span>
									<a onClick={() => this.edit(record.Uid)}>编辑</a>
									<a onClick={() => this.delete(record.Uid)}>删除</a>
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
		let { tableData, loading, pagination, cacheData } = nextProps;
		this.cacheData = cacheData;
		this.setState({
			data: tableData,
			loading,
			pagination,
		});
	}
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
			this.setState({ data: newData });
		}
	}
	save(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.Uid)[0];
		const areaUid = util.getSessionStorate('areaUid');
		if (target) {
			delete target.editable;
			this.fetch_Post({
				url: 'http://localhost:2051/client/ModifyClient',
				data: `Member_Name=${target.Name}&Member_RealName=${target.RealName}
				&Member_Phone=${target.Phone}&Member_Memo=${target.Memo}
				&Member_AreaUid=${areaUid}&Member_UserUid=${target.Uid}`,
				success: (res) => {
					if (res) message.success('修改成功！');
					else message.error('修改失败，请重试！');
				}
			})
			this.setState({ data: newData });
			this.cacheData = JSON.parse(JSON.stringify(newData));
		}
	}
	cancel(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.Uid)[0];
		if (target) {
			Object.assign(target, this.cacheData.filter(item => key === item.Uid)[0]);
			delete target.editable;
			this.setState({ data: newData });
		}
	}
	delete(key) {

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
			<Table rowKey={data => data.Uid}
				dataSource={this.state.data}
				columns={this.columns}
				loading={this.state.loading}
			/>
		)
	}
}
export default ClientList;
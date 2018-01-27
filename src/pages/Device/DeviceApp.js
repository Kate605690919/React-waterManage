import React from 'react';
import { Tree, Affix, Row, Col, Card } from 'antd';
// import $Fetch from '../../util/fetch.js';
import { Radio } from 'antd';
import FMList from './components/FMList';
import PMList from './components/PMList';
import ClientList from './components/ClientList';
import './App.less';

const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

class DeviceApp extends React.Component {
	constructor(props) {
		super(props);
		// 函数的this绑定
		this.onRadioChange = this.onRadioChange.bind(this);
		// 获取区域树数据
		this.fetch({
			url: `http://rap2api.taobao.org/app/mock/2966/GET/area/AreaTree`,
			success: (res) => {
				this.getTableData(res.data[0].id);//加载table的数据
				this.setState({ treeData: res.data, currentTreeKey: res.data[0].id });
			}
		});
	}

	state = {
		treeData: [],
		currentTreeKey: null,
		data: [],
		pagination: {},
		loading: false,
		radioValue: 'FM',
	}
	//获取设备表格数据
	getTableData(areaUid, radioValue = 'FM') {
		let url;
		switch (radioValue) {
			case 'FM': {
				url = 'http://rap2api.taobao.org/app/mock/2966/POST/Area/GetFlowMeterByUid';
				break;
			}
			case 'PM': {
				url = 'http://rap2api.taobao.org/app/mock/2966/POST/Area/GetPressureMeterByAreaUid';
				break;
			}
			case 'QM': {
				url = 'GetQualityMeterByAreaUid';
				break;
			}
			case 'Client': {
				url = 'http://rap2api.taobao.org/app/mock/2966/GET/Client/getAll';
				break;
			}
			case 'Staff': {
				url = 'GetQualityMeterByAreaUid';
				break;
			}
			default: {
				alert('请选择一种设备！');
				return false;
			}
		}
		this.fetch_Post({
			url: url,
			data: `areaUid=${areaUid}`,
			success: (res) => {
				this.setState({ loading: true });
				this.cacheData = JSON.parse(JSON.stringify(res.data));
				// this.cacheData = res.data.map(item => ({ ...item }));
				// this.cacheData = update(res.data);
				const pagination = { ...this.state.pagination };
				// Read total count from server
				// pagination.total = data.totalCount;
				pagination.total = 200;
				this.setState({
					loading: false,
					data: res.data,
					pagination,
					radioValue
				});
			}
		})
	}
	//fetch的get方法封装
	fetch({ url, success }) {
		fetch(url).then((response) => {
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

	//区域树
	renderTreeNodes = (data) => {
		return data.map((item) => {
			//dataRef的数据如何使用：因为dataRef是props，给这个treeNode绑定点击事件,onselect事件即可，然后读取自身的这个dataRef即可？之后绑定的时候试一试
			if (item.children) {
				return (
					<TreeNode title={item.text} key={item.id} dataRef={item.id}>
						{this.renderTreeNodes(item.children)}
					</TreeNode>
				);
			}
			return <TreeNode {...item} dataRef={item} />;
		});
	}
	onSelect = (selectedKeys, info) => {
		console.log('selected', selectedKeys, info);
		this.getTableData(selectedKeys, this.state.radioValue);
	}
	//toolbar的单选按钮组
	onRadioChange(e) {
		const areaUid = this.state.currentTreeKey;
		// window.location.hash = '#/' + e.target.value;
		// this.setState({
		// 	radioValue: e.target.value,
		// });

		this.getTableData(areaUid, e.target.value)
	}
	render() {
		// debugger;
		// console.log(this.state.radioValue, 'Client');
		let Device = null;
		if (this.state.radioValue === 'FM') {
			console.log(this.cacheData);
			Device = <FMList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} />
		} else if (this.state.radioValue === 'PM') {
			Device = <PMList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} />
		} else if (this.state.radioValue === 'Client') {
			Device = <ClientList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} />
		}
		return (
			<div className="content deviceApp">
				<Row>
					<Col className="deviceTree" xs={24} sm={24} md={5} lg={5} xl={5}>
						<Affix>
							{this.state.treeData.length
								? <Tree showLine
									defaultExpandAll
									defaultSelectedKeys={[this.state.currentTreeKey]}
									onSelect={this.onSelect}
								>
									{this.renderTreeNodes(this.state.treeData)}
								</Tree>
								: 'loading tree'}
						</Affix>
					</Col>
					<Col className="deviceTable" xs={24} sm={24} md={19} lg={19} xl={19}>
						<Card>
							<RadioGroup onChange={this.onRadioChange} value={this.state.radioValue}>
								<Radio value='FM'>流量计</Radio>
								<Radio value='PM'>压力计</Radio>
								<Radio value='Client'>客户</Radio>
								<Radio value='Staff'>职员</Radio>
							</RadioGroup>
							{Device}
						</Card>
					</Col>
				</Row>
			</div>
		);
	}
}

export default DeviceApp;
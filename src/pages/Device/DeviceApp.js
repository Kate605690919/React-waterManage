import React from 'react';
import { Tree, Affix, Row, Col, Card } from 'antd';
// import $Fetch from '../../util/fetch.js';
import { Radio } from 'antd';
import FMList from './components/FMList';
import PMList from './components/PMList';
import QMList from './components/QMList';
import ClientList from './components/ClientList';
import StaffList from './components/StaffList';
import util from '../../util/util';
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
			url: `http://localhost:2051/area/AreaTree`,
			success: (res) => {
				res = [res];
				util.setSessionStorate('areatree',res);
				this.getTableData(res[0].id);//加载table的数据
				this.setState({ treeData: res, currentTreeKey: res[0].id });
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
		this.setState({ loading: true });
		let url;
		switch (radioValue) {
			case 'FM': {
				url = 'http://localhost:2051/Area/GetFlowMeterByAreaUid';
				break;
			}
			case 'PM': {
				url = 'http://localhost:2051/Area/GetPressureMeterByAreaUid';
				break;
			}
			case 'QM': {
				url = 'http://localhost:2051/Area/GetQualityMeterByAreaUid';
				break;
			}
			case 'Client': {
				url = 'http://localhost:2051/Client/getAll';
				break;
			}
			case 'Staff': {
				url = 'http://localhost:2051/Staff/getAll';
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
				if(radioValue === 'FM' || radioValue === 'PM' || radioValue === 'QM'){
					res = JSON.parse(JSON.parse(res).data);
					this.cacheData = JSON.parse(JSON.stringify(res));
				} else {
					this.cacheData = JSON.parse(JSON.stringify(res));
				}
				const pagination = { ...this.state.pagination };
				// Read total count from server
				// pagination.total = data.totalCount;
				pagination.total = 200;
				this.setState({
					loading: false,
					data: res,
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
	//添加流量计、压力计后刷新表格
	getNewTableData(){
		this.getTableData(this.state.currentTreeKey, this.state.radioValue);
	}
	render() {
		// debugger;
		// console.log(this.state.radioValue, 'Client');
		let Device = null;
		//添加设备时默认经纬应当为当前区域经纬度，这里先用常量
		const defaultLngLat = {
			'lng': '114.07900429980464',
			'lat': '22.553374'
		}
		if (this.state.radioValue === 'FM') {
			Device = <FMList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} onAddDevice={this.getNewTableData.bind(this)} defaultLngLat={defaultLngLat}/>
		} else if (this.state.radioValue === 'PM') {
			Device = <PMList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} onAddDevice={this.getNewTableData.bind(this)} defaultLngLat={defaultLngLat}/>
		} else if (this.state.radioValue === 'QM'){
			Device = <QMList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} onAddDevice={this.getNewTableData.bind(this)} defaultLngLat={defaultLngLat}/>
		} else if (this.state.radioValue === 'Client') {
			Device = <ClientList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} />
		} else if (this.state.radioValue === 'Staff') {
			Device = <StaffList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} />
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
								<Radio value='QM'>水质计</Radio>
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
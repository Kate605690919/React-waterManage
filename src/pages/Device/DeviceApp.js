import React from 'react';
import { Tree, Affix, Row, Col, Card, Icon } from 'antd';
// import $Fetch from '../../util/fetch.js';
import { Radio } from 'antd';
import FMList from './components/FMList';
import PMList from './components/PMList';
import QMList from './components/QMList';
import ClientList from './components/ClientList';
import StaffList from './components/StaffList';
import AreaList from './components/AreaList';
import util from '../../util/util';
import './App.less';

const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

class DeviceApp extends React.Component {
	constructor(props) {
		super(props);
		// 函数的this绑定
		this.onRadioChange = this.onRadioChange.bind(this);
		this.permission = util.getSessionStorate('permission');
		let permissionObj = {F: 'FM', P: 'PM', Q: 'QM', C: 'Client', S: 'Staff'};
		for(var key in this.permission) {
			if(this['permission'][key]) {
				this.radioValue = permissionObj[key[0]];
				break;
			}
		}
		this.radioValue = 'Area';
		let { FlowMeterView, PressureMeterView, QualityMeterView, ClientView, StaffView, AreaView } = this.permission;
		this.AllPermission = FlowMeterView || PressureMeterView || QualityMeterView || ClientView || StaffView;
		// 获取区域树数据
		if(AreaView) {
			util.fetch({
				url: `http://localhost:64915/area/AreaTree`,
				success: (res) => {
					let areaUid = util.getLocalStorate('areaUid');
					if (!areaUid) {
						util.setLocalStorate('areaUid', res.id);
						areaUid = res.id;
					}
					res = [res];
					util.setLocalStorate('areatree', res);
					util.setSessionStorate('areatree', res);
					this.getTableData(areaUid,this.radioValue);//加载table的数据
					this.setState({ treeData: res, currentTreeKey: areaUid });
				}
			});
		}
	}

	state = {
		treeData: [],
		currentTreeKey: util.getLocalStorate('areaUid'),
		data: [],
		pagination: {},
		loading: false,
		radioValue: this.radioValue,
	}
	//获取设备表格数据
	getTableData(areaUid, radioValue = 'Area') {
		this.setState({ loading: true });
		let url;
		switch (radioValue) {
			case 'FM': {
				url = this.permission.FlowMeterView ? 'http://localhost:64915/Area/GetFlowMeterByAreaUid' : null;
				break;
			}
			case 'PM': {
				url = this.permission.PressureMeterView ? 'http://localhost:64915/Area/GetPressureMeterByAreaUid' : null;
				break;
			}
			case 'QM': {
				url = this.permission.QualityMeterView ? 'http://localhost:64915/Area/GetQualityMeterByAreaUid' : null;
				break;
			}
			case 'Client': {
				url = this.permission.ClientView ? 'http://localhost:2051/Client/getAll' : null;
				break;
			}
			case 'Staff': {
				url = this.permission.StaffView ? 'http://localhost:2051/Staff/getAll' : null;
				break;
			}
			case 'Area': {
				url = this.permission.AreaView ? 'http://localhost:2051/Area/GetAreaDetailByUid' : null;
				break;
			}
			default: {
				alert('请选择一种设备！');
				return false;
			}
		}
		if (url) {
			util.fetch({
				url: `${url}?areaUid=${areaUid}`,
				success: (res) => {
					if (radioValue === 'FM' || radioValue === 'PM' || radioValue === 'QM') {
						res = JSON.parse(res);
					}
					// this.cacheData = res.map(item => ({ ...item }));
					this.cacheData = JSON.parse(JSON.stringify(res));
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
		this.setState({
			currentTreeKey: selectedKeys[0]
		})
		util.setSessionStorate('lng', null);
		util.setSessionStorate('lat', null);
		// this.getTableData(selectedKeys, this.state.radioValue);
		if (selectedKeys.length !== 0) {
			this.getTableData(selectedKeys, this.state.radioValue);
			util.setLocalStorate('areaUid', selectedKeys[0])
		}
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
	//添加设备后刷新表格
	getNewTableData() {
		this.getTableData(this.state.currentTreeKey, this.state.radioValue);
	}

	//获取当前区域经纬度
	getAreas() {
		//因为区域id只有一个，所以要从区域树查找它的父级区域
		const aid = this.state.currentTreeKey;
		const areatree = util.getSessionStorate('areatree');
		const findArea = (areaid, tree) => {
			let arr = null;
			//先判断当前节点的id是否等于要查找的id
			if (tree.id === areaid) {
				arr = {
					'Lng': tree.Lng,
					'Lat': tree.Lat
				};
				return arr;
			} else if (tree.children) {
				//有子节点就继续找
				for (var i = 0; i < tree.children.length; i++) {
					let res = findArea(areaid, tree.children[i]);
					if (res) {
						return res;
					}
				}
			} else {
				//没有子节点
				return false;
			}
		}
		let res = null;
		if (areatree) {
			for (var i = 0; i < areatree.length; i++) {
				res = findArea(aid, areatree[i]);
				if (res) {
					return res;
				}
			}
		}
		return false;
	}
	render() {
		// console.log(this.state.radioValue, 'Client');
		let Device = null;

		//添加设备时默认经纬度应当为当前区域经纬度，但是暂时areatree里面只有最大的区域有经纬度，它的子区域没有经纬度，所以这里先用常量
		const defaultLngLat = this.getAreas() || {
			'Lng': '114.07900429980464',
			'Lat': '22.553374'
		};
		if (this.state.radioValue === 'FM' && this.permission.FlowMeterView) {
			Device = <FMList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} onAddDevice={this.getNewTableData.bind(this)} defaultLngLat={defaultLngLat} />
		} else if (this.state.radioValue === 'PM' && this.permission.PressureMeterView) {
			Device = <PMList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} onAddDevice={this.getNewTableData.bind(this)} defaultLngLat={defaultLngLat} />
		} else if (this.state.radioValue === 'QM' && this.permission.QualityMeterView) {
			Device = <QMList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} onAddDevice={this.getNewTableData.bind(this)} defaultLngLat={defaultLngLat} />
		} else if (this.state.radioValue === 'Client' && this.permission.ClientView) {
			Device = <ClientList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} renderTable={(areaUid) => this.getTableData(areaUid, 'Client')} />
		} else if (this.state.radioValue === 'Staff' && this.permission.StaffView) {
			Device = <StaffList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} renderTable={(areaUid) => this.getTableData(areaUid, 'Staff')} />
		} else if (this.state.radioValue === 'Area' && this.permission.AreaView) {
			Device = <AreaList tableData={this.state.data} cacheData={this.cacheData} loading={this.state.loading} pagination={this.state.pagination} onAddDevice={this.getNewTableData.bind(this)} defaultLngLat={defaultLngLat} />
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
								: this.permission.AreaView ? <Icon type="loading" /> : '对不起，您没有设备和人员的访问权限！'}
						</Affix>
					</Col>
					<Col className="deviceTable" xs={24} sm={24} md={19} lg={19} xl={19}>
						{this.AllPermission ? (<Card>
							<RadioGroup onChange={this.onRadioChange} value={this.state.radioValue}>
								{this.permission.FlowMeterView ? <Radio value='FM'>流量计</Radio> : null}
								{this.permission.PressureMeterView ? <Radio value='PM'>压力计</Radio> : null}
								{this.permission.QualityMeterView ? <Radio value='QM'>水质计</Radio> : null}
								{this.permission.ClientView ? <Radio value='Client'>客户</Radio> : null}
								{this.permission.StaffView ? <Radio value='Staff'>职员</Radio> : null}
								{this.permission.AreaView ? <Radio value='Area'>区域</Radio> : null}
							</RadioGroup>
							{Device}
						</Card>) : '对不起，您没有设备和人员的访问权限！'}

					</Col>
				</Row>
			</div>
		);
	}
}

export default DeviceApp;
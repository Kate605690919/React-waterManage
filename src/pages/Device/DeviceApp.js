import React from 'react';
import { Tree } from 'antd';
// import $Fetch from '../../util/fetch.js';
import './App.less';

const TreeNode = Tree.TreeNode;

class DeviceApp extends React.Component {
	constructor(props) {
		super(props);
		const _this = this;
		fetch(`http://rap2api.taobao.org/app/mock/2966/GET/area/AreaTree`).then((response) => {
			if (response.status !== 200) {
				throw new Error('Fail to get response with status ' + response.status);
			}
			response.json().then((res) => {
				console.log(res);
				_this.setState({ treeData: new Array(res) });
			}).catch((error) => {
				console.error(error);
			});
		}).catch((error) => {
			console.error(error);
		});
	}
	state = {
		treeData: []
	}
	renderTreeNodes = (data) => {
		return data.map((item) => {
			//dataRef的数据如何使用：因为dataRef是props，给这个treeNode绑定点击事件，然后读取自身的这个dataRef即可？之后绑定的时候试一试
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
	}
	render() {
		console.log(this.state.treeData);
		return (
			<div className="content">
				<Tree loadData={this.onLoadData}
					showLine
					defaultExpandedKeys={['0-0-0']}
					onSelect={this.onSelect}
				>
					{this.renderTreeNodes(this.state.treeData)}
				</Tree>

			</div>
		);
	}
}

export default DeviceApp;
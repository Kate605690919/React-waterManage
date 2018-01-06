import React from 'react';
import { Tree, Affix } from 'antd';
import { Table, Input, Popconfirm } from 'antd';
import { Row, Col } from 'antd';
// import $Fetch from '../../util/fetch.js';
import './App.less';

const EditableCell = ({ editable, value, onChange }) => (
	<div>
		{editable
		? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
		: value
		}
	</div>
);

const TreeNode = Tree.TreeNode;

class DeviceApp extends React.Component {
	constructor(props) {
		super(props);
		this.columns = [{
      title: '流量计编码',
      dataIndex: 'flowmeter.FM_Code',
      width: '10%',
      render: (text, record) => this.renderColumns(text, record, 'name'),
    }, {
      title: '描述',
      dataIndex: 'flowmeter.FM_Description',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record, 'name'),
    }, {
      title: '区域',
      dataIndex: 'area.Ara_Name',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record, 'name'),
    }, {
      title: '更新',
      dataIndex: 'flowmeter.FM_FlowCountLast',
      width: '20%',
      render: (text, record) => this.renderColumns(text, record, 'age'),
    }, {
      title: '流量异常',
      dataIndex: 'flowmeter.FM_Flag',
      width: '15%',
      render: (text, record) => this.renderColumns(text, record, 'flag'),
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
                  <a onClick={() => this.save(record.key)}>保存</a>
                  <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.key)}>
                    <a>取消</a>
                  </Popconfirm>
                </span>
                : 
								<span>
									<a onClick={() => this.edit(record.key)}>编辑</a>
									<a onClick={() => this.delete(record.key)}>删除</a>
								</span> 
            }
          </div>
        );
      },
		}];

		this.fetch({
			url: `http://rap2api.taobao.org/app/mock/2966/GET/area/AreaTree`,
			success: (res) => {
				this.setState({ treeData: res.data });
			}
		});
		// this.getTableData();
	}
	state = {
		treeData: [],
		data: [],
		pagination: {},
    loading: false,
	}
	//获取流量计数据
	getTableData(areaUid) {
		this.fetch_Post({
			url: `http://rap2api.taobao.org/app/mock/2966/POST/FlowMeter/GetFlowMeterByUid`,
			data: `areaUid=${areaUid}`,
			success: (res) => {
				this.setState({ loading: true });
				this.cacheData = res.data.map(item => ({ ...item }));
				const pagination = { ...this.state.pagination };
				// Read total count from server
				// pagination.total = data.totalCount;
				pagination.total = 200;
				this.setState({
					loading: false,
					data: res.data,
					pagination,
				});
			}
		})
	}
	//fetch的get方法封装
	fetch({url, success}) {
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
	fetch_Post({url, data, success}) {
		fetch(url, {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: data}).then((response) => {
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
	//设备表
	renderColumns(text, record, column) {
    return (
      <EditableCell
        editable={record.editable}
        value={text}
        onChange={value => this.handleChange(value, record.key, column)}
      />
    );
	}
	handleChange(value, key, column) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target[column] = value;
      this.setState({ data: newData });
    }
	}
	edit(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      target.editable = true;
      this.setState({ data: newData });
    }
  }
  save(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      delete target.editable;
      this.setState({ data: newData });
      this.cacheData = newData.map(item => ({ ...item }));
    }
  }
  cancel(key) {
    const newData = [...this.state.data];
    const target = newData.filter(item => key === item.key)[0];
    if (target) {
      Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
      delete target.editable;
      this.setState({ data: newData });
    }
	}
	delete(key) {

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
		this.getTableData(selectedKeys);
	}
	render() {
		console.log(this.state.treeData);
		return (
			<div className="content deviceApp">
				<Row>
					<Col className="deviceTree" xs={24} sm={24} md={24} lg={5} xl={5}>
						<Affix>
						{this.state.treeData.length
							? <Tree showLine
							defaultExpandAll
								defaultExpandedKeys={['0-0-0']}
								onSelect={this.onSelect}
							>
								{this.renderTreeNodes(this.state.treeData)}
							</Tree>
							: 'loading tree'}
						</Affix>
					</Col>
					<Col className="deviceTable" xs={24} sm={24} md={24} lg={19} xl={19}>
						<Table rowKey={data => data.flowmeter.FM_UId} 
							dataSource={this.state.data} 
							columns={this.columns} 
							loading={this.state.loading}
						/>
					</Col>
				</Row>
			</div>
		);
	}
}

export default DeviceApp;
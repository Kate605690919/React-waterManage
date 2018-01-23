import React from 'react'
import { Table, Popconfirm } from 'antd';

class ClientList extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
			title: '客户名',
			dataIndex: 'Name',
			width: '15%',
			render: (text, record) => <a href={`#/client/detail/uid=${record.Uid}`}>{text}</a>,
		}, {
			title: '真实姓名或公司名',
			dataIndex: 'RealName',
			width: '15%'
		}, {
			title: '所属区域',
			dataIndex: 'area.Ara_Name',
			width: '15%'
		}, {
			title: '电话号码',
			dataIndex: 'Phone',
            width: '20%'
		}, {
			title: '备注',
			dataIndex: 'Memo',
            width: '20%'
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
									<a onClick={() => {}}>编辑</a>
									<a onClick={() => this.delete(record.pressuremeter.PM_UId)}>删除</a>
								</span>
						}
					</div>
				);
			},
		}];
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
    
	delete(key) {
        
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
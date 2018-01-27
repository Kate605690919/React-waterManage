import React from 'react'
import { Table, Popconfirm } from 'antd';

class StaffList extends React.Component {
    constructor(props) {
        super(props);
        this.columns = [{
			title: '职员名',
			dataIndex: 'Name',
			width: '15%',
			render: (text, record) => <a href={`#/staff/detail/uid=${record.Uid}`}>{text}</a>,
		}, {
			title: '所属区域',
			dataIndex: 'area.Ara_Name',
			width: '15%'
		}, {
			title: '职位',
			dataIndex: 'roles',
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
									<a onClick={() => this.save(record.Uid)}>保存</a>
									<Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.Uid)}>
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
export default StaffList;
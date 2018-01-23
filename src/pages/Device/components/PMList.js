import React from 'react'
import { Table, Popconfirm } from 'antd';

class PMList extends React.Component {
    constructor(props) {
        super(props);
        this.PMColumns = [{
			title: '流量计编码',
			dataIndex: 'pressuremeter.PM_Code',
			width: '10%',
			render: (text, record) => <a href={`#/pressuremeter/detail/pmUid=${record.pressuremeter.PM_UId}`}>{text}</a>,
		}, {
			title: '描述',
			dataIndex: 'pressuremeter.PM_Description',
			width: '20%'
		}, {
			title: '区域',
			dataIndex: 'area.Ara_Name',
			width: '20%'
		}, {
			title: '更新',
			dataIndex: 'status.PMS_UpdateDt',
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
            <Table rowKey={data => data.pressuremeter.PM_UId}
                dataSource={this.state.data}
                columns={this.PMColumns}
                loading={this.state.loading}
            />
        )
    }
}
export default PMList;
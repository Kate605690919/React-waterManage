import React from 'react'
import { Table, Input, Popconfirm } from 'antd';

const EditableCell = ({ editable, value, onChange }) => (
	<div>
		{editable
			? <Input style={{ margin: '-5px 0' }} value={value} onChange={e => onChange(e.target.value)} />
			: value
		}
	</div>
);
class FMList extends React.Component {
    constructor(props) {
        super(props);
        this.FMColumns = [{
			title: '流量计编码',
			dataIndex: 'flowmeter.FM_Code',
			width: '10%',
			render: (text, record) => <a href={`#/flowmeter/detail/uid=${record.flowmeter.FM_UId}`}>{text}</a>,
		}, {
			title: '描述',
			dataIndex: 'flowmeter.FM_Description',
			width: '20%'
		}, {
			title: '区域',
			dataIndex: 'area.Ara_Name',
			width: '20%'
		}, {
			title: '更新',
			dataIndex: 'flowmeter.FM_FlowCountLast',
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
									<a onClick={() => this.save(record.flowmeter.FM_UId)}>保存</a>
									<Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.flowmeter.FM_UId)}>
										<a>取消</a>
									</Popconfirm>
								</span>
								:
								<span>
									<a onClick={() => this.edit(record.flowmeter.FM_UId)}>编辑</a>
									<a onClick={() => this.delete(record.flowmeter.FM_UId)}>删除</a>
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
		console.log(newData);
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if (target) {
			target.editable = true;
			this.setState({ data: newData });
		}
	}
	save(key) {
		const newData = [...this.state.data];
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if (target) {
			delete target.editable;
			this.setState({ data: newData });
			this.cacheData = newData.map(item => ({ ...item }));
		}
	}
	cancel(key) {
        const newData = [...this.state.data];
        debugger;
		const target = newData.filter(item => key === item.flowmeter.FM_UId)[0];
		if (target) {
			Object.assign(target, this.cacheData.filter(item => key === item.flowmeter.FM_UId)[0]);
			delete target.editable;
			this.setState({ data: newData });
		}
	}
	delete(key) {
        
	}
    render() {
        return (
            <Table rowKey={data => data.flowmeter.FM_UId}
                dataSource={this.state.data}
                columns={this.FMColumns}
                loading={this.state.loading}
            />
        )
    }
}
export default FMList;
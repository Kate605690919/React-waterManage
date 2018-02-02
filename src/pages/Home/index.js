import React from 'react';
import { Card, Col, Table, Row } from 'antd';
import util from '../../util/util';
import './home.less';
const FMOptions = [{
    title: '名称',
    dataIndex: 'flowmeter.FM_Description',
}, {
    title: '昨日流量',
    dataIndex: 'lastday_flow'
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_flow_proportion',
}];
const PMOptions = [{
    title: '名称',
    dataIndex: 'pressuremeter.PM_Description',
}, {
    title: '昨日流量',
    dataIndex: 'lastday_pressure'
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_pressure_proportion',
}];
const YFMOptions = [{
    title: '名称',
    dataIndex: 'flowmeter.FM_Description',
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_flow_proportion',
}];
const YPMOptions = [{
    title: '名称',
    dataIndex: 'pressuremeter.PM_Description',
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_pressure_proportion',
}];
class Home extends React.Component {
    state = {
        FMRank: [],
        FMLoading: true,
        PMRank: [],
        PMLoading: true,
        YFMRank: [],
        YFMLoading: true,
        YPMRank: [],
        YPMLoading: true,
    }
    componentDidMount() {
        const that = this;
        util.fetch({
            url: 'http://localhost:64915/FlowMeter/GetMostVisitsFlowMeter',
            success: (res) => {
                res = JSON.parse(res);
                that.setState({ FMRank: res.slice(0, 3), FMLoading: false });
            }
        });
        util.fetch({
            url: 'http://localhost:64915/PressureMeter/GetMostVisitsPressureMeter',
            success: (res) => {
                res = JSON.parse(res);
                that.setState({ PMRank: res.slice(0, 3), PMLoading: false });
            }
        });
        util.fetch({
            url: 'http://localhost:64915/FlowMeter/GetLastDayFlowList',
            success: (res) => {
                debugger;
                res = JSON.parse(res);
                that.setState({ YFMRank: res.slice(0, 3), YFMLoading: false });
            }
        });
        util.fetch({
            url: 'http://localhost:64915/PressureMeter/GetLastDayPressureList',
            success: (res) => {
                res = JSON.parse(res);
                that.setState({ YPMRank: res.slice(0, 3), YPMLoading: false });
            }
        });
    }
    render() {
        return (
            <Col className="Role" xs={24} style={{ 'padding': '20px' }}>
                <Card>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={8}>
                            <Card className="littleCard">
                                <Table columns={FMOptions}
                                    dataSource={this.state.FMRank}
                                    size="small"
                                    pagination={false}
                                    loading={this.state.FMLoading}
                                    rowKey={data => data.flowmeter.FM_UId} />
                            </Card>
                            <Card className="littleCard">
                                <Table columns={PMOptions}
                                    dataSource={this.state.PMRank}
                                    size="small"
                                    pagination={false}
                                    loading={this.state.PMLoading}
                                    rowKey={data => data.pressuremeter.PM_UId} />
                            </Card>
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Card className="littleCard">
                                <Table columns={YFMOptions}
                                    dataSource={this.state.YFMRank}
                                    size="small"
                                    pagination={false}
                                    loading={this.state.YFMLoading}
                                    rowKey={data => data.flowmeter.FM_UId} />
                                <Table columns={YPMOptions}
                                    dataSource={this.state.YPMRank}
                                    size="small"
                                    pagination={false}
                                    loading={this.state.YPMLoading}
                                    rowKey={data => data.pressuremeter.PM_UId} />
                            </Card>
                        </Col>
                    </Row>

                    {/* <div className="commonData">
                        <Card className="littleCard">
                            <Table columns={PMOptions}
                                dataSource={this.state.PMRank}
                                size="small"
                                pagination={false}
                                loading={this.state.PMLoading}
                                rowKey={data => data.pressuremeter.PM_UId} />
                        </Card>
                    </div> */}
                </Card>
            </Col>
        );
    }
}
export default Home;

import React from 'react';
import { Card, Col, Table, Row } from 'antd';
import util from '../../util/util';
import initMap from './components/initMap';
import './home.less';
const FMOptions = [{
    title: '名称(流量计)',
    dataIndex: 'flowmeter.FM_Description',
}, {
    title: '昨日流量',
    dataIndex: 'lastday_flow'
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_flow_proportion',
}];
const PMOptions = [{
    title: '名称(压力计)',
    dataIndex: 'pressuremeter.PM_Description',
}, {
    title: '昨日流量',
    dataIndex: 'lastday_pressure'
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_pressure_proportion',
}];
const YFMOptions = [{
    title: '名称(流量计)',
    dataIndex: 'flowmeter.FM_Description',
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_flow_proportion',
}];
const YPMOptions = [{
    title: '名称(压力计)',
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
        util.fetch({
            url: 'http://localhost:64915/Area/GetMapData',
            success: (data) => {
                let mapEl = document.querySelector("#homeMap");
                initMap(mapEl, data);
            }
        })
    }
    render() {
        return (
            <Col className="Role" xs={24} style={{ 'padding': '20px' }}>
                <Card>
                    <Row gutter={16}>
                        <Col className="gutter-row" span={8}>
                            <h2>常用设备</h2>
                            <Table columns={FMOptions}
                                dataSource={this.state.FMRank}
                                size="small"
                                pagination={false}
                                loading={this.state.FMLoading}
                                rowKey={data => data.flowmeter.FM_UId} />
                            <Table columns={PMOptions}
                                dataSource={this.state.PMRank}
                                size="small"
                                pagination={false}
                                loading={this.state.PMLoading}
                                rowKey={data => data.pressuremeter.PM_UId} />
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <h2>昨日流量/压力变化排行</h2>
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
                        </Col>
                        <Col className="gutter-row" span={8}>
                            <Card className="littleCard">
                                <div className="map">
                                    <div id="homeMap" style={{ marginBottom: '10px', minHeight: '300px' }}></div>
                                    <div id="legend">
                                        <ul>
                                            <li><i></i><span>流量计</span></li>
                                            <li><i></i><span>压力计</span></li>
                                            <li><i></i><span>水质计</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </Card>
            </Col>
        );
    }
}
export default Home;

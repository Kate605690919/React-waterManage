import React from 'react';
// import ECharts from 'react-echarts';
import { Breadcrumb, Card, Tabs, Table, Row, Col, DatePicker, Icon } from 'antd';
import moment from 'moment';
import { columnsStatus, columnsAnalysis, columnsNight, columnsFlow } from './components/PMTableOptions';
import detailEchartLinesOption from './components/detailEchartLinesOption';
import detailHeatOption from './components/detailHeatOption';
import util from '../../util/util';

const { RangePicker } = DatePicker;
const TabPane = Tabs.TabPane;

const cardStyle = {
    width: '100%',
    marginTop: '20px'
}


const dateFormat = 'YYYY/MM/DD';
const defaultDate = [moment('2015/01/01', dateFormat), moment('2015/03/01', dateFormat)];
const defaultDateStr = ['2015/01/01', '2015/03/01'];

class DevicePMDetail extends React.Component {
    constructor(props) {
        super(props);
        this._uid = this.props.params.uid;
        this.detailEchartLinesOption = detailEchartLinesOption;
        this.detailHeatOption = detailHeatOption;
    }
    componentDidMount() {
        this.setState({ loading: true, analysisLoading: true });
        // 获取当前设备数据
        this.fetch({
            url: `http://localhost:64915/PressureMeter/Detail?${this._uid}`,
            success: (res) => {
                // this.getTableData(res.data[0].id);//加载table的数据
                this.setState({ baseData: res, loading: false });
                // 获取流量计分析数据
                this.fetch({
                    url: `http://localhost:64915/PressureMeter/PressureAnalysis?${this._uid}&time=${util.dateFormat(res[0].pressuremeter.PM_CountLast, 2)}`,
                    success: (res) => {
                        // this.getTableData(res.data[0].id);//加载table的数据
                        this.setState({ analysisData: [res], analysisLoading: false });
                    }
                });
            }
        });
        this.getFlowData(defaultDateStr);
        this.getHeatData();
    }
    state = {
        baseData: [],
        loading: false,
        analysisData: [],
        analysisLoading: false,
        flowData: [],
        flowLoading: false,
        checked: true,
        detailEchartLinesOption: null,
        heatLoading: false,
        detailHeatOption: null,
    }
    onTabsChange = (key) => {
        console.log(key)
    }
    getFlowData = (dateStrings) => {
        this.setState({ flowLoading: true });
        // 获取当前设备数据
        this.fetch({
            url: `http://localhost:64915/PressureMeter/GetPressureDetailWithTime?${this._uid}&startDt=${dateStrings[0]}&endDt=${dateStrings[1]}`,
            success: (res) => {
                var detailEchartLinesOption = this.detailEchartLinesOption(res);
                this.setState({ flowData: res, flowLoading: false, detailEchartLinesOption });
            }
        });
    }
    getHeatData = () => {
        this.setState({ heatLoading: true });
        // 获取当前设备数据
        this.fetch({
            url: `http://localhost:64915/PressureMeter/RecentPressureData?${this._uid}`,
            success: (res) => {
                // let data = { time: select(res.data, 'time'), value: select(res.data, 'value') };
                var detailHeatOption = this.detailHeatOption(res);
                this.setState({ heatLoading: false, detailHeatOption });
            }
        });
    }
    onDateChange = (dates, dateStrings) => {
        if (dates.length !== 0) this.getFlowData(dateStrings);
    }
    onSwitchChange = (checked) => {
        this.setState({ checked });
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
    render() {
        let { routes, params } = this.props;
        let baseData = this.state.baseData[0];
        let DeviceInfo = null;
        if(baseData) {
            console.log(baseData.pressuremeter);
            DeviceInfo = (
                <div className="deviceInfo">
                    <span>{baseData.pressuremeter.PM_Code}</span>
                    <span>{baseData.pressuremeter.PM_Description}</span>
                    <span>{util.dateFormat(baseData.pressuremeter.PM_CountLast, 2)}</span>
                </div>
            ); 
        } else {
            DeviceInfo = <Icon type="loading" />;
        }
        return (
            <div className="content detailApp">
                <Breadcrumb routes={routes} params={params} />
                <div className="deviceBlock">
                    {DeviceInfo}
                </div>
                <Row gutter={16}>
                    <Col className="gutter-row" span={8}>
                        <Card className="littleCard">
                            <Table columns={columnsStatus}
                                dataSource={this.state.baseData}
                                size="small"
                                pagination={false}
                                loading={this.state.loading}
                                rowKey={data => data.pressuremeter.PM_UId} />
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Card className="littleCard">
                            <Table columns={columnsAnalysis}
                                dataSource={this.state.analysisData}
                                size="small"
                                pagination={false}
                                loading={this.state.analysisLoading}
                                rowKey={data => data.lastdayproportion} />
                        </Card>
                    </Col>
                    <Col className="gutter-row" span={8}>
                        <Card className="littleCard">
                            <Table columns={columnsNight}
                                dataSource={this.state.analysisData}
                                size="small"
                                pagination={false}
                                loading={this.state.analysisLoading}
                                rowKey={data => data.lastdayproportion} />
                        </Card>
                    </Col>
                </Row>
                <Card
                    style={cardStyle}
                >
                    <Tabs defaultActiveKey="1" onChange={this.onTabsChange}>
                        <TabPane tab="流量图表" key="1">
                            <RangePicker
                                defaultValue={defaultDate}
                                format={dateFormat}
                                onChange={this.onDateChange}
                            />
                            <Row gutter={16}>
                                <Col className="gutter-row" md={12} sm={24}>
                                    <Table columns={columnsFlow}
                                        dataSource={this.state.flowData}
                                        loading={this.state.flowLoading}
                                        rowKey={data => data.id}
                                        pagination={{ pageSize: 8 }} />
                                </Col>
                                <Col className="gutter-row" md={12} span={24} >
                                    {/* <ECharts option={this.state.detailEchartLinesOption} style={{ minHeight: '500px' }} /> */}
                                </Col>
                            </Row>

                        </TabPane>
                        <TabPane tab="热力图分析" key="2">
                            {this.state.heatLoading ? <Icon type="loading" /> : null}
                            {/* <ECharts option={this.state.detailHeatOption} style={{ minHeight: '500px' }} /> */}
                        </TabPane>
                    </Tabs>
                </Card>
            </div>
        )
    }
}
export default DevicePMDetail;
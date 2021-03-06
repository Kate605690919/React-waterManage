const columns = [{
    title: '设备编号',
    dataIndex: 'flowmeter.FM_Code',
}, {
    title: '设备名称',
    dataIndex: 'flowmeter.FM_Description',
}];

const columnsStatus = [{
    title: '主电源',
    dataIndex: 'status.FMS_MainBatteryStatus',
}, {
    title: '备用电源',
    dataIndex: 'status.FMS_SecondaryBatteryStatus',
}, {
    title: '通信电池',
    dataIndex: 'status.FMS_ModemBatteryStatus',
}, {
    title: '信号强度',
    dataIndex: 'status.FMS_AntennaSignal',
}];

const columnsAnalysis = [{
    title: '昨日总流量',
    dataIndex: 'lastday_flow',
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_flow_proportion',
}, {
    title: '上月总流量',
    dataIndex: 'month_flow',
}, {
    title: '上月变化趋势',
    dataIndex: 'month_flow_proportion',
}];
const columnsNight = [{
    title: '昨日凌晨2点-4点流量均值',
    dataIndex: 'night_flow',
}, {
    title: '夜间用水量*24*30/总用水量',
    dataIndex: 'night_flow_proportion',
}];

const columnsFlow = [{
    "title": "抄表时间",
    dataIndex: "time",
    sorter: (a, b) => a.time - b.time,
}, {
    "title": "流量",
    dataIndex: "value",
    sorter: (a, b) => a.value - b.value,
}];

export {columns, columnsStatus, columnsAnalysis, columnsNight, columnsFlow}
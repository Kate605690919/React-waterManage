const columnsStatus = [{
    title: '主电源',
    dataIndex: 'status.PMS_MainBatteryStatus',
}, {
    title: '备用电源',
    dataIndex: 'status.PMS_SecondaryBatteryStatus',
}, {
    title: '通信电池',
    dataIndex: 'status.PMS_ModemBatteryStatus',
}, {
    title: '信号强度',
    dataIndex: 'status.PMS_AntennaSignal',
}];

const columnsAnalysis = [{
    title: '昨日总量',
    dataIndex: 'lastday_pressure',
    render: (text, record) => {
        text = parseInt(text, 10);
        return text.toFixed(2);
    }
}, {
    title: '昨日变化趋势',
    dataIndex: 'lastday_pressure_proportion',
}, {
    title: '上月总量',
    dataIndex: 'month_pressure',
    render: (text, record) => {
        text = parseInt(text, 10);
        return text.toFixed(2);
    }
}, {
    title: '上月变化趋势',
    dataIndex: 'month_pressure_proportion',
}];
const columnsNight = [{
    title: '昨日凌晨2点-4点均值',
    dataIndex: 'night_pressure',
    render: (text, record) => {
        text = parseInt(text, 10);
        return text.toFixed(2);
    }
}, {
    title: '夜间用水量*24*30/总量',
    dataIndex: 'night_pressure_proportion',
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

export {columnsStatus, columnsAnalysis, columnsNight, columnsFlow}
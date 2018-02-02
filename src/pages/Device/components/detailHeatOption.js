// import echarts from 'echarts';
// // 引入折线图
// import  'echarts/lib/chart/heatmap';
// // 引入提示框和标题组件
// import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/title';


const detailEchartLinesOption = (data) => {
    //获取dataMax，dataMin
    var dataTime = [];
    var days = [];
    var hours = [];
    var dataMax = 0;
    for (let i = 0; i < (data.value).length - 1; i++) {
        if (dataMax < data.value[i]) {
            dataMax = data.value[i];
        };
    }
    var dataMin = dataMax;
    for (let i = 0; i < (data.value).length - 1; i++) {
        if (dataMin > data.value[i]) {
            dataMin = data.value[i];
        };
    }
    //获取hours和days数组以及datas数组
    var datas = [];
    for (let i = 0; i < (data.time).length; i++) {
        dataTime[i] = (data.time[i]).toString();
        hours.push(dataTime[i].substring(8));
        days.push(dataTime[i].substring(0, 8));
        datas[i] = [hours[i], days[i], Math.round(data.value[i])];
    };
    // Array.prototype.unique3 = function () {
    //     var res = [];
    //     var json = {};
    //     for (var i = 0; i < this.length; i++) {
    //         if (!json[this[i]]) {
    //             res.push(this[i]);
    //             json[this[i]] = 1;
    //         }
    //     }
    //     return res;
    // };
    //将横纵坐标的坐标值按从小到大排序
    hours = bubbleSort(hours);
    days = bubbleSort(days);

    hours = unique3(hours);
    days = unique3(days);
    let option = {
        title: {
            text: '热力图',
            subtext: '一段连续时间每天24小时统计'
        },
        tooltip: {
            position: 'top'
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        animation: false,
        grid: {
            height: '68%',
            y: '15%',
            x: '15%'
        },
        xAxis: {
            type: 'category',
            data: hours
        },
        yAxis: {
            type: 'category',
            data: days
        },
        visualMap: {
            min: dataMin,
            max: dataMax,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '0%',
            target: {
                inRange: {
                    color: ['#b5e2ff', '#2A8FBD', '#00466B']
                }
            },
            controller: {
                inRange: {
                    color: ['#b5e2ff', '#2A8FBD', '#00466B']
                }
            }
        },
        series: [{
            name: '流量',
            type: 'heatmap',
            data: datas,
            label: {
                normal: {
                    show: false
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.3)'
                }
            }
        }]
    };
    return option;
}

//冒泡排序: bubbleSort()
function unique3(arr) {
    let res = [],
        json = {};
    arr.forEach(item => {
        if (!json[item]) {
            res.push(item);
            json[item] = 1;
        }
    });
    return res;
}
function bubbleSort(arg) {
    for (var i = 0; i < arg.length; i++)
        for (var j = 0; j < arg.length - i; j++) {
            if (arg[j] > arg[j + 1]) {
                var Temp = arg[j];
                arg[j] = arg[j + 1];
                arg[j + 1] = Temp;
            };
        };
    return (arg);
}

export default detailEchartLinesOption;
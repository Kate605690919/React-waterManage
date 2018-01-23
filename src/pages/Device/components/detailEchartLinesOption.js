import echarts from 'echarts/dist/echarts.common';
// 引入折线图
import  'echarts/lib/chart/line';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

const detailEchartLinesOption = (data) => {
    var dataXAxis = select(data, "time");
    var flowDataYAxis = select(data, "value");
     //指定图表的配置项和数据
    var optionLine = {
        title: {
            text: '流量计数据统计图',
            subtext: '对应统计数据表格数据显示'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'line',   //显示横纵坐标实时值
                lineStyle: {
                    type: 'dotted',
                    color: '#188df0',//'999'
                    shadowColor: 'rgba(0, 0, 0, 0.5)',
                    shadowBlur: 10
                },
                label: {
                    backgroundColor: ''  //#6a7985
                }
            }
        },  //提示框
        legend: {
            top: '1%',
            right: '18%',
            data: ['流量']
            //, '最大值', '最小值
        },
        toolbox: {
            feature: {
                saveAsImage: {}, //保存为图片
                magicType: {     //动态类型切换
                    type: ['line', 'bar']
                },
                restore: {}  //配置项还原
            }
        },    //工具栏 
        grid: {
            show: false,
            top: '15%',   //距离上边多少
            left: '2%',
            right: '5%',
            // bottom: '8%',
            containLabel: true
            // backgroundColor: '#eee'
        },
        xAxis: {
            data: dataXAxis,
            type: 'category',
            nameLocation: 'middle',
            boundaryGap: false, //坐标轴两边留白策略？
            axisLabel: {
                inside: false,
                textStyle: {
                    color: '#3b3c40'
                }
            },
            axisTick: {         //显示刻度
                show: false
            },
            axisLine: {
                show: false    //显示坐标轴
            },
            z: 10             //等同于z-index
        },
        yAxis: {
            type: 'value',
            axisTick: {        //显示刻度
                show: false
            },
            axisLine: {
                show: false    //显示坐标轴
            },
            axisLabel: {
                textStyle: {
                    color: '#999'
                }
            }
        },
        dataZoom: [
            {
                type: 'inside'
            },
            {
                start: 0,
                end: 10,
                handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
                handleSize: '80%',
                handleStyle: {
                    color: '#fff',
                    shadowBlur: 3,
                    shadowColor: 'rgba(0, 0, 0, 0.6)',
                    shadowOffsetX: 2,
                    shadowOffsetY: 2
                }
            }
        ],
        series: [
            {
                name: '流量',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#83bff6' },
                                { offset: 0.5, color: '#188df0' },
                                { offset: 1, color: '#188df0' }
                            ]
                        )
                    },
                    emphasis: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 0, 1,
                            [
                                { offset: 0, color: '#2378f7' },
                                { offset: 0.7, color: '#2378f7' },
                                { offset: 1, color: '#83bff6' }
                            ]
                        )
                    }
                },
                data: flowDataYAxis,
                markPoint: {
                    label: {
                        normal: {
                            formatter: function (param) {
                                return param != null ? Math.round(param.value) : '';
                            }
                        }
                    },
                    data: [
                        {
                            name: 'highest value',
                            type: 'max'
                        },
                        {
                            name: 'lowest value',
                            type: 'min'
                        },
                    ],
                    tooltip: {
                        formatter: function (param) {
                            return param.name + '<br>' + (param.data.coord || '');
                        }
                    }
                },
                markLine: {
                    data: [
                        {
                            name: 'average value on close',
                            type: 'average'
                        }
                    ]
                }
            },
        ]
    };
    return optionLine;
}
function select(arr, key) {
    var ret = [];
    for (var index in arr) {
        if (arr[index][key] !== undefined)
            ret.push(arr[index][key]);
    }
    return ret;
}

export default detailEchartLinesOption;
    
       




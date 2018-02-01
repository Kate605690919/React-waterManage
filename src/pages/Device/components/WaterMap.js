// WaterMap类中调用了百度地图JavaScript API，使用前需要在public/index.html中添加你的应用key，
// 并且把BMap设为全局变量
import React from 'react';

class WaterMap extends React.Component{
    //lng表示经度，lat表示纬度
    state = {
        lng: this.props.defaultLng,
        lat: this.props.defaultLat
    }
    componentDidMount(){
        // [百度地图JSAPI](http://lbsyun.baidu.com/cms/jsapi/reference/jsapi_reference.html)
        let BMap = window.BMap;
        //在指定的容器内创建地图实例，之后需要调用Map.centerAndZoom()方法对地图进行初始化。
        let map = new BMap.Map(this.props.mapname);        //Map为地图API的核心类，用来实例化一个地图
        map.centerAndZoom(new BMap.Point(this.state.lng, this.state.lat), 14);  //设初始化地图
        map.addControl(new BMap.NavigationControl());   //	将控件添加到地图，一个控件实例只能向地图中添加一次
        map.addEventListener('click', this.getPoint.bind(this));
        map.enableScrollWheelZoom();   //启用滚轮放大缩小，默认禁用
    }
    getPoint(e){  
        //点击地图回调
        this.setState({
            lng: e.point.lng,
            lat: e.point.lat
        })
        this.props.handleChange({
            lng: this.state.lng,
            lat: this.state.lat
        })
    }
    render(){
        return (
            <div id={this.props.mapname} style={{width: '100%', height: '300px'}} ></div>
        )
    }
}

export default WaterMap;
//需要在html中添加key
import React from 'react';

class WaterMap extends React.Component{
    // constructor(props){
    //     super(props);
    //     this
    // }
    state = {
        lng: this.props.defaultLng,
        lat: this.props.defaultLat
    }
    componentDidMount(){
        let BMap = window.BMap;
        let map = new BMap.Map('watermap');
        map.centerAndZoom(new BMap.Point(this.state.lng, this.state.lat), 14);
        map.addControl(new BMap.NavigationControl());
        map.addEventListener('click', this.getPoint.bind(this));
        map.enableScrollWheelZoom()
    }
    getPoint(e){
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
        
        // WMap.addEventListener('click', this.getPoint)
        return (
            <div id="watermap" style={{width: '100%', height: '300px'}} >

            </div>
        )
    }
}

export default WaterMap;
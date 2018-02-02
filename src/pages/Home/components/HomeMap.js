import React from 'react'
import util from '../../../util/util';
import initMap from './initMap';


class HomeMap extends React.Component {
    componentDidMount() {
        let that = this;
        util.fetch({
            url:'/Area/GetMapData',
            success: (data) => {
                let mapEl = document.querySelector("#homeMap");
                // initMap(mapEl, data);
            }
        })
    }
    render() {
        return (
            <div className="map">
                <div id="homeMap" style={{ marginBottom: '10px' }}></div>
                <div id="legend">
                    <ul>
                        <li><i></i><span>流量计</span></li>
                        <li><i></i><span>压力计</span></li>
                        <li><i></i><span>水质计</span></li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default HomeMap;

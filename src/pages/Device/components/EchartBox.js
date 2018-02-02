import React from 'react';
import echarts from 'echarts';

class EchartBox extends React.Component {
    constructor(props) {
        super(props);
        this.id = this.props.id;
    }
    state = {
        options: [],
        loading: true,
        data: null,
    }
    componentWillReceiveProps(nextProps) {
        const { options, loading, id, data } = nextProps;
        this.id = id;
        this.setState({options: options, loading, data});
    }
    componentDidMount() {
        if(this.props.data) {
            let myChartLine = echarts.init(document.getElementById(this.id));
            setTimeout(()=>{
                myChartLine.setOption(this.props.options)
            }, 500);
        }
    }
    componentWillUpdate(nextProps, nextState) {
        if(nextState.data) {
            let myChartLine = echarts.init(document.getElementById(this.id));
            setTimeout(()=>{
                myChartLine.setOption(nextProps.options)
            }, 500);
        }
    }
    render() {
        return (
            <div className="EchartBox" id={this.id} style={{ minHeight: '500px' }}></div>
        );
    }
}

export default EchartBox;
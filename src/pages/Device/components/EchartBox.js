import React from 'react';

class EchartBox extends React.Component {
    state = {
        options: [],
        loading: true,
    }
    componentWillReceiveProps(nextProps) {
        const { options, loading } = nextProps;
        this.setState({options: options, loading});
    }
    componentDidMount() {

    }
    render() {
        return (
            <div className="EchartBox" id={this.props.id}></div>
        );
    }
}
import React from 'react';

class App extends React.Component {
    render() {
        return (
            <div id="root">
                <HeaderTop />
                {this.props.children}
                <Footer />
            </div>
        );
    }
}

export default App;
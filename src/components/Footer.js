import React from 'react';

class Footer extends React.Component {
    render() {
        return (
            <footer style={{position: 'fixed',bottom: 0,left: 0,color: '#a7a6aa',padding: '10px 20px'}}>
                <div>
                    <span>智慧水务</span> - &copy; 2017
                </div>
            </footer>
        );
    }
}

export default Footer;
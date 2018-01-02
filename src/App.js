import React from 'react';
import HeaderTop from './components/HeaderTop/index.jsx';
import Footer from './components/Footer';
import './App.less';

class App extends React.Component {
    constructor(props) {
        super(props);
        fetch(`http://rap.taobao.org/mockjs/28339/www.ileaf.club/user/getUserInfo?12345-678910`).then((response) => {
            if (response.status !== 200) {
                throw new Error('Fail to get response with status ' + response.status);
            }
            response.json().then((res) => {
                console.log(res);
            }).catch((error) => {
                console.error(error);
            });
        }).catch((error) => {
            console.error(error);
        });
    }
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

// class App extends React.Component {
// 	constructor(props) {
// 		super(props);
// 		// fetch(`http://localhost:64915/PressureMeter/Detail`, { 
// 		// 	method: 'POST', 
// 		// 	headers: { 
// 		// 		'Content-Type': 'application/x-www-form-urlencoded'
// 		// 	}, 
// 		// 	body: `pmuid=bc17ba9c-c2fc-421a-9a65-faca08f7082a&userUid=34559244-4930-438b-948a-94e117b59cbb` 
// 		// }).then((response) => {
// 		// 	if (response.status !== 200) {
// 		// 			throw new Error('Fail to get response with status ' + response.status);
// 		// 	}
// 		// 	response.json().then((res) => {
// 		// 			console.log(res);
// 		// 	}).catch((error) => {
// 		// 		console.error(error);
// 		// 	});
// 		// }).catch((error) => {
// 		// 	console.error(error);
// 		// });
// 	}
// 	render() {
// 		return (
// 			<div className="App">
// 				<header className="App-header">
// 					<img src={logo} className="App-logo" alt="logo" />
// 					<h1 className="App-title">Welcome to React</h1>
// 				</header>
// 				<p className="App-intro">
// 					To get started, edit <code>src/App.js</code> and save to reload.
// 				</p>
// 			</div>
// 		);
// 	}
// }

import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './App.js';
import { DeviceApp } from './pages/Device';
// import { ClientApp, ClientList, ClientAdd, ClientDetail, ClientBase, ClientFM } from './pages/Client';
// import { StaffApp, StaffList, StaffAdd, StaffDetail, StaffBase } from './pages/Staff';
import { FeedBackApp } from './pages/FeedBack';
const Routes = () => (
    <Router history={ hashHistory }>
        <Route path="/" component={App}>
            <IndexRoute component={DeviceApp}></IndexRoute>
            {/* <IndexRoute component={HomeApp}></IndexRoute>
            <Route path="devices" component={DeviceApp}>
                <Route path="/flowmeter/detail/:uid" component={DeviceFMDetail}></Route>
                <Route path="/pressuremeter/detail/:uid" component={DeviceFMDetail }></Route>
            </Route>
            <Route path="client" component={ClientApp}>                                                       
                <IndexRoute component={ClientList}></IndexRoute>
                <Route path="Add" component={ClientAdd} />
                <Route path="detail/:uid" component={ClientDetail} />
                <Route path="editbase/:uid" component={ClientBase} />
                <Route path="editfm/:uid" component={ClientFM} />
            </Route>
            <Route path="staff" component={StaffApp}>
                <IndexRoute component={StaffList}></IndexRoute>
                <Route path="Add" component={StaffAdd} />
                <Route path="detail/:uid" component={StaffDetail} />
                <Route path="editbase/:uid" component={StaffBase} />
            </Route> */}
            <Route path="feedback" component={FeedBackApp}></Route>
        </Route>
    </Router>
);

export default Routes;

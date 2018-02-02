import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './App.js';
import Login from './pages/Login';
import { DeviceApp, DeviceFMDetail, DevicePMDetail } from './pages/Device';
import Role from './pages/Role';
import Home from './pages/Home';
import { FeedBackApp } from './pages/FeedBack';
const Routes = () => (
    <Router history={hashHistory}>
        <Route path='/' component={Login} />
        <Route path="/device" component={App} breadcrumbName="设备人员管理">
            <IndexRoute component={DeviceApp} />
            <Route path="flowmeter/detail/:uid" component={DeviceFMDetail} breadcrumbName="流量计详情"></Route>
            <Route path="pressuremeter/detail/:uid" component={DevicePMDetail} breadcrumbName="压力计详情"></Route>
        </Route>
        <Route path="/" component={App}>
            <Route path="/feedback" component={FeedBackApp}></Route>
            <Route path="/role" component={Role}></Route>
            <Route path="/home" component={Home}></Route>
        </Route>
        {/* <Route path="devices" component={DeviceApp}>
                <Route path="/flowmeter" component={FMList}></Route>
                <Route path="/pressuremeter" component={PMList}></Route>
            </Route> */}
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
    </Router>
);

export default Routes;

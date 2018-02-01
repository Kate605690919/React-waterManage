import React from 'react';
import { Router, Route, hashHistory, IndexRoute } from 'react-router';
import App from './App.js';
import { DeviceApp, DeviceFMDetail, DevicePMDetail } from './pages/Device';
// import { ClientApp, ClientList, ClientAdd, ClientDetail, ClientBase, ClientFM } from './pages/Client';
// import { StaffApp, StaffList, StaffAdd, StaffDetail, StaffBase } from './pages/Staff';
import { FeedBackApp } from './pages/FeedBack';
import PasswordUpdateApp from './pages/PasswordUpdateApp';
const Routes = () => (
    <Router history={hashHistory}>
        <Route path="/" component={App} breadcrumbName="首页">
            <IndexRoute component={DeviceApp}></IndexRoute>
            <Route path="/flowmeter/detail/:uid" component={DeviceFMDetail} breadcrumbName="流量计详情"></Route>
            <Route path="/pressuremeter/detail/:uid" component={DevicePMDetail } breadcrumbName="压力计详情"></Route>
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
            <Route path="feedback" component={FeedBackApp}></Route>
            <Route path="/Home/passupdate" component={PasswordUpdateApp} breadcrumbName="修改密码"></Route>
        </Route>
    </Router>
);

export default Routes;

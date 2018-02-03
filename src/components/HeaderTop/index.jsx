import React from 'react';
import { Link } from 'react-router';
import './HeaderTop.less';
import { Button, Icon, Menu } from 'antd';
import util from '../../util/util';
// const SubMenu = Menu.SubMenu;
// const menu = (
//     <Menu>
//         <Menu.Item key="0">
//             <Link to="/" activeClassName="active">客户管理</Link>
//         </Menu.Item>
//         <Menu.Item key="1">
//             <Link to="/" activeClassName="active">职员管理</Link>
//         </Menu.Item>
//     </Menu>
// );

class HeaderTop extends React.Component {
    constructor(props) {
        super(props);
        this._roleName = 'hkAdmin';
        this.permission = util.getSessionStorate('permission');
        // this.permission.RoleView = false;

    }
    state = {
        collapsed: true,
    }
    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }
    componentWillMount() {
        this._roleName = 'hkAdmin';
    }
    render() {
        return (
            <header className="navbar navbar-default navbar-fixed-top" role="navigation">
                <div className="navbar-header">
                    <div className="navbar-brand">智慧水务</div>
                    <Button className="collapse-button" type="primary" onClick={this.toggleCollapsed} style={{ marginBottom: 16 }}>
                        <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                    </Button>
                </div>
                <div className="nav-info">
                    <ul className="nav-menu">
                        <li key="1">
                            <Link to="/home" activeClassName="active">首页</Link>
                        </li>
                        <li key="2">
                            <Link to="/device" activeClassName="active">设备人员管理</Link>
                        </li>
                        {this.permission.RoleView ? (
                            <li key="3">
                                <Link to="/role" activeClassName="active">权限管理</Link>
                            </li>
                        ) : null}
                        <li key="4">
                            <Link to="/feedback" activeClassName="active">反馈</Link>
                        </li>
                    </ul>
                    <ul className="nav-info-menu">
                        <li><span> {this._roleName}</span></li>
                        <li><Link to="/Home/passupdate">修改密码</Link></li>
                        <li><Link to="/"><Icon type="logout" /></Link></li>
                    </ul>
                </div>
                <div className="navbar-collapse">
                    <Menu
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                        theme="dark"
                        inlineCollapsed={this.state.collapsed}
                    >
                        <Menu.Item key="1">
                            <Icon type="pie-chart" />
                            <span><Link to="/home" activeClassName="active">首页</Link></span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="desktop" />
                            <span><Link to="/device" activeClassName="active">设备人员管理</Link></span>
                        </Menu.Item>
                        {this.permission.RoleView ? (
                            <Menu.Item key="3">
                                <Icon type="desktop" />
                                <span><Link to="/role" activeClassName="active">权限管理</Link></span>
                            </Menu.Item>
                        ) : null}

                        <Menu.Item key="4">
                            <Icon type="desktop" />
                            <span><Link to="/feedback" activeClassName="active">反馈</Link></span>
                        </Menu.Item>
                        {/* <SubMenu key="sub1" title={<span><Icon type="mail" /><span>管理</span></span>}>
                            <Menu.Item key="3">客户管理</Menu.Item>
                            <Menu.Item key="4">职员管理</Menu.Item>
                        </SubMenu> */}
                        <Menu.Item key="5" className>
                            <span><a href="####" className="ant-menu-itemSelf"><span className="userLogined"> {this._roleName}</span></a></span>
                            <span><a href="/Home/login" className="ant-menu-itemSelf item-2"><Icon type="logout" /></a></span>
                        </Menu.Item>
                    </Menu>
                </div>
            </header>
        );
    }
}

export default HeaderTop;
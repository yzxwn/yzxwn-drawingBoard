import * as React from "react";
import { Row, Col, Menu, Icon } from "antd";
import { Link } from "react-router-dom";
import "./Header.less";

export const Head: React.StatelessComponent<{}> = () => {
    return (
        <div>
            <Row type="flex" justify="end" align="middle">
                <Col span={3}>
                    <Menu mode="horizontal" className="user-logout">
                        <Menu.SubMenu title={<span><Icon type="user" />{"User 1"}</span>} >
                            <Menu.Item key="logOut"><Link to="#" >Logout</Link></Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Col>
            </Row>
        </div>
    );
};

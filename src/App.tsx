import * as React from 'react';
import { Layout } from "antd";
import Sidebar from "./layouts/Sidebar";
import {Head} from "./layouts/Header";
import {TestPage} from "./pages/TestPage";

const { Header, Sider, Content } = Layout;

class App extends React.Component {
    render() {
        return (
            <Layout>
                {/*<Sider*/}
                    {/*trigger={null}*/}
                    {/*collapsible*/}
                    {/*collapsed={false}*/}
                {/*>*/}
                    {/*<Sidebar />*/}
                {/*</Sider>*/}
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <Head />
                    </Header>
                    <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
                        <TestPage/>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

export {App}
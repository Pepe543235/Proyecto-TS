import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import MenuDynamic from '../MenuComponent';

const { Header, Content, Footer, Sider } = Layout;

function Dashboard() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220} style={{ background: '#001529' }}>
        <div style={{ height: 32, margin: 16, background: 'rgba(255, 255, 255, 0.3)' }} />
        <MenuDynamic />
      </Sider>

      <Layout>
        <Header style={{ padding: 0, background: '#fff' }}>
          <h1 style={{ marginLeft: 16 }}>Dashboard</h1>
        </Header>

        <Content style={{ margin: '24px 16px 0', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          ©2025 Tu Empresa
        </Footer>
      </Layout>
    </Layout>
  );
}

export default Dashboard;

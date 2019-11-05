import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout, Menu } from 'antd';

const { Header, Content, Footer } = Layout;

import 'antd/dist/antd.css';

export default function AppWrapper({ children }: any) {
  const router = useRouter();

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[router.pathname]}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="/">
            <Link href="/">
              <a>Main</a>
            </Link>
          </Menu.Item>
          <Menu.Item key="app">
            <Link href="/orders">
              <a>Orders</a>
            </Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: '0 25px', display: 'flex' }}>
        <div style={{ background: '#fff', padding: 24, minHeight: 280, width: '100%' }}>
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>© 2019 nodkz</Footer>
    </Layout>
  );
}

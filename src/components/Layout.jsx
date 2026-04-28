import React, { useState } from 'react'
import { Layout as AntLayout, Menu, Typography, Button, Drawer } from 'antd'
import {
  HomeOutlined,
  BlockOutlined,
  BuildOutlined,
  MenuOutlined,
  BookOutlined,
  GithubOutlined,
  ApiOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header, Content, Footer } = AntLayout
const { Title } = Typography

const menuItems = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: '/architecture',
    icon: <BlockOutlined />,
    label: '架构解析',
  },
  {
    key: '/build',
    icon: <BuildOutlined />,
    label: '从零构建',
  },
  {
    key: '/parchment',
    icon: <ApiOutlined />,
    label: 'Parchment',
  },
]

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleMenuClick = ({ key }) => {
    navigate(key)
    setMobileMenuOpen(false)
  }

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BookOutlined style={{ fontSize: '24px', color: '#2962ff' }} />
          <Title level={4} style={{ margin: 0, color: '#2962ff' }}>
            Quill 深度解析
          </Title>
        </div>

        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
            style={{ border: 'none', background: 'transparent' }}
          />
          <Button
            type="link"
            icon={<GithubOutlined />}
            href="https://github.com/slab/quill"
            target="_blank"
          />
        </div>

        <Button
          className="mobile-menu-btn"
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileMenuOpen(true)}
          style={{ display: 'none' }}
        />

        <Drawer
          title="导航"
          placement="right"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
        >
          <Menu
            mode="vertical"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Drawer>
      </Header>

      <Content style={{ padding: 0 }}>
        {children}
      </Content>

      <Footer style={{ textAlign: 'center', background: '#1e1e2e', color: '#94e2d5' }}>
        <p>Quill 编辑器深度解析 - 基于官方文档和源码分析</p>
        <div style={{ marginTop: '12px', display: 'flex', gap: '24px', justifyContent: 'center' }}>
          <a href="https://quilljs.com/" target="_blank" rel="noopener noreferrer" style={{ color: '#89b4fa' }}>
            Quill 官网
          </a>
          <a href="https://github.com/slab/quill" target="_blank" rel="noopener noreferrer" style={{ color: '#89b4fa' }}>
            GitHub
          </a>
          <a href="https://quilljs.com/docs/quickstart" target="_blank" rel="noopener noreferrer" style={{ color: '#89b4fa' }}>
            文档
          </a>
        </div>
      </Footer>
    </AntLayout>
  )
}
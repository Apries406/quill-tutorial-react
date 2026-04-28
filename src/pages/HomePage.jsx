import React from 'react'
import { Typography, Card, Row, Col, Button, Space, Tag } from 'antd'
import {
  BookOutlined,
  BlockOutlined,
  BuildOutlined,
  ThunderboltOutlined,
  GithubOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Title, Paragraph, Text } = Typography

const features = [
  {
    icon: <BlockOutlined style={{ fontSize: '32px', color: '#2962ff' }} />,
    title: 'Delta 格式',
    description: '学习 Quill 如何用 JSON 表示富文本文档和变更',
  },
  {
    icon: <BuildOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
    title: 'Parchment 模型',
    description: '理解 Quill 的文档模型和 Blot 抽象层',
  },
  {
    icon: <ThunderboltOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
    title: '模块系统',
    description: '探索 Toolbar、History、Clipboard 等核心模块',
  },
]

const chapters = [
  { number: '01', title: '核心概念', desc: '理解富文本编辑器的本质挑战' },
  { number: '02', title: 'Delta 格式', desc: '用 JSON 表示富文本文档' },
  { number: '03', title: 'Parchment 模型', desc: '文档模型和 Blot 抽象' },
  { number: '04', title: '模块系统', desc: '可扩展的架构设计' },
  { number: '05', title: '从零构建', desc: '动手实现 Mini Quill' },
  { number: '06', title: '扩展定制', desc: '打造专属编辑器' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      {/* Hero Section */}
      <div
        style={{
          background: 'linear-gradient(180deg, #f0f4ff 0%, #ffffff 100%)',
          padding: '80px 24px 60px',
          textAlign: 'center',
        }}
      >
        <Title level={1} style={{ fontSize: '48px', marginBottom: '16px' }}>
          Quill 编辑器
          <br />
          <span style={{ background: 'linear-gradient(135deg, #2962ff, #7c4dff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            深度解析
          </span>
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto 32px' }}>
          从零开始，一步一步理解现代富文本编辑器的设计与实现
        </Paragraph>
        <Space size="large">
          <Button type="primary" size="large" onClick={() => navigate('/architecture')}>
            开始学习 <ArrowRightOutlined />
          </Button>
          <Button size="large" icon={<GithubOutlined />} href="https://github.com/slab/quill" target="_blank">
            GitHub
          </Button>
        </Space>

        <Row gutter={[32, 16]} justify="center" style={{ marginTop: '48px' }}>
          <Col>
            <Tag color="blue" style={{ padding: '4px 12px', fontSize: '14px' }}>47k+ Stars</Tag>
          </Col>
          <Col>
            <Tag color="green" style={{ padding: '4px 12px', fontSize: '14px' }}>v2.0</Tag>
          </Col>
          <Col>
            <Tag color="orange" style={{ padding: '4px 12px', fontSize: '14px' }}>BSD 开源</Tag>
          </Col>
        </Row>
      </div>

      {/* Features Section */}
      <div style={{ padding: '60px 24px', maxWidth: '1200px', margin: '0 auto' }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
          核心概念
        </Title>
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} md={8} key={index}>
              <Card
                hoverable
                style={{ textAlign: 'center', height: '100%' }}
                styles={{ body: { padding: '32px 24px' } }}
              >
                <div style={{ marginBottom: '16px' }}>{feature.icon}</div>
                <Title level={4}>{feature.title}</Title>
                <Paragraph type="secondary">{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* Chapters Section */}
      <div style={{ padding: '60px 24px', background: '#f8f9fa' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: '48px' }}>
            学习路线
          </Title>
          <Row gutter={[16, 16]}>
            {chapters.map((chapter, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card
                  hoverable
                  onClick={() => navigate(index < 4 ? '/architecture' : '/build')}
                  style={{ height: '100%' }}
                >
                  <Text type="secondary" style={{ fontSize: '24px', fontWeight: 700, opacity: 0.3 }}>
                    {chapter.number}
                  </Text>
                  <Title level={4} style={{ marginTop: '8px', marginBottom: '4px' }}>
                    {chapter.title}
                  </Title>
                  <Text type="secondary">{chapter.desc}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  )
}
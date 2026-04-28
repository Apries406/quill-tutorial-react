# Quill 编辑器深度解析 - React 版

使用 Vite + React + Ant Design 构建的 Quill 编辑器教程网站。

## 技术栈

- **构建工具**: Vite 6.x
- **UI 框架**: React 19.x
- **组件库**: Ant Design 5.x (中国开源)
- **路由**: React Router 7.x

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
quill-tutorial-react/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx          # 入口文件
│   ├── App.jsx           # 路由配置
│   ├── index.css         # 全局样式
│   ├── components/
│   │   └── Layout.jsx    # 布局组件
│   └── pages/
│       ├── HomePage.jsx          # 首页
│       ├── ArchitecturePage.jsx  # 架构解析
│       └── BuildPage.jsx         # 从零构建
└── public/
```

## 功能特性

### 架构解析
- Quill 核心架构图解
- Delta 格式详解
- Parchment 文档模型
- 模块系统介绍

### 从零构建
- Step-by-step 教程
- 代码高亮显示
- 交互式演示

## 组件库说明

使用 **Ant Design** 作为 UI 组件库，这是中国最流行的 React 组件库之一：

- 完善的中文文档
- 丰富的组件生态
- 优秀的 TypeScript 支持
- 活跃的社区维护

## 相关链接

- [Quill 官网](https://quilljs.com/)
- [Quill GitHub](https://github.com/slab/quill)
- [Ant Design](https://ant.design/)
- [Vite](https://cn.vite.dev/)
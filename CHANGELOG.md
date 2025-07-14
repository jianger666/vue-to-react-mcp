# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.5] - 2024-07-14

### Fixed
- 修复 GitHub Actions 中 pnpm 版本兼容性问题
- 解决 CI 环境中 lockfile 兼容性错误

### Changed
- GitHub Actions 中指定使用 pnpm 7.26.3 版本
- 优化 CI 构建流程，使用 `--no-frozen-lockfile` 参数

## [1.0.4] - 2024-07-14

### Fixed
- 修复 GitHub Actions 配置以支持 pnpm 项目
- 解决 `npm ci` 在 pnpm 项目中的兼容性问题

### Added
- 添加 pnpm 支持到 GitHub Actions workflow
- 改进自动发布流程

### Changed
- 将 CI 环境从 npm 迁移到 pnpm
- 更新 release 和 publish workflows

## [1.0.3] - 2024-07-14

### Added
- 更新版本号为自动发布流程
- 完善项目配置

### Changed
- 优化项目构建配置

## [1.0.2] - 2024-07-14

### Added
- 添加构建和开发脚本 (`build.js`, `dev.js`)
- 完善项目开发工具链

### Changed
- 更新 `.gitignore` 和 `.npmignore` 配置
- 改进项目构建流程

### Fixed
- 改进文件搜索逻辑和错误提示
- 优化错误处理机制

## [1.0.1] - 2024-07-14

### Added
- 改进文件操作和搜索功能
- 优化错误提示信息

### Fixed
- 修复文件搜索逻辑中的问题
- 改进错误处理和用户反馈

### Changed
- 优化代码结构和可维护性

## [1.0.0] - 2024-07-14

### Added
- 🎉 Vue to React MCP 服务器首次发布
- 🚀 基础页面迁移功能 (`migrate_page`)
- 📚 智能学习功能 (`learn_from_changes`)
- 🔄 任务续传功能 (`continue_migrate_page`)
- 💾 AI 基准版本保存 (`save_ai_baseline`)
- 📊 项目信息获取 (`get_from_application`)
- 📝 自动化 MIGRATION_GUIDE.md 维护
- 🛠️ 完善的文件操作工具
- 📋 Git 操作支持
- 📝 日志系统
- 💻 TypeScript 完整支持
- 🎯 命令行界面支持

### Features
- **智能迁移**: 自动分析 Vue 组件并生成 React 迁移计划
- **学习优化**: 从用户代码修改中学习最佳实践
- **任务管理**: 支持大型项目分阶段迁移
- **知识积累**: 持续维护迁移指南知识库
- **基准对比**: AI 基准版本保存和对比学习
- **MCP 集成**: 完整的 Model Context Protocol 支持

### Technical Details
- Node.js 18+ 支持
- TypeScript 5.3+ 支持
- MCP SDK 1.0.0 集成
- 自动化构建和发布流程
- 完善的错误处理和日志记录

[Unreleased]: https://github.com/jianger666/vue-to-react-mcp/compare/v1.0.5...HEAD
[1.0.5]: https://github.com/jianger666/vue-to-react-mcp/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/jianger666/vue-to-react-mcp/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/jianger666/vue-to-react-mcp/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/jianger666/vue-to-react-mcp/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/jianger666/vue-to-react-mcp/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/jianger666/vue-to-react-mcp/releases/tag/v1.0.0 
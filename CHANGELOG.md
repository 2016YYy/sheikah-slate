# 更新日志 · Changelog

本文件记录项目各版本的 notable changes，格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范，版本号遵循 [语义化版本（SemVer）](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

### Added

- **应用内更新下载**：发现新版本后可在应用内直接下载 APK，带实时进度条（百分比、已下载/总大小、下载速度）
- **后台下载**：下载状态由全局 Context 管理，关闭更新对话框或切换页面后下载仍在继续，顶部固定进度条始终可见
- **APK 安装**：下载完成后一键调用系统包安装器安装更新（基于 `@capacitor-community/file-opener`）
- **全局搜索命令面板**：`Cmd/Ctrl + K` 或点击头部搜索图标，跨武器/防具/神庙/怪物/材料/料理/任务全量搜索
- **首页搜索入口**：首页 Hero 区增加搜索框快捷入口
- **CSS 动效工具类**：新增 `bg-grid`、`animate-float`、`animate-pulse-slow`、`line-clamp-1/2`

### Changed

- **更新机制重构**：将原 AboutPage 内联的更新检查逻辑抽取为全局 `useUpdate` Hook，支持下载进度与安装
- **头部导航**：新增搜索按钮，关于按钮在小屏隐藏（底部导航已覆盖）
- **进度条组件**：顶部更新进度条与头部 sticky 定位联动，避免重叠

### Dependencies

- 新增 `@capacitor/filesystem` — 保存下载的 APK 到缓存目录
- 新增 `@capacitor-community/file-opener` — 调用系统安装器打开 APK
- 复用已有的 `cmdk` 实现全局命令面板

---

## [1.0.0] - 2026-10-15

首个正式发布版本。完整收录《塞尔达传说：旷野之息》图鉴与攻略数据，支持 Web 与 Android APK 两种产物。

### Added

- **图鉴数据库**：武器 131、防具 89、怪物 68、料理 94、材料 100
- **探索收集**：120 神庙 + 15 高塔 + 14 回忆 + 克洛格果实类型
- **任务攻略**：主线 15 + 神庙挑战 42 + 支线 76
- **攻略手册**：6 册（新手开局 / 生存机制 / 探索解谜 / 战斗进阶 / 资源赚钱 / DLC 指南）
- **打勾收集记录**：逐项打勾，`localStorage` 本地持久化
- **分类筛选与搜索**：全部 / 已获 / 未获切换、按类型与地区筛选、跨分类关键词搜索
- **收藏夹**：一键收藏，按分类聚合浏览
- **全进度统计**：环形总进度、分类进度条、高塔 / 回忆 / 克洛格 / 任务分项统计，支持「只看未完成」
- **应用内检查更新**：基于 GitHub Releases，可选联网功能，离线静默跳过
- **希卡风格 UI**：希卡蓝 + 圣三角金配色，自绘希卡符文图标与翻页动画，响应式适配移动端与桌面端
- **Web 构建与 GitHub Pages 自动部署**（`deploy.yml`）
- **Android APK 构建**：基于 Capacitor v8，推送 `v*` 标签自动出包并挂载到 Release（`build-apk.yml`）

### Changed

- 重构项目配置以匹配实际依赖（Vite + Tailwind 插件、npm install CI）

### Fixed

- 修正详情页、任务页与数据 Schema 的匹配
- 修正任务详情、攻略、进度页实现
- 修正收藏、关于、404 页实现
- 修正各页面与磁盘源数据的同步
- 修复 `@radix-ui/react-navigation-menu` 版本冲突（ETARGET）

### CI / Build

- CI 从 JSON 源数据生成 TS 数据模块（`scripts/gen_data.py`）
- CI Node 版本升至 22（Capacitor 8 要求）
- CI Java 版本升至 21（Capacitor 8 要求 VERSION_21）
- 移除损坏的 `setup-android` v3，改用预安装 SDK；`setup-java` 升至 v5
- 支持手动触发时通过 `release_tag` 输入将 APK 挂载到指定 Release

---

[Unreleased]: https://github.com/2016YYy/sheikah-slate/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/2016YYy/sheikah-slate/releases/tag/v1.0.0

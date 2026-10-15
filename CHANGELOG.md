# 更新日志 · Changelog

本文件记录项目各版本的 notable changes，格式遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范，版本号遵循 [语义化版本（SemVer）](https://semver.org/lang/zh-CN/)。

---

## [Unreleased]

<!-- 新增的变更请按以下分类记录，发版时移至对应版本条目 -->

### Added
<!-- 新功能 -->
- 暂无

### Changed
<!-- 对已有功能的变更 -->
- 暂无

### Fixed
<!-- 问题修复 -->
- 暂无

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

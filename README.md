# 希卡石板 · Sheikah Slate

> 《塞尔达传说：旷野之息》完全离线图鉴数据库与攻略助手

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-v1.0.0-22d3ee)
![Offline Ready](https://img.shields.io/badge/offline-ready-22d3ee)
![Stack](https://img.shields.io/badge/stack-React%20%2B%20Vite%20%2B%20Tailwind-3178c6)
![Android](https://img.shields.io/badge/android-Capacitor%20v8-3ddc84)

---

## 📖 项目简介

**希卡石板（Sheikah Slate）** 是一款面向《塞尔达传说：旷野之息》玩家的**完全离线**图鉴与攻略工具。灵感源自游戏中林克手中的希卡石板设备——本应用将其核心功能（图鉴、地图标记、任务追踪）以离线网页 / Android APK 的形式重现，让玩家在没有网络的环境下也能随时查阅攻略数据、记录收集进度。

### 命名由来

> **Sheikah Slate** 是《旷野之息》中希卡族（Sheikah）制造的古代平板设备，游戏开篇即由林克获得，用于查看地图、标记地点、解锁神庙与浏览图鉴。项目以此命名，既是对游戏的致敬，也直观表达了「随身携带的海拉鲁攻略手册」这一定位。

| 项目 | 命名 | 说明 |
| --- | --- | --- |
| 显示名称 | **希卡石板** | 应用内展示名，见 `capacitor.config.ts` 的 `appName` |
| 英文名称 | **Sheikah Slate** | 仓库与对外标识 |
| npm 包名 | `sheikah-slate` | `package.json` 中 `name` 字段（kebab-case） |
| Android 包名 | `com.sheikah.slate` | 反向域名格式，见 `capacitor.config.ts` 的 `appId` |
| 仓库地址 | `2016YYy/sheikah-slate` | GitHub 仓库 |

---

## ✨ 功能特性

- **完全离线运行** — 所有数据内嵌于应用中，不依赖任何网络请求、CDN 或在线资源，断网也能正常使用
- **打勾收集记录** — 武器 / 防具 / 神庙 / 任务 / 怪物 / 材料 / 料理逐项打勾，通过 `localStorage` 本地持久化保存进度
- **分类筛选与搜索** — 全部 / 已获 / 未获切换、按类型与地区筛选、跨分类关键词快速搜索
- **收藏夹** — 心仪条目一键收藏，按分类聚合浏览
- **全进度统计** — 环形总进度、分类进度条、高塔 / 回忆 / 克洛格果实 / 任务分项统计，支持「只看未完成」
- **应用内检查更新** — 基于 GitHub Releases，发现新版本时弹出更新提示（可选联网功能，离线时静默跳过）
- **希卡风格 UI** — 希卡蓝 + 圣三角金配色，自绘希卡符文图标与翻页动画，响应式适配移动端与桌面端

---

## 📚 数据内容

| 模块 | 数量 | 说明 |
| --- | --- | --- |
| 武器图鉴 | 131 | 近战 / 弓 / 盾：攻击、耐久、特殊属性、获取方式 |
| 防具图鉴 | 89 | 防御、效果、套装加成、强化材料、获取方式 |
| 怪物图鉴 | 68 | 血量、掉落物、出没地点、弱点 |
| 料理食谱 | 94 | 食材配方、回复效果、特殊加成 |
| 材料图鉴 | 100 | 来源、用途、售价 |
| 神庙探索 | 120 神庙 + 15 高塔 + 14 回忆 | 地区、试炼类型、奖励 |
| 任务攻略 | 主线 15 + 神庙挑战 42 + 支线 76 | NPC、地点、完成步骤、奖励 |
| 攻略手册 | 6 册 | 新手开局 / 生存机制 / 探索解谜 / 战斗进阶 / 资源赚钱 / DLC 指南 |

> 数据基于网络公开资料整理，详见 [免责声明](#-免责声明)。

---

## 🚀 快速开始

### 环境要求

- **Node.js** ≥ 22（Capacitor v8 要求，CI 使用 Node 22）
- **npm** ≥ 10
- **Python 3**（用于执行数据生成脚本 `scripts/gen_data.py`）
- **Java 21**（仅打包 Android APK 时需要，CI 使用 Temurin 21）

### 安装与开发

```bash
# 1. 安装依赖
npm install

# 2. 生成数据模块（将 data/*.json 转换为 src/data/*.ts）
python3 scripts/gen_data.py

# 3. 启动本地开发服务器
npm run dev

# 4. 生产构建
npm run build

# 5. 本地预览构建产物
npm run preview
```

构建产物输出至 `dist/`，可部署到任意静态托管服务（GitHub Pages、Vercel、Netlify 等）。

---

## 🧰 技术栈

| 类别 | 技术 | 版本 |
| --- | --- | --- |
| 框架 | React | 19 |
| 语言 | TypeScript | ~5.9 |
| 构建工具 | Vite | 6 |
| 样式 | Tailwind CSS | 4 |
| 路由 | React Router | 7 |
| 动画 | Framer Motion | 12 |
| 基础组件 | Radix UI | — |
| 通知 | Sonner | 2 |
| 移动端封装 | Capacitor | 8 |
| 图表 | ECharts | 6 |

---

## 🏗️ 构建说明

本项目支持两种产物：**Web 静态站点** 与 **Android APK**。

### 1. Web 构建（GitHub Pages）

CI 工作流 [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 在 `main` 分支推送或手动触发时自动执行：

1. `npm install` — 安装依赖
2. `python3 scripts/gen_data.py` — 从 JSON 源数据生成 TS 数据模块
3. `npm run build` — 执行 `tsc -b && vite build`，产物输出到 `dist/`
4. 上传 Pages 工件并部署

> `vite.config.ts` 中 `base: './'` 确保相对路径，兼容 GitHub Pages 子路径部署。

手动构建并部署到 Pages：

```bash
npm install
python3 scripts/gen_data.py
npm run build
# 将 dist/ 目录部署到你的静态托管服务
```

### 2. Android APK 构建

CI 工作流 [`.github/workflows/build-apk.yml`](.github/workflows/build-apk.yml) 负责打包 Android 调试版 APK。

**触发方式：**

- **推送 `v*` 标签**（如 `v1.0.1`）— 自动构建并挂载到对应 Release
- **Actions 页面手动触发** — 可填写 `release_tag` 将 APK 挂载到指定 Release，留空则仅产出工件

**构建步骤：**

1. 安装依赖并生成数据模块（同 Web）
2. `npm run build` 构建 Web 资源
3. `npx cap add android` — 添加 Android 平台
4. `npx cap sync android` — 同步 Web 资源到 Android 工程
5. `./gradlew assembleDebug` — 编译调试版 APK
6. 产物路径：`android/app/build/outputs/apk/debug/app-debug.apk`
7. 通过 `gh release upload` 挂载到对应 GitHub Release

**本地打包 APK：**

```bash
npm install
python3 scripts/gen_data.py
npm run build
npx cap add android      # 首次执行；已存在则用 npx cap sync android
npx cap sync android
cd android
./gradlew assembleDebug
# APK 位于 android/app/build/outputs/apk/debug/app-debug.apk
```

> 当前 CI 产出的是 **debug** 版 APK（未签名）。如需发布到应用商店，需配置签名并使用 `assembleRelease`。

---

## 📦 发布流程

本项目遵循 [语义化版本（SemVer）](https://semver.org/lang/zh-CN/) 与 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范。

### 版本号规则

| 版本位 | 含义 | 示例 |
| --- | --- | --- |
| MAJOR | 不兼容的 API 变更 | `1.0.0` → `2.0.0` |
| MINOR | 向后兼容的功能性新增 | `1.0.0` → `1.1.0` |
| PATCH | 向后兼容的问题修复 | `1.0.0` → `1.0.1` |

### 发布步骤

1. **更新版本号** — 修改 `package.json` 中的 `version` 字段
2. **更新 CHANGELOG** — 将 `## [Unreleased]` 下的内容移至新版本条目，标注发布日期
3. **提交代码** — 使用约定式提交：
   ```bash
   git add package.json CHANGELOG.md
   git commit -m "chore(release): v1.0.1"
   ```
4. **打标签并推送** — 触发 APK 构建并挂载到 Release：
   ```bash
   git tag -a v1.0.1 -m "release v1.0.1"
   git push origin main --tags
   ```
5. **等待 CI 完成** — `build-apk.yml` 自动构建 APK 并上传到 `v1.0.1` Release
6. **编写 Release Notes** — 在 GitHub Release 页面补充更新说明（可直接引用 CHANGELOG 内容）

> 推送 `v*` 标签后，CI 会自动将 `app-debug.apk` 挂载到对应 Release。应用内「检查更新」会读取该 Release 信息提示用户。

---

## 🔄 应用内检查更新

应用内置版本号（与 `package.json` 一致）。「关于」页点击「检查更新」会查询本仓库 GitHub Releases 的最新版本：

- **发现新版本** → 弹出更新提示（版本号 + 更新说明 + 跳转 GitHub 下载）
- **无网络或已是最新** → 静默提示，不影响离线使用

发布新版本时，为仓库创建带版本号的 Release（tag 如 `v1.0.1`）即可，无需改动代码。

---

## 📁 项目结构

```
sheikah-slate/
├── .github/workflows/     # CI 工作流（Pages 部署 + APK 构建）
├── data/                  # 源数据（JSON + Markdown）
│   ├── weapons.json
│   ├── armor.json
│   ├── monsters.json
│   ├── food.json
│   ├── collect.json
│   ├── quests.json
│   └── guides.md
├── scripts/
│   └── gen_data.py        # JSON → TS 数据模块生成脚本
├── src/
│   ├── components/        # UI 组件（含 ui/ 基础组件）
│   ├── hooks/             # 自定义 Hooks
│   ├── lib/               # 工具函数
│   ├── pages/             # 页面组件
│   ├── data/              # 生成的 TS 数据模块（勿手动编辑）
│   ├── app.tsx            # 路由配置
│   └── index.tsx          # 入口
├── public/                # 静态资源
├── capacitor.config.ts    # Capacitor 配置
├── vite.config.ts         # Vite 配置
└── package.json
```

---

## 🤝 贡献

欢迎提交 Issue 与 Pull Request！请先阅读 [贡献指南](CONTRIBUTING.md) 了解：

- 分支命名规范
- 约定式提交（Conventional Commits）规范
- 代码命名约定
- 数据纠错与功能建议的提交方式

### 贡献方向

- **数据纠错**：武器 / 防具 / 任务等数值如有出入，请提交 Issue 并说明来源
- **新功能**：搜索、筛选、导出、进度云同步等
- **样式优化**：希卡主题视觉打磨、动效改进
- **多语言**：英文 / 日文等国际化支持

---

## 📋 更新日志

完整变更记录见 [CHANGELOG.md](CHANGELOG.md)，遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范。

---

## ⚠️ 免责声明

本项目为**粉丝自制的非商业学习交流工具**（Fan-made / Unofficial），与任天堂（Nintendo）无任何关联，未经任天堂认可。

《塞尔达传说》《旷野之息》（The Legend of Zelda: Breath of the Wild）等商标，以及游戏内的名称、图像、地图、角色、音乐等所有素材的版权，均归任天堂及其版权所有者所有。

本应用内的攻略与图鉴数据基于网络公开资料自行整理，仅供参考；内容仅供个人学习交流使用，请支持正版游戏。如本应用内容涉及侵权，请联系维护者，我们将及时删除相关内容。

---

## 📄 License

本项目代码以 [MIT License](LICENSE) 开源。攻略与图鉴数据基于网络公开资料整理，仅供学习交流使用。

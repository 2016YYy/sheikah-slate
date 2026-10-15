# 贡献指南 · Contributing

感谢你对 **希卡石板（Sheikah Slate）** 的关注！本文档说明如何参与贡献，包括分支命名、提交规范、代码命名约定与提交流程。

---

## 📋 目录

- [行为准则](#行为准则)
- [分支命名规范](#分支命名规范)
- [提交信息规范（Conventional Commits）](#提交信息规范conventional-commits)
- [代码命名约定](#代码命名约定)
- [数据贡献规范](#数据贡献规范)
- [Pull Request 流程](#pull-request-流程)
- [本地开发](#本地开发)

---

## 行为准则

参与本项目即表示你同意：

- 保持友善与尊重，避免人身攻击
- 聚焦于技术与内容本身的讨论
- 本项目为非商业粉丝作品，请勿提交任何违反版权的内容

---

## 分支命名规范

分支名采用 `类型/简短描述` 的格式，全部小写，单词间用 `-` 连接：

```
<type>/<short-description>
```

| 类型 | 说明 | 示例 |
| --- | --- | --- |
| `feat` | 新功能 | `feat/add-export-progress` |
| `fix` | 修复问题 | `fix/weapon-durability-typo` |
| `docs` | 文档变更 | `docs/update-build-guide` |
| `style` | 代码格式（不影响逻辑） | `style/format-components` |
| `refactor` | 重构（不新增功能、不修 bug） | `refactor/extract-progress-hook` |
| `perf` | 性能优化 | `perf/lazy-load-guides` |
| `test` | 测试相关 | `test/add-progress-hook-tests` |
| `chore` | 构建 / 工具 / 依赖变更 | `chore/bump-vite` |
| `data` | 图鉴 / 攻略数据更新 | `data/correct-shrine-reward` |

**示例：**

```bash
git checkout -b feat/add-export-progress
git checkout -b fix/weapon-durability-typo
git checkout -b data/correct-shrine-reward
```

---

## 提交信息规范（Conventional Commits）

本项目遵循 [Conventional Commits 1.0.0](https://www.conventionalcommits.org/zh-hans/v1.0.0/) 规范。提交信息格式：

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### 类型（type）

| 类型 | 说明 | 对应 SemVer |
| --- | --- | --- |
| `feat` | 新功能 | MINOR |
| `fix` | 修复 bug | PATCH |
| `docs` | 仅文档变更 | — |
| `style` | 代码格式（空格、分号等，不影响逻辑） | — |
| `refactor` | 重构（既不新增功能也不修 bug） | — |
| `perf` | 性能优化 | PATCH |
| `test` | 新增或修正测试 | — |
| `build` | 构建系统或外部依赖变更 | — |
| `ci` | CI 配置变更 | — |
| `chore` | 其他不修改源码或测试的变更 | — |
| `revert` | 回滚提交 | — |

### 范围（scope，可选）

指明变更影响的模块，例如：

- `pages` — 页面组件
- `components` — UI 组件
- `data` — 数据或数据生成脚本
- `ci` — 持续集成
- `capacitor` — 移动端封装
- `release` — 版本发布

### 描述（description）

- 使用祈使句（如「fix」而非 「fixed」「fixes」）
- 结尾不加句号
- 中文项目可用中文描述，但 `type` 与 `scope` 必须使用英文

### 示例

```
feat(pages): add progress export to JSON
fix(ci): bump Node to 22 for Capacitor 8
data(correct): fix 大师之剑 attack value to 30
docs(readme): add Android build instructions
chore(release): v1.0.1
```

### 破坏性变更（BREAKING CHANGE）

在提交信息正文或页脚添加 `BREAKING CHANGE:` 前缀，并说明变更内容与迁移方式，对应 MAJOR 版本号：

```
feat!: change progress storage from localStorage to IndexedDB

BREAKING CHANGE: progress data is no longer stored in localStorage.
Users must re-enter their collection progress.
```

---

## 代码命名约定

### 通用原则

- **一致性优先**：遵循项目现有风格
- **语义清晰**：命名应能自解释，避免无意义缩写（`btn` → `button`，除非是行业通用缩写如 `url`、`id`、`api`）
- **避免保留字**：不使用 `class`、`default` 等保留字作为标识符

### 文件与目录

| 类型 | 规则 | 示例 |
| --- | --- | --- |
| 组件文件 | PascalCase | `SheikahHeader.tsx` |
| 页面目录 | PascalCase | `HomePage/` |
| 普通工具文件 | kebab-case 或 camelCase | `use-progress.ts`、`utils.ts` |
| 样式文件 | kebab-case | `tailwind-theme.css` |
| 数据 JSON | kebab-case 或小写 | `weapons.json` |

### TypeScript / React

| 元素 | 规则 | 示例 |
| --- | --- | --- |
| 组件 | PascalCase | `function HomePage() {}` |
| 自定义 Hook | `use` 前缀 + camelCase | `useProgress()` |
| 工具函数 | camelCase | `formatNumber()` |
| 常量 | UPPER_SNAKE_CASE | `MAX_DURABILITY` |
| 类型 / 接口 | PascalCase（接口不加 `I` 前缀） | `interface WeaponItem` |
| 枚举 | PascalCase | `enum QuestType` |
| 事件处理函数 | `on` 前缀 | `onClickSave()` |
| 布尔变量 | `is` / `has` / `should` 前缀 | `isCompleted` |

### CSS / Tailwind

- 自定义 CSS 类使用 kebab-case：`.sheikah-card`
- Tailwind 工具类按官方顺序书写
- 希卡主题色变量定义在 `tailwind-theme.css` 中，复用而非硬编码

### 数据命名（JSON 源文件）

- 字段名使用英文 snake_case，与游戏数据对应：`atk`、`def`、`dur`、`obtain`
- 数值统一使用数字类型，描述性文本使用字符串
- 新增条目需保持与现有条目字段一致

---

## 数据贡献规范

图鉴与攻略数据存放在 `data/` 目录，由 `scripts/gen_data.py` 生成 `src/data/*.ts`。

### 修改数据的步骤

1. 修改 `data/` 下对应的 JSON 或 Markdown 文件
2. 运行 `python3 scripts/gen_data.py` 重新生成 TS 模块
3. 运行 `npm run dev` 验证数据展示正确
4. 提交时使用 `data` 类型：
   ```
   data(correct): fix 大师之剑 attack value from 20 to 30
   ```

### 数据纠错

如发现武器、防具、任务等数值有误，请：

- 在 Issue 中说明**条目名称**、**错误值**、**正确值**及**来源链接**
- 或直接提交 PR 修改对应 JSON 文件

---

## Pull Request 流程

1. **Fork 仓库** 并创建分支（遵循 [分支命名规范](#分支命名规范)）
2. **本地开发**，确保 `npm run build` 通过
3. **提交信息** 遵循 [Conventional Commits](#提交信息规范conventional-commits)
4. **推送分支** 并在 GitHub 发起 Pull Request
5. **PR 描述** 需说明：
   - 变更目的（解决什么问题 / 新增什么功能）
   - 变更内容摘要
   - 测试方式（如何验证变更有效）
   - 是否涉及破坏性变更
6. 等待维护者 Review，根据反馈修改后合并

### PR 标题

PR 标题同样遵循 Conventional Commits 格式：

```
feat(pages): add progress export feature
fix(data): correct 大师之剑 attack value
```

---

## 本地开发

### 环境要求

- Node.js ≥ 22
- Python 3
- （可选）Java 21，用于本地打包 Android APK

### 启动

```bash
npm install
python3 scripts/gen_data.py
npm run dev
```

### 常用命令

```bash
npm run dev        # 开发服务器
npm run build      # 类型检查 + 生产构建
npm run preview    # 预览构建产物
npm run lint       # ESLint 检查
```

### 提交前检查清单

- [ ] `npm run build` 通过（无 TS 错误）
- [ ] `npm run lint` 无报错
- [ ] 如修改了 `data/`，已重新运行 `gen_data.py`
- [ ] 提交信息符合 Conventional Commits 规范
- [ ] 分支名符合命名规范

---

如有疑问，欢迎在 [Issues](https://github.com/2016YYy/sheikah-slate/issues) 中讨论。

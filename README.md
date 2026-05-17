<div align="center">

<img src="favicon.png" alt="Heart Of Galaxy: Horizons" width="96" />

# Heart Of Galaxy: Horizons

**星系核心：地平线** — 一款基于浏览器的大型太空殖民放置/策略游戏的工程化重构与维护仓库。

[![CI](https://github.com/wjsoj/Heart-Of-Galaxy-Horizon/actions/workflows/ci.yml/badge.svg)](https://github.com/wjsoj/Heart-Of-Galaxy-Horizon/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-4-6e9f18?logo=vitest&logoColor=white)](https://vitest.dev/)
[![Bun](https://img.shields.io/badge/Bun-1.3-fbf0df?logo=bun&logoColor=black)](https://bun.sh/)

</div>

> [!NOTE]
> **来源参考**：游戏原始作品来自 [likexia.gitee.io/xxhx](http://likexia.gitee.io/xxhx)（作者 Cheslava）。  
> 本仓库在保留原始游戏玩法的前提下，重建工程基础设施、引入测试体系，并将其改造为可持续维护的现代前端项目。

---

## 概览

经典的浏览器太空 4X 游戏 _Heart Of Galaxy: Horizons_ 早期以单文件压缩形式发布——一个 ~14k 行的 `sall.js` 承担了几乎所有逻辑，没有模块边界、没有构建链路、没有测试。本仓库在 **不改动核心玩法与游戏逻辑** 的硬约束下，逐步把它改造为可读、可测、可演进的现代代码库：

- **可读** — 全部源文件经 Prettier 格式化，并通过 AST 等价工具证明语义未变。
- **可测** — Vitest + jsdom 守护关键模块（cfg 加载、i18n 字典、工具函数）。
- **可演进** — 新增 `src/` 现代化层（ES Modules + TypeScript），与遗留全局变量并存，逐步迁移。
- **CI 守护** — GitHub Actions 跑全流程：format / lint / typecheck / test / build。

## 技术栈

| 范畴            | 选择                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------- |
| 包管理 / 运行时 | [Bun](https://bun.sh) ≥ 1.3（兼容 Node ≥ 20）                                             |
| 构建            | [Vite 5](https://vitejs.dev/)（MPA 模式 + 自定义中间件）                                  |
| 类型            | [TypeScript 5.6](https://www.typescriptlang.org/)（`allowJs` + `checkJs:false` 渐进迁移） |
| 测试            | [Vitest 4](https://vitest.dev/) + [jsdom](https://github.com/jsdom/jsdom)                 |
| 风格            | Prettier + ESLint（含 typescript-eslint）                                                 |
| AST 工具        | [acorn](https://github.com/acornjs/acorn) — 用于证明改动语义等价                          |

## 快速开始

```bash
bun install
bun run dev        # http://localhost:5173
```

构建：

```bash
bun run build      # 产物在 dist/，含 vite 产物 + 复制后的遗留资源
bun run preview    # 预览构建产物
```

> [!TIP]
> 若没有安装 Bun，可使用 `npm install && npm run dev`，所有脚本通过 `package.json` 暴露。

## 可用脚本

| 脚本                      | 说明                                              |
| ------------------------- | ------------------------------------------------- |
| `dev`                     | 启动 Vite 开发服务器                              |
| `build`                   | 生产构建 + 复制遗留静态资源                       |
| `preview`                 | 本地预览构建产物                                  |
| `format` / `format:check` | Prettier 格式化 / 校验                            |
| `lint` / `lint:fix`       | ESLint 检查 / 自动修复                            |
| `typecheck`               | `tsc --noEmit` 全量类型检查                       |
| `test` / `test:watch`     | Vitest 单次 / 监听模式                            |
| `verify-format`           | 校验两份 JS 是否 AST 等价（重格式化安全网）       |
| `i18n:split`              | 从 `zh/core.js` 抽取字典到 `locales/zh-CN/*.json` |
| `i18n:scan`               | 扫描 `sall.js` 中候选的英文 UI 字符串             |

## 工程结构

```
index.html                  入口：jquery → cfg.js → sall.js → zh/core.js → src/main.ts
core/
  script/
    cfg.js                  游戏静态配置（资源 / 星球 / 舰船 / 神器定义）
    sall.js                 游戏主逻辑（主循环 / UI / 存档 / 战斗）
    change_log.js           更新日志
    jquery.min.js           第三方依赖（不格式化）
    malihu/                 第三方滚动条插件
  style/                    CSS 与字体
zh/core.js                  运行时词典 cnItems（仍为权威来源）
locales/zh-CN/*.json        结构化词典（按 settings / ships / planets / ... 分节）
src/                        现代化层（ES Modules + TypeScript）
  types/globals.d.ts        遗留全局变量的环境类型声明
  utils/                    纯函数工具
  i18n/loader.ts            首个 TS 模块：从 JSON 增量合并到 cnItems
  main.ts                   ESM 入口（<script type="module">）
scripts/                    构建与维护脚本
  verify-ast-equiv.mjs      acorn AST 等价校验
  split-locales.mjs         词典提取
  find-untranslated.mjs     扫描漏译候选
  copy-legacy-assets.mjs    build 后同步遗留静态目录到 dist/
tests/                      Vitest（utils / smoke / i18n）
.github/workflows/ci.yml    全流程 CI
```

## 重构原则

1. **任何改动都不得影响游戏的核心玩法与逻辑。**
2. 涉及 `cfg.js` / `sall.js` / `zh/core.js` 的结构性改动 **必须** 用 `scripts/verify-ast-equiv.mjs` 证明 AST 等价；无法机械证明时需要在浏览器中冒烟测试。
3. 优先选择 **可机械验证** 的改动：格式化、提取常量、迁移到 JSON、并行新建 `src/` 模块。避免一次性大重写。
4. 第三方文件（jQuery、malihu 等）保持原样，不格式化、不进入语言统计。
5. 新增 `src/` 模块需附带 Vitest 测试；新增脚本亦同。

### 校验 AST 等价

```bash
cp core/script/sall.js /tmp/sall.bak.js
# ... 做你的改动 ...
bun run verify-format /tmp/sall.bak.js core/script/sall.js
```

> [!IMPORTANT]
> 这是改动遗留压缩 JS 文件时的关键安全网——即便代码从 14k 行 (压缩) 变成 21k 行 (格式化)，只要 AST 等价就保证运行时行为不变。

## 路线图

- [x] **Phase 1 — 工程地基** Bun + Prettier + ESLint + TypeScript + Vite；把 `cfg.js` / `sall.js` 从压缩单行格式化为可读多行（AST 等价已证明）
- [x] **Phase 2 — 现代化骨架** 搭建 `src/`（types / utils / i18n / main），引入 Vitest + jsdom，写 cfg.js 加载冒烟测试
- [x] **Phase 3 — 数据结构化** 把运行时词典拆为 `locales/zh-CN/*.json`（按主题分节），扫描器辅助查漏
- [x] **Phase 4 — 首个 TS 模块** `src/i18n/loader.ts` 在启动时增量合并 JSON 到 `cnItems`；CI 全流程绿
- [ ] 把 `cfg.js` 的各类 `*Definition` 抽到 `src/data/*.ts`，让 TS 数据模块成为权威，回写 cfg.js 保持向后兼容
- [ ] 按主题切分 `sall.js`（存档 / 战斗 / UI / 主循环 / 探索）
- [ ] 增量替换 jQuery DOM 操作为原生或框架方案
- [ ] `zh/core.js` 改为薄壳，仅调用 `loadLocale`，JSON 成为词典真源

## 致谢

- 游戏原作者：**Cheslava** — [likexia.gitee.io/xxhx](http://likexia.gitee.io/xxhx)
- 本仓库工程化与维护由社区贡献者持续推进

# `src/` — 现代化代码层

本目录与遗留代码 (`core/script/sall.js`, `core/script/cfg.js`, `zh/core.js`) **并行存在**。

## 设计原则

1. **不破坏现有运行时**。遗留代码继续以 `<script>` 形式在 `index.html` 中按顺序加载。
2. `src/` 下的代码以 ES Modules 形式存在，通过 vite 打包，可逐步用 TypeScript 重写。
3. 新代码通过**显式读取/写入 `window` 上的全局对象**与遗留代码交互，由 `src/types/globals.d.ts` 提供类型。
4. 每加入一个 `src/` 模块，都应附带 vitest 单元测试。

## 目录

| 路径          | 用途                                                                |
| ------------- | ------------------------------------------------------------------- |
| `src/types/`  | 全局类型声明（`globals.d.ts`），描述 `window.game` 等遗留对象的形状 |
| `src/utils/`  | 纯函数工具（格式化、数学等），无外部依赖                            |
| `src/data/`   | 未来从 `cfg.js` 抽出的结构化游戏数据                                |
| `src/i18n/`   | 汉化加载与查询                                                      |
| `src/main.ts` | ES 模块入口（被 `index.html` 通过 `<script type="module">` 加载）   |

## 迁移路径

```
[遗留]  index.html
  ├─ jquery.min.js
  ├─ change_log.js
  ├─ cfg.js                ← 现有全局数据
  ├─ sall.js               ← 现有游戏逻辑
  └─ zh/core.js            ← 汉化字典

[新增]  index.html  (尾部追加)
  └─ <script type="module" src="/src/main.ts">
       ↓
       src/i18n/loader.ts  ← 从 locales/*.json 增量补充 cnItems
       src/utils/...       ← 工具函数（先由新代码使用）
       src/data/...        ← 未来抽离的数据
```

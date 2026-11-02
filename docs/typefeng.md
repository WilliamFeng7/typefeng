# TypeFeng 修改说明

本仓库 fork 自 [Open-Less/openless](https://github.com/Open-Less/openless)（AGPL-3.0），
基线提交 `defd6924d9fd634c64acb5e8c78fb8c785e304af`（v2.0.2-Beta.3）。

## 品牌

| 项目 | 上游 | TypeFeng |
| --- | --- | --- |
| 应用名 | OpenLess | TypeFeng |
| Bundle ID | com.openless.app | top.typefeng.desktop |
| 版本 | 2.0.2-Beta.3 | 1.1.0 |
| 图标 | OpenLess | TypeFeng（重新生成） |
| 窗口/托盘/权限文案 | OpenLess | TypeFeng |

替换范围：`openless-all/app/src` 与 `src-tauri/src` 中所有用户可见的 `OpenLess`
字面量（约 610 处、66 个文件），保留了 Rust 类型名（`OpenLessBackend` 等）与
组件名（`OpenLessCapsule` 等），以降低与上游合并的成本。

## 行为变更

- **自动更新关闭**：`src/lib/platform.ts` 中桌面端 `supportsAutoUpdate` 强制为 false；
  `src-tauri/tauri.conf.json` 移除了上游 `plugins.updater` 端点。
- **社区入口移除**：`AboutSection` 删除 QQ 群入口，GitHub/文档/反馈改为本仓库；
  新增「上游项目」署名。
- **关闭上游 CI**：删除 `OpenLess` 专用 workflows，新增 `build-macos.yml`。

## 未改动

- `openless-core`、`openless-capsule`、`micyou-*` 等 crate 名称与目录；
- Android / iOS / Linux / Windows 目标；
- 上游本地 ASR、云端 ASR、风格包、词典、历史等核心逻辑。

## 构建

```bash
cd openless-all/app
npm ci
npm run build
npm run tauri -- build --ci --config src-tauri/tauri.macos.conf.json -- --locked
```

Rust 1.99+、Node 22+、macOS 14+、Xcode Command Line Tools。

## 许可

AGPL-3.0。分发二进制时必须一并提供本仓库源码并保留 LICENSE/NOTICE。

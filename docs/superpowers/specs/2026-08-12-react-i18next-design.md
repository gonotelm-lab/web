# react-i18next 全量 UI 文案多语言

## 决策

- 库：`i18next` + `react-i18next` + `i18next-browser-languagedetector`
- 语言：`zh`（默认）+ `en`
- 结构：按域命名空间 `common` / `home` / `workspace` / `studio` / `sources` / `chat`
- 路由：无 locale URL 前缀
- 切换器：本阶段不做 UI；`localStorage` 键 `gonotelm.locale`
- 范围：全部 UI 壳文案；用户笔记/来源正文不翻译
- fallback：`fallbackLng: 'zh'`

## 目录

- `src/i18n/index.ts` — 初始化
- `src/locales/{zh,en}/*.json` — 文案

## 非组件用法

纯 TS helper / API 错误用 `i18n.t('ns:key', { ... })`。

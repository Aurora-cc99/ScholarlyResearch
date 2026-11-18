# ScholarlyResearch · 学者论文与开源资源库

面向脑电解码、情感智能、类脑计算、多模态基础模型、强化学习与智能计算系统的**学者论文与开源代码 / 数据集 / 模型权重检索库**（涵盖潘纲、黄铁军、陈云霁、吕宝粮、梁臻等 5 位全历史基线学者及 150 位相关领域核验学者）。

## 在线访问入口（GitHub Pages）

- **主检索门户（推荐）**：[学者论文资源检索.html](https://aurora-cc99.github.io/ScholarlyResearch/%E5%AD%A6%E8%80%85%E8%AE%BA%E6%96%87%E8%B5%84%E6%BA%90%E6%A3%80%E7%B4%A2.html)（或直接访问站点根路径 [https://aurora-cc99.github.io/ScholarlyResearch/](https://aurora-cc99.github.io/ScholarlyResearch/)）
- **数据集总览**：[学者论文资源检索.html#datasets](https://aurora-cc99.github.io/ScholarlyResearch/%E5%AD%A6%E8%80%85%E8%AE%BA%E6%96%87%E8%B5%84%E6%BA%90%E6%A3%80%E7%B4%A2.html#datasets)
- **开源代码 / 数据 / 模型**：[学者论文资源检索.html#resources](https://aurora-cc99.github.io/ScholarlyResearch/%E5%AD%A6%E8%80%85%E8%AE%BA%E6%96%87%E8%B5%84%E6%BA%90%E6%A3%80%E7%B4%A2.html#resources)
- **学者总导航文档**：[README_总导航.md](README_总导航.md) · [在线排版阅读](https://aurora-cc99.github.io/ScholarlyResearch/%E6%96%87%E6%A1%A3%E6%B5%8F%E8%A7%88.html?doc=README_%E6%80%BB%E5%AF%BC%E8%88%AA.md)

## 核心功能

1. **中英文全文段毫秒级检索**：支持按学者、学者内研究主类、辅助主题标签、起止年份、开源资源可用性（代码 / 数据集 / 模型权重）多维组合筛选与排序，并提供高频分类提示词面板与交互式年份分布图。
2. **规范化数据集总览与反向索引**：自动对跨论文引用的开源数据集去重聚合，展示数据集下载/申请入口，并反向列出使用该数据集的全部论文。
3. **双模式零依赖运行**：既可通过 GitHub Pages 在线高速访问，也可在本地直接双击打开 `学者论文资源检索.html` 离线检索（无需启动后端服务）。

## 目录结构

- `学者论文资源检索.html` / `index.html`：交互式主检索页面（支持中英文题名与摘要检索、年份柱状图筛选与卡片内双语摘要展开）
- `论文详情.html` / `数据集详情.html` / `文档浏览.html`：论文完整信息与双语摘要页、规范化数据集详情页与 Markdown 在线阅读页
- `data/db-meta.js` / `data/papers-*.js` / `data/abstracts/bucket-*.js`：自动分片前端数据库（单文件均 `< 15 MB`，同时支持 GitHub Pages 在线高速并发加载与本地 `file://` 离线无服务运行）
- `app-common.js` / `docs-bundle.js`：前端公共索引、分片按需加载器与文档离线包
- `学者总库.json` / `收集统计.json`：结构化全量数据与统计快照
- `全部论文总表.csv` / `全部资源总表.csv` / `论文资源关联总表.csv`：可直接用 Excel / Python 分析的总表（UTF-8 BOM）
- `潘纲_Gang_Pan/`、`黄铁军_Tiejun_Huang/`、`陈云霁_Yunji_Chen/`、`吕宝粮_BaoLiang_Lu/`、`梁臻_Zhen_Liang/` 及 `主题_*/`：全部 155 位学者的全历史书目（Markdown / CSV / JSON / BibTeX，含双语题名与摘要）与开源资源档案

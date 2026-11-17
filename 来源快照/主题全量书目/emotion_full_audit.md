# 情感方向新增学者全量书目抓取审计

日期：2026-11-14。本轮按OpenAlex作者簇抓取候选学者书目，形成 **901 条候选书目记录、5 条资源记录**。文件：`emotion_full.json`、`emotion_full.csv`。

## 本轮已抓取

- `xiongkuo_min`：200 条
- `zheng_lian`：94 条
- `jianhua_tao`：200 条
- `mang_ye`：200 条
- `zhiqi_cheng`：87 条
- `sahand_sabour`：18 条
- `he_hu`：69 条
- `licai_sun`：33 条

## 可直接进入下一阶段人工复核的学者

- 闵雄阔（Xiongkuo Min）：上海交通大学官方个人主页可核验；OpenAlex返回424条，当前拉取前200条，需继续cursor分页。
- 连政（Zheng Lian）：同济大学官方主页可核验；OpenAlex 94条，需检查作者簇是否包含同名青岛大学记录。
- 陶建华（Jianhua Tao）：清华官方主页可核验；OpenAlex 525条，当前拉取前200条，需按作者和单位审计。
- Mang Ye：DBLP/OpenAlex作者簇可核验，单位和中文名仍需补官方主页。
- Zhi-Qi Cheng：华盛顿大学官方目录可核验，87条。

## 暂不能直接并入正式主库

- Lancheng Gao、Sahand Sabour、He Hu、Licai Sun等记录目前缺少完整的机构/作者身份确认或作者簇信息，需要逐人确认。
- 赵国英、刘鑫、郝飞、罗萌、陈玉艳、蒋冬梅未找到足够可靠的唯一OpenAlex作者ID，本轮保留在候选筛选文件，不伪造全量书目。

## 字段和质量限制

- OpenAlex记录包含英文题目、年份、venue、作者、DOI（若有）、论文URL、PDF URL和OpenAlex ID；`record_id`使用学者ID+OpenAlex工作ID哈希。
- 已复用现有中文翻译缓存；未命中的论文暂保留英文题名并标记“中文辅助翻译待补”，不能当作正式中文题名。
- `xiongkuo_min`、`jianhua_tao`、`mang_ye`分别超过200条，当前仅拉取前200条；后续需要cursor分页补全。
- 论文版本暂未按DOI/标题跨学者全局去重，正式并库前需先规范化DOI、DBLP键和标题。
- 代码/数据资源仅绑定已核验项目（EEmo-Bench、EIBench、EmoBench、EmoBench-M）；不得把作者全部OpenAlex论文自动标记为开源。
- 当前输出为候选全量书目包，未修改现有五位学者主库和主构建器。
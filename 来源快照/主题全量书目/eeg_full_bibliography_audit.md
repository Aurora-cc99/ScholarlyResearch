# 脑电方向新增学者全量书目抓取审计

日期：2026-11-14。范围覆盖用户点名的脑电情感计算、脑电基础模型、脑电情感大模型及2025-2026代表团队。输出 `eeg_full.json` 和 `eeg_full.csv`；本轮不修改现有五位学者主库。

本轮记录数：385；其中OpenAlex作者作品记录与官方论文级人工补录并存。去重键为候选ID+DOI，缺DOI时使用OpenAlex work ID，仍无键时用规范化题名/年份。

## 作者记录统计

|候选|来源记录数|身份状态|处理建议|
|---|---:|---|---|
|fei_ma|1|论文级人工记录/待身份核验|先完成机构、邮箱、ORCID/DBLP核验，再扩展全历史书目|
|giulia_lioi|61|OpenAlex候选作者ID|可进入下一轮题名翻译、代码/数据资源匹配和分类|
|junjie_yu|1|论文级人工记录/待身份核验|先完成机构、邮箱、ORCID/DBLP核验，再扩展全历史书目|
|karim_jerbi|196|OpenAlex候选作者ID|可进入下一轮题名翻译、代码/数据资源匹配和分类|
|qinfan_xiao|1|论文级人工记录/待身份核验|先完成机构、邮箱、ORCID/DBLP核验，再扩展全历史书目|
|qingzhu_zhang|1|论文级人工记录/待身份核验|先完成机构、邮箱、ORCID/DBLP核验，再扩展全历史书目|
|quanying_liu|1|OpenAlex候选作者ID|可进入下一轮题名翻译、代码/数据资源匹配和分类|
|tongtian_yue|22|OpenAlex候选作者ID|可进入下一轮题名翻译、代码/数据资源匹配和分类|
|wei_bang_jiang|22|OpenAlex候选作者ID|可进入下一轮题名翻译、代码/数据资源匹配和分类|
|xinke_shen|33|OpenAlex候选作者ID|可进入下一轮题名翻译、代码/数据资源匹配和分类|
|yassine_el_ouahidi|23|OpenAlex候选作者ID|可进入下一轮题名翻译、代码/数据资源匹配和分类|
|yifan_xie|1|论文级人工记录/待身份核验|先完成机构、邮箱、ORCID/DBLP核验，再扩展全历史书目|
|zheng_wenming|20|OpenAlex候选作者ID|可进入下一轮题名翻译、代码/数据资源匹配和分类|
|zihan_deng|1|论文级人工记录/待身份核验|先完成机构、邮箱、ORCID/DBLP核验，再扩展全历史书目|
|ziling_lu|1|论文级人工记录/待身份核验|先完成机构、邮箱、ORCID/DBLP核验，再扩展全历史书目|

## 当前安全纳入边界

- OpenAlex作者作品可以安全作为“发现和书目候选”，但不能仅凭姓名自动合并到生产库；作者身份需要机构、ORCID、共同作者和题名方向共同确认。
- mdJPT、BrainOmni、E²-LLM、FAME、OmniEEG-Bench等官方论文级记录包含中英文题名、年份、venue、作者和稳定论文链接；mdJPT、BrainOmni的官方GitHub已写入代码字段。
- OpenAlex记录的中文题名暂为空，下一步用现有翻译规则补齐；翻译不替代英文原题。
- 数据集/模型资源不从OpenAlex推断；仅收录论文或官方README明确给出的代码、模型和申请入口。

## 同名与重复风险

- 陈俊龙、张通：OpenAlex同名结果高度混杂，本轮不生成全历史假书目；需要华南理工发表页、DBLP或ORCID定向抓取。
- 肖勤凡、张超、卢子凌、马飞、谢一帆、俞俊杰、邓子涵、张庆翥：当前以论文级记录为主，未把姓名搜索排名当作身份确认。
- 刘泉影在mdJPT和OmniEEG-Bench中出现，应合并同一候选；现有吕宝粮/潘纲的NeuroLM/CBraMod等项目应通过DOI和作者关联去重。
- REVE团队三位作者分别有OpenAlex候选ID，但仍需检查其机构历史和个人主页；不要把合作团队合并成一位学者。

## 下一步并库顺序

1. 先对OpenAlex候选中有明确机构/ORCID的郑文明、沈新科、岳通天、姜维邦、Yassine El Ouahidi、Giulia Lioi、Karim Jerbi做论文题名翻译和资源匹配。
2. 对mdJPT、BrainOmni、E²-LLM、FAME、OmniEEG-Bench做官方代码/模型/数据访问核验。
3. 对陈俊龙、张通和论文级候选使用学校发表页、DBLP/OpenAlex精确机构过滤，再建立正式学者目录。
4. 完成身份核验后，才把这些记录转入生产库并按学者内部主类别分类；当前JSON/CSV是隔离候选层。

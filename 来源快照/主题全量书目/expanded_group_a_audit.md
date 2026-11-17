# Group A 扩展审计（2026-11-14）

## 胡斌

- Crossref ORCID：`0000-0003-3514-5413`。
- ORCID过滤结果：394 条，去重后保留 394 条。
- 身份来源：[北京理工大学主页](https://smt.bit.edu.cn/szdw/jsml/bssds/5df20d21793e4e408b23d94848d05836.htm)、[IEEE作者页](https://ieeexplore.ieee.org/author/37307887900)、[ORCID](https://orcid.org/0000-0003-3514-5413)。IEEE页面显示434条公开记录；学校公开团队材料给出500余篇，但两者统计口径不同。
- 每条保留DOI、论文URL、Crossref author list和中文辅助译名。
- 2027年卷期记录按Crossref原值保留，未擅自改成年份。

## 高小榕、王毅军

- 已在 `crossref_eeg_expansion.json` 中接入ORCID精确记录：高小榕46条、王毅军57条。
- 高小榕清华英文主页明确列出代表论文并说明已发表200余篇；ResearchGate公开页显示399条、ScienceDirect/Scopus页显示315条。
- 王毅军作者目录和CSAuthors页显示至少90条；其ORCID Crossref包暂保留57条。
- 因姓名同名和数据库收录差异，未将仅凭姓名检索得到的同名记录直接并入主库。

## 约束

- 该包是可核验的ORCID批量书目，不应在页面上标注为“终身全集”。无法消歧的Google Scholar/ResearchGate条目只写入审计，不进入身份判断。

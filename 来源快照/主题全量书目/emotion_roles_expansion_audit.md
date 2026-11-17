# 情感角色扩展包审计（2026-11-14）

## 输出范围

本包对应 `emotion_roles_expansion.json`，供主构建脚本合并使用。傅小兰、徐睿峰、蒋冬梅、孙晓沿用已有作者/机构目录记录（分别 40、143、12、30 条），此次重点核验机构、职称、现任/曾任关系并补充官方身份来源。黄民烈从清华大学交互式人工智能课题组（CoAI）个人主页的 `Selected Publications` 区块解析，抓取 228 条页面列出的作者、题名、年份、会议/期刊和页面公开链接，其中 2025--2026 年条目 40 条（2026 年 18 条、2025 年 22 条；页面中 2 条未重复打印年份，依据相邻年度分组补全并在 JSON 记录中注明）。

`Selected Publications` 是作者主页的精选目录，不应被解释为黄民烈全部历史发表；没有页面链接或 DOI 的条目不做外部推断，`detail_links` 保留原页面公开的 pdf、arXiv、ACL、会议或 GitHub 链接，缺失时回退到个人主页并在记录中保留审计说明。

## 身份与头衔更正

### 傅小兰（Xiaolan Fu）

- 核验身份：上海交通大学心理学院院长、教授、博士生导师；中国科学院心理研究所原所长、研究员；中国科学院大学心理学系教授/博导。
- 采用证据：[上海交通大学心理学院领导页](https://psychology.sjtu.edu.cn/xyld.html)、[傅小兰上海交大个人页](https://psychology.sjtu.edu.cn/tsml/91.html)、[UCAS个人页](https://people.ucas.ac.cn/~fu)、[中科院心理所2024任免通知](https://psych.cas.cn/news/zhxw/202401/t20240130_6980665.html)。
- 更正：CAS 官方通知明确 2024-01-29 起不再担任心理所所长，因此“现任中科院心理所所长”应改为“原所长”；当前行政职务采用上海交大心理学院官方领导页。
- 论文：继承现有官方 SJTU/UCAS 目录 40 条；本补充包不把“40条”宣称为其全部历史发表。

### 徐睿峰（Ruifeng Xu）

- 核验身份：哈尔滨工业大学（深圳）智能学部副主任、智能科学与工程学院长聘教授、博士生导师；研究方向含自然语言处理、情感计算、大模型与智能体、社交媒体挖掘。
- 采用证据：[哈工大教师个人主页](https://homepage.hit.edu.cn/xuruifeng)、[哈工大（深圳）合作导师资料](https://www.hitsz.edu.cn/UserFiles/editor/file/20240201/1706792701873048973.pdf)、[ACL Anthology作者页](https://aclanthology.org/people/ruifeng-xu/)、[ORCID](https://orcid.org/0000-0002-4009-5679)。
- 更正：以哈工大个人主页（更新 2026-08-22）为准，采用“智能学部副主任、长聘教授、博导”；不写成未经官方页支持的院长等职务。
- 论文：继承 ACL Anthology 作者目录 143 条；该数为作者页可见目录覆盖，不保证涵盖所有未被 ACL Anthology 收录的期刊/会议。

### 蒋冬梅（Dongmei Jiang）

- 核验身份：西北工业大学计算机学院/计算机信息工程系教授；鹏城实验室导师（PCL 官方导师名录）。
- 采用证据：[西北工业大学教师页面](https://jsj.nwpu.edu.cn/enweb/FACULTY/Department_of_Computer_Information_Engineering.htm)、[PCL导师名录PDF](https://www.sustech.edu.cn/uploads/2024/04/20240430/17144649676465.pdf)、[DBLP作者页](https://dblp.org/pid/47/1926.html)、[AIS导师页](https://www.ais.cn/mentor/mentorDetail/1c553246-50cd-11eb-94db-a85e45a23623)。
- 更正：当前公开材料支持“西北工业大学教授”和“鹏城实验室导师”；未找到足够官方个人职称证据确认“鹏城实验室首席研究员”，该说法在包中保留为待核查声明。
- 论文：继承已有 DBLP/机构页筛选记录 12 条，主题覆盖视听/语音情感识别与多模态情感计算。
- AVEC 2015/2016 蝉联冠军：用户提供的说法暂列 `reported_claims`，本批次未取得赛事官方排名页，不作为 verified 身份或奖项字段。

### 孙晓（Xiao Sun）

- 核验身份：合肥工业大学计算机与信息学院教授、博士生导师；合肥工业大学情感计算研究所/多模态情感计算实验室（MAC-Lab）；情感计算与先进智能机器安徽省重点实验室常务副主任。
- 采用证据：[合肥工业大学教师主页](https://faculty.hfut.edu.cn/sunxiao/zh_CN/index.htm)、[MAC-Lab主页](https://sxhfut.github.io/)、[研究方向](https://sxhfut.github.io/research/)、[论文目录](https://sxhfut.github.io/publications/)。
- 更正：官方教师主页的所在单位为合肥工业大学，且列出“职务：所长”和省重点实验室副主任；不能标注为中国科学技术大学（USTC）。
- 论文：继承 MAC-Lab/作者目录 30 条；“千万级情感交互文本数据集”和“2025具身情感智能平台”尚未在本批次官方页面获得可引用证据，保留为待补证据声明。

### 黄民烈（Minlie Huang）

- 核验身份：清华大学计算机系、人工智能研究院教授、博士生导师；清华大学交互式人工智能课题组（CoAI）负责人。
- 采用证据：[清华计算机系官方教师页](https://www.cs.tsinghua.edu.cn/info/1121/5620.htm)、[CoAI个人主页](https://coai.cs.tsinghua.edu.cn/hml)、[CoAI主页](https://coai.cs.tsinghua.edu.cn/)、[CoAI GitHub组织](https://github.com/thu-coai)。
- 更正：清华计算机系官方页和个人主页确认“教授/Full Professor”；CoAI旧团队页仍显示“副教授”，视为未同步页面，不覆盖官方教师档案。国家杰出青年基金获得者（2022）为个人主页自述，需按机构最新档案更新。
- 目录：个人主页 `Selected Publications` 解析 228 条，2025 年与 2026 年条目全部纳入；目录仍是精选目录，不宣称全历史全量。
- 重点情感/社会智能工作和资源：ECM（AAAI 2018，情感 STC 数据入口）、ESC（ACL 2021）、PPT（ACL 2022）、CASE、EmoBench、ToMBench、COKE、AugESC、SocialSim、Crisp、CharacterGLM、Emohaa 相关论文等。对应链接和 GitHub/数据入口写入 JSON 的 `resources` 与每条记录的 `detail_links`。

## 数据质量与合并建议

- JSON 中 `scholar_id` 可用于与现有 `emotion_named_supplement_normalized.json` 去重；论文建议按 `scholar_id + year + normalized(title_en)` 去重，避免与既有目录重复。
- 中文题名：黄民烈核心情感条目提供人工中文译名，其余条目使用“中文译名待补：”前缀，便于后续翻译审查；不要把英文原题误当中文译名。
- 链接：`paper_url` 优先使用清华 CoAI 页面公开的原始链接；`detail_links` 保留同一条目所有非 javascript 链接。外链可用性、下载权限和论文最终出版版本需要在主站构建时再次检查。
- 未核验声明不会写入 `verified_affiliation` 或 `verification`，仅放在 `reported_claims`/审计文字中，符合“不能核查的作者信息直接删除或标待核查”的要求。

## 机器统计

| 学者 | 论文/条目 | 资源 | 官方 2025--2026条目 |
|---|---:|---:|---:|
| 傅小兰 | 40 | 3 | 0（现有目录保留） |
| 徐睿峰 | 143 | 5 | 0（现有目录保留） |
| 蒋冬梅 | 12 | 4 | 0（现有目录保留） |
| 孙晓 | 30 | 4 | 2（现有目录保留） |
| 黄民烈 | 228 | 9 | 40 |
| **合计** | **453** | **25** | **42** |

写入文件：`emotion_roles_expansion.json`。


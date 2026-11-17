# 新增六位学者身份与书目核查审计

- 核查日期：2026-11-14
- 身份门槛：必须有机构/个人官方主页，并且发表条目与该身份直接关联；同名但无法消歧的作者不进入主站。
- 结果：6 位均找到可核验官方身份；共写入 423 条论文/代表作记录。
- 主站规范化文件 `new_six_scholars_normalized.json` 保留 423 条可合并记录；原始补充 JSON 保留 423 条并用于审计追溯。
- 说明：蒲慕明、吴思、杨玉超、缪向水使用官方代表作列表；冯建峰使用 Warwick 官方 Full List PDF（J1–J358）解析；刘明使用复旦/中科院官方身份及官方新闻可确认论文，未将同名作者混入。

## 蒲慕明 / Mu-ming Poo
- scholar_id: `mu_ming_poo`
- identity_status: `verified`
- affiliation: Chinese Academy of Sciences Institute of Neuroscience; UC Berkeley Paul Licht Distinguished Professor Emeritus; Hong Kong Institute for Advanced Study Senior Fellow
- records: 5
- official sources: https://www.hkias.cityu.edu.hk/zh-cn/our-people/senior-fellows/professor-mu-ming-poo；https://www.ion.ac.cn/zt/fzs/kxjjs/pmm/；https://academicians.sinica.edu.tw/index.php?_lang=en&id=125&r=academician-n%2Fshow；https://www.mcb.berkeley.edu/faculty/NEU/poom.html
- coverage: HKIAS official five major publications; Berkeley/CAS profiles used for identity; selected official record, not claimed lifetime-complete

## 吴思 / Si Wu
- scholar_id: `wu_si`
- identity_status: `verified`
- affiliation: Peking University School of Psychological and Cognitive Sciences; McGovern Institute for Brain Research
- records: 27
- official sources: https://cqb.pku.edu.cn/cqben/info/1002/1749.htm；https://www.zds.pku.edu.cn/english/people/faculty/professor/wusi/index.htm
- coverage: PKU Center for Quantitative Biology official selected-publication list plus recent PKU profile entries; official selected list, not claimed lifetime-complete

## 刘明 / Ming Liu
- scholar_id: `ming_liu`
- identity_status: `verified`
- affiliation: Fudan University Institute of Frontier Chip and System Technologies; Institute of Microelectronics, Chinese Academy of Sciences
- records: 2
- official sources: https://fics.fudan.edu.cn/36/80/c22618a276096/page.htm；https://www.ime.cas.cn/icac/newsroom/newsroom_1/202001/t20200117_5489467.html
- coverage: official Fudan profile + CAS news records only; representative verified records; full 300+ SCI list requires institutional CV export

## 杨玉超 / Yuchao Yang
- scholar_id: `yuchao_yang`
- identity_status: `verified`
- affiliation: Peking University School of Electronic and Computer Engineering / Center for Brain-inspired Chips; Chinese Institute for Brain Research dual-appointed investigator
- records: 21
- official sources: https://en.cibr.ac.cn/teamDetail/cibrTeamteam/147d119f28cf4d4fa7bb3f04f903eadc/%E6%9D%A8%E7%8E%89%E8%B6%85；https://www.ece.pku.edu.cn/info/1045/2542.htm；https://yanglab.cibr.ac.cn/
- coverage: CIBR official representative publication list plus PKU institutional announcement; official representative list; lab page links to full publication archive

## 缪向水 / Xiangshui Miao
- scholar_id: `xiangshui_miao`
- identity_status: `verified`
- affiliation: Huazhong University of Science and Technology School of Integrated Circuits; Director, Cai Shaotang Memristor Research Center
- records: 20
- official sources: https://ic.hust.edu.cn/info/1282/3205.htm；https://ic.hust.edu.cn/info/1131/3552.htm
- coverage: HUST official representative publication list (2018-2021) and official news additions; representative list; profile states 300+ papers

## 冯建峰 / Jianfeng Feng
- scholar_id: `jianfeng_feng`
- identity_status: `verified`
- affiliation: Fudan University Institute of Science and Technology for Brain-Inspired Intelligence; School of Data Science; Warwick University Professor
- records: 347
- official sources: https://cnbi.fudan.edu.cn/info/1004/1004.htm；https://www.dcs.warwick.ac.uk/~feng/Full_publications.pdf；https://www.clarehall.cam.ac.uk/directory/jianfeng-feng/
- coverage: Warwick official Full List of Publications PDF parsed into records; official PDF contains numbered J1-J358 list; parser retained all parseable entries

## 删除/不纳入规则
- 本轮未发现能够安全归属但缺乏机构证据的记录；未来发现仅有同名搜索结果、无法与官方履历或代表作交叉确认的论文，应标记 `author_match=ambiguous` 并从主站删除。
- `title_zh` 的待补标记是数据质量提示，不代表作者身份不确定。

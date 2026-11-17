# 扩展组 B 书目审计（2026-11-14）

## 覆盖
- 伍冬睿（HUST Complete Publication List，按 EEG/BCI/神经信号/迁移学习/机器学习主题筛选）：191 条；页面还可能包含未纳入本主题包的通用模糊系统与控制论文。来源：[Complete Publication List](https://sites.google.com/site/drwuhust/publications/completepubs)。
- 许敏鹏（天津大学/CsAuthors）：91 条。来源：[天津大学主页](https://faculty.tju.edu.cn/156142/zh_CN/index.htm)、[CsAuthors](https://www.csauthors.net/minpeng-xu/)、[OpenAlex](https://openalex.org/authors/A5082279530)。OpenAlex 页面显示 240 works，当前抓取的公开可解析书目为 91 条。
- 李小俚（北师大/CsAuthors）：164 条。来源：[北师大主页](https://brain.bnu.edu.cn/kytd/jsyjy/Ljs/0f04a81f60614f47a5f2f5178d78e344.htm)、[CsAuthors](https://www.csauthors.net/xiaoli-li-002/)、[DBLP](https://dblp.org/pid/172/6872.html)、[OpenAlex](https://openalex.org/authors/A5100418692)。OpenAlex 页面显示 718 works；当前抓取的公开可解析书目为 164 条。

## 处理规则
- 保留 DOI/论文页；无 DOI 的伍冬睿条目保留 HUST 发表页或论文/预印本链接。
- 主站接入时按 DOI 优先、标题+年份次之去重，并要求作者姓名/机构与身份来源一致。
- CsAuthors 页面中机器编码异常的中文译名已清空，交由主站翻译缓存和审计流程重新生成，避免将乱码写入主站。
- 该包是公开索引的可解析全集快照；OpenAlex/IEEE/ResearchGate 统计数可能包含重复、会议版本或同名作者，不能直接等同于唯一终身论文数。


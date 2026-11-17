# Core Four Scholar Expansion Audit (2026-11-14)

This package keeps official publication lists for Guoying Zhao, Tong Zhang, Wenming Zheng and Hao Fei, and adds Crossref records filtered by exact ORCID. DBLP and ORCID pages are retained for identity and affiliation checks.

| Scholar | Official rows | Crossref ORCID rows | New rows | DOI duplicates | Title-year duplicates | Merged rows |
|---|---:|---:|---:|---:|---:|---:|
| Guoying Zhao | 401 | 99 | 97 | 0 | 1 | 498 |
| Tong Zhang | 103 | 107 | 62 | 31 | 14 | 165 |
| Wenming Zheng | 106 | 95 | 31 | 1 | 63 | 137 |
| Hao Fei | 195 | 50 | 23 | 0 | 27 | 218 |

## Sources

- Guoying Zhao: [official publications](https://gyzhao-nm.github.io/Guoying/publications.htm), [DBLP](https://dblp.org/pid/35/814.html), [ORCID](https://orcid.org/0000-0003-3694-206X).
- Tong Zhang: [SCUT profile](https://www2.scut.edu.cn/cs_en/2026/0324/c45160a621206/page.htm), [DBLP](https://dblp.org/pid/07/4227-15.html), [ORCID](https://orcid.org/0000-0002-7025-6365).
- Wenming Zheng: [SEU AIP lab](https://aip.seu.edu.cn/wmzheng/main.htm), [DBLP](https://dblp.org/pid/64/2253.html), [ORCID](https://orcid.org/0000-0002-7764-5179).
- Hao Fei: [official publications](https://haofei.vip/publications), [DBLP](https://dblp.org/pid/81/3569-1.html), [Oxford OATML](https://oatml.cs.ox.ac.uk/members/hao_fei/), [ORCID](https://orcid.org/0000-0003-3026-6347).

## Deduplication and limitations

- DOI is the primary key after lowercasing and removing DOI URL prefixes; normalized title plus year is the fallback key.
- Exact ORCID filtering strongly reduces homonym contamination, but conference or preprint records without ORCID may be missing. The package is therefore a reproducible verified expansion, not a claim of an immutable lifetime-complete bibliography.
- Official rows without DOI retain the original publication page URL; Crossref additions retain both the API query and DOI detail URL.

- Guoying Zhao ORCID note: DBLP/Crossref identity is 0000-0003-3694-206X; the official Oulu profile also exposes 0000-0002-0673-4767. Crossref rows were retained only when affiliations contained University of Oulu/CMVS or matching Oulu coauthor context; this discrepancy is flagged for manual review.

- One Crossref record dated 2027 (Human Behavior Analysis and Interaction for Emotional Intelligence) was excluded from merged rows as forthcoming/book metadata beyond the current 2026-11-14 cutoff.


## Comparison with local scholar JSON snapshots

| Scholar | Local snapshot | Core-four package | Difference |
|---|---:|---:|---:|
| Guoying Zhao (`guoying_zhao.json`) | 498 | 498 | 0 |
| Tong Zhang (`tong_zhang.json`) | 167 | 165 | -2 |
| Wenming Zheng (`wenming_zheng.json`) | 140 | 137 | -3 |
| Hao Fei (`hao_fei.json`) | 217 | 218 | +1 |

Local snapshots may contain candidate/resource records with different deduplication or source scopes; this package intentionally exposes the exact official-plus-ORCID evidence path and counts.

(function (global) {
  'use strict';

  const OTHER_SCHOLAR_ID = '__other__';
  const OTHER_SCHOLAR_THRESHOLD = 20;

  function list(x) {
    return Array.isArray(x) ? x : (x !== undefined && x !== null && x !== '' ? [String(x)] : []);
  }

  function joined(x, sep) {
    return list(x).join(sep === undefined ? '；' : sep);
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = String(text);
    return n;
  }

  function addLink(parent, url, label) {
    if (typeof url !== 'string') return null;
    const trimmed = url.trim();
    if (!/^https?:\/\/\S+$/i.test(trimmed)) return null;
    const a = el('a', '', label);
    a.href = trimmed;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    parent.append(a);
    return a;
  }

  function doiUrl(doi) {
    const raw = String(doi || '').trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
    return raw ? 'https://doi.org/' + raw : '';
  }

  function paperLinkUrl(p) {
    if (!p) return '';
    const direct = String(p.paper_url || '').trim();
    if (/^https?:\/\/\S+$/i.test(direct)) return direct;
    const dUrl = doiUrl(p.doi);
    if (dUrl) return dUrl;
    const src = String(p.source_url || '').trim();
    if (/^https?:\/\/\S+$/i.test(src)) return src;
    return '';
  }

  function evidenceLabel(url, type) {
    const u = String(url || '');
    const l = u.toLowerCase();
    const path = l.split(/[?#]/)[0];
    if (l.includes('github.com')) {
      if (path.includes('/blob/') || path.includes('/tree/')) {
        if (/dataset|data_loader|dataloader/.test(path)) return 'GitHub 数据加载脚本';
        if (/finetune|fine-tune|fine_tune/.test(path)) return 'GitHub 微调脚本';
        if (/pretrain|train/.test(path)) return 'GitHub 训练脚本';
        return 'GitHub 代码文件';
      }
      return 'GitHub 代码仓库';
    }
    if (/huggingface\.co\/datasets|zenodo\.org|physionet\.org|openneuro\.org|osf\.io|figshare\.com|kaggle\.com|dataset|download|数据集/.test(l)) {
      return (type === 'model' || type === 'weights') ? '模型权重下载' : '数据集下载/申请';
    }
    if (/huggingface\.co\/(models|[^/]+\/[^/]+)$/.test(l) || type === 'model' || type === 'weights') {
      return '模型权重下载';
    }
    if (/doi\.org|arxiv\.org|openreview\.net|proceedings\.iclr\.(org|cc)|iclr\.cc|iclr\.org|aclanthology\.org|ieeexplore\.ieee\.org|dl\.acm\.org|sciencedirect\.com|springer\.com|nature\.com|cvf\.com|aaai\.org/.test(l)) {
      return '论文主页/PDF';
    }
    if (/\.edu\.|\.ac\.|author|faculty|lab|institute|university/.test(l)) {
      return '作者/机构主页';
    }
    return '项目主页/资源说明';
  }

  function normKey(v) {
    return String(v || '')
      .toLowerCase()
      .normalize('NFKC')
      .replace(/^https?:\/\/(www\.)?/g, '')
      .replace(/\/+$/g, '')
      .replace(/[\s\u3000\-_/\\.,:;|()[\]{}]+/g, '');
  }

  function genericDatasetName(v) {
    const s = String(v || '').trim();
    if (!s) return true;
    if (/^(数据集|dataset|数据链接[:：]?|data link[:：]?)$/i.test(s)) return true;
    if (/^(数据链接[:：]|data link[:：]|数据集[:：])/i.test(s)) return true;
    return false;
  }

  const knownDatasetNames = {
    'https://osf.io/pq7vb/': '2020 International BCI Competition',
    'https://bcmi.sjtu.edu.cn/home/seed/': 'SEED 情感脑电数据集系列 (SJTU BCMI)',
    'https://bcmi.sjtu.edu.cn/applicationform/apply_form/': 'SJTU BCMI 数据集许可申请入口',
    'https://nda.nih.gov/general-query.html': 'NIMH Data Archive (NDA)',
    'https://ida.loni.usc.edu/login.jsp?project=adni&page=home': 'ADNI (LONI Image & Data Archive)',
    'https://sleeptight.isr.uc.pt/': 'ISRUC-Sleep / SleepTight Dataset',
    'https://sleeptight.isr.uc.pt/?page_id=48': 'ISRUC-Sleep / SleepTight 下载页',
    'https://mahnob-db.eu/hci-tagging/': 'MAHNOB-HCI Tagging Database',
    'http://mahnob-db.eu/hci-tagging/accounts/register/': 'MAHNOB-HCI Tagging Database (注册申请)',
    'https://bicr-resource.atr.jp/srpbsopen/': 'SRPBS Open Dataset (ATR)',
    'https://image-net.org/': 'ImageNet',
    'http://predict.cs.unm.edu/': 'PRED+CT EEG Repository (UNM)',
    'http://vgl.ict.usc.edu/data/lightstage/': 'USC ICT LightStage Data',
    'https://www.enterface.net/enterface06/': 'eNTERFACE 2006 Emotion Database',
    'https://roboimagedata.compute.dtu.dk/?page_id=36': 'DTU Robot Image Data Set',
    'https://raw.githubusercontent.com/albertmentat/labram-at-scale/main/data_manifests/pretraining/datasets.csv': 'LaBraM-at-Scale 预训练数据集清单'
  };

  function datasetNameFromUrl(u) {
    const raw = String(u || '').trim();
    if (!raw) return '未命名数据集';
    const lower = raw.toLowerCase();
    const lowerSlash = lower.replace(/\/+$/, '') + '/';
    if (knownDatasetNames[lower]) return knownDatasetNames[lower];
    if (knownDatasetNames[lowerSlash]) return knownDatasetNames[lowerSlash];

    let m;
    if ((m = raw.match(/physionet\.org\/content\/([^/?#]+)/i))) {
      return 'PhysioNet / ' + m[1];
    }
    if ((m = raw.match(/huggingface\.co\/datasets\/([^/?#]+\/[^/?#]+)/i))) {
      return 'Hugging Face / ' + m[1];
    }
    if ((m = raw.match(/kaggle\.com\/(?:competitions|c|datasets)\/([^/?#]+(?:\/[^/?#]+)?)/i))) {
      const clean = m[1].replace(/\/(data|overview|rules|code)$/i, '');
      return 'Kaggle / ' + clean;
    }
    if ((m = raw.match(/figshare\.com\/articles\/(?:dataset\/)?([^/?#]+)\/(\d+)/i))) {
      return 'Figshare / ' + decodeURIComponent(m[1]).replace(/[_-]+/g, ' ');
    }
    if ((m = raw.match(/m9\.figshare\.(\d+(?:\.v\d+)?)/i))) {
      return 'Figshare / ' + m[1];
    }
    if ((m = raw.match(/zenodo\.org\/records?\/(\d+)/i))) {
      return 'Zenodo / Record ' + m[1];
    }
    if ((m = raw.match(/osf\.io\/([a-z0-9]{4,10})/i))) {
      return 'OSF / ' + m[1];
    }
    if ((m = raw.match(/eecs\.qmul\.ac\.uk\/mmv\/datasets\/([^/?#]+)/i))) {
      return m[1].toUpperCase() + ' Dataset (QMUL MMV)';
    }
    if ((m = raw.match(/bbci\.de\/competition\/([^/?#]+)/i))) {
      return 'BCI Competition ' + m[1].toUpperCase();
    }
    if ((m = raw.match(/zju-bmi-lab\.github\.io\/([^/?#]+)/i))) {
      return m[1] + ' Dataset (ZJU BMI Lab)';
    }
    if ((m = raw.match(/fcon_1000\.projects\.nitrc\.org\/indi\/retro\/([^/?#]+)/i))) {
      return 'NITRC / ' + m[1].replace(/_/g, '-');
    }
    if ((m = raw.match(/data\.nemar\.org\/(nm\d+)/i))) {
      return 'NEMAR / ' + m[1];
    }
    if ((m = raw.match(/synapse\.org\/.*?(syn\d+)/i))) {
      return 'Synapse / ' + m[1];
    }
    if ((m = raw.match(/modma\.lzu\.edu\.cn/i))) {
      return 'MODMA 多模态抑郁数据集 (LZU)';
    }
    if ((m = raw.match(/github\.com\/([^/?#]+\/[^/?#]+)/i))) {
      return 'GitHub / ' + m[1].replace(/\.git$/i, '');
    }
    if ((m = raw.match(/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)/i))) {
      return 'Google Drive 数据文件 (' + m[1].slice(0, 8) + ')';
    }
    if ((m = raw.match(/drive\.google\.com\/drive\/folders\/([A-Za-z0-9_-]+)/i))) {
      return 'Google Drive 数据目录 (' + m[1].slice(0, 8) + ')';
    }
    if ((m = raw.match(/pan\.baidu\.com\/s\/([A-Za-z0-9_-]+)/i))) {
      return '百度网盘共享数据 (' + m[1].slice(0, 8) + ')';
    }
    if (/sharepoint\.com/i.test(raw)) {
      const idMatch = raw.match(/\/([A-Za-z0-9_-]{12,})(?:\?|$)/);
      return 'SharePoint 共享数据' + (idMatch ? ' (' + idMatch[1].slice(0, 8) + ')' : '');
    }
    if ((m = raw.match(/erda\.ku\.dk\/public\/archives\/([a-z0-9]{8})/i))) {
      return 'KU ERDA Archive (' + m[1] + ')';
    }
    if ((m = raw.match(/data\.donders\.ru\.nl\/.*\/([^/?#]+)$/i))) {
      return 'Donders Repository / ' + m[1];
    }
    if ((m = raw.match(/dataverse\.[^/]+\/dataverse\/([^/?#]+)/i))) {
      return 'Dataverse / ' + m[1];
    }

    const hostMatch = raw.match(/^https?:\/\/([^/]+)/i);
    const host = (hostMatch ? hostMatch[1] : '').replace(/^www\./i, '').toLowerCase();
    const parts = (hostMatch ? raw.slice(hostMatch[0].length) : raw).split(/[?#]/)[0].split('/').filter(Boolean);
    let leaf = parts[parts.length - 1] || '';
    if (/^(download|data|datasets?|index|home|register|view|files|main|application|apply_form)(\.[a-z0-9]+)?$/i.test(leaf) && parts.length >= 2) {
      leaf = parts[parts.length - 2];
    }
    try { leaf = decodeURIComponent(leaf); } catch (e) {}
    leaf = leaf.replace(/[_-]+/g, ' ').replace(/\.(html?|jsp|php|json|csv|zip|tar|gz|mat|edf|set|txt)$/i, '').trim();
    if (leaf && !/^(download|data|datasets?|index|home|register|view)$/i.test(leaf)) {
      return (host ? host + ' / ' : '') + leaf;
    }
    return host || '未命名数据集';
  }

  function datasetDisplayName(d) {
    if (!d) return '未命名数据集';
    if (d._displayName) return d._displayName;
    const zh = String(d.name_zh || '').trim();
    const en = String(d.name || '').trim();
    if (!genericDatasetName(zh)) return zh;
    if (!genericDatasetName(en)) return en;
    const derived = list(d.urls).map(datasetNameFromUrl).find(Boolean);
    return derived || '未命名数据集';
  }

  function prepareDb(db) {
    if (!db || db._prepared) return db;
    const paperByAnyId = new Map();
    const activePapers = [];
    for (const p of db.papers) {
      if (!p.compatibility_only) activePapers.push(p);
      const canSet = k => k && (!paperByAnyId.has(String(k)) || !p.compatibility_only);
      if (canSet(p.global_record_id)) paperByAnyId.set(String(p.global_record_id), p);
      if (canSet(p.record_id)) paperByAnyId.set(String(p.record_id), p);
      for (const sid of list(p.source_record_ids)) {
        if (canSet(sid)) paperByAnyId.set(String(sid), p);
      }
    }
    const resById = new Map();
    for (const r of db.resources) {
      if (r.id) resById.set(String(r.id), r);
    }

    const lowScholars = db.scholars.filter(s => (Number(s.counts && s.counts.bibliographic_records) || 0) <= OTHER_SCHOLAR_THRESHOLD);
    const lowScholarIds = new Set(lowScholars.map(s => s.id));

    db._activePapers = activePapers;
    db._paperByAnyId = paperByAnyId;
    db._resById = resById;
    db._lowScholars = lowScholars;
    db._lowScholarIds = lowScholarIds;
    db._prepared = true;
    return db;
  }

  function scholarSelectionMatches(db, id, sid) {
    if (!sid) return true;
    if (id === sid) return true;
    if (sid === OTHER_SCHOLAR_ID) {
      prepareDb(db);
      return db._lowScholarIds.has(id);
    }
    return false;
  }

  function linkedPapersForResource(db, r, preferActiveOnly) {
    prepareDb(db);
    const found = [];
    const seen = new Set();
    for (const mpid of list(r && r.matched_paper_ids)) {
      const p = db._paperByAnyId.get(String(mpid));
      if (!p) continue;
      const gid = String(p.global_record_id || p.record_id);
      if (!seen.has(gid)) {
        seen.add(gid);
        found.push(p);
      }
    }
    if (preferActiveOnly !== false) {
      const active = found.filter(p => !p.compatibility_only);
      if (active.length) return active;
    }
    return found;
  }

  function linkedResourcesForPaper(db, p) {
    prepareDb(db);
    if (!p) return [];
    const out = [];
    const seen = new Set();
    for (const rid of list(p.resource_ids)) {
      const r = db._resById.get(String(rid));
      if (r && !seen.has(r.id)) {
        seen.add(r.id);
        out.push(r);
      }
    }
    const pIds = new Set([p.global_record_id, p.record_id, ...list(p.source_record_ids)].filter(Boolean).map(String));
    for (const r of db.resources) {
      if (seen.has(r.id)) continue;
      if (list(r.matched_paper_ids).some(id => pIds.has(String(id)))) {
        seen.add(r.id);
        out.push(r);
      }
    }
    return out;
  }

  function buildDatasetIndex(db) {
    prepareDb(db);
    if (db._datasets) return db._datasets;

    const map = new Map();
    const byName = new Map();
    const byUrl = new Map();

    const addPaperToDataset = (d, p) => {
      if (!p) return;
      const gid = String(p.global_record_id || p.record_id || '');
      if (!gid) return;
      d._paperMap.set(gid, p);
      list(p.scholar_names).forEach(x => d.scholars.add(x));
      list(p.scholar_ids).forEach(x => d.scholar_ids.add(x));
      Object.entries(p.scholar_categories || {}).forEach(([sid, v]) => {
        if (v && v.category_id && v.category_id !== '__legacy_compat__') {
          d.scholar_ids.add(sid);
          d.category_ids.add(sid + '::' + v.category_id);
        }
      });
    };

    const ensure = (nameZh, name, url, resource, paper) => {
      const label = String(nameZh || name || url || '数据集').trim();
      const canonical = String(url || '').trim();
      const rawNames = [nameZh, name, label]
        .filter(Boolean)
        .map(x => String(x).trim())
        .filter(x => x && !genericDatasetName(x));
      const nameKeys = rawNames.map(normKey).filter(Boolean);
      const urlKey = canonical ? normKey(canonical) : '';

      let d = (urlKey && byUrl.get(urlKey)) || nameKeys.map(k => byName.get(k)).find(Boolean);
      if (!d) {
        d = {
          id: 'dataset-' + (map.size + 1),
          name_zh: label,
          name: name || label,
          url: canonical,
          urls: new Set(),
          descriptions: new Set(),
          access_notes: new Set(),
          resource_ids: new Set(),
          resource_types: new Set(),
          _paperMap: new Map(),
          scholars: new Set(),
          scholar_ids: new Set(),
          category_ids: new Set(),
          occurrences: 0
        };
        map.set(d.id, d);
      }

      nameKeys.forEach(k => byName.set(k, d));
      if (urlKey) byUrl.set(urlKey, d);

      if (nameZh && !genericDatasetName(nameZh)) {
        d.name_zh = String(nameZh).trim();
      } else if (genericDatasetName(d.name_zh) && name && !genericDatasetName(name)) {
        d.name_zh = String(name).trim();
      }
      if (name && (!d.name || genericDatasetName(d.name))) {
        d.name = String(name).trim();
      }
      if (canonical) {
        d.urls.add(canonical);
        if (!d.url) d.url = canonical;
      }
      if (resource) {
        if (resource.id) d.resource_ids.add(resource.id);
        if (resource.type) d.resource_types.add(resource.type);
        if (resource.download_url) d.urls.add(String(resource.download_url).trim());
        if (resource.description) d.descriptions.add(String(resource.description).trim());
        if (resource.access) d.access_notes.add(String(resource.access).trim());
        list(resource.scholar_id).forEach(x => d.scholar_ids.add(x));
        if (resource.scholar_name) d.scholars.add(resource.scholar_name);
        list(resource.scholar_category_ids).forEach(x => {
          if (!String(x).includes('__legacy_compat__')) d.category_ids.add(x);
        });
      }
      if (paper) addPaperToDataset(d, paper);
      d.occurrences++;
      return d;
    };

    const datasetResources = db.resources.filter(r =>
      r.type === 'dataset' ||
      (r.type === 'collection' && /dataset|数据集|data|数据/i.test(String(r.name || '') + ' ' + String(r.name_zh || '')))
    );

    for (const r of datasetResources) {
      const papers = linkedPapersForResource(db, r, true);
      const d = ensure(r.name_zh, r.name, r.url || r.download_url, r, null);
      papers.forEach(p => addPaperToDataset(d, p));
      if (!papers.length && list(r.related_paper_titles).length) {
        for (const t of list(r.related_paper_titles)) {
          const p = db._activePapers.find(x => x.title === t || x.title_zh === t || x.title_en === t)
            || db.papers.find(x => x.title === t || x.title_zh === t || x.title_en === t);
          if (p) addPaperToDataset(d, p);
        }
      }
    }

    for (const p of db._activePapers) {
      for (const u of list(p.data_urls)) {
        ensure('数据链接：' + datasetNameFromUrl(u), '', u, null, p);
      }
    }

    const result = [...map.values()].map(d => {
      const allPapers = [...d._paperMap.values()];
      const activeOnly = allPapers.filter(p => !p.compatibility_only);
      const finalPapers = (activeOnly.length ? activeOnly : allPapers).sort((a, b) =>
        (Number(b.year) || 0) - (Number(a.year) || 0) ||
        String(a.title_zh || a.title || '').localeCompare(String(b.title_zh || b.title || ''), 'zh-CN') ||
        String(a.title || '').localeCompare(String(b.title || ''), 'en')
      );
      const item = {
        id: d.id,
        name_zh: d.name_zh,
        name: d.name,
        url: d.url,
        urls: [...d.urls].filter(Boolean),
        descriptions: [...d.descriptions].filter(Boolean),
        access_notes: [...d.access_notes].filter(Boolean),
        resource_ids: [...d.resource_ids],
        resource_types: [...d.resource_types],
        papers: finalPapers,
        paper_ids: finalPapers.map(p => p.global_record_id || p.record_id),
        scholar_names: [...d.scholars],
        scholar_ids: [...d.scholar_ids],
        category_ids: [...d.category_ids],
        occurrences: d.occurrences
      };
      item._displayName = datasetDisplayName(item);
      item._search = [
        item._displayName,
        item.name_zh,
        item.name,
        ...item.urls,
        ...item.descriptions,
        ...item.scholar_names,
        ...item.papers.map(p => (p.title_zh || '') + ' ' + (p.title || ''))
      ].join(' ').toLowerCase();
      return item;
    }).sort((a, b) => a._displayName.localeCompare(b._displayName, 'zh-CN'));

    db._datasets = result;
    db._datasetById = new Map(result.map(d => [d.id, d]));
    return result;
  }

  function docViewerHref(docPath) {
    return '文档浏览.html?doc=' + encodeURIComponent(docPath);
  }

  const CACHE_VER = '20261118v2';
  function withCacheVer(src) {
    const s = String(src || '');
    if (!s || (typeof location !== 'undefined' && location.protocol === 'file:')) return s;
    return s + (s.includes('?') ? '&' : '?') + 'v=' + CACHE_VER;
  }

  let _shardsLoadPromise = null;
  function loadAllPaperShards(db) {
    if (!db) return Promise.reject(new Error('Missing SCHOLAR_DB'));
    if (db._shardsLoaded || !(db.shards && Array.isArray(db.shards.papers) && db.shards.papers.length)) {
      db._shardsLoaded = true;
      prepareDb(db);
      return Promise.resolve(db);
    }
    if (_shardsLoadPromise) return _shardsLoadPromise;
    if (typeof document === 'undefined' || !document.head) {
      db._shardsLoaded = true;
      prepareDb(db);
      return Promise.resolve(db);
    }
    _shardsLoadPromise = Promise.all(db.shards.papers.map(src => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = withCacheVer(src);
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load shard: ' + src));
      document.head.appendChild(s);
    }))).then(() => {
      db._shardsLoaded = true;
      db._prepared = false;
      db._datasets = null;
      prepareDb(db);
      return db;
    });
    return _shardsLoadPromise;
  }

  const _loadedAbsBuckets = new Map();
  function bucketIndexForId(gid, bucketCount) {
    const s = String(gid || '');
    let h = 0;
    for (let i = 0; i < s.length; i++) h = ((h * 31) + s.charCodeAt(i)) >>> 0;
    return h % (bucketCount || 16);
  }

  function loadAbstract(db, gid) {
    const id = String(gid || '');
    if (!id) return Promise.resolve(null);
    if (global.SCHOLAR_ABSTRACTS && global.SCHOLAR_ABSTRACTS[id]) {
      return Promise.resolve(global.SCHOLAR_ABSTRACTS[id]);
    }
    if (typeof document === 'undefined' || !document.head) return Promise.resolve(null);
    const bucketCount = (db && db.shards && db.shards.abstractBucketCount) || 16;
    const bIdx = bucketIndexForId(id, bucketCount);
    const bKey = String(bIdx).padStart(2, '0');
    if (!_loadedAbsBuckets.has(bKey)) {
      _loadedAbsBuckets.set(bKey, new Promise(resolve => {
        const s = document.createElement('script');
        s.src = withCacheVer('data/abstracts/bucket-' + bKey + '.js');
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => resolve();
        document.head.appendChild(s);
      }));
    }
    return _loadedAbsBuckets.get(bKey).then(() => {
      return (global.SCHOLAR_ABSTRACTS && global.SCHOLAR_ABSTRACTS[id]) || null;
    });
  }

  global.ScholarCommon = {
    OTHER_SCHOLAR_ID,
    OTHER_SCHOLAR_THRESHOLD,
    list,
    joined,
    el,
    addLink,
    doiUrl,
    paperLinkUrl,
    evidenceLabel,
    normKey,
    genericDatasetName,
    datasetNameFromUrl,
    datasetDisplayName,
    prepareDb,
    scholarSelectionMatches,
    linkedPapersForResource,
    linkedResourcesForPaper,
    buildDatasetIndex,
    docViewerHref,
    loadAllPaperShards,
    loadAbstract,
    bucketIndexForId
  };
})(typeof window !== 'undefined' ? window : globalThis);

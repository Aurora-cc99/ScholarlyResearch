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
    'https://bcmi.sjtu.edu.cn/home/seed/': 'SEED 情感脑电数据集 (SJTU BCMI)',
    'https://bcmi.sjtu.edu.cn/home/seed/seed-iv.html': 'SEED-IV 四分类情感脑电数据集 (SJTU BCMI)',
    'https://bcmi.sjtu.edu.cn/home/seed/seed-v.html': 'SEED-V 五分类情感脑电数据集 (SJTU BCMI)',
    'https://bcmi.sjtu.edu.cn/home/seed/seed-vii.html': 'SEED-VII 七分类连续情感脑电数据集 (SJTU BCMI)',
    'https://bcmi.sjtu.edu.cn/home/seed/seed-vig.html': 'SEED-VIG 驾驶警觉度脑电数据集 (SJTU BCMI)',
    'https://bcmi.sjtu.edu.cn/applicationform/apply_form/': 'SJTU BCMI 数据集许可申请入口',
    'https://www.eecs.qmul.ac.uk/mmv/datasets/deap/': 'DEAP 多模态生理与脑电情感数据集',
    'https://zenodo.org/records/546113': 'DREAMER 便携脑电与心电情感数据集',
    'https://www.eecs.qmul.ac.uk/mmv/datasets/amigos/': 'AMIGOS 群体与个体情感生理数据集',
    'https://mahnob-db.eu/hci-tagging/': 'MAHNOB-HCI 多模态情感数据库',
    'http://mahnob-db.eu/hci-tagging/accounts/register/': 'MAHNOB-HCI Tagging Database (注册申请)',
    'https://www.synapse.org/#!synapse:syn50614194': 'FACED 细粒度情感脑电数据集 (Tsinghua)',
    'https://github.com/tengfei000/mped': 'MPED 多模态生理情绪数据库 (SEU)',
    'http://modma.lzu.edu.cn/data/index/': 'MODMA 多模态精神障碍脑电数据集 (LZU)',
    'https://www.bbci.de/competition/iv/': 'BCI Competition IV 脑机接口竞赛数据集',
    'https://www.bbci.de/competition/iii/': 'BCI Competition III 脑机接口竞赛数据集',
    'https://physionet.org/content/eegmmidb/1.0.0/': 'PhysioNet EEGMMIDB 运动想象脑电数据集',
    'https://physionet.org/content/hmc-sleep-staging/1.1/': 'HMC 睡眠分期多导脑电数据集 (PhysioNet)',
    'https://physionet.org/content/eegmat/1.0.0/': 'EEGMAT 心算认知任务脑电数据集 (PhysioNet)',
    'https://physionet.org/content/siena-scalp-eeg/1.0.0/': 'Siena 头皮癫痫发作脑电数据集 (PhysioNet)',
    'https://physionet.org/content/i-care/2.1/': 'I-CARE 心脏骤停昏迷预后多中心脑电数据集 (PhysioNet)',
    'https://physionet.org/content/sleep-edfx/1.0.0/': 'Sleep-EDF / Sleep-EDFX 睡眠脑电数据集',
    'https://sleeptight.isr.uc.pt/': 'ISRUC-Sleep 睡眠分期脑电数据集',
    'https://sleeptight.isr.uc.pt/?page_id=48': 'ISRUC-Sleep / SleepTight 下载页',
    'https://sleepdata.org/datasets/shhs': 'SHHS 睡眠心脏健康研究队列',
    'http://ceams-carsm.ca/mass/': 'MASS 蒙特利尔睡眠脑电档案库',
    'https://physionet.org/content/chbmit/1.0.0/': 'CHB-MIT 儿童癫痫头皮脑电数据集',
    'https://isip.piconepress.com/projects/nedc/html/tuh_eeg/': 'TUH EEG 坦普尔大学临床脑电语料库',
    'https://bci.med.tsinghua.edu.cn/download.html': 'Tsinghua SSVEP / BETA 稳态视觉诱发脑电基准集',
    'http://bnci-horizon-2020.eu/database/data-sets': 'BNCI Horizon 2020 脑机接口公开库',
    'https://nda.nih.gov/general-query.html': 'NIMH Data Archive (NDA)',
    'https://adni.loni.usc.edu/data-samples/adni-data/': 'ADNI 阿尔茨海默病神经影像数据集',
    'https://ida.loni.usc.edu/login.jsp?project=adni&page=home': 'ADNI 阿尔茨海默病神经影像数据集',
    'https://fcon_1000.projects.nitrc.org/indi/abide/': 'ABIDE 自闭症脑影像交换数据集',
    'https://fcon_1000.projects.nitrc.org/indi/adhd200/': 'ADHD-200 注意缺陷多动障碍脑影像集',
    'https://www.humanconnectome.org/study/hcp-young-adult': 'HCP 人类连接组计划脑影像数据集',
    'https://www.ukbiobank.ac.uk/': 'UK Biobank 英国生物银行队列',
    'http://braintumorsegmentation.org/': 'BraTS 脑肿瘤医学影像分割基准集',
    'https://physionet.org/content/mitdb/1.0.0/': 'MIT-BIH 心律失常心电数据集',
    'https://physionet.org/content/mimiciv/': 'MIMIC-III / MIMIC-IV 重症临床数据库',
    'https://bicr-resource.atr.jp/srpbsopen/': 'SRPBS Open Dataset (ATR)',
    'https://sail.usc.edu/iemocap/': 'IEMOCAP 多模态情感对话数据集',
    'https://affective-meld.github.io/': 'MELD 多方对话多模态情感数据集',
    'http://multicomp.cs.cmu.edu/resources/cmu-mosei-dataset/': 'CMU-MOSEI 多模态情感与情绪强度数据集',
    'http://multicomp.cs.cmu.edu/resources/cmu-mosi-dataset/': 'CMU-MOSI 多模态观点情感数据集',
    'https://ecs.utdallas.edu/research/researchlabs/msp-lab/msp-podcast.html': 'MSP-Podcast 自然语音情感语料库',
    'https://zenodo.org/records/1188976': 'RAVDESS 视听情绪语音与歌唱数据集',
    'http://emodb.bilderbar.info/': 'EMO-DB 柏林德语情感语音库',
    'http://kahlan.eps.surrey.ac.uk/savee/': 'SAVEE 视听英语情感语音库',
    'https://github.com/cheyneycomputerscience/crema-d': 'CREMA-D 众包多模态情感演员数据集',
    'http://casme.psych.ac.cn/casme/e2': 'CASME II / CAS(ME)² 自发微表情数据集',
    'http://www2.docm.mmu.ac.uk/staff/m.yap/dataset.php': 'SAMM 自发微表情动作数据集',
    'https://ibug.doc.ic.ac.uk/resources/aff-wild2/': 'Aff-Wild2 自然场景连续情感行为数据集',
    'http://mohammadmahoor.com/affectnet/': 'AffectNet 大规模面部表情情感数据集',
    'http://www.whdeng.cn/raf/model1.html': 'RAF-DB 真实世界人脸表情数据库',
    'https://www.kaggle.com/c/challenges-in-representation-learning-facial-expression-recognition-challenge/data': 'FER2013 面部表情识别挑战赛数据集',
    'https://dfew-dataset.github.io/': 'DFEW / MAFW 动态面部表情视频数据集',
    'http://yanran.li/dailydialog': 'DailyDialog 日常多轮对话情绪数据集',
    'https://github.com/facebookresearch/empatheticdialogues': 'EmpatheticDialogues 共情对话数据集',
    'https://github.com/thu-coai/emotional-support-conversation': 'ESConv 情绪支持对话数据集 (THU CoAI)',
    'https://www.garrickorchard.com/datasets/n-mnist': 'N-MNIST / N-Caltech101 神经形态视觉数据集',
    'https://research.ibm.com/interactive/dvsgesture/': 'DVS128 Gesture 事件相机手势识别数据集',
    'https://figshare.com/articles/dataset/cifar10-dvs_new/4724671': 'CIFAR10-DVS 神经形态事件流数据集',
    'https://zenkelab.org/resources/spiking-heidelberg-datasets-shd/': 'SHD 脉冲海德堡语音数字数据集',
    'https://image-net.org/': 'ImageNet 大规模视觉识别基准',
    'https://cocodataset.org/': 'MS-COCO 通用目标检测与图文基准',
    'https://www.cs.toronto.edu/~kriz/cifar.html': 'CIFAR-10 / CIFAR-100 图像分类基准',
    'https://github.com/zalandoresearch/fashion-mnist': 'Fashion-MNIST 图像分类数据集',
    'https://www.cvlibs.net/datasets/kitti/': 'KITTI 自动驾驶与三维视觉基准集',
    'https://github.com/linfeng-tang/msrs': 'MSRS 红外与可见光图像融合数据集',
    'https://figshare.com/articles/dataset/tno_image_fusion_dataset/1008029': 'TNO 多波段红外图像融合数据集',
    'https://hltsingapore.github.io/esd/': 'ESD 多语种情感语音合成数据集',
    'https://www.openslr.org/33/': 'AISHELL 中文开源语音识别语料库',
    'https://datashare.ed.ac.uk/handle/10283/3443': 'VCTK 多说话人英语语音语料库',
    'https://www.openslr.org/12': 'LibriSpeech / LibriTTS 英语语音语料库',
    'https://alt.qcri.org/semeval2018/': 'SemEval 国际语义与情感评测数据集',
    'https://gluebenchmark.com/': 'GLUE / SST-2 自然语言理解评测基准',
    'https://rajpurkar.github.io/squad-explorer/': 'SQuAD 机器阅读理解问答基准',
    'http://yann.lecun.com/exdb/mnist/': 'MNIST 手写数字识别基准集',
    'https://www.crcv.ucf.edu/data/ucf101.php': 'UCF101 / HMDB51 人体动作识别视频集',
    'https://zheng-lab-anu.github.io/project/project_reid.html': 'Market-1501 / CUHK03 行人重识别基准',
    'https://openneuro.org/': 'OpenNeuro 开放神经影像与脑电数据平台',
    'http://predict.cs.unm.edu/': 'PRED+CT EEG Repository (UNM)',
    'http://vgl.ict.usc.edu/data/lightstage/': 'USC ICT LightStage Data',
    'https://www.enterface.net/enterface06/': 'eNTERFACE 2006 Emotion Database',
    'https://roboimagedata.compute.dtu.dk/?page_id=36': 'DTU Robot Image Data Set',
    'https://raw.githubusercontent.com/albertmentat/labram-at-scale/main/data_manifests/pretraining/datasets.csv': 'LaBraM-at-Scale 预训练数据集清单'
  };

  function cleanUrlForKey(rawUrl) {
    return String(rawUrl || '')
      .trim()
      .toLowerCase()
      .replace(/^https?:\/\/(www\.)?/, '')
      .replace(/[?#].*$/, '')
      .replace(/\/(?:tree\/main|blob\/main|index\.html?|download\.html?|files)\/?$/i, '')
      .replace(/\/+$/, '');
  }

  // Canonical family & subset resolver: groups multi-subset families & duplicate mirrors under one parent card while preserving subset names!
  function resolveDatasetFamily(nameZh, nameEn, urlsList) {
    const combinedText = `${nameZh || ''} ${nameEn || ''}`.trim();
    const urlsJoined = list(urlsList).join(' ').toLowerCase();
    const all = `${combinedText} ${urlsJoined}`;

    // 1. SJTU BCMI SEED Family (SEED / IV / V / VII / VIG / FRA / GER / OLF / SD / MYA / DV + license portal)
    if (/\bSEED(?:[- ](?:IV|V|VII|VIG|FRA|GER|OLF|SD|MYA|DV))?\b/i.test(combinedText) || /bcmi\.sjtu\.edu\.cn\/(?:home\/(?:seed|eeg2video)|applicationform\/apply_form)/i.test(urlsJoined)) {
      let sub = '';
      const sm = combinedText.match(/\b(SEED-(?:IV|VII|VIG|FRA|GER|OLF|SD|MYA|DV|V))\b/i);
      if (sm) sub = sm[1].toUpperCase();
      else if (/eeg2video/i.test(urlsJoined)) sub = 'SEED-DV';
      else if (/apply_form|许可申请/i.test(all)) sub = 'BCMI许可申请入口';
      else if (/\bSEED\b/i.test(combinedText) || /home\/seed/i.test(urlsJoined)) sub = 'SEED';
      return {
        key: 'family:seed_series',
        name_zh: 'SEED 系列情感与多模态脑电数据集 (SJTU BCMI)',
        name_en: 'SJTU BCMI SEED Series (SEED / IV / V / VII / VIG / FRA / GER / OLF / SD / MYA / DV)',
        canonical_url: 'https://bcmi.sjtu.edu.cn/home/seed/',
        subset: sub
      };
    }

    // 2. TUH EEG Family (TUEG / TUAB / TUSZ / TUEV / TUAR)
    if (/\b(?:TUH[- ]?EEG|TUEG|TUAB|TUSZ|TUEV|TUAR)\b/i.test(combinedText) || /piconepress\.com\/projects\/(?:nedc\/html\/)?tuh_eeg/i.test(urlsJoined)) {
      const tm = combinedText.match(/\b(TUEG|TUAB|TUSZ|TUEV|TUAR)\b/i);
      return {
        key: 'family:tuh_eeg',
        name_zh: 'TUH EEG 坦普尔大学临床脑电语料库 (TUEG / TUAB / TUSZ / TUEV)',
        name_en: 'Temple University Hospital EEG Corpus (TUEG / TUAB / TUSZ / TUEV)',
        canonical_url: 'https://isip.piconepress.com/projects/nedc/html/tuh_eeg/',
        subset: tm ? tm[1].toUpperCase() : 'TUEG'
      };
    }

    // 3. BCI Competition IV (Dataset 1 / 2a / 2b) & BNCI2014-001
    if (/\bBCI Competition IV\b/i.test(combinedText) || /bbci\.de\/competition\/iv\b/i.test(urlsJoined)) {
      let sub = '';
      if (/2a/i.test(all)) sub = 'Dataset 2a';
      else if (/2b/i.test(all)) sub = 'Dataset 2b';
      else if (/dataset\s*1\b|#dataset1/i.test(all)) sub = 'Dataset 1';
      return {
        key: 'family:bci_comp_iv',
        name_zh: 'BCI Competition IV 脑机接口竞赛数据集 (含 Dataset 1 / 2a / 2b)',
        name_en: 'BCI Competition IV (Datasets 1 / 2a / 2b)',
        canonical_url: 'https://www.bbci.de/competition/iv/',
        subset: sub
      };
    }

    // 4. 2020 International BCI Competition (Track 3 Imagined Speech / pq7vb)
    if (/2020 International BCI Competition|BCI Competition 2020/i.test(combinedText) || /osf\.io\/pq7vb|brain\.korea\.ac\.kr\/bci2020/i.test(urlsJoined)) {
      return {
        key: 'family:bci_comp_2020',
        name_zh: '2020 International BCI Competition (含 Track 3 想象语音脑电)',
        name_en: '2020 International BCI Competition',
        canonical_url: 'https://osf.io/pq7vb/',
        subset: /track\s*3/i.test(all) ? 'Track 3 (Imagined Speech)' : ''
      };
    }

    // 5. BNCI Horizon 2020 (BNCI2014-002 / BNCI2015-001 / Monitoring ErrP)
    if (/\bBNCI(?:201\d-\d+|\s+Horizon\s+2020)\b|Monitoring ErrP/i.test(combinedText) || /bnci-horizon-2020\.eu/i.test(urlsJoined)) {
      const bm = combinedText.match(/\b(BNCI201\d-\d+)\b/i);
      return {
        key: 'family:bnci_horizon_2020',
        name_zh: 'BNCI Horizon 2020 脑机接口公开数据集集合',
        name_en: 'BNCI Horizon 2020 BCI Database',
        canonical_url: 'http://bnci-horizon-2020.eu/database/data-sets',
        subset: bm ? bm[1].toUpperCase() : (/ErrP/i.test(combinedText) ? 'Monitoring ErrP' : '')
      };
    }

    // 6. OpenNeuro BIDS Datasets (ds00xxxx)
    if (/\bOpenNeuro\b|\bds00\d{4}\b/i.test(all) && /openneuro\.org/i.test(urlsJoined)) {
      const dm = all.match(/\b(ds00\d{4})\b/i);
      return {
        key: 'family:openneuro_bids',
        name_zh: 'OpenNeuro 开放脑电与神经影像数据集集合 (BIDS)',
        name_en: 'OpenNeuro BIDS Neuroimaging & EEG Datasets',
        canonical_url: 'https://openneuro.org/',
        subset: dm ? dm[1].toLowerCase() : ''
      };
    }

    // 7. M3D 3D Medical Multimodal Family (M3D-Cap / VQA / Seg / RefSeg)
    if (/\bM3D-(?:Cap|VQA|Seg|RefSeg)\b/i.test(all) || /GoodBaiBai88\/M3D-/i.test(urlsJoined)) {
      let sub = '';
      if (/m3d-cap/i.test(all)) sub = 'M3D-Cap';
      else if (/m3d-vqa/i.test(all)) sub = 'M3D-VQA';
      else if (/m3d-refseg/i.test(all)) sub = 'M3D-RefSeg';
      else if (/m3d-seg/i.test(all)) sub = 'M3D-Seg';
      return {
        key: 'family:m3d_medical',
        name_zh: 'M3D 三维医学多模态数据集系列 (Cap / VQA / Seg / RefSeg)',
        name_en: 'M3D 3D Medical Multimodal Datasets (M3D-Cap / VQA / Seg / RefSeg)',
        canonical_url: 'https://huggingface.co/datasets/GoodBaiBai88/M3D-Seg',
        subset: sub
      };
    }

    // 8. MinD-3D++ Family (fMRI-Shape / fMRI-Objaverse)
    if (/MinD-3D\+\+|Fudan-fMRI\/fMRI-(?:Shape|Objaverse)/i.test(all)) {
      const sub = /Objaverse/i.test(all) ? 'fMRI-Objaverse' : (/Shape/i.test(all) ? 'fMRI-Shape' : '');
      return {
        key: 'family:mind3d_pp',
        name_zh: 'MinD-3D++ 脑影像三维重建数据集 (fMRI-Shape / fMRI-Objaverse)',
        name_en: 'MinD-3D++ fMRI 3D Reconstruction Datasets',
        canonical_url: 'https://huggingface.co/datasets/Fudan-fMRI/fMRI-Shape',
        subset: sub
      };
    }

    // 9. Exact & Multi-Subset Dataset Families
    const RULES = [
      { key: 'family:faced', re: /\bFACED\b|syn50614194/i, zh: 'FACED 细粒度情感脑电数据集 (Tsinghua)', en: 'FACED Fine-grained Affective Computing EEG Dataset', url: 'https://www.synapse.org/#!Synapse:syn50614194' },
      { key: 'family:mped', re: /\bMPED\b|tengfei000\/mped/i, zh: 'MPED 多模态生理情绪数据库 (SEU)', en: 'MPED Multi-Modal Physiological Emotion Database', url: 'https://github.com/Tengfei000/MPED' },
      { key: 'family:modma', re: /\bMODMA\b|modma\.lzu\.edu\.cn/i, zh: 'MODMA 多模态精神障碍脑电与语音数据集 (LZU)', en: 'MODMA Multi-modal Open Dataset for Mental-disorder Analysis', url: 'https://modma.lzu.edu.cn/data/index/', subRe: /128-channel/i, subName: '128-channel Resting EEG' },
      { key: 'family:mahnob', re: /\bMAHNOB|mahnob-db\.eu/i, zh: 'MAHNOB-HCI 多模态情感与眼动生理数据库', en: 'MAHNOB-HCI Tagging Database', url: 'https://mahnob-db.eu/hci-tagging/' },
      { key: 'family:amigos', re: /\bAMIGOS\b|datasets\/amigos/i, zh: 'AMIGOS 群体与个体多模态情感生理数据集', en: 'AMIGOS Dataset', url: 'https://www.eecs.qmul.ac.uk/mmv/datasets/amigos/' },
      { key: 'family:deap', re: /\bDEAP\b|datasets\/deap/i, zh: 'DEAP 多模态生理与脑电情感数据集', en: 'DEAP Dataset for Emotion Analysis using Physiological Signals', url: 'https://www.eecs.qmul.ac.uk/mmv/datasets/deap/' },
      { key: 'family:isruc', re: /\bISRUC|sleeptight\.isr\.uc\.pt/i, zh: 'ISRUC-Sleep 睡眠分期多导脑电数据集', en: 'ISRUC-Sleep Dataset', url: 'https://sleeptight.isr.uc.pt/' },
      { key: 'family:mass', re: /\bMontreal Archive of Sleep Studies|\bMASS(?:-EX)?\b|ceams-carsm\.ca\/mass|9MYUCS|19087197/i, zh: 'MASS 蒙特利尔睡眠脑电档案库 (含 MASS-EX 专家标注子集)', en: 'Montreal Archive of Sleep Studies (MASS & MASS-EX)', url: 'http://ceams-carsm.ca/mass/', subRe: /MASS-EX|19087197/i, subName: 'MASS-EX 专家标注子集' },
      { key: 'family:beta_ssvep', re: /\bBETA SSVEP|The_BETA_database|12264401|bci\.med\.tsinghua\.edu\.cn/i, zh: 'Tsinghua SSVEP / BETA 稳态视觉诱发脑电基准集', en: 'Tsinghua Benchmark & BETA SSVEP Datasets', url: 'https://bci.med.tsinghua.edu.cn/download.html' },
      { key: 'family:mumtaz_mdd', re: /Mumtaz2016|EEG_Data_New|EEG Data New|4244171/i, zh: 'Mumtaz2016 / EEG_Data_New 抑郁症脑电公开数据集', en: 'Mumtaz2016 MDD EEG Dataset (Figshare 4244171)', url: 'https://figshare.com/articles/dataset/EEG_Data_New/4244171' },
      { key: 'family:shu_mi', re: /\bSHU(?:-MI|\s+Multi-session|\s+Dataset)|shu_dataset\/19228725|s41597-022-01647-1/i, zh: 'SHU-MI 上海大学多会话运动想象脑电数据集', en: 'SHU Multi-session Motor Imagery EEG Dataset (Ma et al., 2022)', url: 'https://figshare.com/articles/software/shu_dataset/19228725' },
      { key: 'family:way_eeg_gal', re: /WAY-EEG-GAL|Grasp and Lift|grasp-and-lift-eeg-detection/i, zh: 'WAY-EEG-GAL 手部抓举动作脑电肌电数据集', en: 'WAY-EEG-GAL / Grasp-and-Lift EEG Detection', url: 'https://www.kaggle.com/competitions/grasp-and-lift-eeg-detection/data' },
      { key: 'family:inria_bci', re: /Inria BCI Challenge|inria-bci-challenge/i, zh: 'Inria BCI Challenge (NER 2015 错觉电位脑机竞赛集)', en: 'Inria BCI Challenge (NER 2015)', url: 'https://www.kaggle.com/competitions/inria-bci-challenge' },
      { key: 'family:rsed2017', re: /Trujillo.*2017|rsed2017|EG0LJI/i, zh: 'Resting-State EEG 静息态脑电数据集 (Trujillo et al., 2017)', en: 'Resting-state EEG (Trujillo et al., 2017)', url: 'https://dataverse.tdl.org/dataverse/rsed2017' },
      { key: 'family:m3cv', re: /\bM3CV\b|eeg-biometric-competition|nm000166/i, zh: 'M3CV 多会话多任务跨被试脑电数据集 (含 NEMAR BIDS 版)', en: 'M3CV Multi-subject Multi-session EEG Dataset', url: 'https://nemar.org/dataset/nm000166', subRe: /NEMAR|nm000166/i, subName: 'NEMAR BIDS 版' },
      { key: 'family:eeg_macs', re: /EEG-MACS|1HD2lOxh/i, zh: 'EEG-MACS 临床轻度认知障碍与帕金森脑电数据集', en: 'EEG-MACS Clinical MCI/AD & PD EEG Dataset', url: 'https://github.com/ICI-BCI/EEG-MACS', subRe: /\bPD\b/i, subName: 'PD 帕金森子集' },
      { key: 'family:mdme', re: /\bMDME\b|11194571|s41597-024-03676-4/i, zh: 'MDME 混合情绪识别多模态数据集', en: 'MDME: Multimodal Dataset for Mixed Emotion Recognition', url: 'https://zenodo.org/records/11194571' },
      { key: 'family:zbra', re: /\bZBra(?:in-music|\s+Dataset)?\b|zju-bmi-lab\.github\.io\/zbra/i, zh: 'ZBrain / ZBra 自然音乐脑活动数据集 (ZJU BMI Lab)', en: 'ZBrain-music / ZBra Dataset', url: 'https://zju-bmi-lab.github.io/ZBra/index.html' },
      { key: 'family:dcsm', re: /\bDCSM\b|Danish Center for Sleep Medicine|db553715/i, zh: 'DCSM 丹麦睡眠医学中心临床多导睡眠数据集', en: 'Danish Center for Sleep Medicine (DCSM)', url: 'https://erda.ku.dk/public/archives/db553715ecbe1f3ac66c1dc569826eef/published-archive.html' },
      { key: 'family:happy_sad_fmri', re: /Naturalistic Happy\/Sad fMRI|janezhenliang\/fmriemo|1k2mdyNm/i, zh: 'Naturalistic Happy/Sad fMRI 自然情绪脑影像数据集', en: 'Naturalistic Happy/Sad fMRI Dataset', url: 'https://sites.google.com/site/janezhenliang/fmriemo' },
      { key: 'family:nda', re: /NIMH Data Archive|\bB-SNIP1\b|nda\.nih\.gov/i, zh: 'NIMH Data Archive (NDA, 含 B-SNIP1 精神障碍脑电集合)', en: 'NIMH Data Archive (NDA / B-SNIP1 Collection 2274)', url: 'https://nda.nih.gov/edit_collection.html?id=2274', subRe: /B-SNIP1/i, subName: 'B-SNIP1 (Collection 2274)' },
      { key: 'family:mous', re: /Schoffelen2019|\bMOUS\b|DSC_3011020\.09_236/i, zh: 'MOUS 自然语言句子阅读与听觉脑磁图/fMRI数据集', en: 'Schoffelen2019 / MOUS Dataset', url: 'https://data.donders.ru.nl/collections/di/dccn/DSC_3011020.09_236' },
      { key: 'family:meg_masc', re: /Gwilliams2022|MEG-MASC|osf\.io\/ag3kj/i, zh: 'MEG-MASC 自然连续语音听觉脑磁图数据集', en: 'Gwilliams2022 / MEG-MASC Dataset', url: 'https://osf.io/ag3kj/' },
      { key: 'family:mpi_lemon', re: /MPI[-_]LEMON/i, zh: 'MPI-LEMON 心智-脑-体多模态脑电与磁共振数据集', en: 'MPI-LEMON Dataset', url: 'https://fcon_1000.projects.nitrc.org/indi/retro/MPI_LEMON.html' },
      { key: 'family:labram_523', re: /LaBraM[- ]at[- ]Scale/i, zh: 'LaBraM-at-Scale 523 源大规模脑电预训练数据集清单', en: 'LaBraM-at-Scale 523-Dataset Pretraining Inventory', url: 'https://github.com/AlbertMentat/LaBraM-at-Scale' },
      { key: 'family:activity_forensics', re: /ActivityForensics/i, zh: 'ActivityForensics 视觉活动取证数据集', en: 'ActivityForensics Dataset', url: 'https://huggingface.co/datasets/ActivityForensics/ActivityForensics' },
      { key: 'family:cifar10_dvs', re: /CIFAR10-DVS|1pzYnhoU|1q1k6JJg|zju-bmi-lab\/TMC/i, zh: 'CIFAR10-DVS 神经形态事件流数据集 (含 TMC 训练/测试划分)', en: 'CIFAR10-DVS Neuromorphic Dataset', url: 'https://figshare.com/articles/dataset/CIFAR10-DVS_New/4724671' },
      { key: 'family:dtu_mvs', re: /DTU Robot Image|DTU processed data|DTU MVS|roboimagedata\.compute\.dtu\.dk|1SJFgt8q/i, zh: 'DTU MVS 多视角三维重建数据集 (含 SpikingGS 预处理子集)', en: 'DTU Robot Image / MVS Dataset', url: 'https://roboimagedata.compute.dtu.dk/?page_id=36' },
      { key: 'family:s_imagenet_cars', re: /\bS-ImageNet\b|\bS-CARS\b/i, zh: 'S-ImageNet / S-CARS 脉冲相机视觉识别数据集', en: 'S-ImageNet & S-CARS Spike Camera Datasets', url: 'https://pkuorgcn-my.sharepoint.com/:u:/g/personal/jwz_pku_org_cn/EYjP_sf9i-RFodsPnVYKKPgB43fQR4ZIWP4gAhfXvqErDA?e=1OerGY' },
      { key: 'family:dense_outdoor_spike', re: /\bDENSE-Spike\b|\bOutdoor-Spike\b/i, zh: 'DENSE-Spike / Outdoor-Spike 脉冲相机室内外单目深度估计数据集', en: 'DENSE-Spike & Outdoor-Spike Depth Datasets', url: 'https://pan.baidu.com/s/1Lg2spMW4OYlsYy0iT4u_7g' },
      { key: 'family:diligent', re: /\bDiLiGenT(?:102)?\b|photometricstereodata|diligent102/i, zh: 'DiLiGenT / DiLiGenT102 光度立体三维表面重建基准集', en: 'DiLiGenT & DiLiGenT102 Photometric Stereo Benchmark', url: 'https://photometricstereo.github.io/diligent102.html' },
      { key: 'family:zuco', re: /\bZuCo\s*[12]\.0\b|osf\.io\/(?:q3zws|2urht)/i, zh: 'ZuCo (1.0 & 2.0) 自然阅读脑电与眼动追踪语料库', en: 'ZuCo 1.0 & ZuCo 2.0 Zurich Cognitive Language Processing Corpus', url: 'https://osf.io/2urht/' },
      { key: 'family:4dme', re: /\b4DME(?:plus)?\b|4dmr-ijcai/i, zh: '4DME / 4DMEplus 四维多模态自发微表情数据集', en: '4DME & 4DMEplus 4D Spontaneous Micro-Expression Datasets', url: 'https://github.com/1nO1SB/4DMEplus' },
      { key: 'family:aves', re: /\bAVES\b|aves-dataset/i, zh: 'AVES 音视频连续情绪流检测数据集', en: 'AVES: Audio-Visual Emotion Stream Dataset', url: 'https://liyan4ai.github.io/aves-dataset/' },
      { key: 'family:cmu_mosi_mosei', re: /\bCMU-MOSE?I\b|cmu-mose?i-dataset/i, zh: 'CMU-MOSI / CMU-MOSEI 多模态观点与情感强度数据集', en: 'CMU-MOSI & CMU-MOSEI Multimodal Sentiment Datasets', url: 'http://multicomp.cs.cmu.edu/resources/cmu-mosei-dataset/' },
      { key: 'family:semeval', re: /\bSemEval\b|SemEval-2024_ECAC/i, zh: 'SemEval 国际语义与多模态对话情感评测集 (含 SemEval-2024 ECAC)', en: 'SemEval Affective & Emotion-Cause Evaluation Datasets', url: 'https://alt.qcri.org/semeval2018/' },
      { key: 'family:deepfake_fp', re: /System Fingerprints Detection for DeepFake|13318702|13340666/i, zh: 'DeepFake Audio System Fingerprints 伪造音频系统指纹数据集', en: 'System Fingerprints Detection for DeepFake Audio Dataset', url: 'https://zenodo.org/records/13318702' },
      { key: 'family:adni', re: /\bADNI\b|adni\.loni\.usc\.edu|project=adni/i, zh: 'ADNI 阿尔茨海默病神经影像数据集', en: 'Alzheimer\'s Disease Neuroimaging Initiative (ADNI)', url: 'https://adni.loni.usc.edu/data-samples/adni-data/' },
      // Clean curated titles for truncated single datasets
      { key: 'family:or_pad', re: /Oulu Remote-photoplethysmography|\bOR-PAD\b/i, zh: 'OR-PAD 奥卢远程光电容积脉搏波防伪数据库', en: 'Oulu Remote-PPG Presentation Attacks Database (OR-PAD)', url: 'https://gyzhao-nm.github.io/Guoying/publications.htm' },
      { key: 'family:avamerg', re: /Avatar-based Benchmark|avamerg\.github\.io/i, zh: 'AvaMERG 多模态虚拟人共情回复生成基准集', en: 'AvaMERG Multimodal Empathetic Response Generation Benchmark', url: 'https://avamerg.github.io/' },
      { key: 'family:ugvq', re: /zczhang-sjtu\/UGVQ/i, zh: 'UGVQ 多维 AIGC 生成视频质量评测数据集', en: 'UGVQ AIGC Video Quality Assessment Dataset', url: 'https://github.com/zczhang-sjtu/UGVQ' },
      { key: 'family:ghvq', re: /zczhang-sjtu\/GHVQ/i, zh: 'GHVQ 人体活动生成视频质量评测数据集', en: 'GHVQ Human-Activity AIGC Video Quality Dataset', url: 'https://github.com/zczhang-sjtu/GHVQ' },
      { key: 'family:dumoga', re: /lili0415\/DuMoGa/i, zh: 'DuMoGa 复杂查询指代图像分割基准集', en: 'DuMoGa Complex-query Referring Image Segmentation Benchmark', url: 'https://github.com/lili0415/DuMoGa' },
      { key: 'family:mc_eiu', re: /MC-EIU\/MC-EIU/i, zh: 'MC-EIU 多模态对话情感与意图联合理解数据集', en: 'MC-EIU Multimodal Conversation Emotion & Intent Dataset', url: 'https://github.com/MC-EIU/MC-EIU' },
      { key: 'family:mud3', re: /Syx1030\/MUD3/i, zh: 'MUD3 动态社交媒体多模态用户级抑郁检测数据集', en: 'MUD3 Multimodal User-Level Depression Detection Dataset', url: 'https://github.com/Syx1030/MUD3' },
      { key: 'family:mie', re: /WKH186\/MIE/i, zh: 'MIE 多模态隐式情绪理解与推理数据集', en: 'MIE Multimodal Implicit Emotion Dataset', url: 'https://github.com/WKH186/MIE' },
      { key: 'family:multimm', re: /DUTIR-YSQ\/MultiMM/i, zh: 'MultiMM 跨文化多模态情感分析基准数据集', en: 'MultiMM Cross-Cultural Multimodal Sentiment Benchmark', url: 'https://github.com/DUTIR-YSQ/MultiMM' },
      { key: 'family:gpt4v_emotion', re: /zeroQiaoba\/gpt4v-emotion/i, zh: 'GPT-4V-Emotion 通用多模态情感识别评测基准', en: 'GPT-4V with Emotion Benchmark', url: 'https://github.com/zeroQiaoba/gpt4v-emotion' },
      { key: 'family:moralstory', re: /thu-coai\/MoralStory/i, zh: 'MoralStory 中文道德故事理解与生成语料库 (THU CoAI)', en: 'MoralStory Corpus', url: 'https://github.com/thu-coai/MoralStory' },
      { key: 'family:cdial_gpt', re: /thu-coai\/CDial-GPT/i, zh: 'LCCC / CDial-GPT 大规模中文短文本对话数据集 (THU CoAI)', en: 'LCCC Large-Scale Chinese Short-Text Conversation Dataset', url: 'https://github.com/thu-coai/CDial-GPT' },
      { key: 'family:mer2025', re: /MERChallenge\/MER2025/i, zh: 'MER 2025 多模态情感识别挑战赛数据集', en: 'MER 2025 Affective Computing & LLM Dataset', url: 'https://huggingface.co/datasets/MERChallenge/MER2025' },
      { key: 'family:vwg_bench', re: /KlingTeam\/VWG-Bench/i, zh: 'VWG-Bench 视频生成世界规律与推理评测基准', en: 'VWG-Bench (KlingTeam)', url: 'https://huggingface.co/datasets/KlingTeam/VWG-Bench' },
      { key: 'family:objaverse_mix', re: /BAAI\/Objaverse-MIX/i, zh: 'Objaverse-MIX 三维形状自回归生成数据集 (BAAI)', en: 'BAAI/Objaverse-MIX 3D Dataset', url: 'https://huggingface.co/datasets/BAAI/Objaverse-MIX' },
      { key: 'family:mulocbench', re: /somethingone\/MULocBench/i, zh: 'MULocBench 软件工程代码与非代码缺陷定位基准集', en: 'MULocBench Dataset', url: 'https://huggingface.co/datasets/somethingone/MULocBench' },
      { key: 'family:temporal_vip', re: /yml2002\/Temporal-VIP/i, zh: 'Temporal-VIP 视频关键人物多模态时空识别数据集', en: 'Temporal-VIP Dataset', url: 'https://huggingface.co/datasets/yml2002/Temporal-VIP' }
    ];

    for (const rule of RULES) {
      if (rule.re.test(all)) {
        let sub = '';
        if (rule.subRe && rule.subRe.test(all)) sub = rule.subName;
        else if (rule.key === 'family:s_imagenet_cars') sub = /S-CARS/i.test(all) ? 'S-CARS' : 'S-ImageNet';
        else if (rule.key === 'family:dense_outdoor_spike') sub = /Outdoor-Spike/i.test(all) ? 'Outdoor-Spike' : 'DENSE-Spike';
        else if (rule.key === 'family:diligent') sub = /102/.test(all) ? 'DiLiGenT102' : 'DiLiGenT';
        else if (rule.key === 'family:zuco') sub = /2\.0|2urht/.test(all) ? 'ZuCo 2.0' : 'ZuCo 1.0';
        else if (rule.key === 'family:4dme') sub = /plus/i.test(all) ? '4DMEplus' : '4DME';
        else if (rule.key === 'family:cmu_mosi_mosei') sub = /mosei/i.test(all) ? 'CMU-MOSEI' : 'CMU-MOSI';
        return {
          key: rule.key,
          name_zh: rule.zh,
          name_en: rule.en,
          canonical_url: rule.url,
          subset: sub
        };
      }
    }
    return null;
  }

  function datasetPlatformTag(u) {
    const l = String(u || '').toLowerCase();
    if (!l) return '申请/论文内说明';
    if (l.includes('huggingface.co')) return 'Hugging Face';
    if (l.includes('physionet.org')) return 'PhysioNet';
    if (l.includes('openneuro.org')) return 'OpenNeuro';
    if (l.includes('zenodo.org')) return 'Zenodo';
    if (l.includes('osf.io')) return 'OSF';
    if (l.includes('figshare.com')) return 'Figshare';
    if (l.includes('bcmi.sjtu.edu.cn')) return 'SJTU BCMI';
    if (l.includes('kaggle.com')) return 'Kaggle';
    if (l.includes('synapse.org')) return 'Synapse';
    if (l.includes('nitrc.org')) return 'NITRC';
    if (l.includes('sleepdata.org')) return 'NSRR SleepData';
    if (l.includes('github.com') || l.includes('github.io')) return 'GitHub';
    return '官方数据主页';
  }

  function canonicalizeDatasetUrl(rawUrl) {
    const u = String(rawUrl || '').trim();
    if (!u) return '';
    const fam = resolveDatasetFamily('', '', [u]);
    if (fam && fam.canonical_url) return fam.canonical_url;
    return u;
  }

  function datasetNameFromUrl(u) {
    const raw = canonicalizeDatasetUrl(u);
    if (!raw) return '未命名数据集';
    const fam = resolveDatasetFamily('', '', [raw]);
    if (fam && fam.name_zh) return fam.name_zh;
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

    const scholarById = new Map(db.scholars.map(s => [s.id, s]));

    const addPaperToDataset = (d, p) => {
      if (!p) return;
      const gid = String(p.global_record_id || p.record_id || '');
      if (!gid) return;
      d._paperMap.set(gid, p);
      list(p.scholar_names).forEach(x => d.scholars.add(x));
      list(p.scholar_ids).forEach(x => d.scholar_ids.add(x));
      list(p.topics).forEach(x => d.topics.add(x));
      if (list(p.code_urls).length) d.has_code = true;
      if (list(p.model_urls).length) d.has_model = true;
      Object.entries(p.scholar_categories || {}).forEach(([sid, v]) => {
        if (v && v.category_id && v.category_id !== '__legacy_compat__') {
          d.scholar_ids.add(sid);
          d.category_ids.add(sid + '::' + v.category_id);
        }
      });
    };

    const byFamily = new Map();

    const ensure = (nameZh, name, url, resource, paper) => {
      const extraUrls = [url, resource && resource.url, resource && resource.download_url].filter(Boolean).map(x => String(x).trim());
      const fam = resolveDatasetFamily(nameZh, name, extraUrls);
      const canonical = fam ? fam.canonical_url : canonicalizeDatasetUrl(url);
      const knownLabel = fam
        ? fam.name_zh
        : (canonical ? (knownDatasetNames[canonical.toLowerCase()] || knownDatasetNames[canonical.toLowerCase().replace(/\/+$/, '') + '/'] || '') : '');
      const label = String(knownLabel || nameZh || name || canonical || '数据集').trim();
      const rawNames = [knownLabel, fam && fam.name_en, nameZh, name, label]
        .filter(Boolean)
        .map(x => String(x).trim())
        .filter(x => x && !genericDatasetName(x));
      const nameKeys = rawNames.map(normKey).filter(Boolean);
      const urlKeys = [...new Set([canonical, ...extraUrls].map(cleanUrlForKey).filter(Boolean))];

      let d = (fam && byFamily.get(fam.key))
        || urlKeys.map(k => byUrl.get(k)).find(Boolean)
        || nameKeys.map(k => byName.get(k)).find(Boolean);

      if (!d) {
        d = {
          id: 'dataset-' + (map.size + 1),
          family_key: fam ? fam.key : '',
          name_zh: label,
          name: (fam && fam.name_en) || name || label,
          url: canonical,
          urls: new Set(),
          subsets: new Set(),
          descriptions: new Set(),
          access_notes: new Set(),
          resource_ids: new Set(),
          resource_types: new Set(),
          topics: new Set(),
          has_code: false,
          has_model: false,
          _paperMap: new Map(),
          scholars: new Set(),
          scholar_ids: new Set(),
          category_ids: new Set(),
          occurrences: 0
        };
        map.set(d.id, d);
      }

      if (fam) {
        byFamily.set(fam.key, d);
        d.name_zh = fam.name_zh;
        d.name = fam.name_en;
        d.url = fam.canonical_url;
        if (fam.subset) d.subsets.add(fam.subset);
      } else {
        if (knownLabel) {
          d.name_zh = knownLabel;
        } else if (nameZh && !genericDatasetName(nameZh)) {
          d.name_zh = String(nameZh).trim();
        } else if (genericDatasetName(d.name_zh) && name && !genericDatasetName(name)) {
          d.name_zh = String(name).trim();
        }
        if (name && (!d.name || genericDatasetName(d.name))) {
          d.name = String(name).trim();
        }
      }

      nameKeys.forEach(k => byName.set(k, d));
      urlKeys.forEach(k => byUrl.set(k, d));

      if (canonical) {
        d.urls.add(canonical);
        if (!d.url) d.url = canonical;
      }
      extraUrls.forEach(u => { if (u) d.urls.add(u); });
      if (resource) {
        if (resource.id) d.resource_ids.add(resource.id);
        if (resource.type) {
          d.resource_types.add(resource.type);
          if (['code', 'software', 'repository'].includes(resource.type)) d.has_code = true;
          if (['model', 'weights'].includes(resource.type)) d.has_model = true;
        }
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
      r.is_dataset_benchmark ||
      (r.type === 'collection' && /dataset|数据集|data|数据/i.test(String(r.name || '') + ' ' + String(r.name_zh || '')))
    );

    for (const r of datasetResources) {
      const papers = linkedPapersForResource(db, r, true);
      const dNameZh = r.dataset_title || r.name_zh;
      const dNameEn = r.dataset_title || r.name;
      const d = ensure(dNameZh, dNameEn, r.url || r.download_url, r, null);
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

    // Second-pass connected-components merge: merge any buckets sharing a non-generic dataset URL or identical display name!
    const mergeInto = (target, src) => {
      if (target === src) return;
      src.urls.forEach(x => target.urls.add(x));
      src.subsets.forEach(x => target.subsets.add(x));
      src.descriptions.forEach(x => target.descriptions.add(x));
      src.access_notes.forEach(x => target.access_notes.add(x));
      src.resource_ids.forEach(x => target.resource_ids.add(x));
      src.resource_types.forEach(x => target.resource_types.add(x));
      src.topics.forEach(x => target.topics.add(x));
      if (src.has_code) target.has_code = true;
      if (src.has_model) target.has_model = true;
      src._paperMap.forEach((p, gid) => target._paperMap.set(gid, p));
      src.scholars.forEach(x => target.scholars.add(x));
      src.scholar_ids.forEach(x => target.scholar_ids.add(x));
      src.category_ids.forEach(x => target.category_ids.add(x));
      target.occurrences += src.occurrences;
      if (!target.family_key && src.name_zh && !/^数据链接[:：]/.test(src.name_zh) && /^数据链接[:：]/.test(target.name_zh)) {
        target.name_zh = src.name_zh;
        target.name = src.name || src.name_zh;
      }
      map.delete(src.id);
    };

    let mergedPass = true;
    while (mergedPass) {
      mergedPass = false;
      const seenUrlOwner = new Map();
      const seenDispOwner = new Map();
      for (const d of [...map.values()]) {
        const dispKey = normKey(datasetDisplayName({ name_zh: d.name_zh, name: d.name, urls: [...d.urls] }));
        if (dispKey && seenDispOwner.has(dispKey) && seenDispOwner.get(dispKey) !== d) {
          mergeInto(seenDispOwner.get(dispKey), d);
          mergedPass = true;
          break;
        }
        if (dispKey) seenDispOwner.set(dispKey, d);
        let didUrlMerge = false;
        for (const u of d.urls) {
          const uk = cleanUrlForKey(u);
          if (!uk || /publications\.htm|faculty|home\/lubaoliang|dsfc\/jsjkxyjs|bnci-horizon-2020\.eu\/database\/data-sets/i.test(uk)) continue;
          if (seenUrlOwner.has(uk) && seenUrlOwner.get(uk) !== d) {
            mergeInto(seenUrlOwner.get(uk), d);
            mergedPass = true;
            didUrlMerge = true;
            break;
          }
          seenUrlOwner.set(uk, d);
        }
        if (didUrlMerge) break;
      }
    }

    const result = [...map.values()].map((d, finalIdx) => {
      const allPapers = [...d._paperMap.values()];
      const activeOnly = allPapers.filter(p => !p.compatibility_only);
      const finalPapers = (activeOnly.length ? activeOnly : allPapers).sort((a, b) =>
        (Number(b.year) || 0) - (Number(a.year) || 0) ||
        String(a.title_zh || a.title || '').localeCompare(String(b.title_zh || b.title || ''), 'zh-CN') ||
        String(a.title || '').localeCompare(String(b.title || ''), 'en')
      );
      if (!d.category_ids.size && d.scholar_ids.size) {
        for (const sid of d.scholar_ids) {
          const sch = scholarById.get(sid);
          if (sch && sch.classification && Array.isArray(sch.classification.categories)) {
            sch.classification.categories.forEach(c => d.category_ids.add(sid + '::' + c.id));
          }
        }
      }
      const years = [...new Set(finalPapers.map(p => Number(p.year)).filter(y => y >= 1970 && y <= 2030))].sort((a, b) => a - b);
      const urlsArr = [...d.urls].filter(Boolean);
      const subsetsArr = [...d.subsets].filter(Boolean).sort((a, b) => a.localeCompare(b, 'en'));
      const item = {
        id: 'dataset-' + (finalIdx + 1),
        name_zh: d.name_zh,
        name: d.name,
        url: d.url || urlsArr[0] || '',
        urls: urlsArr,
        subsets: subsetsArr,
        platform_tag: datasetPlatformTag(d.url || urlsArr[0] || ''),
        descriptions: [...d.descriptions].filter(Boolean),
        access_notes: [...d.access_notes].filter(Boolean),
        resource_ids: [...d.resource_ids],
        resource_types: [...d.resource_types],
        has_code: d.has_code,
        has_model: d.has_model,
        topics: [...d.topics],
        years,
        latest_year: years.length ? years[years.length - 1] : 0,
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
        item.platform_tag,
        ...item.subsets,
        ...item.urls,
        ...item.descriptions,
        ...item.topics,
        ...item.scholar_names,
        ...item.papers.map(p => (p.title_zh || '') + ' ' + (p.title || ''))
      ].join(' ').toLowerCase();
      return item;
    }).sort((a, b) =>
      b.papers.length - a.papers.length ||
      b.scholar_names.length - a.scholar_names.length ||
      a._displayName.localeCompare(b._displayName, 'zh-CN')
    );

    const dsByPaperGid = new Map();
    const dsByResId = new Map();
    for (const ds of result) {
      for (const gid of ds.paper_ids) {
        const k = String(gid);
        if (!dsByPaperGid.has(k)) dsByPaperGid.set(k, []);
        dsByPaperGid.get(k).push(ds);
      }
      for (const rid of ds.resource_ids) {
        dsByResId.set(String(rid), ds);
      }
    }

    db._datasets = result;
    db._datasetById = new Map(result.map(d => [d.id, d]));
    db._datasetsByPaperGid = dsByPaperGid;
    db._datasetByResourceId = dsByResId;
    return result;
  }

  function docViewerHref(docPath) {
    return '文档浏览.html?doc=' + encodeURIComponent(docPath);
  }

  const CACHE_VER = '20261118v4';
  function withCacheVer(src) {
    const s = String(src || '');
    if (!s || (typeof location !== 'undefined' && location.protocol === 'file:')) return s;
    return s + (s.includes('?') ? '&' : '?') + 'v=' + CACHE_VER;
  }

  let _shardsLoadPromise = null;
  function loadAllPaperShards(db, onProgress) {
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
    let doneCount = 0;
    const total = db.shards.papers.length;
    _shardsLoadPromise = Promise.all(db.shards.papers.map(src => new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = withCacheVer(src);
      s.async = true;
      s.onload = () => {
        doneCount++;
        if (typeof onProgress === 'function') {
          try { onProgress(doneCount, total); } catch (e) {}
        }
        resolve();
      };
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

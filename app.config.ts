export default defineAppConfig({
  truthlight: {
    site: {
      name: 'Truth Light',
      topPageName: 'Truth Light | 薬物依存のリカバリー＆ハームリダクション',
      topPageDescription: 'Truth Lightは「日本版Erowid」を目指し、薬物に対する正しい情報と依存症からの回復の道を提供します。',
      url: 'https://www.truth-light.jp/',
      version: "1.0.1",
      ogImage: '/og-default.png'
    },
    header: {
      title: 'Truth Light',
      showTitle: true,
      showTitleInMobile: true,
      darkModeToggle: true,
      logo: {
        white: './logo/Jesus_fish_03_ol_white.png',
        black: './logo/Jesus_fish_03_ol_grey.png',
      },
      nav: {
        database: { type: "link", title: '規制物質DB(α版)', to: '/substances' },
        basics: {
          type: "menu",
          title: "ハームリダクション",
          meth: { type: "link", title: "🧊 メタンフェタミン", to: '/readings/basics/methamphetamine' },
          cocaine: { type: "link", title: '🚴 コカイン',to: '/readings/basics/cocaine' },
          mdma: { type: "link", title: '❌️ エクスタシー', to: '/readings/basics/ecstasy' },
          marijuana: { type: "link", title: '🥦 マリファナ', to: '/readings/basics/marijuana' },
          ketamine: { type: 'link', title: '🐘 ケタミン/PCP', to: '/readings/basics/ketamine-and-pcp' },
        },
        recovery: {
          type: "menu",
          title: '依存症からの回復',
          addiction: { type: 'link', title: '薬物依存症とは', to: '/readings/recovery/what-is-addiction' },
          support: { type: 'link', title: '依存症相談・支援先一覧', to: '/readings/recovery/get-help' },
          dict: { type: 'link', title: '回復用語集', to: '/readings/recovery/dict'}
          /* program: { type: 'link', title: '依存症回復プログラム', to: '/readings/recovery/program' }, */
        },
        info: {
          type: "menu",
          title: "インフォメーション",
          // about: { type: "link", title: '私たちについて', to: '/about-us'},
          // disclaimer: { type: "link", title: '免責事項', to: '/disclaimer'},
          contactUs: { type: "link", title: "お問い合わせ", to: '/contact-us' }
        },
        blog: {
          type: 'link',
          title: 'Note',
          to: 'https://note.com/truthlight_proj'
        }
      },
      socialLinks: {
        links: [{
          title: 'Truth Light JP',
          icon: './icon/X/x-logo.png',
          to: 'https://x.com/TruthLightJP',
          target: '_blank',
        }]
      }
    },
    categories: {
      stimulants: "中枢神経刺激薬", 
      psychedelics: 'サイケデリックス',
      dissociatives: "解離性麻酔薬",
      deliriants: "せん妄誘発薬薬",
      depressants: '鎮静薬',
      opioids: "オピオイド",
      cannabinoids: "カンナビノイド"
    }, 
    footer: {
      credits: '© 2025-2026 Truth Light.',
      links: [
        {
          title: 'X @TruthLightJP',
          to: 'https://x.com/TruthLightJP',
          target: '_blank',
        },
        {
          title: 'サイトマップ',
          to: 'https://www.truth-light.jp/sitemap.xml',
          target: '_blank'
        }
      ],
      resources: [
        {
          title: 'PubChem',
          to: 'https://pubchem.ncbi.nlm.nih.gov/',
          target: '_blank'
        },
        {
          title: 'DrugBank',
          to: 'https://go.drugbank.com/',
          target: '_blank'
        },
        {
          title: 'ChEBI',
          to: 'https://www.ebi.ac.uk/chebi/',
          target: '_blank'
        }
      ]
    },
  }
});
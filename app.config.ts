export default defineAppConfig({
  truthlight: {
    site: {
      name: 'Truth Light',
      topPageName: 'Truth Light | 薬物依存のリカバリー＆ハームリダクション＆キリスト',
      topPageDescription: 'Truth Lightは「日本版Erowid」を目指し、薬物に対する正しい情報と依存症からの回復の道を提供します。',
      url: 'https://www.truth-light.jp/',
      ogImage: '/og-default.png'
    },
    theme: {
      customizable: true,
      color: 'slate',
      radius: 0.5
    },
    header: {
      title: 'Truth Light',
      showTitle: true,
      showTitleInMobile: true,
      darkModeToggle: true,
      languageSwitcher: {
        enable: false,
        triggerType: 'icon',
        dropdownType: 'select',
      },
      logo: {
        white: './logo/Jesus_fish_03_ol_white.png',
        black: './logo/Jesus_fish_03_ol_grey.png',
      },
      border: false,

      nav: {
        database: { type: "link", title: '💽 規制物質DB', to: '/substances' },
        basics: {
          type: "menu",
          title: "🔰 ハームリダクション",
          meth: { type: "link", title: "🧊 メタンフェタミン", to: '/docs/basics/methamphetamine' },
          cocaine: { type: "link", title: '🚴 コカイン',to: '/docs/basics/cocaine' },
          mdma: { type: "link", title: '❌️ エクスタシー', to: '/docs/basics/ecstasy' },
          /* marijuana: { type: "link", title: '🥦 マリファナ', to: '/docs/basics/marijuana' }, */
          ketamine: { type: 'link', title: '🐘 ケタミン/PCP', to: '/docs/basics/ketamine-pcp' },
        },
        recovery: {
          type: "menu",
          title: '❤️‍🩹 依存症からの回復',
          support: { type: 'link', title: '依存症相談・支援先一覧', to: '/docs/recovery/get-help' },
          /* program: { type: 'link', title: '依存症回復プログラム', to: '/docs/recovery/program' }, */
        },
        info: {
          type: "menu",
          title: "ℹ️ インフォメーション",
          about: { type: "link", title: '私たちについて', to: '/docs/info/about-us'},
          disclaimer: { type: "link", title: '免責事項', to: '/docs/info/disclaimer'},
          contactUs: { type: "link", title: "お問い合わせ", to: '/contact-us' }
        }
      },
      socialLinks: {
        links: [{
          title: 'Truth Light JP',
          icon: './icon/X/x-logo-black.png',
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
      depressant: '鎮静薬',
      opioid: "オピオイド",
      cannabinoids: "カンナビノイド"
    }, 
    aside: {
      useLevel: true,
      levelStyle: 'header',
      collapse: false,
    },
    main: {
      breadCrumb: true,
      showTitle: true,
      padded: true
    },
    footer: {
      credits: 'Copyright © 2025-2026 Truth Light. All rights reserved.',
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
    search: {
      enable: true,
      inAside: false,
      style: 'input',
    }
  }
});
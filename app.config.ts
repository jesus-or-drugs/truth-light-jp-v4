export default defineAppConfig({
  truthlight: {
    site: {
      name: 'Truth Light | 薬物 ✕ ハームリダクション ✕ 回復',
      description: 'この日本で薬物依存症で苦しむ人をゼロにするハームリダクション&回復支援サイト',
      ogImage: '/og-default.png'
    },
    theme: {
      customizable: true,
      color: 'slate',
      radius: 0.5,
      fontFamily: {
        title: ['Avenir', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        sans: ['Avenir', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['Source Han Code JP', '源ノ角ゴシック Code JP', 'Source Han Code', '源ノ角ゴシック Code', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New']
        }
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
        white: './logo/Jesus_fish_02_ol_white.png',
        black: './logo/Jesus_fish_02_ol_black.png',
      },
      border: false,

      nav: {
        database: { type: "link", title: 'NPSデータベース(α版)', to: '/substances' },
        basics: {
          type: "menu",
          title: "ドラッグ基礎編",
          meth: { type: "link", title: "🧊 メタンフェタミン", to: '/docs/basics/methamphetamine' },
          cocaine: { type: "link", title: '🚴 コカイン',to: '/docs/basics/cocaine' },
          mdma: { type: "link", title: '❌️ エクスタシー', to: '/docs/basic' },
        },
        recovery: { type: "link", title: '依存症からの回復', to: '/docs/recovery' },
        info: {
          type: "menu",
          title: "当サイトについて",
          about: { type: "link", title: 'インフォメーション', to: '/docs/info/mission'},
          disclaimer: { type: "link", title: '免責事項', to: '/docs/info/disclaimer'}
        }
      },
      socialLinks: {
        links: [{
          title: 'ヤク中クリスチャン',
          icon: 'x-logo-white.png',
          to: 'https://x.com/Jesus_or_Drugs',
          target: '_blank',
        }]
      }
    },
    categories: {
      stimulants: "中枢神経刺激薬", 
      psychedelics: 'サイケデリックス',
      dissociatives: "解離薬",
      deliriants: "せん妄誘発薬剤",
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
      credits: 'Copyright © 2025 Truth Light. All rights reserved.',
      links: [{
        title: 'ヤク中クリスチャン',
        icon: 'x-logo-white.png',
        to: 'https://x.com/Jesus_or_Drugs',
        target: '_blank',
      }],
    },
    search: {
      enable: true,
      inAside: false,
      style: 'input',
    }
  }
});
export default defineAppConfig({
  truthlight: {
    site: {
      name: 'Truth Light',
      description: 'この日本で薬物依存症で苦しむ人をゼロにするハームリダクションサイト',
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
        light: './logo/Jesus_fish_02_ol_black.png',
        dark: './logo/Jesus_fish_02_ol_white.png',
      },
      border: false,
      nav: [
        { title: 'NPSデータベース(ALPHA)', to: '/substances' },
        // { title: '依存症相談窓口', to: '/recovery' }
      ],
      links: [{
        icon: 'lucide:github',
        to: 'https://github.com/jesus-or-drugs/truth-light-jp-v4',
        target: '_blank',
      }],
    },
    hero: {
      background: '/structure-bg-02-upscale.png',
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
    toc: {
      enable: true,
      links: [{
        title: 'ヤク中クリスチャン',
        icon: 'x-logo-white.png',
        to: 'https://x.com/Jesus_or_Drugs',
        target: '_blank',
      }]
    },
    search: {
      enable: true,
      inAside: false,
      style: 'input',
    }
  }
});
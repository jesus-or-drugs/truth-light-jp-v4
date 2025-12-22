export default defineAppConfig({
  truthlight: {
    site: {
      name: 'Truth Light JP',
      description: 'この日本で薬物依存症により苦しむ人をゼロにするハームリダクションサイト',
      ogImage: '/og-default.png'
    },
    theme: {
      customizable: true,
      color: 'slate',
      radius: 0.5,
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
        light: 'logo.png',
        dark: 'logo-dark.png',
      },
      border: false,
      nav: [
        { title: 'ファクトシート', to: '/substances' },
        { title: '規制薬物一覧', to: '/legal' },
        { title: '依存症相談窓口', to: '/recovery' }
      ],
      links: [{
        icon: 'lucide:github',
        to: 'https://github.com/jesus-or-drugs/truth-light-jp-v4',
        target: '_blank',
      }],
    },
    hero: {
      background: '/structure-bg-02.png',
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
<template>
  <!-- md以上: 横並びナビ -->
  <nav class="hidden md:inline md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 gap-4 text-sm text-slate-300 my-auto">
    <!-- メインメニュー -->
  <ul class="flex flex-row list-none">
  <li v-for="n in navItems" :key="n.key" class="pr-4 flex items-center">
    <!-- 単体リンク -->
    <NuxtLink
      v-if="n.type === 'link'"
      :to="n.item.to"
      class="py-2 text-slate-300 hover:text-white"
    >
      {{ n.item.title }}
    </NuxtLink>

    <!-- ドロップダウン -->
    <details v-else class="group relative">
      <summary
        class="list-none cursor-pointer select-none py-2 text-slate-300 hover:text-white inline-flex items-center gap-1"
      >
        <span>{{ n.title }}</span>
        <span class="text-xs opacity-90 transition-transform duration-200 group-open:rotate-180">▾</span>
      </summary>

      <div
        class="
          absolute left-1/2 -translate-x-1/2 mt-2 min-w-56
          rounded-xl border border-white/10 bg-slate-900/80 backdrop-blur shadow-lg
          overflow-hidden opacity-0 scale-95 translate-y-1 pointer-events-none
          transition-all duration-200 ease-out
          group-open:opacity-100 group-open:scale-100 group-open:translate-y-0
          group-open:pointer-events-auto
        "
      >
        <div class="flex flex-col p-2">
          <NuxtLink
            v-for="c in n.children"
            :key="c.key"
            :to="c.item.to"
            class="rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
          >
            {{ c.item.title }}
          </NuxtLink>
        </div>
      </div>
    </details>
  </li>
</ul>

  </nav>


  <!-- md未満: メニューボタン -->
  <button id="mobileButton" type="button" src class="absolute inline md:hidden menu-button w-[42px] h-[42px] "
  aria-controls="mobileMenu" aria-expanded="false" aria-labelledby="mobileButtonLabel">
    <span class="inline rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10">
      <img src="/icon/menu_open_01_white.png" alt="開く" />
    </span>
  </button>
  
</template>

<script setup lang="ts">
import { computed } from "vue"

const appConfig = useAppConfig()

type NavLeaf = { title: string; to: string }
type NavNode =
  | { key: string; type: "link"; item: NavLeaf }
  | { key: string; type: "menu"; title: string; children: { key: string; item: NavLeaf }[] }

// header.nav と theme.nav どっちでも動くように吸収
const rawNav = computed<Record<string, any>>(
  () => appConfig.truthlight?.header?.nav ?? {}
)

console.log(`rawNavの内容：${rawNav}`)

const navItems = computed<NavNode[]>(() => {
  const titleMap: Record<string, string> = {
    basics: "薬物基礎編",
    database: 'NPSデータベース(α版)',
    recovery: '依存症回復相談',
    info: "当サイトについて",
  }

  return Object.entries(rawNav.value).map(([key, value]: any) => {
    // {title,to} の単体リンクの場合
    console.log('valueの内容：' + value)
    if (value?.title && value?.to) {
      return { key, type: "link", item: value as NavLeaf }
    }

    // object ならドロップダウン扱い
    const children = Object.entries(value ?? {}).map(([childKey, childVal]: any) => ({
      key: childKey,
      item: childVal as NavLeaf,
    }))

    return {
      key,
      type: "menu",
      title: titleMap[key] ?? key,
      item: titleMap[key] ?? key, 
      children,
    }
  })
})

console.log(`navItemsの中身：${navItems}`)

const toggleMenu =computed<void>(() => {

})
</script>

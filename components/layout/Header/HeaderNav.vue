<template>
  <!-- md以上: 横並びナビ -->
  <nav class="hidden items-center gap-6 text-sm text-slate-300 md:flex">
    <a class="hover:text-white" href="/substances">NPSデータベース(α版)</a>
    <a class="hover:text-white" href="/info">Purpose</a>
    <a class="hover:text-white" href="/info/legal">法規制</a>
    <!-- <a class="hover:text-white" href="/articles">Articles</a> -->
  </nav>

  <!-- md未満: メニューボタン -->
  <button class="md:hidden inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm" @click="toggle"
    :aria-expanded="open" aria-controls="mobile-menu">
    <span class="font-medium">Menu</span>
    <span aria-hidden="true">{{ open ? "✕" : "☰" }}</span>
  </button>

  <!-- ここが肝: absoluteで“浮く”メニュー -->
  <Transition enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2 max-h-0" enter-to-class="opacity-100 translate-y-0 max-h-[70vh]"
    leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 max-h-[70vh]"
    leave-to-class="opacity-0 -translate-y-2 max-h-0">
    <div v-show="open" id="mobile-menu"
      class="md:hidden absolute left-0 right-0 top-full border-t bg-slate-700/95 backdrop-blur shadow-lg overflow-hidden"
      @click.stop>
      <div class="px-4 py-3 flex flex-col gap-3">
        <NuxtLink to="/substances" class="py-2" @click="close">Substances</NuxtLink>
        <NuxtLink to="/about" class="py-2" @click="close">About</NuxtLink>
        <NuxtLink to="/terms" class="py-2" @click="close">Terms</NuxtLink>
      </div>
    </div>
  </Transition>

  <!-- Mobile: details/summary (CSS + native open/close, no JS state) -->
  <nav id="mobile-menu" class="md:hidden border-t">
    <div class="px-4 py-3 flex flex-col gap-2">
      <template v-for="n in navItems" :key="n.key">
        <NextLink v-if="n.type === 'link'" :to="n.item.to" class="py-2 text-slate-200">
          {{ n.item.title }}
        </NextLink>

        <details v-else class="rounded-lg border border-white/10">
          <summary class="px-3 py-2 cursor-pointer text-slate-200 select-none">
            {{ n.title }}
          </summary>
          <div class="px-3 pb-2 flex flex-col">
            <NextLink v-for="c in n.children" :key="c.key" :to="c.item.to" class="py-2 text-slate-200/90">
              {{ c.item.title }}
            </NextLink>
          </div>
        </details>
      </template>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from "vue"

const appConfig = useAppConfig()

type NavLeaf = { title: string; to: string }
type NavNode =
  | { key: string; type: "link"; item: NavLeaf }
  | { key: string; type: "menu"; title: string; children: { key: string; item: NavLeaf }[] }

// header.nav と theme.nav どっちでも動くように吸収（好きな方だけ残してもOK）
const rawNav = computed<Record<string, any>>(
  () => appConfig.truthlight?.theme?.nav ?? appConfig.truthlight?.header?.nav ?? {}
)

const navItems = computed<NavNode[]>(() => {
  const titleMap: Record<string, string> = {
    basics: "基本",
    info: "情報",
  }

  return Object.entries(rawNav.value).map(([key, value]: any) => {
    // {title,to} なら単体リンク
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
      children,
    }
  })
})
</script>

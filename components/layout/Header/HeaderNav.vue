<template>
  <!-- Desktop: hover dropdown (CSS only) -->
  <nav class="hidden md:flex items-center gap-6">
    <template v-for="n in navItems" :key="n.key">
      <!-- Single link -->
      <NextLink
        v-if="n.type === 'link'"
        :to="n.item.to"
        class="text-sm text-slate-200 hover:text-white"
      >
        {{ n.item.title }}
      </NextLink>

      <!-- Dropdown (hover only) -->
      <div v-else class="relative group">
        <span class="text-sm text-slate-200 hover:text-white inline-flex items-center gap-1 cursor-default">
          {{ n.title }}
          <span class="text-xs opacity-70">▾</span>
        </span>

        <!-- hover area -->
        <div class="absolute left-0 top-full pt-2 hidden group-hover:block">
          <div
            class="min-w-56 rounded-xl border border-white/10 bg-slate-900/95 backdrop-blur px-2 py-2 shadow-lg"
          >
            <NextLink
              v-for="c in n.children"
              :key="c.key"
              :to="c.item.to"
              class="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
            >
              {{ c.item.title }}
            </NextLink>
          </div>
        </div>
      </div>
    </template>
  </nav>

  <!-- Mobile: details/summary (CSS + native open/close, no JS state) -->
  <nav id="mobile-menu" class="md:hidden border-t">
    <div class="px-4 py-3 flex flex-col gap-2">
      <template v-for="n in navItems" :key="n.key">
        <NextLink
          v-if="n.type === 'link'"
          :to="n.item.to"
          class="py-2 text-slate-200"
        >
          {{ n.item.title }}
        </NextLink>

        <details v-else class="rounded-lg border border-white/10">
          <summary class="px-3 py-2 cursor-pointer text-slate-200 select-none">
            {{ n.title }}
          </summary>
          <div class="px-3 pb-2 flex flex-col">
            <NextLink
              v-for="c in n.children"
              :key="c.key"
              :to="c.item.to"
              class="py-2 text-slate-200/90"
            >
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

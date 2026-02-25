<template>
  <!-- md以上: 横並びナビ -->
  <nav v-if="props.variant === `default` || props.variant === `legal`" class="hidden md:inline md:absolute md:left-1/2 md:-translate-x-1/2 md:top-1/2 md:-translate-y-1/2 gap-4 text-sm text-slate-200 my-auto">
    <!-- メインメニュー -->
    <ul class="flex flex-row list-none">
      <li v-for="n in navItems" :key="n.key" class="pr-4 flex items-center relative group">
        <!-- 単体リンク -->
        <NuxtLink
          v-if="n.type === 'link'"
          :to="n.item.to"
          class="py-2 text-slate-200 hover:text-white"
        >
          {{ n.item.title }}
        </NuxtLink>

        <!-- ドロップダウン -->
        <template v-else>
          <button
            type="button"
            class="list-none cursor-pointer select-none py-2 text-slate-200 hover:text-white"
          >
            <span>{{ n.title }}</span>
          </button>

          <div
            class="
              absolute left-1/2 -translate-x-1/2 top-full pt-2 z-50
            "
          >
            <div
              class="
                min-w-56 rounded-md border border-white/10 bg-slate-900/90 shadow-lg backdrop-blur-xl
                overflow-hidden opacity-0 scale-95 translate-y-1 pointer-events-none
                transition-all duration-200 ease-out
                group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0
                group-hover:pointer-events-auto
              "
            >
              <div class="flex flex-col p-2">
                <NuxtLink
                  v-for="c in n.children"
                  :key="c.key"
                  :to="c.item.to"
                  class="rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/5 hover:text-white"
                >
                  {{ c.item.title }}
                </NuxtLink>
              </div>
            </div>
          </div>
        </template>
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

const props = defineProps<{
  variant?: "default" | "substances" | "legal",
}>()

const appConfig = useAppConfig()

type NavLeaf = { title: string; type: string; to: string }
type NavNode =
  | { key: string; type: "link"; item: NavLeaf }
  | { key: string; type: "menu"; title: String; children: { key: string; item: NavLeaf }[] }

// header.nav と theme.nav どっちでも動くように吸収
const rawNav = computed<Record<string, any>>(
  () => appConfig.truthlight?.header?.nav ?? {}
)

const navItems = computed<NavNode[]>(() => {
  return Object.entries(rawNav.value).map(
    ([key, value]: any) => {
      // 単一メニューはそのまま表示
      if (value.type === "link") {
        return { key: key, type: value.type, item: value as NavLeaf }
      }

      // 複数メニューはプルダウン化
      if (value.type === "menu") {
        const children = Object.entries(value)
        .filter(([k,v]: any) => v.type === "link")
        .map(([childKey, childVal]: any) => ({key: childKey, item: childVal}))

        return { key, type: "menu", title: value.title, children }
      }
      return { key, type: "link", item: { title: String(key), to: "/" } }
  })
})

console.log(navItems)

</script>

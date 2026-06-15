<template>
  <nav
    class="hidden text-sm my-auto
    md:inline-block h-full"
  >
    <!-- メインメニュー -->
    <ul class="flex flex-row items-center gap-4 h-full list-none">
      <li v-for="n in navItems" :key="n.key" class="flex flex-row items-center relative group h-full">

        <!-- 単体リンク -->
        <NuxtLink
          v-if="n.type === 'link'"
          :to="n.item.to"
          class="flex items-center h-full hover:text-[#FF9B51] hover:bg-[#BFC9D1]/20 no-underline"
        >
          {{ n.item.title }}
        </NuxtLink>

        <!-- ドロップダウン -->
        <template v-else>
          <button
            type="button"
            class="group inline-flex items-center gap-1 w-auto h-full list-none cursor-pointer select-none hover:text-[#FF9B51] hover:bg-[#BFC9D1]/20"
          >
            <span>{{ n.title }}</span>

            <span class="relative inline-block w-4 h-4 shrink-0">
              <img
                src="/ui/angle-small-down.png"
                class="absolute inset-0 w-4 h-4 opacity-100 group-hover:opacity-0 transition-opacity duration-200"
              />
              <img
                src="/ui/angle-small-up.png"
                class="absolute inset-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </span>
          </button>

          <div
            class="
              absolute left-1/2 -translate-x-1/2 top-full z-50
            "
          >
            <div
              class="
                min-w-56 rounded-md border border-[#BFC9D1] bg-[#DCE3E8] shadow-lg backdrop-blur-xl
                overflow-hidden hidden pointer-events-none
                transition-all duration-200 ease-out
                group-hover:block
                group-hover:pointer-events-auto
              "
            >
              <div class="flex flex-col p-2">
                <NuxtLink
                  v-for="c in n.children"
                  :key="c.key"
                  :to="c.item.to"
                  class="rounded-md px-3 py-2 text-sm hover:bg-white/20 hover:text-[#FF9B51] no-underline"
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
  
</template>

<script setup lang="ts">
import { computed } from "vue"

const appConfig = useAppConfig()

type NavLeaf = { title: string; type: string; to: string }
type NavNode =
  | { key: string; type: "link"; item: NavLeaf }
  | { key: string; type: "menu"; title: string; children: { key: string; item: NavLeaf }[] }

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
      // それ以外
      return { key, type: "link", item: { title: String(key), type: "link", to: "/" } }
    }
  )
})

</script>

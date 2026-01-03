<script setup lang="ts">
import { computed, onMounted, ref, shallowRef, watch } from "vue"
import Fuse from "fuse.js"
import { useRouter } from "vue-router"

type Substance = {
  id: string
  common_name?: string
  aliases?: string[]
  categories?: string[]
  legal?: {
    jp?: {
      law_category?: string
    }
  }
}

type Row = {
  id: string
  commonName: string
  aliases: string
  category: string
  legal: string
}

const router = useRouter()

const pending = ref(true)
const error = ref<unknown>(null)
const rows = ref<Row[]>([])

// 検索（3カラム別）
const qName = ref("")
const qCategory = ref("")
const qLegal = ref("")

// ちょい軽量化：デバウンス
const dqName = ref("")
const dqCategory = ref("")
const dqLegal = ref("")

function debounceRef(src: typeof qName, dst: typeof dqName, ms = 150) {
  let t: ReturnType<typeof setTimeout> | null = null
  watch(
    src,
    (v) => {
      if (t) clearTimeout(t)
      t = setTimeout(() => (dst.value = v), ms)
    },
    { immediate: true }
  )
}
debounceRef(qName, dqName)
debounceRef(qCategory, dqCategory)
debounceRef(qLegal, dqLegal)

// Fuse（目的別に3つ作って “積集合” を取る）
const fuseName = shallowRef<Fuse<Row> | null>(null)
const fuseCategory = shallowRef<Fuse<Row> | null>(null)
const fuseLegal = shallowRef<Fuse<Row> | null>(null)

function buildFuses(list: Row[]) {
  const base = {
    includeScore: false,
    shouldSort: true,
    threshold: 0.35,
    ignoreLocation: true,
    minMatchCharLength: 2
  } satisfies Fuse.IFuseOptions<Row>

  fuseName.value = new Fuse(list, {
    ...base,
    keys: ["commonName", "aliases"]
  })

  fuseCategory.value = new Fuse(list, {
    ...base,
    keys: ["category"]
  })

  fuseLegal.value = new Fuse(list, {
    ...base,
    keys: ["legal"]
  })
}

onMounted(async () => {
  try {
    const r = await $fetch.raw("/data/all_substances.json")
    const arr: Substance[] = Array.isArray(r._data) ? r._data : []

    rows.value = arr.map((s) => ({
      id: s.id ?? "",
      commonName: s.common_name ?? s.id ?? "",
      aliases: (s.aliases ?? []).join(", "),
      category: (s.categories ?? []).join(", "),
      legal: s.legal?.jp?.law_category ?? ""
    }))

    buildFuses(rows.value)
  } catch (e) {
    error.value = e
  } finally {
    pending.value = false
  }
})

// ソート
type SortKey = "name" | "category" | "legal"
type SortDir = "asc" | "desc"

const activeKey = ref<SortKey>("name")
const dir = ref<SortDir>("asc")

const toggleSort = (key: SortKey) => {
  if (activeKey.value === key) {
    dir.value = dir.value === "asc" ? "desc" : "asc"
  } else {
    activeKey.value = key
    dir.value = "asc"
  }
}

const sortClass = (key: SortKey) => {
  if (activeKey.value !== key) return "idle"
  return dir.value
}

function getSortValue(r: Row, key: SortKey) {
  if (key === "name") return r.commonName ?? ""
  if (key === "category") return r.category ?? ""
  return r.legal ?? ""
}

// 検索（積集合）
const filtered = computed<Row[]>(() => {
  const list = rows.value
  if (!list.length) return []

  const nameQ = dqName.value.trim()
  const catQ = dqCategory.value.trim()
  const legalQ = dqLegal.value.trim()

  // 何も入ってないなら全件
  if (!nameQ && !catQ && !legalQ) return list

  let ids: Set<string> | null = null

  const intersect = (a: Set<string>, b: Set<string>) => {
    const out = new Set<string>()
    for (const x of a) if (b.has(x)) out.add(x)
    return out
  }

  const apply = (f: Fuse<Row> | null, q: string) => {
    if (!f || !q) return
    const hit = new Set(f.search(q).map((x) => x.item.id))
    ids = ids ? intersect(ids, hit) : hit
  }

  apply(fuseName.value, nameQ)
  apply(fuseCategory.value, catQ)
  apply(fuseLegal.value, legalQ)

  if (!ids) return list
  return list.filter((r) => ids!.has(r.id))
})

const sorted = computed<Row[]>(() => {
  const key = activeKey.value
  const direction = dir.value

  const copied = filtered.value.slice()

  copied.sort((a, b) => {
    const av = getSortValue(a, key)
    const bv = getSortValue(b, key)
    const cmp = av.localeCompare(bv, "ja", { sensitivity: "base", numeric: true })
    return direction === "asc" ? cmp : -cmp
  })

  return copied
})

const go = (id: string) => {
  if (!id) return
  router.push(`/substances/${encodeURIComponent(id)}`)
}
</script>

<template>
  <section class="h-full min-h-0 flex flex-col">
    <div class="h-full min-h-0 overflow-y-auto">
      <div v-if="pending">Loading...</div>
      <div v-else-if="error" class="text-red-500">
        Failed to load: {{ String(error) }}
      </div>

      <div v-else class="border-r md:border-r-0 border-l border-t border-b rounded-l-xl overflow-hidden border-teal-600">
        <div class="max-h-[80vh] overflow-y-auto">
          <table class="w-full table-fixed border-separate border-spacing-0" id="substances-table">
            <colgroup>
              <col class="w-2/4" />
              <col class="w-1/4 hidden md:table-cell" />
              <col class="w-1/4 hidden md:table-cell" />
            </colgroup>

            <thead class="title">
              <tr class="sticky">
                <th class="sticky border-b border-teal-600 top-0 bg-[#192539] text-left p-4">
                  <button
                    class="sort-toggle"
                    :class="sortClass('name')"
                    @click="toggleSort('name')"
                  >
                    名称
                  </button>
                  <br />
                  <input
                    v-model="qName"
                    type="search"
                    class="w-full h-7 p-2 bg-slate-700 rounded-lg"
                    placeholder="名称/通称で検索"
                  />
                </th>

                <th class="hidden md:table-cell sticky border-b border-teal-600 top-0 bg-[#192539] text-left pt-4 pb-4 pr-4">
                  <button
                    class="sort-toggle"
                    :class="sortClass('category')"
                    @click="toggleSort('category')"
                  >
                    カテゴリー
                  </button>
                  <br />
                  <input
                    v-model="qCategory"
                    type="search"
                    class="w-full h-7 p-2 bg-slate-700 rounded-lg"
                    placeholder="カテゴリで検索"
                  />
                </th>

                <th class="hidden md:table-cell sticky border-b border-teal-600 top-0 bg-[#192539] text-left pt-4 pb-4 pr-4">
                  <button
                    class="sort-toggle"
                    :class="sortClass('legal')"
                    @click="toggleSort('legal')"
                  >
                    規制区分
                  </button>
                  <br />
                  <input
                    v-model="qLegal"
                    type="search"
                    class="w-full h-7 p-2 bg-slate-700 rounded-lg"
                    placeholder="規制区分で検索"
                  />
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="r in sorted"
                :key="r.id"
                class="row cursor-pointer group"
                @click="go(r.id)"
              >
                <td class="bg-[#192539] border-b border-teal-600 h-14 p-4 break-words group-hover:bg-[#2b3e5a]">
                  <div class="font-medium">{{ r.commonName }}</div>
                  <div v-if="r.aliases" class="text-slate-400 text-sm">{{ r.aliases }}</div>
                </td>

                <td class="hidden md:table-cell bg-[#192539] border-b border-teal-600 h-14 p-4 w-1/4 group-hover:bg-[#2b3e5a]">
                  {{ r.category }}
                </td>

                <td class="hidden md:table-cell bg-[#192539] border-b border-teal-600 h-14 p-4 w-1/4 group-hover:bg-[#2b3e5a]">
                  {{ r.legal }}
                </td>
              </tr>

              <tr v-if="sorted.length === 0">
                <td colspan="3" class="bg-[#192539] p-6 text-slate-300">
                  該当なし
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="!pending && !error" class="mt-2 text-slate-400 text-sm">
        件数: {{ sorted.length }} / {{ rows.length }}
      </div>
    </div>
  </section>
</template>

<style scoped>
.sort-toggle {
  cursor: pointer;
  user-select: none;
}

.sort-toggle.idle::after {
  content: "";
}

.sort-toggle.asc::after {
  content: " ▲";
}
.sort-toggle.desc::after {
  content: " ▼";
}
</style>

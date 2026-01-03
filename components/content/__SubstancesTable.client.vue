SubstanceTable.client.vue

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue"

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

const pending = ref(true)
const error = ref<unknown>(null)
const substances = ref<Substance[]>([])
const listInstance = ref<any>(null)

onMounted(async () => {
  try {
    // public/data/all_substances.json を想定（= /data/all_substances.json で取れる）
    const r = await $fetch.raw("/data/all_substances.json")

    // JSONが「配列」or「{ list: [...] }」どっちでも吸えるように保険
    substances.value = Array.isArray(r._data) ? r._data : []
} catch (e) {
    error.value = e
  } finally {
    pending.value = false
  }


  if (error.value) return

  // List.js をクライアントでだけ読み込む
  await nextTick()

  const { default: List } = await import("list.js")

  const options ={
    valueNames: ['id', 'commonName', 'aliases','category','legal'],
    item: `<tr class="row cursor-pointer group"><td class="name bg-[#192539] border-b border-teal-600 h-14 p-4 break-words group-hover:bg-[#2b3e5a]"><span class="id hidden"></span><span class="commonName"></span><br /><span class="aliases text-slate-400"></span></td><td class="category bg-[#192539] border-b border-teal-600 h-14 p-4 w-1/4 group-hover:bg-[#2b3e5a]"></td><td class="legal bg-[#192539] border-b border-teal-600 h-14 p-4 w-1/4 group-hover:bg-[#2b3e5a]"></td></tr>`
  }
  // 0件初期化でも落ちないように item テンプレを渡す（ここ超重要）
  listInstance.value = new List("substances-table", options)
  
  // データをList.jsに流し込む
  listInstance.value.add(
    substances.value.map((s) => ({
        id: s.id ?? "",
        commonName: s.common_name ?? s.id,
        aliases: s.aliases ?? "",
        category: s.categories ?? "",
        legal: s.legal?.jp?.law_category ?? ""
    }
    ))
  )
})

onMounted(async () => {
  await nextTick()

  const tbody = document.querySelector("#substances-table tbody.list")
  const router = useRouter()

  tbody?.addEventListener("click", (e) => {
    const tr = (e.target as HTMLElement).closest("tr.row")
    if (!tr) return

    const id = tr.querySelector(".id")?.textContent?.trim()
    if (!id) return

    console.log("clicked id =", id, "push url =", `/substances/${encodeURIComponent(id)}`)
    
    router.push(`/substances/${encodeURIComponent(id)}`) // ここは実際のルートに合わせて
  })
})

// ソート用クラス名トグル
// テーブルのclass名に合わせる
type SortKey = "name" | "category" | "legal"
type SortDir = "asc" | "desc"

const activeKey = ref<SortKey>("name")
const dir = ref<SortDir>("asc")

const toggleSort = (key: SortKey) => {
    // デフォルトはnameで設定されているが、HTML側のクリックeventで他のカラムのkeyが来たらactiveKeyを更新する
    if (activeKey.value === key) {
        dir.value = dir.value === "asc" ? "desc" : "asc"
    } else {
        activeKey.value = key
        dir.value = dir.value === "asc" ? "desc" : "asc"
    }
}

const sortClass = (key: SortKey) => {
    if (activeKey.value !== key) return "idle"
    return dir.value
}

</script>

<template>
    <section class="h-full min-h-0 flex flex-col">
        <div
        id="substances-table"
        class="h-full min-h-0 overflow-y-auto">
            <!-- ロード中＆失敗アナウンス -->
            <div v-if="pending">Loading...</div>
            <div v-else-if="error" class="text-red-500">
            Failed to load: {{ String(error) }}
            </div>

            <div class="border-l border-t border-b rounded-l-xl overflow-hidden border-teal-600">
              <div class="max-h-[80vh] overflow-y-auto">
                <table class="w-full table-fixed border-separate border-spacing-0">
                     <colgroup>
                      <col class="w-2/4" />
                      <col class="w-1/4" />
                      <col class="w-1/4" />
                    </colgroup>
                    <thead class="title">
                      <tr class="sticky">
                          <th class="nameTitle sticky border-b border-teal-600 top-0 bg-[#192539] text-left p-4">
                              <button class="sort sort-toggle asc" data-sort="name" :class="sortClass('name')" @click="toggleSort(`name`)">名称</button><br />
                              <input type="search" class="search w-full h-7 p-2 bg-slate-700 rounded-lg" placeholder="名称で検索" />
                          </th>
                          <th class="categoryTitle sticky border-b border-teal-600 top-0 bg-[#192539] text-left pt-4 pb-4 pr-4">
                              <button class="sort sort-toggle asc" data-sort="name" :class="sortClass('category')" @click="toggleSort(`category`)">カテゴリー</button><br />
                              <input type="search" class="search w-full h-7 p-2 bg-slate-700 rounded-lg" placeholder="カテゴリで検索" />
                          </th>
                          <th class="legalTitle sticky border-b border-teal-600 top-0 bg-[#192539] text-left pt-4 pb-4 pr-4">
                              <button class="sort sort-toggle asc" data-sort="name" :class="sortClass('legal')" @click="toggleSort(`legal`)">規制区分</button><br />
                              <input type="search" class="search w-full h-7 p-2 bg-slate-700 rounded-lg" placeholder="規制区分で検索" />
                          </th>
                      </tr>
                    </thead>
                    <tbody class="list">
                    </tbody>
                </table>
              </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.sort-toggle {
  cursor: pointer;
  user-select: none;
}

/* アクティブじゃない列は矢印なし（または薄い矢印でもOK） */
.sort-toggle.idle::after {
  content: "";
}

/* アクティブ列だけ矢印を切り替える */
.sort-toggle.asc::after {
  content: " ▲";
}
.sort-toggle.desc::after {
  content: " ▼";
}
</style>
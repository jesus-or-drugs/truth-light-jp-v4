SubstanceTable.client.vue

<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue"

type Substance = {
  id: string
  common_name?: string
  aliases?: string[]
  identifiers?: {
    pubchem_cid? : number
    inchi_key?: string
    smiles?: string
  }
  categories?: string[]
  legal?: {
    ja?: {
      law_category?: string
    }
  }
  summary?: string
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
    valueNames: ['commonName', 'aliases','category','legal'],
    item: `<tr class="border-b border-teal-600 h-14"><td class="name"><span class="commonName"></span><br /><span class="aliases"></span></td><td class="category"></td><td class="legal"></td></tr>`
  }
  // 0件初期化でも落ちないように item テンプレを渡す（ここ超重要）
  listInstance.value = new List("substances-table", options)

  console.log(substances.value[0]?.identifiers?.pubchem_cid)
  
  // データをList.jsに流し込む
    console.log("sample row:", substances.value[0])
    console.log("sample identifiers:", substances.value[0]?.identifiers)
  listInstance.value.add(
    substances.value.map((s) => ({
        commonName: s.common_name ?? s.id,
        aliases: s.aliases ?? "",
        category: s.categories ?? "",
        legal: s.legal ?? ""
    }
    ))
  )
})

// ソート用クラス名トグル
// テーブルのclass名に合わせる
type SortKey = "name"  
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
        <div id="substances-table"
        class="h-full min-h-0 overflow-y-auto">
            <!-- ロード中＆失敗アナウンス -->
            <div v-if="pending">Loading...</div>
            <div v-else-if="error" class="text-red-500">
            Failed to load: {{ String(error) }}
            </div>

            <div class="border-l border-t border-b rounded-l-xl overflow-hidden border-teal-600">
              <div class="max-h-[70vh] overflow-y-auto">
                <table class="w-full">
                    <thead class="title border-b borderteal-600">
                      <tr class="sticky">
                          <th class="nameTitle sticky top-0 bg-slate-800 text-left">
                              <button class="sort sort-toggle asc" data-sort="name" :class="sortClass('name')" @click="toggleSort(`name`)">名称</button><br />
                              <input type="search" class="search w-2/3" placeholder="MDMA etc.." />
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
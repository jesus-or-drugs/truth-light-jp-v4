<script setup lang="ts">
type Substance = {
  id: string
  name_ja: string
  name_en: string
  aliases: string[]
  categories: string[]
  legal: string[]
  summary: string
}

const { data: substances } = await useFetch<Substance[]>("/data/substances.json")

const selectedCategories = ref<string[]>([])
const selectedLegal = ref<string[]>([])

const allCategories = computed(() => {
  const set = new Set<string>()
  for (const s of substances.value ?? []) for (const c of s.categories ?? []) set.add(c)
  return Array.from(set).sort()
})

const allLegal = computed(() => {
  const set = new Set<string>()
  for (const s of substances.value ?? []) for (const l of s.legal ?? []) set.add(l)
  return Array.from(set).sort()
})

const filtered = computed(() => {
  const raw = substances.value

  // raw が配列のときだけそれを使う。違う形なら items を見る。なければ空配列。
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as any)?.items)
      ? (raw as any).items
      : []

  return list.filter((s) => {
    const catOk =
      selectedCategories.value.length === 0 ||
      selectedCategories.value.every((c) => (s.categories ?? []).includes(c))

    const legalOk =
      selectedLegal.value.length === 0 ||
      selectedLegal.value.every((l) => (s.legal ?? []).includes(l))

    return catOk && legalOk
  })
})

</script>

<template>
  <div class="prose prose-neutral dark:prose-invert max-w-none">
    <h1>Substances</h1>
    <p>Tripsit風：一覧＋フィルタ（検索なし）</p>

    <div class="not-prose grid gap-6 md:grid-cols-4">
      <!-- Filters -->
      <aside class="md:col-span-1 space-y-6">
        <div>
          <div class="font-semibold mb-2">カテゴリ</div>
          <label v-for="c in allCategories" :key="c" class="flex items-center gap-2 text-sm">
            <input type="checkbox" :value="c" v-model="selectedCategories" />
            <span>{{ c }}</span>
          </label>
        </div>

        <div>
          <div class="font-semibold mb-2">法規制</div>
          <label v-for="l in allLegal" :key="l" class="flex items-center gap-2 text-sm">
            <input type="checkbox" :value="l" v-model="selectedLegal" />
            <span>{{ l }}</span>
          </label>
        </div>

        <button class="text-sm underline" @click="selectedCategories = []; selectedLegal = []">
          クリア
        </button>
      </aside>

      <!-- List -->
      <section class="md:col-span-3">
        <div class="text-sm opacity-70 mb-3">表示件数：{{ filtered.length }}</div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="s in filtered"
            :key="s.id"
            :to="`/substance/${s.id}`"
            class="border rounded-lg p-4 hover:bg-muted/50 transition"
          >
            <div class="font-semibold">{{ s.name_ja }}</div>
            <div class="text-xs opacity-70">{{ s.name_en }}</div>
            <div class="text-sm mt-2 line-clamp-3 opacity-80">{{ s.summary }}</div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

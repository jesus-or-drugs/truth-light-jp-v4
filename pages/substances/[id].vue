<template>
  <div class="min-h-screen">
    <div class="container mx-auto max-w-screen-xl px-4 py-8">
      <!-- Header -->
      <header class="mb-6">
        <div class="text-sm text-slate-400 mb-2">
          <NuxtLink to="/substances" class="hover:underline">Substances</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-slate-300">{{ routeId }}</span>
        </div>

        <h1 class="text-3xl font-bold leading-tight">
          {{ titleJa || titleEn || routeId }}
        </h1>

        <p v-if="titleEn || titleJa" class="mt-2 text-slate-300">
          <span v-if="titleEn">{{ titleEn }}</span>
          <span v-if="titleEn && titleJa" class="mx-2 text-slate-500">•</span>
          <span v-if="titleJa">{{ titleJa }}</span>
        </p>

        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <span v-if="substance?.id" class="rounded-full border border-teal-600/60 px-3 py-1 text-teal-300">
            id: {{ substance.id }}
          </span>
          <span v-if="substance?.pubchem_cid" class="rounded-full border border-slate-600/60 px-3 py-1 text-slate-200">
            PubChem CID: {{ substance.pubchem_cid }}
          </span>
          <span v-if="substance?.inchikey" class="rounded-full border border-slate-600/60 px-3 py-1 text-slate-200">
            InChIKey: {{ substance.inchikey }}
          </span>
        </div>
      </header>

      <!-- Not found -->
      <div v-if="notFound" class="rounded-2xl border border-red-500/40 bg-red-500/10 p-6">
        <p class="text-red-200 font-semibold">Not found</p>
        <p class="mt-2 text-slate-200">
          JSON が見つからなかった：<span class="font-mono">{{ routeId }}</span>
        </p>
        <p class="mt-4 text-slate-300 text-sm">
          例：ファイル名が <span class="font-mono">alpha_pvp.json</span> なのに URL が
          <span class="font-mono">/substances/α-PVP</span> みたいになってるとズレる。
        </p>
      </div>

      <!-- Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Main -->
        <main class="lg:col-span-8 space-y-6">
          <!-- Summary -->
          <section class="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-6">
            <h2 class="text-xl font-semibold mb-3">概要</h2>
            <p v-if="substance?.summary" class="leading-relaxed text-slate-200 whitespace-pre-line">
              {{ substance.summary }}
            </p>
            <p v-else class="text-slate-400">概要はまだありません。</p>
          </section>

          <!-- Tabs (no shadcn dependency) -->
          <section class="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-6">
            <div class="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3 mb-4">
              <button
                v-for="t in tabs"
                :key="t.key"
                class="rounded-full px-4 py-1.5 text-sm border transition"
                :class="activeTab === t.key
                  ? 'border-teal-500/70 text-teal-200 bg-teal-500/10'
                  : 'border-slate-600/60 text-slate-200 hover:bg-slate-800/40'"
                @click="activeTab = t.key"
              >
                {{ t.label }}
              </button>
            </div>

            <!-- effects -->
            <div v-if="activeTab === 'effects'">
              <h3 class="text-lg font-semibold mb-2">効果</h3>
              <p v-if="substance?.effects" class="text-slate-200 whitespace-pre-line">{{ substance.effects }}</p>
              <p v-else class="text-slate-400">未記載</p>
            </div>

            <!-- dosage -->
            <div v-if="activeTab === 'dosage'">
              <h3 class="text-lg font-semibold mb-2">用量・作用時間</h3>
              <p v-if="substance?.dosage" class="text-slate-200 whitespace-pre-line">{{ substance.dosage }}</p>
              <p v-else class="text-slate-400">未記載</p>
            </div>

            <!-- experiences -->
            <div v-if="activeTab === 'experiences'">
              <h3 class="text-lg font-semibold mb-2">体験談</h3>
              <p v-if="substance?.experiences" class="text-slate-200 whitespace-pre-line">{{ substance.dosage }}</p>
              <p v-else class="text-slate-400">未記載</p>
            </div>

            <!-- External resources -->
            <div v-if="activeTab === 'resources'">
              <h3 class="text-lg font-semibold mb-3">外部リンク</h3>

              <div v-if="resourceLinks.length" class="space-y-3">
                <div
                  v-for="link in resourceLinks"
                  :key="link.label"
                  class="rounded-xl border border-slate-700/60 bg-slate-950/30 p-4"
                >
                  <p class="text-sm text-slate-300 mb-1">{{ link.label }}</p>
                  <a
                    class="text-teal-300 hover:underline break-all"
                    :href="link.url"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {{ link.url }}
                  </a>
                </div>
              </div>

              <p v-else class="text-slate-400">未記載</p>
            </div>

          </section>
        </main>

        <!-- Side -->
        <aside class="lg:col-span-4 space-y-6">
          <section v-if="substance?.identifiers?.smiles">
            <ClientOnly>
              <ContentKetcherFrame :smiles="substance?.identifiers?.smiles" />
            </ClientOnly>
          </section>
          <section class="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-6">
            <h2 class="text-lg font-semibold mb-3">基本情報</h2>

            <dl class="space-y-3 text-sm">
              <div class="flex gap-3">
                <dt class="w-28 text-slate-400">系統名</dt>
                <dd class="flex-1 text-slate-200 break-words">
                  {{ substance?.name_en_systematic || substance?.systematic_name || "—" }}
                </dd>
              </div>

              <div class="flex gap-3">
                <dt class="w-28 text-slate-400">カテゴリー</dt>
                <dd class="flex-1 text-slate-200 break-words">
                  {{ substance?.psychoactive_class || substance?.class || "—" }}
                </dd>
              </div>

              <div class="flex gap-3">
                <dt class="w-28 text-slate-400">法規制</dt>
                <dd class="flex-1 text-slate-200 break-words">
                  {{ substance?.jp_legal_status || "—" }}
                </dd>
              </div>

              <div class="flex gap-3">
                <dt class="w-28 text-slate-400">SMILES</dt>
                <dd class="flex-1 text-slate-200 break-words">
                  {{ substance?.identifiers?.smiles || "—" }}
                </dd>
              </div>

            </dl>
          </section>

          <section class="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-6">
            <h2 class="text-lg font-semibold mb-3">ルートID確認</h2>
            <p class="text-slate-300 text-sm">
              URL param: <span class="font-mono text-slate-200">{{ routeId }}</span>
            </p>
            <p class="mt-2 text-slate-400 text-sm">
              読み込み対象ファイル候補:
              <span class="font-mono">{{ triedIds.join(", ") }}</span>
            </p>
          </section>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "substances",
})

// ✅ ここが“500避け”のキモ：存在するJSONをglobで全部拾う
const JSON_MODULES = import.meta.glob("~/data/substances/*.json")

type AnyObj = Record<string, any>

const route = useRoute()
const routeId = computed(() => String(route.params.id ?? ""))

/**
 * URL param とファイル名がズレがちなケースがあるので候補を複数作る
 * 例: "α-PVP" -> "α-pvp", "α_pvp", "alpha_pvp" など
 * ※必要に応じて増やせる
 */
function normalizeId(s: string) {
  return s
    .trim()
    .replace(/%2F/gi, "/")
    .replace(/\s+/g, "_")
    .replace(/-+/g, "_")
    .toLowerCase()
}

function alphaFallback(s: string) {
  // 超ざっくり（必要なら本格対応する）
  return s
    .replace(/α/gi, "alpha")
    .replace(/β/gi, "beta")
    .replace(/γ/gi, "gamma")
    .replace(/δ/gi, "delta")
}

const triedIds = computed(() => {
  const raw = decodeURIComponent(routeId.value)
  const a = raw
  const b = normalizeId(raw)
  const c = normalizeId(alphaFallback(raw))
  // 重複排除
  return Array.from(new Set([a, b, c].filter(Boolean)))
})

// modules のキー（パス） -> basename(id) に変換してマップ化
const moduleMap = computed(() => {
  const map = new Map<string, string>()
  for (const p of Object.keys(JSON_MODULES)) {
    const base = p.split("/").pop()?.replace(/\.json$/, "")
    if (base) map.set(base, p)
  }
  return map
})

const { data: substance, error } = await useAsyncData<AnyObj | null>(
  () => `substance-${routeId.value}`,
  async () => {
    const candidates = triedIds.value
    const map = moduleMap.value

    for (const id of candidates) {
      const path = map.get(id)
      if (!path) continue

      const loader = JSON_MODULES[path] as () => Promise<any>
      const mod = await loader()
      return mod.default ?? mod
    }

    // 見つからない場合は null にしてテンプレで Not found 表示
    return null
  },
  { watch: [routeId] }
)

const notFound = computed(() => !substance.value && !error.value)

// UI
const tabs = [
  { key: "effects", label: "効果" },
  { key: "dosage", label: "用量・作用時間" },
  { key: "experiences", label: "体験談"},
  { key: "resources", label: "外部リンク" },
] as const

const activeTab = ref<(typeof tabs)[number]["key"]>("effects")

const titleJa = computed(() => substance.value?.name_ja ?? substance.value?.name?.ja ?? "")
const titleEn = computed(() => substance.value?.name_en ?? substance.value?.name?.en ?? "")

const aliases = computed<string[]>(() => {
  const a = substance.value?.aliases
  if (Array.isArray(a)) return a.filter(Boolean)
  return []
})

const resourceLinks = computed(() => {
  const r = substance.value?.external_resources ?? substance.value?.resources ?? null
  if (!r || typeof r !== "object") return []
  const out: Array<{ label: string; url: string }> = []
  for (const [k, v] of Object.entries(r)) {
    if (typeof v === "string" && v.trim()) out.push({ label: k, url: v.trim() })
  }
  return out
})
</script>

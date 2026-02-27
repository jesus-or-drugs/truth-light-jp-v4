<template>
  <div class="min-h-screen">
    <div class="container mx-auto max-w-screen-xl px-4 py-8">
      <!-- Header -->
      <header class="mb-6">
        <div class="text-sm text-slate-400 mb-2">
          <NuxtLink to="/substances" class="hover:underline">Substances</NuxtLink>
          <span class="mx-2">/</span>
          <span class="text-slate-200">{{ routeId }}</span>
        </div>

        <h1 class="text-3xl text-white custom-font-bold leading-tight h-auto">{{ titleJa }}</h1>

        <div class="mt-3 flex flex-wrap gap-2 text-xs">
          <span v-if="substance?.id" class="rounded-full border border-teal-600/60 px-3 py-1 text-teal-300">
            ID: {{ substance.id }}
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
            <h2 class="text-xl text-slate-100 font-semibold mb-3">概要</h2>
            <div
              v-if="substance?.summary"
              class="leading-relaxed"
              v-html="substance.summary"
            />
            <p v-else class="text-slate-400">概要はまだありません。</p>
          </section>

          <!-- History -->
          <section
            v-if="substance?.history"
            class="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-6">

            <h2 class="text-xl text-slate-100 font-semibold mb-3">ヒストリー</h2>
            <div
              class="leading-relaxed"
              v-html="substance.history"
            />
          </section>

          <!-- タブ -->
          <section class="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-6">
            <div class="flex flex-wrap gap-2 border-b border-slate-700/60 pb-3 mb-4">
              <button
                v-for="t in tabs"
                :key="t.key"
                class="rounded-full px-4 py-1.5 text-sm border transition"
                :class="activeTab === t.key
                  ? 'border-teal-600/60 text-teal-300 bg-teal-500/10'
                  : 'border-slate-700/60 text-slate-200 hover:bg-slate-700/30'"
                @click="activeTab = t.key"
              >
                {{ t.label }}
              </button>
            </div>

            <div v-if="activeTab === 'effects'">
              <template v-if="((substance?.effects?.effects_positive?.length ?? 0) + (substance?.effects?.effects_negative?.length ?? 0)) > 0">
                <!-- ポジ -->
                <section v-if="(substance?.effects?.effects_positive?.length ?? 0) > 0" class="mb-6">
                  <h3 class="text-lg font-semibold mb-2">ポジティブな効果</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li
                      v-for="(ep, i) in (substance?.effects?.effects_positive ?? [])"
                      :key="`pos-${i}`"
                    >
                      {{ ep }}
                    </li>
                  </ul>
                </section>

                <!-- ネガ -->
                <section v-if="(substance?.effects?.effects_negative?.length ?? 0) > 0">
                  <h3 class="text-lg font-semibold mb-2">ネガティブな効果</h3>
                  <ul class="list-disc pl-5 space-y-1">
                    <li
                      v-for="(en, i) in (substance?.effects?.effects_negative ?? [])"
                      :key="`neg-${i}`"
                    >
                      {{ en }}
                    </li>
                  </ul>
                </section>
              </template>

              <!-- 両方ない -->
              <p v-else class="text-slate-400">記載なし</p>
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
                <dt class="w-28 text-slate-400">系統名<sup>[1]</sup></dt>
                <dd class="flex-1 text-slate-200 break-words">
                  {{ substance?.systematic_name || "—" }}
                </dd>
              </div>

              <div class="flex gap-3">
                <dt class="w-28 text-slate-400">SMILES<sup>[1]</sup></dt>
                <dd class="w-28 flex-1 text-slate-200 break-words">
                  {{ substance?.identifiers?.smiles || "—" }}
                </dd>
              </div>

              <div class="flex gap-3">
                <dt class="w-28 text-slate-400">カテゴリー</dt>
                <dd class="flex-1 text-slate-200 break-words">
                  <span v-for="cat in substance?.categories">{{cat || "—" }}</span>
                </dd>
              </div>

              <div class="flex gap-3">
                <dt class="w-28 text-slate-400">法規制</dt>
                <dd class="flex-1 text-slate-200 break-words">
                  <span class="block">{{ substance?.legal?.jp?.law_category || "—" }}</span>
                  <span v-if="substance?.legal?.jp?.source_link" class="block underline"><a :href="substance?.legal?.jp?.source_link" target="_blank">[一次ソース]</a></span>
                </dd>
              </div>
            </dl>
          </section>

          <!-- <section class="rounded-2xl border border-slate-700/60 bg-slate-900/30 p-6">
            <h2 class="text-lg font-semibold mb-3">ルートID確認</h2>
            <p class="text-slate-300 text-sm">
              URL param: <span class="font-mono text-slate-200">{{ routeId }}</span>
            </p>
            <p class="mt-2 text-slate-400 text-sm">
              読み込み対象ファイル候補:
              <span class="font-mono">{{ triedIds.join(", ") }}</span>
            </p>
          </section> -->
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ContentKetcherFrame from '~/components/content/KetcherFrame.vue'
definePageMeta({
  layout: "substances",
})

const appConfig = useAppConfig();
const categoryList =appConfig.truthlight?.categories ?? [];

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

const titleJa = computed(() => substance.value?.common_name ?? substance.value?.id ?? "")

console.log(`titleJaの中身: ${titleJa}`)

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

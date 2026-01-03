<!-- pages/substances/[id].vue -->

<template>
  <div v-if="substance" class="container mx-auto px-4 md:px-6 py-8">

    <div class="grid gap-6 md:grid-cols-2">

      <!-- <SubstanceHero
      :substance_name="substance.name.ja"
      :aliases="substance.aliases"
      :iupac_name="substance.iupac_name"
      :categories="substance.categories"
      :legal="substance.legal.jp"

      :pubchem_cid="substance.identifier.pubchem_cid"
      :smiles="substance.identifier.smiles"
      /> -->

      <section class="md:col-span-2">
        <div>
          <h2>概要</h2>
          <p>{{ substance.summary }}</p>
        </div>

        <div>
          <h2>効果</h2>
          <p>ポジティブな作用：{{ substance.effects.effects_positive }}</p>
          <p>ネガティブな作用：{{ substance.effects.effects_negative }}</p>
        </div>
        
        <div>
          <h2>用法用量・持続時間</h2>
          <p>{{ substance.external_resources.dosage_duration}}</p>
        </div>


        <div v-if="substance.history !== ''">
          <h2 v-if="substance.history !== ''">経験談</h2>
          <p v-if="substance.history !== ''">{{substance.external_resources.experiences}}</p>

        </div>

        <div>
          <h2></h2>
          <p>{{ substance.external_resources.experiences }}</p>
        </div>

      </section>
    </div>
  </div>

</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import type SubstanceHeroVue from '~/components/content/SubstanceHero.vue';

const route = useRoute()
const id = computed(() => String(route.params.id))
console.log("route param id =", route.params.id)
watch(
  id,
  async (newId) => {
    try {
      const mod = await import(`~/data/substances/${newId}.json`)
      substance.value = mod.default
    } catch (e) {
      // 無いIDで500にせず、404にしたいなら
      throw createError({ statusCode: 404, statusMessage: `Substance not found: ${newId}` })
      // もしくは substance.value = null にして v-if で「見つかりません」表示でもOK
    }
  },
  { immediate: true }
)

definePageMeta({
  key: (route) => String(route.params.id),
  layout: "substances"
})

// JSON を動的に読む
const substance = await import(`~/data/substances/${id}.json`)
  .then(m => m.default)


async function smilesToCid(smiles : string) {
  const res = await fetch("https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/smiles/cids/JSON", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
    body: new URLSearchParams({ smiles }),
  });
  const data = await res.json();
  return data?.IdentifierList?.CID?.[0] ?? null;
}

function cidToPngUrl(cid: string, size = "300x300") {
  return `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/record/PNG?image_size=${size}`;
}

type Link = { label: string; href: string }

const props = withDefaults(
  defineProps<{
    experience?: string
    history?: string
    // このサイト内では「具体的な用量/使用手順」は書かない想定
    dosageNote?: string
    dosageLinks?: Link[]
  }>(),
  {
    experience: "",
    history: "",
    dosageNote:
      "このページでは安全上の理由から、具体的な用量・使用方法の案内は扱いません。必ず信頼できる外部情報源・医療情報を参照し、緊急時は医療機関へ相談してください。",
    dosageLinks: () => [],
  }
)



</script>

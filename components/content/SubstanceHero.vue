<script setup lang="ts">
type Props = {
  substance_name: string
  aliases?: string[]
  iupac_name?: string[]
  categories?: string[]
  legal?: string[]
  pubchem_cid?: string[]
  smiles?: string[]
}
const props = defineProps<Props>()

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
</script>

<template>
  <section class="min-h-screen w-full items-center justify-center">
    <div class="grid grid-cols-1 md:grid-cols-2">
        <section id="substance_image" class="mx-auto">
            <div class="item-center justify-center">
                <span
                v-if="pubchem_cid === ''" <!-- PubChemのCIDがわからなければSMILESで画像を取得 -->
                ><img :src="smilesToCid(smailes)" alt="{$slot.id}化学構造式" /></span>
                <span
                v-else
                ><img :src="cidToPngUrl(pubchem_cid)" alt="化学構造式" /></span>
            </div>
        </section>

        <section id="basics" class="">
            <h1 class="text-2xl font-bold mb-4">
                {{ substance_name }}
            </h1>

            <h2 class="inline-block mb-1 text-lg">IUPAC名：<br/>{{ iupac_name }}</h2>

            <div>
                <p class="inline-block mb-1 text-lg">カテゴリ：
                <span v-for="category in categories" :class="mx-2"
                >{{ category }}&nbsp;</span>
                </p>
            </div>


            <p id="regulation_badges" class="inline-block mb-1 text-lg">法規制：<span>{{ legal }}</span></p>
            

            <p class="inline-block mb-1 text-lg">
            エイリアス:
                <span
                    v-for="(alias, index) in aliases"
                    :key="alias"
                    class="mr-3 p-2 rounded-md text-white inline"
                >
                    {{ alias }}<span v-if="index < aliases.length - 1">,</span>
                </span>
            </p>
<!--             <ul class="inline-block list-none p-0 m-0">
                <li v-for="(alias, index) in aliases"
                :key="alias"
                class= "mr-3 p-2 rounded-md text-white inline"
                >
                {{ alias }}
                <span v-if="index < aliases.length - 1">,</span>
                </li>
            </ul>       -->
        </section>


    </div>
  </section>
</template>

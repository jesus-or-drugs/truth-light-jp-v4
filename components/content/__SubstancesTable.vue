<script setup lang="ts">
import { onMounted, nextTick } from 'vue';

onMounted(async () =>{
    const list = (await import('list.js')).default

    await nextTick()

    const options = {
        valueNames: ['name', 'alias', 'legal', 'category', 'summary']
    }
    const listObj = new list('substancesDB', options)
    const { data: substances, pending, error } = await useFetch<Substance[]>("public/data/all_substances.json")
    console.log("substances(value) on client:", substances.value)

})

type Substance = {
  id: string
  name: { ja: string; en: string }
  iupac_name?: string
  aliases?: string[]
  identifier?: {
    pubchem_cid?: string
    inchi_key?: string
    smiles?: string
  }
  categories: string[]
  legal?: { jp?: string }
  summary?: string
}

</script>

<template>
    <section class="px-3">

            <div id="substances-table">
                <div v-if="pending">読み込み中...</div>
                <div v-else-if="error">読み込みに失敗：{{ error.message }}</div>
                <div></div>
                <table class="border-2 border-black">
                    <thead>
                    <tr>
                        <th class="sort text-left" data-sort="name">名称<br />
                            <input type="search" class="search" placeholder="検索" />
                        </th>
                        <th class="sort text-left" data-sort="alias">
                            別称等<br />
                            <input type="search" class="search" placeholder="検索" />
                        </th>
                        <th class="sort text-left" data-sort="legal">
                            規制状況<br />
                            <input type="search" class="search" placeholder="検索" />
                        </th>
                        <th class="sort text-left" data-sort="category">
                            カテゴリ<br />
                            <input type="search" class="search" placeholder="検索" />
                        </th>
                        <th class="sort text-left" data-sort="summary">
                            サマリー<br />
                            <input type="search" class="search" placeholder="検索" />
                        </th>
                    </tr>
                    </thead>
                    <tbody class="list">
                    <tr v-for="substance in (substances ?? [])" :key="substance.id">
                        <td class="name">
                            {{substance.name.ja ?? ""}}
                        </td>
                        <td class="Synonyms">
                            <span v-for="alias in substance.aliases ?? []" :key="alias" :class="alias">{{ alias }}</span>
                        </td>
                        <td class="legal">
                            <span>{{ substance.legal?.ja ?? "" }}</span>
                        </td>
                        <td class="category">
                            <span v-for="category in substances" :class="category">{{ category }}</span>
                        </td>
                        <td class="summary"><span v-for="substance in substances">{{ substance.summary }}</span></td>
                    </tr>
                    </tbody>
                </table>
            </div>

    </section>

</template>
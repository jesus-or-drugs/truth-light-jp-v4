<script setup lang="ts">
import ContentSubstancesTable from '~/components/content/ContentSubstancesTable.client.vue'

const route = useRoute()
definePageMeta({
    key: route => route.fullPath,
})

useSeoMeta({
  title: `規制物質データベース`,
  description: `現在日本で覚醒剤取締法・麻薬及び向精神薬取締法・薬機法における指定薬物で規制されている物質のデータベース`,
  ogDescription: `現在日本で覚醒剤取締法・麻薬及び向精神薬取締法・薬機法における指定薬物の規制されている物質のデータベース`,
})

</script>

<template>
  <p>substancesページです。</p>
  <ClientOnly>
    <ContentSubstancesTable :key="route.fullPath" />
    <template #fallback>
      <div class="text-base text-center mt-16">Loading…</div>
    </template>
  </ClientOnly>
</template>

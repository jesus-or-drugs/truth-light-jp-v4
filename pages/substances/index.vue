<script setup lang="ts">
import ContentSubstancesTable from '~/components/content/SubstancesTable.client.vue'
definePageMeta({ layout: "substances" })



</script>

<template>
  <ClientOnly>
    <ContentSubstancesTable />
    <template #fallback>
      <div class="text-slate-400 text-sm px-6 pt-5">Loading…</div>
    </template>
  </ClientOnly>
</template>

<template>
    <div class="flex items-center gap-2"">
        <a v-for="i in tocLinks" :href="i.to" class="inline rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"><img :src="`/${i.icon}`" :alt="i.title" class="w-4" /></a>
    </div>
</template>

<script setup lang="ts">
type TocConfig = [{
  title?: string
  icon?: string
  to?: string
  target?: string
}]

const appConfig = useAppConfig()

const toc = appConfig.truthlight?.toc ?? {}

const tocEnable = (toc.enable ?? false) as boolean
const tocLinks = (toc.links ?? []) as TocConfig


</script>
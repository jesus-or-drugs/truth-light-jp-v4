<template>
    <div class="flex items-center gap-2"">
        <a v-for="i in links" :href="i.to" class="inline rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"><img :src="`/${i.icon}`" :alt="i.title" class="w-4" /></a>
    </div>
</template>

<script setup lang="ts">
type SocialLinkConfig = [{
  title?: string
  icon?: string
  to?: string
  target?: string
}]

const appConfig = useAppConfig()
const socialLinks = appConfig.truthlight?.header?.socialLinks ?? {}

const links = (socialLinks.links ?? []) as SocialLinkConfig


</script>
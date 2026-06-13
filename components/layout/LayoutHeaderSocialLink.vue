<template>
    <div class="flex items-center gap-2"">
        <a v-for="i in links" :href="i.to" class="inline">
            <img :src="`/${i.icon}`" :alt="i.title" class="w-4 h-auto" />
        </a>
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
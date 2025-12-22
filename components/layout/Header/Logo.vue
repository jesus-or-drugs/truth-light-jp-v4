<template>
  <div>
    <NuxtLink v-if="logo?.light && logo?.dark" to="/" class="flex">
      <NuxtImg :src="logo.dark" class="h-7 dark:block" />
      <span v-if="showTitle && title" class="ml-3 self-center text-2xl text-white font-bold">
        {{ title }}
      </span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
type LogoConfig = {
  light?: string
  dark?: string
}

const appConfig = useAppConfig()

const header = appConfig.truthlight?.header ?? {}

const logo = (header.logo ?? {}) as LogoConfig
const title = (header.title ?? "") as string
const showTitle = (header.showTitle ?? true) as boolean
</script>

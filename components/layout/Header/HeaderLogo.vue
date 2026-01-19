<template>
  <div class="flex items-center gap-3">
    <NuxtLink v-if="logo?.black && logo?.white" to="/" class="flex">
      <NuxtImg :src="logo.white" class="h-7 dark:block" />
      <span v-if="showTitle && title" class="text-sm font-semibold tracking-wide"
      style="font-family: 'Avenir', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif';">
        {{ title }}
      </span>
    </NuxtLink>

    <span v-if="props.subtitle !== ``" class="ml-3 self-center text-white font-bold text-lg hidden md:inline-block">{{ props.subtitle }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: string,
  subtitle?: string
}>()

type LogoConfig = {
  white?: string
  black?: string
}

const appConfig = useAppConfig()

const header = appConfig.truthlight?.header ?? {}
const logo = (header.logo ?? {}) as LogoConfig

const title = (header.title ?? "") as string
const showTitle = (header.showTitle ?? true) as boolean
</script>

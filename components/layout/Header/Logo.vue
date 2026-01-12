<template>
  <div>
    <NuxtLink v-if="logo?.light && logo?.dark" to="https://www.truth-light.jp/" class="flex">
      <NuxtImg :src="logo.dark" class="relative top-[0.08rem] h-7 dark:block" />
      <span v-if="showTitle && title" class="ml-3 self-center text-2xl text-teal-400 font-bold drop-shadow-xl drop-shadow-teal-400"
      style="font-family: 'Avenir', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif';">
        {{ title }}
      </span>
      <span v-if="props.subtitle !== ``" class="ml-3 self-center text-white font-bold text-lg hidden md:inline-block">{{ props.subtitle }}</span>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: string,
  subtitle?: string
}>()

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

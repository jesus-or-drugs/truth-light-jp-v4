<template>
  <div class="flex flex-row items-center gap-2 mx-auto md:mx-0">
    <NuxtLink v-if="logo?.black && logo?.white" to="/" class="flex flex-row items-center gap-2 no-underline">
      <NuxtImg :src="logo.black" class="h-7 dark:block" />
      <span v-if="showTitle && title" class="custom-font-bold text-lg tracking-wide">
        {{ title }}
      </span>
    </NuxtLink>

    <span v-if="props.subtitle !== ``" class="ml-3 custom-font-bold text-base hidden md:inline-block">
      {{ props.subtitle }}
    </span> 
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

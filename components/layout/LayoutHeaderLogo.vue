<template>
  <div class="flex flex-row items-center gap-2 mx-auto md:mx-0">
    <NuxtLink to="/" class="flex flex-row items-center gap-2 no-underline">
      <NuxtImg :src="logo" class="h-8" />
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

const appConfig = useAppConfig()

const header = appConfig.truthlight?.header ?? {}
const logo = header.logo ?? ''
const title = header.title ?? ''
</script>

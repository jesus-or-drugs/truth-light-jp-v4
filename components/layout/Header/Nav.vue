<template>
<nav 
class="hidden items-center gap-6 text-sm text-slate-300 hover:text-white md:flex">
        <a
        v-for="i in nav" :href="i.to">
            {{ i.title }}
        </a>
</nav>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const props = defineProps<{
  variant?: "default" | "substances" | "legal",
}>()

const nav = appConfig.truthlight?.header?.nav ?? {}


</script>

<template>
<div>
    <ul
    class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-row gap-5 text-base text-white font-bold">
        <li
        v-for="i in nav">
            <a :href="i.to">{{ i.title }}</a>
        </li>
    </ul>
</div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()
const props = defineProps<{
  variant?: "default" | "substances" | "legal",
}>()

const nav = appConfig.truthlight?.header?.nav ?? {}


</script>

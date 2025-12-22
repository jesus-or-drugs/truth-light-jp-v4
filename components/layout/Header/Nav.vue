<template>
<div>
    <ul class="flex flex-row gap-5 text-base text-white font-bold">
        <li
        v-for="i in nav">
            <a :href="i.to">{{ i.title }}</a>
        </li>
    </ul>
</div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig()

const nav = appConfig.truthlight?.header?.nav ?? {}
</script>

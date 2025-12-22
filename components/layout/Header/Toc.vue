<template>
    <ul v-if="tocEnable === true" class="flex flex-row gap-5">
        <li
        v-for="i in tocLinks">
            <a :href="i.to"><img :src="i.icon" :alt="i.title" class="w-4" /></a>
        </li>
    </ul>
</template>

<script setup lang="ts">
type TocConfig = [{
  title?: string
  icon?: string
  to?: string
  target?: string
}]

const appConfig = useAppConfig()

const toc = appConfig.truthlight?.toc ?? {}

const tocEnable = (toc.enable ?? false) as boolean
const tocLinks = (toc.links ?? []) as TocConfig


</script>
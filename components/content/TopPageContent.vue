<script setup lang="ts">
const { data: notices } = await useAsyncData('notices-home', () =>
  queryContent('/notices')
    .sort({ date: -1 })
    .limit(8)
    .only(['title', 'date', '_path'])
    .find()
)

const { data: news } = await useAsyncData('news-home', () =>
  queryContent('/news')
    .sort({ date: -1 })
    .limit(8)
    .only(['title', 'date', 'description', '_path'])
    .find()
)

const fmt = (d?: string) => (d ? new Date(d).toISOString().slice(0, 10) : '')
</script>

<template>
    <section class="topPage container w-2xl my-8 px-4">
        <slot />
    </section>
</template>

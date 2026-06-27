<template>
  <NuxtLink
    v-for="feed in noteFeeds"
    :to="feed.title" class="block p-4 hover:bg-white/10">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-medium">{{ feed.title }}</h3>
      <p class="text-xs text-slate-400">{{ feed.pubDate }}</p>
    </div>
    <p class="mt-1 text-xs text-slate-400">{{ feed.contentSnippet }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
const noteFeeds = await $fetch('/api/feeds/note-feeds')
console.log(noteFeeds)

</script>
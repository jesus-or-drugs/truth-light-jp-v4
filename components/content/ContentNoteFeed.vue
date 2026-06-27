<template>
  <NuxtLink
    v-for="feed in noteFeeds"
    :to="feed.title" class="block p-4 hover:bg-white/10 no-underline">
    <div class="">
      <p class="text-xs text-slate-400 text-left">{{ feed.pubDate }}</p>
      <h3 class="text-base font-medium">{{ feed.title }}</h3>
    </div>
    <p class="mt-1 text-xs text-slate-400">{{ feed.contentSnippet }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
const noteFeeds = await $fetch('/api/feeds/note-feeds')

noteFeeds.forEach(noteFeed => {
  noteFeeds.push(formatDateToYMD(noteFeed))
});

function formatDateToYMD(dateString?: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

</script>
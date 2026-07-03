<template>
  <NuxtLink
    v-for="feed in formattedNoteFeeds"
    :to="feed.link" class="block p-4 hover:bg-white/10 no-underline">
    <div class="">
      <p class="text-xs text-slate-400 text-right">{{ feed.fmtDate }}</p>
      <h3 class="text-base font-medium">{{ feed.title }}</h3>
    </div>
    <p class="mt-1 text-xs text-slate-400">{{ feed.contentSnippet }}</p>
  </NuxtLink>
</template>

<script setup lang="ts">
type NoteFeed = {
  title?: string
  link?: string
  pubDate?: string
  contentSnippet?: string
}

type FormattedNoteFeed = NoteFeed & {
  fmtDate: string
}

const noteFeeds = await $fetch<NoteFeed[]>('/api/feeds/note-feeds')

const formattedNoteFeeds: FormattedNoteFeed[] = noteFeeds.map((noteFeed) => {
  return {
    ...noteFeed,
    fmtDate: formatDateToYMD(noteFeed.pubDate as string)
  }
})

function formatDateToYMD(dateString?: string): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  console.log(date)

  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

</script>
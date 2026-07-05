<template>
  <main class="mx-auto max-w-4xl px-6 py-16 text-[#25343F]">
    <h1 class="mb-10 text-3xl font-bold">
      更新情報
    </h1>

    <ul class="space-y-6">
      <li
        v-for="item in sortedNews"
        :key="item.id"
        class="border-b border-slate-200 pb-6"
      >
        <div class="mb-2 flex flex-wrap items-center gap-3 text-sm">
          <time class="text-slate-500">{{ item.date }}</time>
          <span class="rounded-full bg-[#FF9B51]/15 px-3 py-1 text-[#B85A1D]">
            {{ categoryLabels[item.category] }}
          </span>
        </div>

        <h2 class="mb-2 text-xl font-bold">
          <NuxtLink
            v-if="item.href"
            :to="item.href"
            class="hover:text-[#FF9B51]"
          >
            {{ item.title }}
          </NuxtLink>
          <span v-else>{{ item.title }}</span>
        </h2>

        <p class="text-slate-600">
          {{ item.summary }}
        </p>
      </li>
    </ul>
  </main>
</template>

<script setup lang="ts">
import { newsItems } from '~/data/news'

const sortedNews = [...newsItems].sort((a, b) => {
  return new Date(b.date).getTime() - new Date(a.date).getTime()
})

const categoryLabels = {
  site: 'サイト更新',
  law: '法規制',
  substance: '物質情報',
  article: '記事',
}
</script>
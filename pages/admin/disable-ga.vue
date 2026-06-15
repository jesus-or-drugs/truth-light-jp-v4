<script setup lang="ts">
onMounted(() => {
  localStorage.setItem('tl_disable_ga', '1')
})
</script>

<template>
  <main class="mx-auto max-w-xl px-6 py-16">
    <h1 class="mb-4 text-2xl font-bold">
      GA計測を無効化しました。
    </h1>

    <p class="text-slate-600">
      このブラウザからのアクセスはGoogle Analyticsに送信されません。
    </p>
  </main>
</template>
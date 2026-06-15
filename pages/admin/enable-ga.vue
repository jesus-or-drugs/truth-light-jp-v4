<script setup lang="ts">
onMounted(() => {
  localStorage.removeItem('tl_disable_ga')
})
</script>

<template>
  <main class="mx-auto max-w-xl px-6 py-16">
    <h1 class="mb-4 text-2xl font-bold">
      GA計測を有効化しました
    </h1>

    <p class="text-slate-600">
      このブラウザからのアクセスはGoogle Analyticsに送信されます。
    </p>
  </main>
</template>
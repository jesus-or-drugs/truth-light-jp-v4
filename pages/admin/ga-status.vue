<script setup lang="ts">
const gaStatus = ref<'loading' | 'disabled' | 'enabled'>('loading')
const storedValue = ref<string | null>(null)

onMounted(() => {
  storedValue.value = localStorage.getItem('tl_disable_ga')

  if (storedValue.value === '1') {
    gaStatus.value = 'disabled'
  } else {
    gaStatus.value = 'enabled'
  }
})
</script>

<template>
  <main class="mx-auto max-w-xl px-6 py-16">
    <h1 class="mb-6 text-2xl font-bold text-[#25343F]">
      GA計測ステータス確認
    </h1>

    <div
      class="rounded-2xl border border-[#BFC9D1] bg-[#EAEFEF] p-6"
    >
      <p class="mb-3 text-sm text-slate-500">
        現在のブラウザに保存されている設定
      </p>

      <template v-if="gaStatus === 'loading'">
        <p class="text-lg font-bold text-slate-600">
          確認中...
        </p>
      </template>

      <template v-else-if="gaStatus === 'disabled'">
        <p class="text-lg font-bold text-[#FF9B51]">
          GA計測は無効です
        </p>

        <p class="mt-3 text-sm text-slate-600">
          localStorage の <code>tl_disable_ga</code> が <code>1</code> になっています。
        </p>
      </template>

      <template v-else>
        <p class="text-lg font-bold text-[#25343F]">
          GA計測は有効です
        </p>

        <p class="mt-3 text-sm text-slate-600">
          localStorage の <code>tl_disable_ga</code> が <code>1</code> ではありません。
        </p>
      </template>

      <div class="mt-6 rounded-xl bg-white/70 p-4 text-sm text-slate-600">
        <p class="mb-1 font-bold text-[#25343F]">
          保存されている値
        </p>

        <code>
          tl_disable_ga: {{ storedValue ?? '未設定' }}
        </code>
      </div>
    </div>
  </main>
</template>
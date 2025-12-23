<template>
  <div class="bg-teal-50 min-h-screen"
  style="font-family: 'ヒラギノ角ゴシック Pro', 'Hiragino Kaku Gothic Pro', '游ゴシック体', 'Yu Gothic', 'YuGothic', 'メイリオ', 'Meiryo', 'sans-serif';">
    <slot />
  </div>
</template>

<script setup lang="ts">
  const appConfig = useAppConfig()
</script>
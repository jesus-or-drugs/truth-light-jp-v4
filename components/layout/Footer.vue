<template>
    <!-- デフォルトページ用 -->
    <footer v-if="props.variant === `default`" class="mb-4">
        <p class="text-slate-400 text-center">{{ copyright }}</p>
    </footer>

    <footer v-else-if="props.variant === `substances`" class="mb-4">
        <p class="text-slate-400 text-center">{{ copyright }}</p>
    </footer>

    <footer v-else-if="props.variant === `legal`" class="mb-4">
        <p class="text-slate-400 text-center">{{ copyright }}</p>
    </footer>

    <footer v-else class="mb-4">
        <p class="text-slate-400 text-center">{{ copyright }}</p>
    </footer>


</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: "default" | "substances" | "legal",
}>()

const appConfig = useAppConfig()

const footer = appConfig.truthlight?.footer

const copyright = footer.credits
</script>
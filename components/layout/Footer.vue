<template>
    <!-- デフォルトページ用 -->
    <footer v-if="props.variant === `default`" class="pb-4">
        <p class="text-slate-300 text-center">{{ copyright }}</p>
    </footer>

    <footer v-else-if="props.variant === `substances`" class="pb-4">
        <p class="text-slate-300 text-center">{{ copyright }}</p>
    </footer>

    <footer v-else-if="props.variant === `legal`" class="pb-4">
        <p class="text-slate-300 text-center">{{ copyright }}</p>
    </footer>

    <footer v-else class="pb-4">
        <p class="text-slate-300 text-center">{{ copyright }}</p>
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
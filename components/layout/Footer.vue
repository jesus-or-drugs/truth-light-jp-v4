<template>
    <footer class="w-fit mx-auto mb-6 px-6 py-1 rounded-lg bg-slate-900">
        <p class="text-white text-center">{{ copyright }}</p>
    </footer>
</template>

<script setup lang="ts">
    const appConfig = useAppConfig()

    const footer = appConfig.truthlight?.footer

    const copyright = footer.credits
</script>
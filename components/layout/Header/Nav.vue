<template>
<nav 
id="mobile-menu"
class="md:hidden border-t"
v-show="open">
    <div class="px-4 py-3 flex flex-col gap-3">
        <span
        v-for="i in nav">
            <NextLink  :to="i.to">{{ i.title }}</NextLink>
        </span>
    </div>
</nav>
</template>

<script setup lang="ts">
import { ref } from "vue"
const open = ref(false)

const appConfig = useAppConfig()
const props = defineProps<{
  variant?: "default" | "substances" | "legal",
}>()

const nav = appConfig.truthlight?.header?.nav ?? {}


</script>

<template>
  <header class="top-0 z-50">
    <div class="relative h-16 mx-auto px-10 flex flex-row items-center justify-between">
      <div class="md:hidden w-[34px] h-[34px]"><LayoutHeaderMobileNav /></div>
      <div><LayoutHeaderLogo :subtitle="subtitle" /></div>
      <div class="h-full hidden md:inline-block"><LayoutHeaderNav /></div>
      <div class=""><LayoutHeaderSocialLink /></div>
    </div>

    <div
      v-show="open"
      class="fixed inset-0 z-40 bg-black/20 md:hidden"
      @click="close"
      aria-hidden="true"
    ></div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue"
const open = ref(false)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)

const props = defineProps<{
  variant?: "default" | "substances",
}>()

const variant = computed(() => props.variant ?? "default")

const subtitle = computed(() => {
  if (variant.value === "default") {
    return ""
  } else if (variant.value === "substances") {
    return "規制物質データベース"
  } else {
    return ""
  }
})

const appConfig = useAppConfig();
const route = useRoute();

</script>

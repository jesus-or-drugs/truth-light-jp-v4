<template>
  <section class="flex w-auto flex-col mb-12 items-center justify-center py-6 min-h-screen bg-cover bg-center bg-no-repeat"
  :style="{ backgroundImage: `url(${bgImg})` }">
    <h1 class="text-3xl md:text-6xl text-white font-bold leading-tight tracking-wide
           [filter:drop-shadow(0_6px_18px_rgba(0,0,0,0.90))] my-5 lg:leading-[1.1]">
      NPSデータベース開発中
    </h1>
    <div class="flex">
        <!-- <LayoutSearchBar />  -->
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  actions: {
    name?: string;
    leftIcon?: string;
    rightIcon?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    to?: string;
    target?: Target;
  }[];
}>();
defineSlots();

const appConfig = useAppConfig()

const hero = appConfig.truthlight?.hero

const bgImg = (hero.background ?? "") as string
</script>

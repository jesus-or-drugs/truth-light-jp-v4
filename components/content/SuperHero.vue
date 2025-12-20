<template>
  <section class="flex w-auto flex-col mb-3 items-center justify-center py-6 min-h-screen bg-[url(/hexagon-upscale.png)] bg-cover bg-center bg-no-repeat">
    <h1 class="text-center text-3xl font-bold leading-tight tracking-wide drop-shadow-lg/40 my-5 md:text-6xl lg:leading-[1.1]">
      <ContentSlot :use="$slots.title" unwrap="p" />
    </h1>
    <div class="flex">

      <!-- <ClientOnly fallback-tag="div" fallback="loading..."> -->
        <LayoutSearchBar />
      <!-- </ClientOnly> -->
       
    </div>
  </section>
</template>

<script setup lang="ts">
import type { S } from 'vue-router/dist/router-CWoNjPRp.mjs';

defineProps<{
  announcement?: {
    to?: string;
    target?: Target;
    icon?: string;
    title: string;
  };
  actions: {
    name: string;
    leftIcon?: string;
    rightIcon?: string;
    variant?: 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost';
    to: string;
    target?: Target;
  }[];
}>();
defineSlots();
</script>

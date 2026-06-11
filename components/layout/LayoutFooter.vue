<template>
  <footer class="pb-4 bg-[#BFC9D1] border-t border-[#EAEFEF]/20">
    <div class="mx-auto max-w-6xl px-6 py-10">
      <div class="grid gap-8 md:grid-cols-3">
        <div>
          <p class="text-sm custom-font-bold">Truth Light</p>
          <p class="mt-2 text-sm">
            Truth Lightは薬物に対する正しい情報と依存症からの回復の道を提供します。
          </p>
        </div>

        <div class="text-sm">
          <p class="custom-font-bold">リンク</p>
          <div class="mt-2 space-y-2">
            <a v-for="link in links" class="block text-[#25343F]/70 hover:text-[#FF9B51]" :href="link.to"
              :target="link.target">
              {{ link.title }}
            </a>
          </div>
        </div>

        <div class="text-sm">
          <p class="custom-font-bold">外部リソース</p>
          <div class="mt-2 space-y-2">
            <a v-for="resource in resources" class="block text-[#25343F]/70 hover:text-[#FF9B51]" :href="resource.to"
              :target="resource.target">
              {{ resource.title }}
            </a>
          </div>
        </div>
      </div>

      <div class="mt-16 text-xs text-slate-500 text-center">
        <p>私たちはキリストの死と復活と十字架による罪の赦しを信じているキリスト教系の団体です。</p>
        <p>本サイトの目的は薬物依存症の人を回復に回復の方法を提供すること意図としており、無理な宗教勧誘等は行いません。</p>
      </div>

      <div class="mt-8 text-xs text-slate-500 text-center">
        <p>当サイトの画像やデザインは一部生成AIを利用しています。</p>
        <p>記事本文は一部生成AIによる情報収集を行い一次ソースを確認しファクトチェックを行った上で掲載しています。</p>
      </div>


      <p class="mt-4 text-xs text-[#25343F] text-center">
        © <span id="year"></span> Truth Light. All rights reserved.
      </p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: "default" | "substances",
}>()

const appConfig = useAppConfig()

const site = appConfig.truthlight?.site ?? ''

const footer = appConfig.truthlight?.footer ?? ''
const links = footer.links ?? ''
const resources = footer.resources ?? ''
const copyright = footer.credits
</script>
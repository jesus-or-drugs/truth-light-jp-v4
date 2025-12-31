<template>
  <div class="prose">
    <ContentSuperHero />

    <section class="flex flex-col w-auto items-center justify-center mb-12 py-6">
      <h2 class="mb-6 text-3xl font-bold"
      style="font-family: 'Avenir', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif';"
      >Purpose</h2>
      <p class="text-lg">この日本で薬物依存症より苦しむ人を0にする</p>
    </section>

    <section class="flex flex-col w-auto items-center justify-center mb-12 py-6">
      <h2 class="mb-6 text-3xl font-bold"
      style="font-family: 'Avenir', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif';"
      >Vision</h2>
      <p class="text-lg">私たちは薬物の乱用を推奨しないかつ依存症者もまた裁かない。</p>
      <p class="text-lg">信頼できる向精神薬の情報のアーカイブを体系化し、誰でもアクセスできる形で公開する。</p>
      <p class="text-lg">医者やカウンセラー、依存症当事者またはその家族あらゆる横のつながりを構築する</p>
    </section>

    <section class="flex flex-col w-auto items-center justify-center mb-12 py-6">
      <h2 class="mb-6 text-3xl font-bold"
      style="font-family: 'Avenir', 'Avenir Next', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif';"
      >Value</h2>
      <p class="text-lg">神学的</p>
      <p class="text-lg">哲学的</p>
      <p class="text-lg">社会学的</p>
      <p class="text-lg">心理学的</p>
      <p class="text-lg">薬理学的</p>
      <p class="text-lg">上記で挙げたように様々な切り口から薬物依存症というものを研究する</p>
    </section>

  </div>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();

useSeoMeta({
  title: `${appConfig.truthlight.site.name ?? '404'}`,
  ogTitle: appConfig.truthlight.site.name,
  description: appConfig.truthlight.site.name,
  ogDescription: appConfig.truthlight.site.name,
  ogImage: appConfig.truthlight.site.ogImage,
  twitterCard: 'summary_large_image'
});
</script>

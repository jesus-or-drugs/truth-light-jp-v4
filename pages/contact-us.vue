<script setup lang="ts">
const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
})

const isSubmitting = ref(false)
const isSent = ref(false)
const errorMessage = ref('')

const handleSubmit = async () => {
  isSubmitting.value = true
  isSent.value = false
  errorMessage.value = ''

  try {
    await $fetch('/api/contact-us', {
      method: 'POST',
      body: form,
    })

    isSent.value = true

    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  } catch (error) {
    errorMessage.value = '送信に失敗しました。時間をおいて再度お試しください。'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <section class="mx-auto mt-16 mb-16 max-w-2xl rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-[#BFC9D1]">
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-[#25343F]">
        お問い合わせ
      </h2>
      <p class="mt-2 text-sm leading-7 text-[#25343F]/70">
        ご質問・ご相談・情報提供などがありましたら、以下のフォームよりご連絡ください。
      </p>
    </div>

    <form class="space-y-5" @submit.prevent="handleSubmit">
      <div>
        <label for="name" class="mb-1 block text-sm font-bold text-[#25343F]">
          お名前
        </label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          name="name"
          autocomplete="name"
          required
          class="w-full rounded-xl border border-[#BFC9D1] bg-white px-4 py-3 text-[#25343F] outline-none transition focus:border-[#FF9B51] focus:ring-2 focus:ring-[#FF9B51]/30"
          placeholder="夢可愛アイ"
        />
      </div>

      <div>
        <label for="email" class="mb-1 block text-sm font-bold text-[#25343F]">
          メールアドレス
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          required
          class="w-full rounded-xl border border-[#BFC9D1] bg-white px-4 py-3 text-[#25343F] outline-none transition focus:border-[#FF9B51] focus:ring-2 focus:ring-[#FF9B51]/30"
          placeholder="example@example.com"
        />
      </div>

      <div>
        <label for="subject" class="mb-1 block text-sm font-bold text-[#25343F]">
          件名
        </label>
        <input
          id="subject"
          v-model="form.subject"
          type="text"
          name="subject"
          required
          class="w-full rounded-xl border border-[#BFC9D1] bg-white px-4 py-3 text-[#25343F] outline-none transition focus:border-[#FF9B51] focus:ring-2 focus:ring-[#FF9B51]/30"
          placeholder="お問い合わせの件名"
        />
      </div>

      <div>
        <label for="message" class="mb-1 block text-sm font-bold text-[#25343F]">
          お問い合わせ内容
        </label>
        <textarea
          id="message"
          v-model="form.message"
          name="message"
          rows="7"
          required
          class="w-full resize-y rounded-xl border border-[#BFC9D1] bg-white px-4 py-3 text-[#25343F] outline-none transition focus:border-[#FF9B51] focus:ring-2 focus:ring-[#FF9B51]/30"
          placeholder="お問い合わせ内容を入力してください"
        />
      </div>

      <div class="rounded-xl bg-[#EAEFEF] p-4 text-xs leading-6 text-[#25343F]/70">
        送信いただいた内容は、今後のサイト開発のために活用させていただきます。<br />
        いただいた情報をTruth Light運営者以外のいかなる第三者に開示することはありません。<br />
        緊急性の高い医療・法律・安全に関する相談には対応できません。<br />
      </div>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full rounded-xl bg-[#FF9B51] px-5 py-3 font-bold text-white shadow-md transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {{ isSubmitting ? '送信中...' : '送信する' }}
      </button>

      <p v-if="isSent" class="rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">
        お問い合わせを受け付けました。
      </p>

      <p v-if="errorMessage" class="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">
        {{ errorMessage }}
      </p>
    </form>
  </section>
</template>
<template>
  <div class="relative w-full h-[70vh] overflow-hidden rounded-xl bg-black/10">
    <iframe
      ref="iframeEl"
      :src="ketcherUrl"
      class="absolute inset-0 w-full h-full border-0 block"
      loading="lazy"
      referrerpolicy="no-referrer"
      allow="clipboard-read; clipboard-write"
      @load="onIframeLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch, computed } from "vue"

const props = defineProps<{ smiles?: string | null }>()

const KETCHER_ORIGIN = "https://ketcher.truth-light.jp"
const ketcherUrl = computed(() => `${KETCHER_ORIGIN}/`)

const iframeEl = ref<HTMLIFrameElement | null>(null)
const ready = ref(false)
let helloTimer: number | null = null

function postSmiles(smiles?: string | null) {
  console.log("[parent] postSmiles called:", { ready: ready.value, smiles })

  if (!smiles) return
  const win = iframeEl.value?.contentWindow
  console.log("[parent] iframe window exists?", !!win)

  if (!win) return
  // READY待ちを親側でやめるのもアリだけど、ここでは握手後に送る
  
  console.log("[parent] send TL_SET_SMILES ->", smiles)
  if (!ready.value) return

  win.postMessage({ type: "TL_SET_SMILES", smiles }, KETCHER_ORIGIN)
}

function sendHello() {
  const win = iframeEl.value?.contentWindow
  if (!win) return
  win.postMessage({ type: "TL_HELLO" }, KETCHER_ORIGIN)
}

function onIframeLoad() {
  // iframeロード後にHELLO（数回リトライ）
  sendHello()
  if (helloTimer) window.clearInterval(helloTimer)
  helloTimer = window.setInterval(() => {
    if (ready.value) {
      if (helloTimer) window.clearInterval(helloTimer)
      helloTimer = null
      return
    }
    sendHello()
  }, 500)
}

function onMessage(ev: MessageEvent) {
  if (ev.origin !== KETCHER_ORIGIN) return

  if (ev.data?.type === "TL_READY") {
    ready.value = true
    postSmiles(props.smiles)
  }
}

if (process.client) {
  window.addEventListener("message", onMessage)
}

onBeforeUnmount(() => {
  if (process.client) window.removeEventListener("message", onMessage)
  if (helloTimer) window.clearInterval(helloTimer)
  helloTimer = null
})

watch(
  () => props.smiles,
  (s) => postSmiles(s),
  { immediate: true }
)
</script>

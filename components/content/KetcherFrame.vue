<template>
  <div class="relative h-[70vh] w-full overflow-hidden rounded-lg border border-slate-600 bg-white">
    <iframe
      src="https://ketcher.truth-light.jp/"
      class="absolute inset-0 h-full w-full border-0 block"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  smiles: string
}>()

const frame = ref<HTMLIFrameElement | null>(null)
const ketcher = shallowRef<any>(null)

async function onLoad() {
  const win = frame.value?.contentWindow as any
  if (!win?.ketcher) return

  ketcher.value = win.ketcher

  // SMILES を描画（Ketcher API: setMolecule は “any supported format” を受ける）
  await ketcher.value.setMolecule(props.smiles)
}

watch(
  () => props.smiles,
  async (next) => {
    if (!ketcher.value || !next) return
    await ketcher.value.setMolecule(next)
  }
)
</script>

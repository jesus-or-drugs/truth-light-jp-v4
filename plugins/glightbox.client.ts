// plugins/glightbox.client.ts
import { nextTick } from 'vue'
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.css'

export default defineNuxtPlugin((nuxtApp) => {
  let lightbox: ReturnType<typeof GLightbox> | undefined

  nuxtApp.hook('page:finish', async () => {
    await nextTick()

    lightbox?.destroy()

    lightbox = GLightbox({
      selector: '.glightbox',
      touchNavigation: true,
      zoomable: true,
    })
  })
})
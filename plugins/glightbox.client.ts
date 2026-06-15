// plugins/glightbox.client.ts
import GLightbox from 'glightbox'
import 'glightbox/dist/css/glightbox.css'

export default defineNuxtPlugin(() => {
  GLightbox({
    selector: '.glightbox',
  })
})
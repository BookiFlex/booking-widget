import { createApp } from 'vue'
import BookingWidget from './App.vue'
import i18n from '@/i18n.js'

createApp(BookingWidget)
  .use(i18n)
  .mount('#app')

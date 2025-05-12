import { createApp } from 'vue'
import BookingWidget from './App.vue'
import i18n from '@/i18n.js'

const start = new Date()
start.setDate(start.getDate() + 5)

const end = new Date()
end.setDate(start.getDate() + 3)

createApp(BookingWidget, {
  start: start.toISOString().split('T')[0],
  end: end.toISOString().split('T')[0],
})
  .use(i18n)
  .mount('#app')

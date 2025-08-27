import { createApp } from 'vue'
import BookingWidget from './App.vue'
import i18n from '@/i18n.js'
import { getStartEndDates } from '@/util/date.js'

const start = new Date()
start.setDate(start.getDate() + 5)

const end = new Date()
end.setDate(start.getDate() + 3)

createApp(BookingWidget, getStartEndDates())
  .use(i18n)
  .mount('#app')

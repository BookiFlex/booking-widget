import { createApp } from 'vue'
import BookingWidget from './App.vue'
import { getStartEndDates } from '@/util/date.js'

const start = new Date()
start.setDate(start.getDate() + 5)

const end = new Date()
end.setDate(start.getDate() + 3)

createApp(BookingWidget, getStartEndDates())
  .mount('#app')

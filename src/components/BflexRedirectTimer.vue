<template>
  <div class="payment-timer-container">
    <div v-if="captureToken" class="timer-wrapper">
      <div class="timer-circle">
        <svg class="timer-svg" width="120" height="120">
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#e5e7eb"
            stroke-width="4"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="#ff0000"
            stroke-width="4"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            transform="rotate(-90 60 60)"
            class="timer-progress"
          />
        </svg>
        <div class="timer-text">
          {{ formatTime(timeLeft) }}
        </div>
      </div>

      <button
        ref="manualOpenBtn"
        @click="openManually"
        class="button proceed-button"
        :disabled="!captureToken"
        >{{ t('redirectTimer.goToPay') }}</button>
    </div>

    <div v-else class="no-token-message">
      <p>{{ t('redirectTimer.waitingLink') }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  captureToken: {
    type: String,
    required: false,
    default: ''
  },
  timeout: {
    type: Number,
    required: false,
    default: 60
  },
  blank: {
    type: Boolean,
    required: false,
    default: false
  }
})

const timeLeft = ref(props.timeout)
const intervalId = ref(null)
const radius = 50
const circumference = 2 * Math.PI * radius
const manualOpenBtn = ref(null)

const strokeDashoffset = computed(() => {
  const progress = timeLeft.value / props.timeout
  return circumference * (1 - progress)
})

const { t } = useI18n()

// Методы
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const proceedToPayment = () => {
  manualOpenBtn.value.click()
}

const openManually = () => {
  if (!props.captureToken) return

  stopTimer()

  if (props.blank) {
    const newWindow = window.open(props.captureToken, '_blank')
    if (!newWindow) {
      manualOpenBtn.value.innerHTML = t('redirectTimer.doesntOpen')
      alert(t('redirectTimer.windowBlocked'))
    }
  } else {
    window.location.href = props.captureToken
  }
}

const startTimer = () => {
  if (!props.captureToken) return

  stopTimer() // Останавливаем предыдущий таймер, если есть
  timeLeft.value = props.timeout

  intervalId.value = setInterval(() => {
    timeLeft.value--

    if (timeLeft.value <= 0) {
      proceedToPayment()
    }
  }, 1000)
}

const stopTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
    intervalId.value = null
  }
}

// Следим за изменениями props
watch(() => props.captureToken, (newToken) => {
  if (newToken) {
    startTimer()
  } else {
    stopTimer()
  }
}, { immediate: true })

watch(() => props.timeout, (newTimeout) => {
  timeLeft.value = newTimeout
  if (props.captureToken) {
    startTimer()
  }
})

// Lifecycle hooks
onMounted(() => {
  if (props.captureToken) {
    startTimer()
  }
})

onUnmounted(() => {
  stopTimer()
})
</script>

<style></style>

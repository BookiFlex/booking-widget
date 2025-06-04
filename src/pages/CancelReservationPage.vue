<script setup>
import { defineProps, onMounted, ref, watch, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { cancelReservation, loadReservation } from '../api/api.js'
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue'
import BflexInformationBlock from '../components/InformationBlock/BflexInformationBlock.vue'
import BflexHeader from '../components/InformationBlock/BflexHeader.vue'
import BflexDivider from '../components/InformationBlock/BflexDivider.vue'
import BflexContent from '../components/InformationBlock/BflexContent.vue'
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue'
import BflexHotelInformationCard from '@/components/BflexHotelInformationCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'
import { useFormattedCancellationPolicy } from '../util/text.js'
import BflexButton from '@/components/ui/BflexButton.vue'
import BflexFieldDecorator from '@/components/ui/BflexFieldDecorator.vue'

const props = defineProps({
  sid: {
    type: String,
    required: true,
    default: '',
  },
})
const { t } = useI18n()

const settings = inject('settings')
const data = ref(null)
const loading = ref(true)

const { setError } = inject('globalError')

const loadReservationCallback = async () => {
  if (!props.sid) {
    return
  }

  loading.value = true
  try {
    const result = await loadReservation({ sid: atob(props.sid) })
    data.value = result.data
  } catch (error) {
    setError(error)
  } finally {
    loading.value = false
  }
}

const { formatDescription } = useFormattedCancellationPolicy()

const cancellationCode = ref('')
const cancellationInProgress = ref(false)
const onClickAction = async () => {
  cancellationInProgress.value = false
  const result = await cancelReservation({ sid: atob(props.sid), code: cancellationCode.value })
  if (result.successful) {
    alert(t('cancellationProcess.result.success'))
    window.location.replace(window.location.origin)
  } else {
    alert(t('cancellationProcess.result.error'))
    cancellationCode.value = ''
  }
}

watch(() => props.sid, loadReservationCallback)
onMounted(loadReservationCallback)
</script>

<template>
  <BflexGridGap>
    <BflexSkeletonLoader v-if="loading"></BflexSkeletonLoader>
    <template v-else>
      <section class="reservation-result">
        <div class="reservation-result__title">{{ t('cancellationProcess.title') }}</div>
        <div class="reservation-result__description">{{ t(`cancellationProcess.description`) }}</div>
      </section>

      <BflexChosenAccommodationsCard
        mode="cancellation"
        :reservation="data.reservation"
        :summary="data.summary"
        :payment="data.payment"
        :locale="settings.widget.locale"
      >
        <BflexContent>
          <dl class="accommodation-list__payment-rules">
            <dt style="color: orangered">{{ t('chosenAccommodation.penalty') }}:</dt>
            <dd style="color: orangered">{{ data.reservation.penalties.total.amount }} {{ data.reservation.penalties.total.currency }}</dd>
          </dl>
        </BflexContent>
        <BflexDivider></BflexDivider>
        <div style="display: flex; flex-direction: row; justify-content: end; column-gap: 0.5rem; padding: 1rem; align-items: center;">
          <div>{{ t('cancellationProcess.codeHelp') }}</div>
          <BflexFieldDecorator :label="t('cancellationProcess.codeLabel')" hide-hint>
            <input name="cancellationCode" :value="cancellationCode" @input.stop="(e) => cancellationCode = e.currentTarget.value" />
          </BflexFieldDecorator>
          <BflexButton @click="onClickAction" :disabled="!cancellationCode">{{ t('cancellationProcess.action') }}</BflexButton>
        </div>
      </BflexChosenAccommodationsCard>

      <BflexInformationBlock class="information-block--attention">
        <BflexHeader>{{ t('cancellationProcess.rules') }}</BflexHeader>
        <BflexDivider></BflexDivider>
        <BflexContent>
          <ul class="agreement-rules-list__rules">
          <li
            v-for="(i, index) in formatDescription(data.reservation.cancellationPolicy.consequences)"
            :key="index"
          >{{ i }}</li>
          </ul>
        </BflexContent>
      </BflexInformationBlock>

      <BflexHotelInformationCard :hotel-info="settings.hotelInfo" />
    </template>
  </BflexGridGap>
</template>

<style lang="scss"></style>

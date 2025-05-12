<script setup>
import { defineProps, onMounted, ref, watch, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadReservation } from '../api/api.js'
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue'
import BflexInformationBlock from '../components/InformationBlock/BflexInformationBlock.vue'
import BflexHeader from '../components/InformationBlock/BflexHeader.vue'
import BflexDivider from '../components/InformationBlock/BflexDivider.vue'
import BflexContent from '../components/InformationBlock/BflexContent.vue'
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue'
import BflexHotelInformationCard from '@/components/BflexHotelInformationCard.vue'
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue'

const props = defineProps({
  sid: {
    type: String,
    required: true,
    default: '',
  },
})
const { t } = useI18n()

const settings = inject('settings')
const reservation = ref(null)
const loading = ref(true)

const { setError } = inject('globalError')

const loadReservationCallback = async () => {
  if (!props.sid) {
    return
  }

  loading.value = true
  try {
    const result = await loadReservation({ sid: props.sid })
    reservation.value = result.reservations
  } catch (error) {
    setError(error)
  } finally {
    loading.value = false
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
        <div class="reservation-result__title">{{ t('reservation.title') }}</div>
        <div class="reservation-result__description">{{ t('reservation.description') }}</div>
      </section>

      <BflexChosenAccommodationsCard
        :items="reservation.reservations"
        :summary="reservation.summary"
        :payment="reservation.payment"
        :locale="settings.widget.locale"
        dummy
      ></BflexChosenAccommodationsCard>

      <BflexInformationBlock v-if="reservation.note">
        <BflexHeader>{{ t('reservation.customerRequest') }}</BflexHeader>
        <BflexDivider></BflexDivider>
        <BflexContent>{{ reservation.note }}</BflexContent>
      </BflexInformationBlock>

      <BflexHotelInformationCard :hotel-info="settings.hotelInfo" />
    </template>
  </BflexGridGap>
</template>

<style lang="scss"></style>

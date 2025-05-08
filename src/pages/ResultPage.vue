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
const loading = ref(false)

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
  <section v-if="reservation" class="reservation-result">
    <div class="reservation-result__title">{{ t('reservation.title') }}</div>
    <div class="reservation-result__description">{{ t('reservation.description') }}</div>

    <BflexSkeletonLoader v-if="loading"></BflexSkeletonLoader>
    <BflexChosenAccommodationsCard
      v-else
      :items="reservation.reservations"
      :summary="reservation.summary"
      :payment="reservation.payment"
      dummy
    ></BflexChosenAccommodationsCard>

    <BflexInformationBlock v-if="reservation.note">
      <BflexHeader>{{ t('reservation.customerRequest') }}</BflexHeader>
      <BflexDivider></BflexDivider>
      <BflexContent>{{ reservation.note }}</BflexContent>
    </BflexInformationBlock>

    <div
      style="width: 150px; height: 3px; margin: 0 auto; margin-bottom: 1em; background: gray"
    ></div>
    <BflexInformationBlock>
      <BflexHeader>{{ t('reservation.hotelInfo.title') }}</BflexHeader>
      <BflexDivider></BflexDivider>
      <BflexContent>
        <div class="hotel-information">
          <span class="icon-text">
            <span class="icon-text__icon material-icons">hotel</span>
            <span class="icon-text__text">{{ settings.hotelInfo.name }}</span>
          </span>
          <span class="icon-text">
            <span class="icon-text__icon material-icons">home</span>
            <span class="icon-text__text">{{ settings.hotelInfo.address.address }}</span>
          </span>
          <span class="icon-text">
            <span class="icon-text__icon material-icons">phone</span>
            <span class="icon-text__text">{{ settings.hotelInfo.phone }}</span>
          </span>
          <span class="icon-text">
            <span class="icon-text__icon material-icons">email</span>
            <span class="icon-text__text"
              >{{ t('reservation.hotelInfo.email') }}: <a href="#">{{ settings.hotelInfo.email }}</a></span
            >
          </span>
        </div>
      </BflexContent>
    </BflexInformationBlock>
  </section>
</template>

<style lang="scss">
</style>

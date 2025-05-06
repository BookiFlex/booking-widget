<script setup>
import { defineProps, onMounted, ref, watch, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { loadReservation } from '../api/api.js'
import ChosenAccommodationsBlock from '../components/ChosenAccommodationsBlock.vue'
import InformationBlock from '../components/InformationBlock/InformationBlock.vue'
import Header from '../components/InformationBlock/Header.vue'
import Divider from '../components/InformationBlock/Divider.vue'
import Content from '../components/InformationBlock/Content.vue'
import Skeleton from '../components/Skeleton/Skeleton.vue'

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

    <Skeleton v-if="loading"></Skeleton>
    <ChosenAccommodationsBlock
      v-else
      :items="reservation.reservations"
      :summary="reservation.summary"
      :payment="reservation.payment"
      dummy
    ></ChosenAccommodationsBlock>

    <InformationBlock v-if="reservation.note">
      <Header>{{ t('reservation.customerRequest') }}</Header>
      <Divider></Divider>
      <Content>{{ reservation.note }}</Content>
    </InformationBlock>

    <div
      style="width: 150px; height: 3px; margin: 0 auto; margin-bottom: 1em; background: gray"
    ></div>
    <InformationBlock>
      <Header>{{ t('reservation.hotelInfo.title') }}</Header>
      <Divider></Divider>
      <Content>
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
      </Content>
    </InformationBlock>
  </section>
</template>

<style lang="scss">
</style>

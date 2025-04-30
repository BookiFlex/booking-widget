<script setup>
import { defineProps, onMounted, ref, watch, inject } from 'vue'
import { loadReservation } from '../api/api.js'
import AccommodationsCard from '../components/AccommodationsCard.vue'
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

const settings = inject('settings')
const reservation = ref(null)
const loading = ref(false)

const loadReservationCallback = async () => {
  if (!props.sid) {
    return
  }

  loading.value = true
  const result = await loadReservation({ sid: props.sid })
  reservation.value = result.reservations
  loading.value = false
}

watch(() => props.sid, loadReservationCallback)
onMounted(loadReservationCallback)
</script>

<template>
  <section v-if="reservation" class="reservation-result">
    <div class="reservation-result__title">Ваше бронирование оформлено!</div>
    <div class="reservation-result__description">Ожидайте подтверждение от отеля</div>

    <Skeleton v-if="loading"></Skeleton>
    <AccommodationsCard
      v-else
      :items="reservation.reservations"
      :summary="reservation.summary"
      :payment="reservation.payment"
      dummy
    ></AccommodationsCard>

    <InformationBlock v-if="reservation.note">
      <Header>Your comment</Header>
      <Divider></Divider>
      <Content>{{ reservation.note }}</Content>
    </InformationBlock>

    <div
      style="width: 150px; height: 3px; margin: 0 auto; margin-bottom: 1em; background: gray"
    ></div>
    <InformationBlock>
      <Header>Hotel information</Header>
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
              >Email: <a href="#">{{ settings.hotelInfo.email }}</a></span
            >
          </span>
        </div>
      </Content>
    </InformationBlock>
  </section>
</template>

<style lang="scss">
@forward "../assets/css/result-page.scss";
</style>

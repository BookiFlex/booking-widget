<script setup>
import { onMounted, computed, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue';
import BflexInformationBlock from '../components/InformationBlock/BflexInformationBlock.vue';
import BflexHeader from '../components/InformationBlock/BflexHeader.vue';
import BflexDivider from '../components/InformationBlock/BflexDivider.vue';
import BflexContent from '../components/InformationBlock/BflexContent.vue';
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue';
import BflexHotelInformationCard from '@/components/BflexHotelInformationCard.vue';
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue';
import { convertStatus } from '../util/text.js';
import BflexRedirectTimer from '@/components/BflexRedirectTimer.vue';
import { useBooking } from '@/composables/useBooking';

const { t } = useI18n();
const settings = inject('settings');
const { sid, reservation, loadingReservation, loadReservation } = useBooking();

onMounted(() => loadReservation(sid.value));

const statusText = computed(() => {
  if (reservation.value?.reservation) {
    return convertStatus(reservation.value.reservation.status);
  }
  return '';
});
</script>

<template>
  <BflexGridGap>
    <BflexSkeletonLoader v-if="loadingReservation" />
    <template v-else-if="reservation">
      <section class="reservation-result">
        <div class="reservation-result__title">{{ t('reservation.title') }}</div>
        <div class="reservation-result__description">
          {{ t(`reservation.description.${statusText}`) }}
        </div>
      </section>

      <BflexChosenAccommodationsCard
        mode="info"
        :reservation="reservation.reservation"
        :summary="reservation.summary"
        :payment="reservation.payment"
        :locale="settings.widget.locale"
      />

      <BflexInformationBlock class="information-block--attention">
        <BflexHeader>{{ t('reservation.whatIsNext') }}</BflexHeader>
        <BflexDivider />
        <BflexContent>
          {{ t(`reservation.nextStep.${statusText}`, { untilTime: '' }) }}
        </BflexContent>
        <template v-if="reservation.payment.captureToken">
          <BflexRedirectTimer :capture-token="reservation.payment.captureToken" :timeout="30" blank />
        </template>
      </BflexInformationBlock>

      <BflexInformationBlock v-if="reservation.reservation.specialRequest">
        <BflexHeader>{{ t('reservation.specialRequest') }}</BflexHeader>
        <BflexDivider />
        <BflexContent>{{ reservation.reservation.specialRequest }}</BflexContent>
      </BflexInformationBlock>

      <BflexHotelInformationCard :hotel-info="settings.hotelInfo" />


    </template>
  </BflexGridGap>
</template>

<style lang="scss"></style>

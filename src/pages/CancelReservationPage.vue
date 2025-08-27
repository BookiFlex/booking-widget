<script setup>
import { ref, onMounted, inject } from 'vue';
import { useI18n } from 'vue-i18n';
import BflexChosenAccommodationsCard from '../components/BflexChosenAccommodationsCard.vue';
import BflexInformationBlock from '../components/InformationBlock/BflexInformationBlock.vue';
import BflexHeader from '../components/InformationBlock/BflexHeader.vue';
import BflexDivider from '../components/InformationBlock/BflexDivider.vue';
import BflexContent from '../components/InformationBlock/BflexContent.vue';
import BflexSkeletonLoader from '../components/ui/BflexSkeletonLoader.vue';
import BflexHotelInformationCard from '@/components/BflexHotelInformationCard.vue';
import BflexGridGap from '@/components/InformationBlock/BflexGridGap.vue';
import { useFormattedCancellationPolicy } from '../util/text.js';
import BflexButton from '@/components/ui/BflexButton.vue';
import BflexFieldDecorator from '@/components/ui/BflexFieldDecorator.vue';
import { useBooking } from '@/composables/useBooking';

const { t } = useI18n();
const settings = inject('settings');
const { cancelReservationSid, cancelationData, loadingCancelation, loadCancelation, cancel } = useBooking();

onMounted(() => loadCancelation(cancelReservationSid.value));

const { formatDescription } = useFormattedCancellationPolicy();

const cancellationCode = ref('');
const cancellationInProgress = ref(false);

const onClickAction = async () => {
  cancellationInProgress.value = true;
  try {
    const result = await cancel(cancelReservationSid.value, cancellationCode.value);
    if (result.successful) {
      alert(t('cancellationProcess.result.success'));
      window.location.replace(window.location.origin);
    } else {
      alert(t('cancellationProcess.result.error'));
      cancellationCode.value = '';
    }
  } finally {
    cancellationInProgress.value = false;
  }
};
</script>

<template>
  <BflexGridGap>
    <BflexSkeletonLoader v-if="loadingCancelation" />
    <template v-else-if="cancelationData">
      <section class="reservation-result">
        <div class="reservation-result__title">{{ t('cancellationProcess.title') }}</div>
        <div class="reservation-result__description">
          {{ t('cancellationProcess.description') }}
        </div>
      </section>

      <BflexChosenAccommodationsCard
        mode="cancellation"
        :reservation="cancelationData.reservation"
        :summary="cancelationData.summary"
        :payment="cancelationData.payment"
        :locale="settings.widget.locale"
      >
        <BflexContent>
          <dl class="accommodation-list__payment-rules">
            <dt style="color: orangered">{{ t('chosenAccommodation.penalty') }}:</dt>
            <dd style="color: orangered">
              {{ cancelationData.reservation.penalties.total.amount }}
              {{ cancelationData.reservation.penalties.total.currency }}
            </dd>
          </dl>
        </BflexContent>
        <BflexDivider />
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: end;
            column-gap: 0.5rem;
            padding: 1rem;
            align-items: center;
          "
        >
          <div>{{ t('cancellationProcess.codeHelp') }}</div>
          <BflexFieldDecorator :label="t('cancellationProcess.codeLabel')" hide-hint>
            <input
              name="cancellationCode"
              :value="cancellationCode"
              @input.stop="(e) => (cancellationCode = e.currentTarget.value)"
            />
          </BflexFieldDecorator>
          <BflexButton @click="onClickAction" :disabled="!cancellationCode || cancellationInProgress">
            {{ t('cancellationProcess.action') }}
          </BflexButton>
        </div>
      </BflexChosenAccommodationsCard>

      <BflexInformationBlock class="information-block--attention">
        <BflexHeader>{{ t('cancellationProcess.rules') }}</BflexHeader>
        <BflexDivider />
        <BflexContent>
          <ul class="agreement-rules-list__rules">
            <li
              v-for="(i, index) in formatDescription(
                cancelationData.reservation.cancellationPolicy.consequences,
              )"
              :key="index"
            >
              {{ i }}
            </li>
          </ul>
        </BflexContent>
      </BflexInformationBlock>

      <BflexHotelInformationCard :hotel-info="settings.hotelInfo" />
    </template>
  </BflexGridGap>
</template>

<style lang="scss"></style>

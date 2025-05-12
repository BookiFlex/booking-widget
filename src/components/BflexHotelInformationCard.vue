<script setup>
import { useI18n } from 'vue-i18n'
import BflexHeader from '@/components/InformationBlock/BflexHeader.vue'
import BflexDivider from '@/components/InformationBlock/BflexDivider.vue'
import BflexContent from '@/components/InformationBlock/BflexContent.vue'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexIconText from '@/components/ui/BflexIconText.vue'

defineProps({
  hotelInfo: {
    type: Object,
  },
})

const { t } = useI18n()
</script>

<template>
  <BflexInformationBlock>
    <BflexHeader>{{ t('reservation.hotelInfo.title') }}</BflexHeader>
    <BflexDivider></BflexDivider>
    <BflexContent>
      <div class="hotel-information">
        <BflexIconText icon="Hotel">{{ hotelInfo.name }}</BflexIconText>
        <BflexIconText icon="Home">{{ hotelInfo.address.address }}</BflexIconText>
        <BflexIconText icon="Phone"
          ><a :href="`tel:${hotelInfo.phone}`">{{ hotelInfo.phone }}</a></BflexIconText
        >
        <BflexIconText icon="Email"
          ><a href="#">{{ hotelInfo.email }}</a></BflexIconText
        >
      </div>
    </BflexContent>
  </BflexInformationBlock>
</template>

<style scoped lang="scss"></style>

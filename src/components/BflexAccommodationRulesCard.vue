<script setup>
import { computed, defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BflexInformationBlock from '@/components/InformationBlock/BflexInformationBlock.vue'
import BflexContent from '@/components/InformationBlock/BflexContent.vue'
import BflexHeader from '@/components/InformationBlock/BflexHeader.vue'
import BflexCheckbox from '@/components/ui/BflexCheckbox.vue'
import BflexDivider from '@/components/InformationBlock/BflexDivider.vue'

const props = defineProps({
  agreements: {
    type: Array,
    default: () => [],
  },
  rules: {
    type: Array,
    default: () => [],
  },
})

const { t } = useI18n()

const combinedAgreements = computed(() => {
  return props.agreements.filter((item) => item.combined)
})

const combinedAgreementsChecked = ref(false)
const agreementsChecked = ref(props.agreements.map(() => false))
</script>

<template>
  <BflexInformationBlock class="agreement-rules-list">
    <BflexHeader>{{ t('accommodationRules.title') }}</BflexHeader>
    <template v-if="rules.length > 0">
      <BflexDivider></BflexDivider>
      <BflexContent>
        <ul class="agreement-rules-list__rules">
          <li v-for="(rule, idx) in rules" :key="idx">{{ rule.text }}</li>
        </ul>
      </BflexContent>
    </template>
    <BflexDivider></BflexDivider>
    <BflexContent>
      <div class="agreement-rules-list__agreements">
        <div v-if="combinedAgreements.length > 0" class="agreement-rules-list__agreements-item">
          <BflexCheckbox v-model="combinedAgreementsChecked" required>
            <span
              >{{ t('accommodationRules.agreementSentence') }}
              <a
                class="agreement-rules-list__combined-agreement"
                target="_blank"
                v-for="(agreement, index) in combinedAgreements"
                :href="agreement.url"
                :key="index"
                >{{ agreement.anchor }}</a
              >.</span
            >
          </BflexCheckbox>
        </div>
        <template v-for="(agreement, index) in agreements" :key="index">
          <div v-if="agreement.combined === false" class="agreement-rules-list__agreements-item">
            <BflexCheckbox v-model="agreementsChecked[index]" :required="agreement.required"
              ><span
                >{{ t('accommodationRules.agreementSentenceShort') }}
                <a target="_blank" :href="agreement.url">{{ agreement.anchor }}</a></span
              ></BflexCheckbox
            >
          </div>
        </template>
      </div>
    </BflexContent>
  </BflexInformationBlock>
</template>

<style lang="scss"></style>

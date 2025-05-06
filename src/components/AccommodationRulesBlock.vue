<script setup>
import { computed, defineProps, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import InformationBlock from '@/components/InformationBlock/InformationBlock.vue'
import Content from '@/components/InformationBlock/Content.vue'
import Header from '@/components/InformationBlock/Header.vue'
import CheckBox from '@/components/ui/CheckBox.vue'
import Divider from '@/components/InformationBlock/Divider.vue'

const props = defineProps({
  agreements: {
    type: Array,
    default: () => [],
  },
  rules: {
    type: Array,
    default: () => [],
  }
})

const { t } = useI18n()

const combinedAgreements = computed(() => {
  return props.agreements.filter((item) => item.combined)
})

const combinedAgreementsChecked = ref(false);
const agreementsChecked = ref(props.agreements.map(() => false));
</script>

<template>
  <InformationBlock class="agreement-rules-list">
    <Header>{{ t('accommodationRules.title') }}</Header>
    <template v-if="rules.length > 0">
      <Divider></Divider>
      <Content>
        <ul class="agreement-rules-list__rules">
          <li v-for="(rule, idx) in rules" :key="idx">{{ rule.text }}</li>
        </ul>
      </Content>
    </template>
    <Divider></Divider>
    <Content>
      <div class="agreement-rules-list__agreements">
        <div v-if="combinedAgreements.length > 0" class="agreement-rules-list__agreements-item">
          <CheckBox v-model="combinedAgreementsChecked" required>
            <span>{{ t('accommodationRules.agreementSentence') }}
              <a
                class="agreement-rules-list__combined-agreement"
                target="_blank"
                v-for="(agreement, index) in combinedAgreements"
                :href="agreement.url"
                :key="index"
              >{{ agreement.anchor }}</a
              >.</span>
          </CheckBox>
        </div>
      <template v-for="(agreement, index) in agreements" :key="index">
          <div v-if="agreement.combined === false" class="agreement-rules-list__agreements-item">
            <CheckBox v-model="agreementsChecked[index]" :required="agreement.required"><span
            >{{ t('accommodationRules.agreementSentenceShort') }}
                <a target="_blank" :href="agreement.url">{{ agreement.anchor }}</a></span
            ></CheckBox>
          </div>
        </template>
      </div>
    </Content>
  </InformationBlock>
</template>

<style lang="scss">
</style>

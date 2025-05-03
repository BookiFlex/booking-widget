<script setup>
import { computed, defineProps, ref } from 'vue'
import InformationBlock from '@/components/InformationBlock/InformationBlock.vue'
import Content from '@/components/InformationBlock/Content.vue'
import Header from '@/components/InformationBlock/Header.vue'
import Checkbox from '@/components/ui/Checkbox.vue'
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

const combinedAgreements = computed(() => {
  return props.agreements.filter((item) => item.combined)
})

const combinedAgreementsChecked = ref(false);
const agreementsChecked = ref(props.agreements.map(() => false));
</script>

<template>
  <InformationBlock class="agreement-rules-list">
    <Header>Accommodation rules</Header>
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
          <Checkbox v-model="combinedAgreementsChecked" required>
            <span>Подтверждаю, что ознакомился и согласен c
              <a
                class="agreement-rules-list__combined-agreement"
                target="_blank"
                v-for="(agreement, index) in combinedAgreements"
                :href="agreement.url"
                :key="index"
              >{{ agreement.anchor }}</a
              >.</span>
          </Checkbox>
        </div>
      <template v-for="(agreement, index) in agreements" :key="index">
          <div v-if="agreement.combined === false" class="agreement-rules-list__agreements-item">
            <Checkbox v-model="agreementsChecked[index]" :required="agreement.required"><span
            >Подтверждаю, что
                <a target="_blank" :href="agreement.url">{{ agreement.anchor }}</a></span
            ></Checkbox>
          </div>
        </template>
      </div>
    </Content>
  </InformationBlock>
</template>

<style lang="scss">
</style>

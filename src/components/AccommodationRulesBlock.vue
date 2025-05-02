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
  <InformationBlock>
    <Header>Accommodation rules</Header>
    <template v-if="rules.length > 0">
      <Divider></Divider>
      <Content>
        <ul>
          <li v-for="(rule, idx) in rules" :key="idx">{{ rule.text }}</li>
        </ul>
      </Content>
    </template>
    <Divider></Divider>
    <Content>
      <div class="agreements-list-items">
        <label v-if="combinedAgreements.length > 0" class="agreements-list-items__item">
          <Checkbox v-model="combinedAgreementsChecked" required></Checkbox>
          <span
          >Подтверждаю, что ознакомился и согласен c
              <a
                class="agreements-list-items__combined-agreement"
                target="_blank"
                v-for="(agreement, index) in combinedAgreements"
                :href="agreement.url"
                :key="index"
              >{{ agreement.anchor }}</a
              >.</span
          >
        </label>
        <template v-for="(agreement, index) in agreements" :key="index">
          <label v-if="agreement.combined === false" class="agreements-list-items__item">
            <Checkbox v-model="agreementsChecked[index]" :required="agreement.required"></Checkbox>
            <span
            >Подтверждаю, что
                <a target="_blank" :href="agreement.url">{{ agreement.anchor }}</a></span
            >
          </label>
        </template>
      </div>
    </Content>
  </InformationBlock>
</template>

<style lang="scss">
@forward "../assets/css/accommodation-rules-block";
</style>

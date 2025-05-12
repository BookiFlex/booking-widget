import { createI18n } from 'vue-i18n'
import l10n from './l10n.js'

const pluralizationRules = () => {
  return {
    /**
     * @param choice {number} индекс выбора, переданный в $tc: `$tc('path.to.rule', choiceIndex)`
     * @param choicesLength {number} общее количество доступных вариантов
     * @returns финальный индекс для выбора соответственного варианта слова
     */
    ru: function (choice, choicesLength) {
      if (choice === 0) {
        return 0
      }

      const teen = choice > 10 && choice < 20
      const endsWithOne = choice % 10 === 1

      if (choicesLength < 4) {
        return !teen && endsWithOne ? 1 : 2
      }
      if (!teen && endsWithOne) {
        return 1
      }
      if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
        return 2
      }

      return choicesLength < 4 ? 2 : 3
    },

    /**
     * Otóż zasada jest taka, że liczebniki 2, 3, 4 oraz liczebniki, których ostatnim członem jest 2, 3, 4 (czyli np. 22, 23, 24, 152, 153, 154 itd.)
     * łączą się z rzeczownikami w mianowniku liczby mnogiej, np. trzy koty, dwadzieścia cztery koty, sto pięćdziesiąt dwa koty.
     *
     * Liczebniki od 5 do 21 i te, które są zakończone na 5-9 (np. 25, 36, 27, 58, 69), łączą się z rzeczownikiem w dopełniaczu liczby mnogiej,
     * np. pięć kotów, siedemnaście kotów, sto siedemdziesiąt siedem kotów.
     *
     * 1 noc | 2 noce | 5 nocy
     *
     * @param choice
     */
    pl: function (choice) {
      if (choice === 0) {
        return 0
      }

      if (choice === 1) {
        return 1
      }

      if (choice % 10 >= 2 && choice % 10 <= 4 && (choice % 100 < 10 || choice % 100 >= 20)) {
        return 2
      }

      return 3
    },
  }
}

export default createI18n({
  legacy: false,
  fallbackLocale: 'en',
  locale: 'en',
  messages: l10n,
  pluralizationRules: pluralizationRules(),
})

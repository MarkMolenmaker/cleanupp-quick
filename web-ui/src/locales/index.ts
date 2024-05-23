import { createI18n } from 'vue-i18n'
import dutch from './dutch'
import english from './english'

export default createI18n({
  legacy: false,
  locale: 'nl',
  fallbackLocale: 'nl',
  messages: {
    en: english,
    nl: dutch
  },
})

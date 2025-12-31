import { initReactI18next } from 'react-i18next'
import i18n from 'i18next'

import en from './locales/en.json'
import tr from './locales/tr.json'

const lng = localStorage.getItem('currentLang')?.toString();
  

i18n.use(initReactI18next).init({
  resources: {
    en,
    tr,
  },
  lng,
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
})

export default i18n

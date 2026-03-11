import { ProductType } from '@constants/index';
import i18n from '@i18n/index';

export type SupportedLanguage = 'tr' | 'en';

const DEFAULT_LANGUAGE: SupportedLanguage = 'tr';

const englishFieldMap: Record<'name' | 'description', keyof ProductType> = {
  name: 'nameEn',
  description: 'descriptionEn',
};

const normalizeLanguage = (lang?: string | null): SupportedLanguage => {
  return lang === 'en' ? 'en' : DEFAULT_LANGUAGE;
};

const getLanguageFromI18n = (): SupportedLanguage | null => {
  const runtimeLanguage = i18n?.resolvedLanguage || i18n?.language;
  if (!runtimeLanguage) {
    return null;
  }

  return normalizeLanguage(runtimeLanguage);
};

const getLanguageFromStorage = (): SupportedLanguage | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem('currentLang');
    return storedValue ? normalizeLanguage(storedValue) : null;
  } catch (error) {
    return null;
  }
};

export const getActiveLanguage = (): SupportedLanguage => {
  return (
    getLanguageFromI18n() ||
    getLanguageFromStorage() ||
    DEFAULT_LANGUAGE
  );
};

export const getLocalizedProductText = (
  product: ProductType | undefined,
  field: 'name' | 'description',
  language?: string | null,
): string => {
  if (!product) {
    return '';
  }

  const lang = typeof language === 'undefined' || language === null
    ? getActiveLanguage()
    : normalizeLanguage(language);
  const fallbackValue = (product[field] ?? '').toString();

  if (lang === 'en') {
    const englishKey = englishFieldMap[field];
    const englishValue = product[englishKey];

    if (typeof englishValue === 'string' && englishValue.trim().length > 0) {
      return englishValue;
    }
  }

  return fallbackValue;
};

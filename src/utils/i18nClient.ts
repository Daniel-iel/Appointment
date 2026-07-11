import en from '@/i18n/en/common.json';
import ptBR from '@/i18n/pt-BR/common.json';

export type Locale = 'en' | 'pt-BR';

const messagesMap: Record<Locale, Record<string, any>> = {
  'en': en as Record<string, any>,
  'pt-BR': ptBR as Record<string, any>,
};

export function getBrowserLocale(): Locale {
  if (typeof navigator === 'undefined') return 'pt-BR';
  const lang = navigator.language || (navigator.languages && navigator.languages[0]) || 'pt-BR';
  if (lang.toLowerCase().startsWith('pt')) return 'pt-BR';
  return 'en';
}

function lookup(messages: Record<string, any>, key: string): string | undefined {
  return key.split('.').reduce((acc: any, part: string) => (acc && acc[part] !== undefined ? acc[part] : undefined), messages);
}

export function t(key: string, params?: Record<string, string | number>): string {
  const locale = getBrowserLocale();
  const messages = messagesMap[locale];
  let value = lookup(messages, key) as string | undefined;

  if (typeof value !== 'string') {
    // fallback to English then to the key itself
    value = lookup(messagesMap['en'], key) as string | undefined || key;
  }

  if (params) {
    return value.replace(/\{(\w+)\}/g, (_, p) => String(params[p] ?? `{${p}}`));
  }
  return value;
}

export default t;

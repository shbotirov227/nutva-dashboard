export const getLanguageFlag = (lang: string) => {
  const flags: { [key: string]: string } = {
    "en": "/flag-en.svg",
    "uz": "/flag-uz.svg",
    "ru": "/flag-ru.svg"
  };
  return flags[lang.toLowerCase()] || "🏳️";
};
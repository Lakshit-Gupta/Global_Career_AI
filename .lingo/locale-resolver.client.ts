// Client-side locale detection and persistence
export function getClientLocale(): string {
  // Check localStorage first
  const stored = localStorage.getItem("locale");
  if (stored) return stored;

  // Fall back to browser language
  const browserLang = navigator.language.split("-")[0];
  const supportedLocales = ["en", "es", "de", "fr", "ja"];
  
  if (supportedLocales.includes(browserLang)) {
    return browserLang;
  }

  return "en"; // Default locale
}

export function persistLocale(locale: string): void {
  localStorage.setItem("locale", locale);
  
  // Force page reload to apply new locale
  window.location.reload();
}

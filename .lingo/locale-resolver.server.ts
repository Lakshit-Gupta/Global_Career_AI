// Server-side locale detection
import { cookies, headers } from "next/headers";

export async function getServerLocale(): Promise<string> {
  // Check cookie first
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("locale");
  
  if (localeCookie?.value) {
    return localeCookie.value;
  }

  // Fall back to accept-language header
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  
  if (acceptLanguage) {
    const locale = acceptLanguage.split(",")[0]?.split("-")[0];
    const supportedLocales = ["en", "es", "de", "fr", "ja"];
    
    if (locale && supportedLocales.includes(locale)) {
      return locale;
    }
  }

  return "en"; // Default locale
}

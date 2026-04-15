export interface LocaleInfo {
  code: string;
  /** ISO 3166-1 alpha-2 country code (lowercase) for the flag-icons CSS class. */
  country: string;
  name: string;
}

export const LOCALES: LocaleInfo[] = [
  { code: "zh-CN", country: "cn", name: "简体中文" },
  { code: "zh-TW", country: "tw", name: "繁體中文" },
  { code: "en",    country: "us", name: "English" },
  { code: "ja",    country: "jp", name: "日本語" },
  { code: "ko",    country: "kr", name: "한국어" },
  { code: "es",    country: "es", name: "Español" },
  { code: "fr",    country: "fr", name: "Français" },
  { code: "de",    country: "de", name: "Deutsch" },
];

export const LOCALE_CODES = LOCALES.map((l) => l.code);

/** Resolve a browser/OS BCP 47 tag (e.g. "zh-Hant-HK") to a supported locale.
 *  Falls back to "en" if nothing matches. */
export function resolveLocale(tag: string | undefined | null): string {
  if (!tag) return "en";
  const t = tag.toLowerCase();

  // Chinese: distinguish Simplified vs Traditional
  if (t.startsWith("zh")) {
    if (t.includes("hant") || t.includes("tw") || t.includes("hk") || t.includes("mo")) {
      return "zh-TW";
    }
    return "zh-CN";
  }
  if (t.startsWith("ja")) return "ja";
  if (t.startsWith("ko")) return "ko";
  if (t.startsWith("es")) return "es";
  if (t.startsWith("fr")) return "fr";
  if (t.startsWith("de")) return "de";
  if (t.startsWith("en")) return "en";
  return "en";
}

/** Detect the user's preferred locale from the browser/OS, falling back to "en". */
export function detectLocale(): string {
  const nav = typeof navigator !== "undefined" ? navigator : undefined;
  const candidates: string[] = [];
  if (nav?.languages) candidates.push(...nav.languages);
  if (nav?.language) candidates.push(nav.language);
  for (const c of candidates) {
    const resolved = resolveLocale(c);
    if (LOCALE_CODES.includes(resolved)) return resolved;
  }
  return "en";
}

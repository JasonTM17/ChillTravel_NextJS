import slugify from "slugify";

/**
 * Vietnamese diacritics → ASCII mapping beyond what slugify handles.
 *
 * `slugify` already strips Latin combining marks (e.g. the diacritic on "ê"
 * in "Huế"), but `đ`/`Đ` are standalone code points (U+0111 / U+0110) that
 * the library does NOT convert. We therefore pre-map them before handing
 * the string to slugify.
 *
 * See design §5.4 slug utility.
 */
const VIETNAMESE_CHAR_MAP: Record<string, string> = {
  đ: "d",
  Đ: "D"
};

/**
 * Convert arbitrary (Vietnamese-friendly) text into a URL-safe slug.
 *
 * @example
 *   generateSlug("Hà Nội")      // "ha-noi"
 *   generateSlug("Đà Nẵng")     // "da-nang"
 *   generateSlug("Phú Quốc")    // "phu-quoc"
 *   generateSlug("")             // ""
 */
export function generateSlug(text: string | null | undefined): string {
  if (!text) return "";
  const normalized = text
    .split("")
    .map((ch) => VIETNAMESE_CHAR_MAP[ch] ?? ch)
    .join("");
  return slugify(normalized, {
    lower: true,
    strict: true,
    trim: true,
    locale: "vi"
  });
}

/**
 * Return a unique slug by appending `-1`, `-2`, ... suffixes when the base
 * is already taken. Gives up after `maxAttempts` (default 100) and throws,
 * which indicates pathological collision (shouldn't happen in practice).
 *
 * `exists` is an async predicate the caller implements against their
 * repository — e.g. `async (slug) => !!(await prisma.tour.findUnique({ where: { slug } }))`.
 *
 * Design §5.4 / Req 21 (slug uniqueness).
 */
export async function ensureUniqueSlug(
  baseSlug: string,
  exists: (slug: string) => Promise<boolean>,
  maxAttempts = 100
): Promise<string> {
  if (!baseSlug) {
    throw new Error("ensureUniqueSlug: baseSlug must be non-empty");
  }
  if (!(await exists(baseSlug))) return baseSlug;
  for (let i = 1; i <= maxAttempts; i++) {
    const candidate = `${baseSlug}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }
  throw new Error(
    `ensureUniqueSlug: exhausted ${maxAttempts} attempts for base "${baseSlug}"`
  );
}

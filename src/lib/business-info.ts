/** Clinic schedule approved by the owner on November 13, 2026. Practitioner hours remain API-owned. */
export const CLINIC_OPENING_HOURS = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  opens: '09:00',
  closes: '19:00',
};

/** Shared public identity and localized clinic opening hours. */
export const BUSINESS_INFO = {
  phone: '+212666124035',
  phoneDisplay: '+212 6 66 12 40 35',
  street: '88 Rue De Jabal Azourki',
  city: 'Casablanca',
  postalCode: '20930', // Existing value retained; operations must confirm before launch.
  hours: {
    fr: `Du lundi au samedi, ${CLINIC_OPENING_HOURS.opens.replace(':', 'h')}–${CLINIC_OPENING_HOURS.closes.replace(':', 'h')}`,
    en: `Monday–Saturday, ${CLINIC_OPENING_HOURS.opens.replace(/^0/, '')}–${CLINIC_OPENING_HOURS.closes}`,
  },
};
export const SOCIAL_URLS: Record<string, string> = {
  LinkedIn: 'https://www.linkedin.com/company/wenaya',
  Instagram: 'https://www.instagram.com/wenaya_maroc/',
  Facebook: 'https://www.facebook.com/WenayaMaroc/',
  TikTok: 'https://www.tiktok.com/@wenaya_maroc',
};
/** Populate only after the original decisions and approved public wording have been reviewed. */
export const APPROVED_CNDP_NOTICE: { fr: string; en: string } | null = null;

export const APPROVED_CORPORATE_PARTNERS: readonly string[] = [];

import Link from 'next/link';
import { APPROVED_CNDP_NOTICE } from '@/lib/business-info';
import { h } from '@/lib/href';
export default function DataProtectionNotice({ locale }: { locale: 'fr' | 'en' }) {
  return <p className="text-xs leading-relaxed text-inherit">
    {APPROVED_CNDP_NOTICE ? <>{APPROVED_CNDP_NOTICE[locale]} · </> : null}
    <Link href={h(locale, '/privacy-policy')} className="underline underline-offset-4">{locale === 'fr' ? 'Protection des données personnelles · Politique de confidentialité' : 'Personal data protection · Privacy policy'}</Link>
  </p>;
}

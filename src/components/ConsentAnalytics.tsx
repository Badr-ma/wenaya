"use client";
import { useEffect, useState } from 'react';
import Script from 'next/script';
export const CONSENT_KEY = 'wenaya-cookie-consent';
export const CONSENT_EVENT = 'wenaya:consent-change';
type AnalyticsWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void };
/** No analytics script or events until explicit opt-in. Never send form fields, link text, health slugs or query strings. */
export default function ConsentAnalytics() {
  const [allowed, setAllowed] = useState(false);
  const id = process.env.NEXT_PUBLIC_GA_ID;
  useEffect(() => {
    const update = () => {
      let accepted = false;
      try { accepted = localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch { /* Necessary cookies only. */ }
      if (id && /^G-[A-Z0-9]+$/i.test(id)) (window as unknown as Record<string, unknown>)['ga-disable-' + id] = !accepted;
      (window as AnalyticsWindow).gtag?.('consent', 'update', { analytics_storage: accepted ? 'granted' : 'denied' });
      setAllowed(accepted);
    };
    update(); window.addEventListener(CONSENT_EVENT, update); window.addEventListener('storage', update);
    return () => { window.removeEventListener(CONSENT_EVENT, update); window.removeEventListener('storage', update); };
  }, [id]);
  useEffect(() => {
    if (!allowed || !id) return;
    const click = (event: MouseEvent) => {
      const link = event.target instanceof Element ? event.target.closest('a') : null;
      if (!link) return;
      const url = new URL(link.href, location.href);
      const kind = url.protocol === 'tel:' ? 'phone' : /(^|\.)wa\.me$|(^|\.)whatsapp\.com$/.test(url.hostname) ? 'whatsapp' : /calendar\.app\.google$/.test(url.hostname) ? 'calendar' : /\.pdf$/i.test(url.pathname) ? 'download' : null;
      if (kind) (window as AnalyticsWindow).gtag?.('event', 'contact_click', { contact_method: kind, page_location: location.origin, page_title: 'Wenaya', page_referrer: '' });
    };
    document.addEventListener('click', click);
    return () => document.removeEventListener('click', click);
  }, [allowed, id]);
  if (!allowed || !id || !/^G-[A-Z0-9]+$/i.test(id)) return null;
  return <>
    <Script id="ga4-consented-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});gtag('js',new Date());gtag('config','${id}',{send_page_view:false,page_location:window.location.origin,page_title:'Wenaya',page_referrer:'',allow_google_signals:false,allow_ad_personalization_signals:false});`}</Script>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
  </>;
}

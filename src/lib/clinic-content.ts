export interface ClinicMetric { value: string; label: string; }
export const clinicMetrics = (locale: 'fr' | 'en'): ClinicMetric[] => locale === 'fr'
 ? [{value:'Évaluer',label:'comprendre vos besoins'},{value:'Orienter',label:'choisir un professionnel'},{value:'Accompagner',label:'construire votre parcours'},{value:'Suivre',label:'ajuster avec vous'}]
 : [{value:'Assess',label:'understand your needs'},{value:'Guide',label:'choose a professional'},{value:'Support',label:'build your pathway'},{value:'Follow up',label:'adjust with you'}];

import type { Pratique } from './pratiques';
const RELATED: Record<string, string[]> = {
 neuropsychologie: ['orthophonie','psychomotricite','psychologie','psychotherapie'],
 orthophonie: ['neuropsychologie','psychomotricite','psychologie'],
 psychomotricite: ['orthophonie','neuropsychologie','psychologie'],
};
export function relatedPractices(practices: Pratique[], current: Pratique): Pratique[] {
 const slugs = RELATED[current.slug];
 if (slugs) return slugs.flatMap(slug => { const p = practices.find(p => p.slug === slug); return p ? [p] : []; });
 return practices.filter(p => p.slug !== current.slug && p.category === current.category).slice(0, 6);
}
export function practiceSeo(practice: Pratique, locale: 'fr' | 'en') {
 if (practice.slug !== 'neuropsychologie') return {title:practice.title,description:practice.description};
 return locale === 'fr' ? {title:'Bilan neuropsychologique à Casablanca | Wenaya Clinic',description:'Bilans de la mémoire, de l’attention et des apprentissages à Casablanca pour enfants, adultes et seniors. Découvrez le déroulement et les professionnels Wenaya.'} : {title:'Neuropsychological Assessment in Casablanca | Wenaya Clinic',description:'Memory, attention and learning assessments in Casablanca for children, adults and older people. Explore the process and Wenaya professionals.'};
}

/**
 * Specialists data — mock data for Wenaya practitioners.
 * Replace with actual API/CMS fetch when ready.
 */

export interface SpecialistService {
  id: string;
  title: string;
  duration: string;
  price: string;
  description: string;
  type: "presentiel" | "ligne";
}

export interface SpecialistReview {
  id: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  specialty: string;
  verified: boolean;
}

export interface SpecialistAvailability {
  day: string;
  date: string;
  slots: { time: string; available: boolean }[];
}

export interface Specialist {
  slug: string;
  name: string;
  role: string;
  roleEn?: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  languages: string[];
  orderNumber: string;
  bio: string;
  approach: string;
  specialtyTags: string[];
  certifications: string[];
  services: SpecialistService[];
  availability: SpecialistAvailability[];
  location: {
    lat: number;
    lng: number;
    city: string;
    address: string;
    parking: string;
    access: string;
  };
  hours: string;
  clinicPhotos: string[];
  reviews: SpecialistReview[];
}

export const specialists: Specialist[] = [
  {
    slug: "nadine-kita",
    name: "Nadine Kita",
    role: "Kinésithérapeute",
    roleEn: "Physiotherapist",
    specialty: "Kinésithérapie",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 47,
    yearsExperience: 10,
    languages: ["Français", "Anglais", "Arabe"],
    orderNumber: "KO-12345",
    bio: "Spécialiste en rééducation fonctionnelle et thérapie manuelle avec plus de 10 ans d'expérience. Diplômée de l'Université Mohammed V, certifiée TECARTherapy et formée en thérapie manuelle avancée à Bordeaux.",
    approach: "Je crois que chaque corps a la capacité de se réparer quand il reçoit les bons soins. Mon approche combine techniques evidence-based et écoute attentive pour un suivi personnalisé et des résultats durables.",
    specialtyTags: ["Douleur chronique", "Rééducation post-opératoire", "Sportif blessé", "Rhumatologie", "Posturologie"],
    certifications: [
      "Diplôme de Kinésithérapie — Université Mohammed V, 2014",
      "Certification TECARTherapy — Paris, 2016",
      "Formation Thérapie Manuelle Avancée — Bordeaux, 2018",
      "Spécialisation Rééducation Fonctionnelle, 2020",
      "Posturologie & Biomécanique — Casablanca, 2022",
    ],
    services: [
      { id: "s1", title: "Bilan kinésithérapique", duration: "45 min", price: "300 DH", description: "Évaluation complète de votre mobilité et posture", type: "presentiel" },
      { id: "s2", title: "Séance de rééducation", duration: "30 min", price: "250 DH", description: "Séance de rééducation fonctionnelle personnalisée", type: "presentiel" },
      { id: "s3", title: "Thérapie manuelle", duration: "45 min", price: "350 DH", description: "Techniques avancées de mobilisation articulaire", type: "presentiel" },
      { id: "s4", title: "TECARTherapy", duration: "30 min", price: "300 DH", description: "Thermothérapie profonde pour récupération musculaire", type: "presentiel" },
    ],
    availability: [
      {
        day: "Lun",
        date: "21",
        slots: [
          { time: "09:00", available: true },
          { time: "10:00", available: false },
          { time: "11:00", available: true },
          { time: "14:00", available: true },
          { time: "15:00", available: true },
          { time: "16:00", available: false },
        ],
      },
      {
        day: "Mar",
        date: "22",
        slots: [
          { time: "09:00", available: true },
          { time: "10:00", available: true },
          { time: "11:00", available: false },
          { time: "14:00", available: true },
          { time: "15:00", available: false },
        ],
      },
      {
        day: "Mer",
        date: "23",
        slots: [
          { time: "09:00", available: true },
          { time: "10:00", available: true },
          { time: "11:00", available: true },
          { time: "14:00", available: false },
          { time: "15:00", available: true },
        ],
      },
      {
        day: "Jeu",
        date: "24",
        slots: [
          { time: "09:00", available: false },
          { time: "10:00", available: true },
          { time: "14:00", available: true },
          { time: "15:00", available: true },
          { time: "16:00", available: true },
        ],
      },
      {
        day: "Ven",
        date: "25",
        slots: [
          { time: "09:00", available: true },
          { time: "10:00", available: true },
          { time: "11:00", available: true },
          { time: "14:00", available: true },
        ],
      },
    ],
    location: {
      lat: 33.5731,
      lng: -7.5898,
      city: "Casablanca",
      address: "88 Rue De Jabal Azourki, Casablanca 20930",
      parking: "Parking privé disponible",
      access: "Accès PMR, Ascenseur",
    },
    hours: "Lun–Sam 8h–20h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Fatima Z.", rating: 5, date: "Il y a 2 semaines", text: "Excellent suivi. Ma douleur au dos a considérablement diminué après 3 séances. Nadine est très à l'écoute et professionnelle.", specialty: "Kinésithérapie", verified: true },
      { id: "r2", name: "Karim B.", rating: 5, date: "Il y a 1 mois", text: "Après mon opération du genou, la rééducation avec Nadine a été parfaite. Je recommande vivement.", specialty: "Rééducation", verified: true },
      { id: "r3", name: "Youssef L.", rating: 4, date: "Il y a 2 mois", text: "Très bonne thérapeute. Les séances de TECAR m'ont beaucoup aidé pour mes douleurs chroniques.", specialty: "Kinésithérapie", verified: true },
      { id: "r4", name: "Amina K.", rating: 5, date: "Il y a 3 mois", text: "Professionnelle et bienveillante. Mondossements ont disparu en quelques semaines. Merci Nadine !", specialty: "Ostéopathie", verified: true },
    ],
  },
  {
    slug: "dr-amal-benali",
    name: "Dr. Amal Benali",
    role: "Médecin Généraliste",
    roleEn: "General Practitioner",
    specialty: "Médecine Générale",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&q=80&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 63,
    yearsExperience: 12,
    languages: ["Français", "Arabe", "Anglais"],
    orderNumber: "ME-67890",
    bio: "Médecin généraliste spécialisée en santé préventive et bilans de santé complets. Avec 12 ans d'expérience, elle construit des relations durables avec ses patients pour une prise en charge personnalisée.",
    approach: "La médecine préventive est la clé d'une vie saine. Je prends le temps de comprendre chaque patient pour proposer un suivi adapté à ses besoins spécifiques.",
    specialtyTags: ["Bilan de santé", "Médecine préventive", "Dépistage", "Suivi médical", "Santé au travail"],
    certifications: [
      "Doctorat en Médecine — Université Hassan II, 2012",
      "Spécialisation Médecine Préventive — Paris, 2015",
      "Certification Bilan de Santé Complet, 2018",
      "Formation Médecine Fonctionnelle, 2021",
    ],
    services: [
      { id: "s1", title: "Consultation générale", duration: "30 min", price: "350 DH", description: "Consultation médicale complète", type: "presentiel" },
      { id: "s2", title: "Bilan de santé complet", duration: "90 min", price: "800 DH", description: "Évaluation approfondie de votre état de santé", type: "presentiel" },
      { id: "s3", title: "Téléconsultation", duration: "20 min", price: "250 DH", description: "Consultation à distance par vidéo", type: "ligne" },
    ],
    availability: [
      { day: "Lun", date: "21", slots: [{ time: "09:00", available: true }, { time: "10:00", available: true }, { time: "14:00", available: true }] },
      { day: "Mar", date: "22", slots: [{ time: "09:00", available: false }, { time: "10:00", available: true }, { time: "14:00", available: true }] },
      { day: "Mer", date: "23", slots: [{ time: "09:00", available: true }, { time: "14:00", available: true }] },
    ],
    location: {
      lat: 33.5950,
      lng: -7.6200,
      city: "Casablanca",
      address: "Boulevard Mohammed V, Casablanca",
      parking: "Stationnement à proximité",
      access: "Accès PMR",
    },
    hours: "Lun–Ven 9h–17h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Sara M.", rating: 5, date: "Il y a 1 semaine", text: "Dr Benali prend le temps d'expliquer tout. Son bilan de santé complet m'a permis de détecter un problème que j'ignorais.", specialty: "Médecine générale", verified: true },
      { id: "r2", name: "Mohamed T.", rating: 5, date: "Il y a 3 semaines", text: "Médecin sérieuse et à l'écoute. Je recommande pour le suivi préventif.", specialty: "Médecine préventive", verified: true },
    ],
  },
  {
    slug: "khalid-ouazzani",
    name: "Khalid Ouazzani",
    role: "Ostéopathe",
    roleEn: "Osteopath",
    specialty: "Ostéopathie",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 38,
    yearsExperience: 11,
    languages: ["Français", "Arabe"],
    orderNumber: "OS-11223",
    bio: "Ostéopathe expert en douleurs musculo-squelettiques et troubles fonctionnels. Diplômé du Centre d'Études Ostéopathiques de Paris, spécialisé en ostéopathie crânienne et viscérale.",
    approach: "Le corps est un tout. Mon approche ostéopathique traite la cause profonde du désordre, pas seulement le symptôme. Chaque séance est unique, adaptée aux besoins du patient.",
    specialtyTags: ["Douleur chronique", "Lombalgie", "Cervicalgie", "Stress", "Migraine", "Troubles digestifs"],
    certifications: [
      "Diplôme d'Ostéopathie — Centre d'Études Ostéopathiques, Paris, 2013",
      "Certification Ostéopathie Crânienne, 2015",
      "Formation Ostéopathie Viscérale, 2017",
      "Douleurs Chroniques & Approches Globales, 2019",
    ],
    services: [
      { id: "s1", title: "Séance d'ostéopathie", duration: "45 min", price: "400 DH", description: "Consultation et traitement ostéopathique complet", type: "presentiel" },
      { id: "s2", title: "Ostéopathie crânienne", duration: "45 min", price: "450 DH", description: "Techniques douces pour tensions crâniennes", type: "presentiel" },
    ],
    availability: [
      { day: "Lun", date: "21", slots: [{ time: "10:00", available: true }, { time: "14:00", available: true }, { time: "16:00", available: true }] },
      { day: "Mar", date: "22", slots: [{ time: "10:00", available: false }, { time: "14:00", available: true }, { time: "16:00", available: true }] },
      { day: "Jeu", date: "24", slots: [{ time: "10:00", available: true }, { time: "14:00", available: true }] },
    ],
    location: {
      lat: 33.5650,
      lng: -7.5750,
      city: "Casablanca",
      address: "Rue Ibn Batouta, Casablanca",
      parking: "Parking public à 200m",
      access: "Accès au rez-de-chaussée",
    },
    hours: "Mar–Sam 10h–19h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Youssef L.", rating: 5, date: "Il y a 2 semaines", text: "Les séances d'ostéopathie avec Khalid m'ont soulagé d'une lombalgie chronique depuis 2 ans. Exceptionnel.", specialty: "Ostéopathie", verified: true },
      { id: "r2", name: "Nadia R.", rating: 5, date: "Il y a 1 mois", text: "Très bon ostéopathie. Il comprend instantanément le problème et ses mains sont magiques.", specialty: "Douleur chronique", verified: true },
    ],
  },
  {
    slug: "nadia-tazi",
    name: "Nadia Tazi",
    role: "Psychologue Clinicienne",
    roleEn: "Clinical Psychologist",
    specialty: "Psychologie",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 52,
    yearsExperience: 8,
    languages: ["Français", "Arabe", "Anglais"],
    orderNumber: "PC-44556",
    bio: "Psychologue clinicienne spécialisée en thérapies cognitivo-comportementales et gestion du stress. Son approche combine rigueur scientifique et écoute bienveillante pour un accompagnement adapté à chaque patient.",
    approach: "La santé mentale n'est pas un luxe, c'est la base d'une vie épanouie. Je crée un espace sûr où chaque patient peut explorer ses difficultés et développer des stratégies concrètes pour aller mieux.",
    specialtyTags: ["Anxiété", "Dépression", "Burnout", "Gestion du stress", "Phobie", "Troubles du sommeil"],
    certifications: [
      "Master en Psychologie Clinique — Université Mohammed V, 2015",
      "Certification Thérapies Cognitivo-Comportementales, 2017",
      "Formation Gestion du Stress & Pleine Conscience, 2019",
      "Spécialisation Burnout & Santé Mentale au Travail, 2021",
    ],
    services: [
      { id: "s1", title: "Séance de TCC", duration: "50 min", price: "500 DH", description: "Thérapie cognitivo-comportementale individuelle", type: "presentiel" },
      { id: "s2", title: "Téléconsultation psychologie", duration: "50 min", price: "450 DH", description: "Séance de psychologie par vidéo", type: "ligne" },
      { id: "s3", title: "Bilan psychologique", duration: "90 min", price: "700 DH", description: "Évaluation complète et recommandations", type: "presentiel" },
    ],
    availability: [
      { day: "Lun", date: "21", slots: [{ time: "09:00", available: false }, { time: "10:00", available: true }, { time: "14:00", available: true }, { time: "16:00", available: true }] },
      { day: "Mer", date: "23", slots: [{ time: "09:00", available: true }, { time: "10:00", available: true }, { time: "14:00", available: true }] },
      { day: "Ven", date: "25", slots: [{ time: "09:00", available: true }, { time: "14:00", available: true }] },
    ],
    location: {
      lat: 33.5800,
      lng: -7.6100,
      city: "Casablanca",
      address: "Avenue des FAR, Casablanca",
      parking: "Parking souterrain disponible",
      access: "Accès PMR, Ascenseur",
    },
    hours: "Lun–Ven 9h–18h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Amina K.", rating: 5, date: "Il y a 1 semaine", text: "Nadia m'a aidée à surmonter une période de burnout. Sa patience et sa méthode TCC m'ont transformée.", specialty: "Psychologie", verified: true },
      { id: "r2", name: "Rachid H.", rating: 5, date: "Il y a 2 semaines", text: "Enfin une psy qui comprend vraiment. Ses conseils sont concrets et applicables dès la première séance.", specialty: "Gestion du stress", verified: true },
    ],
  },
  {
    slug: "yassine-el-amrani",
    name: "Yassine El Amrani",
    role: "Nutritionniste",
    roleEn: "Nutritionist",
    specialty: "Nutrition",
    image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&q=80&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 31,
    yearsExperience: 9,
    languages: ["Français", "Arabe"],
    orderNumber: "NT-77889",
    bio: "Nutritionniste expert en rééquilibrage alimentaire et suivi métabolique. Sa philosophie : la nutrition comme médecine, avec des résultats durables basés sur la science.",
    approach: "Pas de régimes restrictifs, pas de tendances passagères. Je construis avec vous un plan alimentaire adapté à votre vie, vos goûts et vos objectifs de santé.",
    specialtyTags: ["Rééquilibrage alimentaire", "Perte de poids", "Nutrition sportive", "Diabète", "Cholestérol", "Grossesse"],
    certifications: [
      "Master en Nutrition & Diététique — Université Hassan II, 2014",
      "Certification Nutrition Sportive — INSEP, Paris, 2016",
      "Formation Métabolisme & Compositions Corporelles, 2019",
      "Nutrition Fonctionnelle & Micronutrition, 2021",
    ],
    services: [
      { id: "s1", title: "Bilan nutritionnel", duration: "60 min", price: "450 DH", description: "Analyse complète de vos habitudes alimentaires", type: "presentiel" },
      { id: "s2", title: "Suivi nutritionnel", duration: "30 min", price: "300 DH", description: "Consultation de suivi et ajustements", type: "presentiel" },
      { id: "s3", title: "Programme alimentaire", duration: "60 min", price: "600 DH", description: "Plan nutritionnel personnalisé complet", type: "presentiel" },
    ],
    availability: [
      { day: "Lun", date: "21", slots: [{ time: "08:00", available: true }, { time: "09:00", available: true }, { time: "14:00", available: true }] },
      { day: "Mar", date: "22", slots: [{ time: "08:00", available: false }, { time: "09:00", available: true }, { time: "14:00", available: true }] },
      { day: "Ven", date: "25", slots: [{ time: "08:00", available: true }, { time: "09:00", available: true }] },
    ],
    location: {
      lat: 33.5550,
      lng: -7.6150,
      city: "Casablanca",
      address: "Rue Ahmed Sekkat, Casablanca",
      parking: "Parking à proximité",
      access: "Accès au rez-de-chaussée",
    },
    hours: "Lun–Sam 8h–17h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Leila B.", rating: 5, date: "Il y a 3 semaines", text: "Yassine m'a aidée à perdre 8kg en 3 mois sans frustration. Sa méthode est scientifique et bienveillante.", specialty: "Nutrition", verified: true },
    ],
  },
  {
    slug: "sara-mansouri",
    name: "Sara Mansouri",
    role: "Psychomotricienne",
    roleEn: "Psychomotor Therapist",
    specialty: "Psychomotricité",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 29,
    yearsExperience: 7,
    languages: ["Français", "Arabe"],
    orderNumber: "PM-33445",
    bio: "Psychomotricienne spécialisée en développement de l'enfant et troubles des apprentissages. Son approche ludique et bienveillante aide les enfants à surmonter leurs difficultés via le mouvement et le jeu.",
    approach: "Le corps est le premier langage de l'enfant. À travers le jeu et le mouvement, je l'aide à développer ses compétences motrices, émotionnelles et cognitives.",
    specialtyTags: ["Développement de l'enfant", "Troubles des apprentissages", "Retard moteur", "Gestion des émotions", "Activation psychomotrice"],
    certifications: [
      "Master en Psychomotricité — Université Hassan II, 2017",
      "Formation Développement de l'Enfant — Paris, 2019",
      "Certification Retard Moteur & Apprentissage, 2021",
    ],
    services: [
      { id: "s1", title: "Séance de psychomotricité", duration: "45 min", price: "350 DH", description: "Séance individuelle adaptée aux besoins de l'enfant", type: "presentiel" },
      { id: "s2", title: "Bilan psychomoteur", duration: "60 min", price: "500 DH", description: "Évaluation complète du profil psychomoteur", type: "presentiel" },
    ],
    availability: [
      { day: "Lun", date: "21", slots: [{ time: "09:00", available: true }, { time: "10:00", available: true }, { time: "14:00", available: true }, { time: "15:00", available: false }] },
      { day: "Mer", date: "23", slots: [{ time: "09:00", available: true }, { time: "14:00", available: true }] },
      { day: "Ven", date: "25", slots: [{ time: "09:00", available: true }, { time: "10:00", available: true }, { time: "14:00", available: true }] },
    ],
    location: {
      lat: 33.5700,
      lng: -7.6000,
      city: "Casablanca",
      address: "Rue Chaouki, Casablanca",
      parking: "Parking à proximité",
      access: "Accès au rez-de-chaussée",
    },
    hours: "Lun–Ven 9h–18h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Houda M.", rating: 5, date: "Il y a 1 semaine", text: "Sara a transformé la vie de mon fils. Ses séances sont ludiques et il fait des progrès incroyables.", specialty: "Psychomotricité", verified: true },
      { id: "r2", name: "Ali R.", rating: 5, date: "Il y a 1 mois", text: "Un vrai talent avec les enfants. Ma fille adore ses séances.", specialty: "Développement enfant", verified: true },
    ],
  },
  {
    slug: "mehdi-irzi",
    name: "Mehdi Irzi",
    role: "Orthophoniste",
    roleEn: "Speech Therapist",
    specialty: "Orthophonie",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 34,
    yearsExperience: 9,
    languages: ["Français", "Arabe", "Anglais"],
    orderNumber: "OR-55667",
    bio: "Orthophoniste expérimenté spécialisé en troubles de la communication, du langage écrit et de la déglutition. Intervention auprès de tous les âges, de la petite enfance à l'âge adulte.",
    approach: "Chaque patient a son propre rythme. Je construis un parcours thérapeutique adapté, en combinant techniques modernes et relation de confiance pour des résultats durables.",
    specialtyTags: ["Trouble du langage", "Bégaiement", "Trouble de la déglutition", "Retard de parole", "Rééducation post-AVC"],
    certifications: [
      "Master en Orthophonie — Université Mohammed V, 2015",
      "Certification Rééducation de la Déglutition, 2018",
      "Formation Bégaiement & Fluence — Lyon, 2020",
    ],
    services: [
      { id: "s1", title: "Bilan orthophonique", duration: "60 min", price: "400 DH", description: "Évaluation complète du langage et de la communication", type: "presentiel" },
      { id: "s2", title: "Séance de rééducation", duration: "45 min", price: "350 DH", description: "Séance individualisée de rééducation orthophonique", type: "presentiel" },
      { id: "s3", title: "Téléconsultation orthophonie", duration: "45 min", price: "300 DH", description: "Séance à distance par vidéo", type: "ligne" },
    ],
    availability: [
      { day: "Lun", date: "21", slots: [{ time: "09:00", available: true }, { time: "11:00", available: true }, { time: "14:00", available: false }] },
      { day: "Mar", date: "22", slots: [{ time: "09:00", available: true }, { time: "10:00", available: true }, { time: "15:00", available: true }] },
      { day: "Jeu", date: "24", slots: [{ time: "09:00", available: true }, { time: "14:00", available: true }, { time: "16:00", available: true }] },
    ],
    location: {
      lat: 33.5850,
      lng: -7.6100,
      city: "Casablanca",
      address: "Boulevard Anfa, Casablanca",
      parking: "Parking souterrain",
      access: "Accès PMR, Ascenseur",
    },
    hours: "Lun–Ven 8h30–18h30",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Rachid A.", rating: 5, date: "Il y a 2 semaines", text: "Mon fils a commencé à parler correctement grâce à Mehdi. Un professionnel exceptionnel.", specialty: "Orthophonie", verified: true },
    ],
  },
  {
    slug: "najat-berrada",
    name: "Najat Berrada",
    role: "Naturopathe",
    roleEn: "Naturopath",
    specialty: "Naturopathie",
    image: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?w=400&q=80&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 22,
    yearsExperience: 6,
    languages: ["Français", "Arabe"],
    orderNumber: "NA-88990",
    bio: "Naturopathe certifiée spécialisée en micronutrition, phytothérapie et aromathérapie. Son approche holistique vise à rééquilibrer le terrain naturellement pour prévenir et accompagner divers troubles.",
    approach: "La nature dispose en nous de tout ce qu'il faut pour guérir. Mon rôle est de réveiller ces capacités innées grâce aux thérapies naturelles et un mode de vie adapté.",
    specialtyTags: ["Micronutrition", "Phytothérapie", "Aromathérapie", "Fatigue chronique", "Stress", "Troubles du sommeil"],
    certifications: [
      "Diplôme de Naturopathie — Institut de Naturopathie de Paris, 2018",
      "Certification Micronutrition Fonctionnelle, 2020",
      "Formation Aromathérapie Clinique, 2021",
    ],
    services: [
      { id: "s1", title: "Bilan naturopathique", duration: "75 min", price: "500 DH", description: "Évaluation complète du terrain et recommandations personnalisées", type: "presentiel" },
      { id: "s2", title: "Séance de phytothérapie", duration: "45 min", price: "350 DH", description: "Conseil en plantes et compléments naturels", type: "presentiel" },
      { id: "s3", title: "Consultation en ligne", duration: "45 min", price: "300 DH", description: "Consultation à distance par vidéo", type: "ligne" },
    ],
    availability: [
      { day: "Mar", date: "22", slots: [{ time: "09:00", available: true }, { time: "10:00", available: true }, { time: "14:00", available: true }] },
      { day: "Jeu", date: "24", slots: [{ time: "09:00", available: true }, { time: "14:00", available: true }] },
      { day: "Sam", date: "26", slots: [{ time: "09:00", available: true }, { time: "10:00", available: true }] },
    ],
    location: {
      lat: 33.5600,
      lng: -7.5950,
      city: "Casablanca",
      address: "Rue du Commerce, Casablanca",
      parking: "Parking à proximité",
      access: "Accès au rez-de-chaussée",
    },
    hours: "Mar–Sam 9h–17h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Claire D.", rating: 5, date: "Il y a 2 semaines", text: "Najat m'a aidée à retrouver de l'énergie après des années de fatigue. Ses conseils sont précieux.", specialty: "Naturopathie", verified: true },
    ],
  },
  {
    slug: "omar-tazi",
    name: "Omar Tazi",
    role: "Médecin du Sport",
    roleEn: "Sports Physician",
    specialty: "Médecine du Sport",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 41,
    yearsExperience: 14,
    languages: ["Français", "Arabe", "Anglais"],
    orderNumber: "MS-22334",
    bio: "Médecin du sport diplômé, spécialisé en rééducation fonctionnelle sportive et prévention des blessures. Accompagne athlètes de haut niveau et sportifs amateurs depuis 14 ans.",
    approach: "Le sport est une médecine. Mon rôle est de vous aider à pratiquer en toute sécurité, de prévenir les blessures et de optimiser vos performances grâce à une approche scientifique.",
    specialtyTags: ["Rééducation sportive", "Prévention blessures", "Performance sportive", "Medicine de l'effort", "Traumatologie du sport"],
    certifications: [
      "Doctorat en Médecine du Sport — Université Mohammed V, 2010",
      "Diplôme de Médecine du Sport — Paris, 2012",
      "Certification Rééducation Fonctionnelle Sportive, 2015",
    ],
    services: [
      { id: "s1", title: "Bilan médical du sport", duration: "45 min", price: "500 DH", description: "Évaluation complète de votre condition physique", type: "presentiel" },
      { id: "s2", title: "Consultation de suivi", duration: "30 min", price: "350 DH", description: "Suivi de rééducation et adaptation du programme", type: "presentiel" },
      { id: "s3", title: "Téléconsultation sport", duration: "30 min", price: "300 DH", description: "Consultation à distance par vidéo", type: "ligne" },
    ],
    availability: [
      { day: "Lun", date: "21", slots: [{ time: "08:00", available: true }, { time: "09:00", available: false }, { time: "14:00", available: true }] },
      { day: "Mar", date: "22", slots: [{ time: "08:00", available: true }, { time: "10:00", available: true }, { time: "14:00", available: true }] },
      { day: "Ven", date: "25", slots: [{ time: "08:00", available: true }, { time: "09:00", available: true }] },
    ],
    location: {
      lat: 33.5780,
      lng: -7.5800,
      city: "Casablanca",
      address: "Avenue de France, Casablanca",
      parking: "Parking privé disponible",
      access: "Accès PMR",
    },
    hours: "Lun–Ven 8h–16h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Younes K.", rating: 5, date: "Il y a 1 semaine", text: "Dr Tazi m'a remis sur pied après une rupture du ligament croisé. Sa rigueur est impressionnante.", specialty: "Médecine du sport", verified: true },
      { id: "r2", name: "Sara L.", rating: 5, date: "Il y a 3 semaines", text: "Un médecin qui comprend vraiment les athlètes. Ses conseils de prévention m'ont évité plusieurs blessures.", specialty: "Prévention sportive", verified: true },
    ],
  },
  {
    slug: "fatima-zahra-alami",
    name: "Fatima Zahra Alami",
    role: "Diététicienne-Nutritionniste",
    roleEn: "Dietitian-Nutritionist",
    specialty: "Nutrition",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&q=80&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 26,
    yearsExperience: 8,
    languages: ["Français", "Arabe"],
    orderNumber: "DN-44556",
    bio: "Diététicienne-nutritionniste spécialisée en nutrition clinique et troubles du comportement alimentaire. Son approche bienveillante et sans jugement accompagne chaque patient vers une relation saine avec la nourriture.",
    approach: "Il n'y a pas de mauvais aliment, seulement des déséquilibres. Mon approche est sans jugement, centrée sur le plaisir de manger tout en respectant vos objectifs de santé.",
    specialtyTags: ["Troubles du comportement alimentaire", "Nutrition clinique", "Grossesse", "Diabète", "Intolérances alimentaires"],
    certifications: [
      "Diplôme de Diététique — Université Hassan II, 2016",
      "Spécialisation Nutrition Clinique — Paris, 2018",
      "Certification TCA & Approche Compassionate, 2021",
    ],
    services: [
      { id: "s1", title: "Bilan diététique complet", duration: "60 min", price: "400 DH", description: "Analyse approfondie de vos habitudes et besoins nutritionnels", type: "presentiel" },
      { id: "s2", title: "Suivi nutritionnel", duration: "30 min", price: "250 DH", description: "Consultation de suivi et ajustements du plan", type: "presentiel" },
      { id: "s3", title: "Téléconsultation nutrition", duration: "30 min", price: "200 DH", description: "Consultation à distance par vidéo", type: "ligne" },
    ],
    availability: [
      { day: "Lun", date: "21", slots: [{ time: "09:00", available: true }, { time: "10:00", available: true }, { time: "14:00", available: true }] },
      { day: "Mer", date: "23", slots: [{ time: "09:00", available: false }, { time: "10:00", available: true }, { time: "14:00", available: true }] },
      { day: "Ven", date: "25", slots: [{ time: "09:00", available: true }, { time: "14:00", available: true }] },
    ],
    location: {
      lat: 33.5900,
      lng: -7.6050,
      city: "Casablanca",
      address: "Rue Meknes, Casablanca",
      parking: "Parking à proximité",
      access: "Accès au rez-de-chaussée",
    },
    hours: "Lun–Ven 9h–18h",
    clinicPhotos: [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&q=80&auto=format&fit=crop",
    ],
    reviews: [
      { id: "r1", name: "Amina H.", rating: 5, date: "Il y a 2 semaines", text: "Fatima m'a aidée à changer ma relation avec la nourriture. Enfin une diététicienne qui comprend les TCA.", specialty: "Nutrition", verified: true },
      { id: "r2", name: "Nabil F.", rating: 4, date: "Il y a 1 mois", text: "Très professionnelle et à l'écoute. Les repas proposés sont variés et délicieux.", specialty: "Diététique", verified: true },
    ],
  },
];

export function getSpecialistBySlug(slug: string): Specialist | undefined {
  return specialists.find((s) => s.slug === slug);
}

export function getAllSpecialists(): Specialist[] {
  return specialists;
}

export function getSpecialistsBySpecialty(specialty: string): Specialist[] {
  return specialists.filter((s) => s.specialty === specialty);
}

/**
 * Async versions — check Redis first, fall back to hardcoded data.
 * Used by server components (specialistes pages) to serve admin-edited data.
 */

const REDIS_SPECIALISTS_KEY = "admin:specialists";

export async function getAllSpecialistsAsync(): Promise<Specialist[]> {
  try {
    const { getRedis } = await import("./redis");
    const redis = getRedis();
    if (!redis) return specialists;

    const stored = await redis.get<Specialist[]>(REDIS_SPECIALISTS_KEY);
    if (!stored || !Array.isArray(stored) || stored.length === 0) return specialists;
    return stored;
  } catch {
    return specialists;
  }
}

export async function getSpecialistBySlugAsync(slug: string): Promise<Specialist | undefined> {
  const all = await getAllSpecialistsAsync();
  return all.find((s) => s.slug === slug);
}

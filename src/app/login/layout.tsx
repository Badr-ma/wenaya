import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion — Espace Patient Wenaya",
  description:
    "Connectez-vous à votre espace patient Wenaya pour gérer vos rendez-vous, consulter vos bilans de santé et suivre votre parcours bien-être.",
  alternates: {
    canonical: "https://www.wenaya.com/login",
  },
  robots: { index: false, follow: false },
  openGraph: {
    title: "Connexion — Espace Patient Wenaya",
    description:
      "Accédez à votre espace patient Wenaya.",
    url: "https://www.wenaya.com/login",
    type: "website",
  },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}

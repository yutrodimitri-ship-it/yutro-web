import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contáctanos para tu próximo proyecto audiovisual con IA. Email, teléfono e Instagram disponibles.",
};

export default function ContactoLayout({ children }: { children: React.ReactNode }) {
  return children;
}

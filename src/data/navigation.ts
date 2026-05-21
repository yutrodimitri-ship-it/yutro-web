export interface NavItem {
  key: string;
  href: string;
  anchor?: string | null;
  external?: boolean;
}

// Menu principal del header publico. Orden definido en
// .ai/decisions.md (Sprint 1, Tarea 1.1).
//   Casting · Produccion · Estudio · Blog · Contacto
export const mainNavItems: NavItem[] = [
  { key: "casting", href: "/casting" },
  { key: "production", href: "/produccion" },
  { key: "estudio", href: "/estudio" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contacto", anchor: "#contacto-cta" },
];

// Boton separado a la derecha del header — distinto visualmente
// (outlined coral). Lleva al login de la plataforma privada.
export const clientAccessItem: NavItem = {
  key: "clientAccess",
  href: "/studio/login",
  external: true,
};

export const mobileNavItems: NavItem[] = [
  { key: "home", href: "/" },
  ...mainNavItems,
];

export const footerNavItems: NavItem[] = [
  { key: "casting", href: "/casting" },
  { key: "production", href: "/produccion" },
  { key: "projects", href: "/proyectos" },
  { key: "estudio", href: "/estudio" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contacto" },
];

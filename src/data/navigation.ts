export interface NavItem {
  key: string;
  href: string;
  anchor?: string | null;
  external?: boolean;
}

export const mainNavItems: NavItem[] = [
  { key: "projects", href: "/proyectos" },
  { key: "services", href: "/servicios" },
  { key: "influencer", href: "/influencer" },
  { key: "studio", href: "/studio/login", external: true },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contacto", anchor: "#contacto-cta" },
];

export const mobileNavItems: NavItem[] = [
  { key: "home", href: "/" },
  ...mainNavItems,
];

export const footerNavItems: NavItem[] = [
  { key: "projects", href: "/proyectos" },
  { key: "services", href: "/servicios" },
  { key: "influencer", href: "/influencer" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contacto" },
];

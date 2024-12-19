export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Aeroportal",
  description: "The coolest weather station + home hub.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Settings",
      href: "/settings",
    },
  ],
  links: {
    github: "https://github.com/TheScientist101/aeroportal",
  },
};

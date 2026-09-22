export const siteConfig = {
  name: "Felgenhotel",
  legalName: "Felgenhotel", // TODO: vollstaendige Firmierung inkl. Rechtsform vom Kunden
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.felgenhotel.de",
  address: {
    street: "Herler Straße 21",
    postalCode: "51067",
    city: "Köln",
    region: "Nordrhein-Westfalen",
    country: "DE",
  },
  phone: {
    label: "0221 – 259 84 202",
    href: "tel:+4922125984202",
  },
  mobile: {
    label: "+49 178 5071710",
    href: "tel:+491785071710",
  },
  email: "info@felgenhotel.de",
  whatsapp: {
    number: "491785071710",
    message:
      "Hallo Felgenhotel, ich möchte gerne eine Felgenreparatur bzw. Felgenveredelung anfragen. Ich würde Ihnen gerne Bilder meiner Felge schicken.",
  },
  openingHours: [
    { days: "Montag – Freitag", time: "09:00 – 18:00 Uhr" },
    { days: "Samstag", time: "09:00 – 14:00 Uhr" },
  ],
} as const;

export const whatsappUrl = `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(
  siteConfig.whatsapp.message,
)}`;

export const siteConfig = {
  name: "TeleBotHost",
  title: "TeleBotHost Blog",
  description:
    "The TeleBotHost blog: tech, bots, travel, work, food, and the small stuff that actually sticks with you.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://blog.telebothost.com",
  author: {
    name: "TeleBotHost Team",
    role: "Writers",
    bio: "We write about bots, building products, and the everyday stuff around shipping software.",
  },
  products: [
    {
      name: "TeleBotHost",
      href: "https://telebothost.com",
      label: "Official",
      description: "Host Telegram bots without babysitting servers.",
    },
    {
      name: "teledevs.me",
      href: "https://teledevs.me",
      label: "Official",
      description: "Where we keep our developer tools and product links.",
    },
  ],
  links: {
    github: "https://github.com",
    twitter: "https://x.com",
  },
} as const;

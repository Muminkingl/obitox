export default defineAppConfig({
  socials: {
    x: 'https://x.com/nuxt_js',
    discord: 'https://discord.com/invite/ps2h6QT',
    nuxt: 'https://nuxt.com',
  },
  github: {
    rootDir: 'docs',
  },
  toc: {
    bottom: {
      links: [
        {
          icon: 'i-lucide-book-open',
          label: 'Nuxt UI docs',
          to: 'https://ui.nuxt.com/getting-started/installation/nuxt',
          target: '_blank',
        },
        {
          icon: 'i-lucide-book-open',
          label: 'Nuxt Content docs',
          to: 'https://content.nuxt.com/docs/getting-started/installation/',
          target: '_blank',
        },
        {
          icon: 'i-lucide-book-open',
          label: 'Nuxt Studio docs',
          to: 'https://nuxt.studio/introduction',
          target: '_blank',
        },
      ],
    },
  },
  ui: {
    pageHero: {
      slots: {
        title: 'font-semibold sm:text-6xl',
        container: '!pb-0',
      },
    },
    pageCard: {
      slots: {
        container: 'lg:flex min-w-0',
        wrapper: 'flex-none',
      },
    },
  },
})

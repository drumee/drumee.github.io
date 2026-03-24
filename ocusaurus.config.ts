import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Drumee Documentation',
  tagline: 'Meta Operating System for Sovereign Web Applications',
  favicon: 'img/favicon.ico',

  url: 'https://drumee.github.io',
  baseUrl: '/',
  organizationName: 'drumee',
  projectName: 'drumee-docs',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/',
          editUrl: 'https://github.com/drumee/drumee-docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Drumee',
      logo: {
        alt: 'Drumee Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          to: '/api-reference',
          label: 'API Reference',
          position: 'left',
        },
        {
          to: '/guides',
          label: 'Guides',
          position: 'left',
        },
        {
          href: 'https://github.com/drumee',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started',
            },
            {
              label: 'Core Concepts',
              to: '/concepts',
            },
            {
              label: 'API Reference',
              to: '/api-reference',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/drumee',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/drumee',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/drumee_os',
            },
          ],
        },
        {
          title: 'Repositories',
          items: [
            {
              label: 'Server Core',
              href: 'https://github.com/drumee/server-core',
            },
            {
              label: 'UI Team',
              href: 'https://github.com/drumee/ui-team',
            },
            {
              label: 'Schemas',
              href: 'https://github.com/drumee/schemas',
            },
            {
              label: 'Server Team',
              href: 'https://github.com/drumee/server-team',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Drumee. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['sql', 'json', 'bash'],
    },
    mermaid: {
      theme: {light: 'neutral', dark: 'dark'},
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true,
  },

  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
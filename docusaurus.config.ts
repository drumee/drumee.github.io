import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
// Every URL of the previous site that no longer exists, grouped by the page it now redirects to
// (taken from the sitemap of the site this one replaced).
import legacyRedirects from './legacy-redirects.json';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Welcome to Drumee Documentation',
  tagline: 'Built to be yours, designed to be shared.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.drumee.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  //baseUrl: '/documentation/',
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'drumee', // Usually your GitHub org/user name.
  projectName: 'drumee.github.io', // Usually your repo name.

  onBrokenLinks: 'warn',
  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
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
          routeBasePath: '/',  // Docs are at root of this deployment
          editUrl: 'https://github.com/drumee/drumee.github.io/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: 'Drumee Docs',
      logo: {
        alt: 'Drumee Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://drumee.com',
          label: '← Back to Home',
          position: 'right',
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
            { label: 'Introduction', to: '/introduction' },
            { label: 'Technology', to: '/technology' },
            { label: 'Resources', to: '/resources/01-glossary' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'GitHub', href: 'https://github.com/drumee' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Home', href: 'https://drumee.com' },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Drumee.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json', 'http'],
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  themes: ['@docusaurus/theme-mermaid'],

  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        // Old URLs keep working: each redirects to the page that now covers its subject.
        redirects: [
          { from: '/technology/02-acl-system', to: '/technology/02-rbac-system' },
          { from: '/technology/03-mfs-architecture', to: '/technology/03-file-storage' },
          { from: '/technology/06-request-pipeline', to: '/technology/04-request-pipeline' },
          { from: '/technology/07-database-sharding', to: '/technology/05-data-storage-encryption' },
          { from: '/technology/yellow-pages-schema', to: '/technology/06-directory-schema' },
          { from: ['/technology/04-letc-engine', '/technology/05-widget-concept'], to: '/technology/01-overview' },
          ...Object.entries(legacyRedirects as Record<string, string[]>).map(([to, from]) => ({ from, to })),
        ],
      },
    ],
  ],
};

export default config;

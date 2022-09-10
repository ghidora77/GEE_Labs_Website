const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Remote Sensing Documentation',
  tagline: 'Remote sensing and mapping with the Google Earth Engine',
  url: 'https://LozAnalytics.github.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'LozAnalytics', // Usually your GitHub org/user name.
  projectName: 'remote-sensing', // Usually your repo name.
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
      type: 'text/css',
      integrity:
      'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
      crossorigin: 'anonymous',
    },
  ],
  themeConfig: {
    navbar: {
      title: 'Remote Sensing',
      logo: {
        alt: 'Loz Analytics',
        src: 'img/logo-bold-small.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'A01-Attribution',
          position: 'left',
          label: 'Tutorial',
        },
        {
          href: 'https://github.com/LozAnalytics/remote-sensing',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Tutorial',
              to: '/docs/A01-Attribution',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Website',
              href: 'https://lozanalytics.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Loz Analytics, LLC. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/ghidora77/VT_RemoteSensing_SocialSci', 
          remarkPlugins: [math],
          rehypePlugins: [katex],

        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

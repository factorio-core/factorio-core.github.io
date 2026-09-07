// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import mermaid from 'astro-mermaid';
import starlightTypeDoc, { typeDocSidebarGroup } from 'starlight-typedoc';

// https://astro.build/config
export default defineConfig({
  site: process.env.SITE_URL || 'https://factorio-core.github.io',
  integrations: [
    mermaid({
      theme: 'dark',
      autoTheme: true,
    }),
    starlight({
      title: 'fcore',
      description: 'Reactive UI Engine & Modding Framework for Factorio 2.0',
      logo: {
        dark: './src/assets/logo.svg',
        light: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/factorio-core',
      },
      customCss: ['./src/styles/custom.css'],
      plugins: [
        starlightTypeDoc({
          entryPoints: [
            '../fcore/src/react/index.ts',
            '../fcore/src/react-components/index.tsx',
            '../fcore/src/utils/event.ts',
            '../fcore/src/utils/scheduler.ts',
            '../fcore/src/utils/signal.ts',
            '../fcore/src/utils/data.ts',
            '../fcore/src/utils/strace.ts',
            '../fcore/src/utils/table.ts',
            '../fcore/src/utils/translate.ts',
            '../fcore/src/styles/index.ts',
          ],
          tsconfig: '../fcore/tsconfig.json',
          output: 'api',
          sidebar: {
            label: '📚 API Reference',
            collapsed: true,
          },
          pagination: true,
          typeDoc: {
            outputFileStrategy: 'modules',
            entryFileName: 'index.md',
            skipErrorChecking: true,
            readme: 'none',
            excludeInternal: true,
            excludePrivate: true,
            excludeProtected: true,
            excludeExternals: true,
            gitRevision: 'master',
            sort: ['source-order'],
            parametersFormat: 'table',
            propertiesFormat: 'table',
            enumMembersFormat: 'table',
            typeDeclarationFormat: 'table',
            expandParameters: true,
            useCodeBlocks: true,
          },
        }),
      ],
      sidebar: [
        {
          label: 'Introduction',
          items: [
            { label: 'Overview', link: '/' },
            { label: 'Infrastructure', link: '/fcore/infrastructure/' },
            { label: 'React', link: '/fcore/react/' },
            { label: 'Event', link: '/fcore/event/' },
            { label: 'Scheduler', link: '/fcore/scheduler/' },
            { label: 'Styles', link: '/fcore/styles/' },
            { label: 'Strace', link: '/fcore/strace/' },
            { label: 'Translate', link: '/fcore/translate/' },
          ],
        },
        {
          label: 'Mods',
          items: [
            { label: 'Cybersyn2 Combinator', link: '/cybersyn2-combinator/' },
          ],
        },
        {
          label: 'API Reference',
          autogenerate: { directory: 'api', collapsed: false },
        },
      ],
    }),
    react(),
  ],
});

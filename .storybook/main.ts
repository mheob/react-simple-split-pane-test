import path from 'path';

import { StorybookConfig } from '@storybook/react/types';

export const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  core: { builder: 'webpack5' },

  // webpackFinal: async (config) => {
  //   config.module?.rules?.push({
  //     test: /\.css$/i,
  //     exclude: /(node_modules)/,
  //     use: [
  //       'style-loader',
  //       {
  //         loader: 'css-loader',
  //         options: {
  //           modules: true,
  //         },
  //       },
  //     ],
  //   });

  //   return config;
  // },
};

export default config;

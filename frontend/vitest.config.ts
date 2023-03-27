import { defineConfig } from "vitest/config";
import Vue from "@vitejs/plugin-vue";
import * as path from "path";
import {fileURLToPath, URL} from "url";

export default defineConfig({
  plugins: [Vue({
    template: {
      compilerOptions: {
        isCustomElement: (tag) => [
          'DsfrAlert',
          'DsfrBreadcrumb',
          'DsfrTile',
          'DsfrButton',
          'DsfrButtonGroup',
          'HistoVecButtonLink',
          'router-link',
          'LoaderComponent'
        ].includes(tag),
      }
    }
  })],
  test: {
    testTimeout: 6000,
    globals: true,
    environment: "jsdom",
  },
  resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@Api': path.resolve(__dirname, './src/api'),
    '@Assets': path.resolve(__dirname, './src/assets'),
    '@Components': path.resolve(__dirname, './src/components'),
    '@Constants': path.resolve(__dirname, './src/constants'),
    '@Utils': path.resolve(__dirname, './src/utils'),
    '@Views': path.resolve(__dirname, './src/views'),
  },
},
  root: ".", //Define the root
});

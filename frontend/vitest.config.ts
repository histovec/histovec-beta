import { defineConfig } from "vitest/config";
import Vue from "@vitejs/plugin-vue";
import * as path from "path";

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
    '@': path.resolve(__dirname, './src')
  },
},
  root: ".", //Define the root
});

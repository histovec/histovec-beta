// http://eslint.org/docs/user-guide/configuring

module.exports = {
  // root: true,
  // globals: {
  //   defineEmits: 'readonly',
  //   defineProps: 'readonly',
  // },
  env: {
    browser: true,
    es6: true,
    // es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
  ],
  // parserOptions: {
  //   ecmaVersion: 12,
  //   sourceType: 'module',
  // },
  // plugins: [
  //   'vue',
  // ],
  // add your custom rules here
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    // Fix v-for/template/key bug
    'vue/html-self-closing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    quotes: ['error', 'single'],
  },
}

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/prettier',
		'@vue/typescript/recommended'
  ],

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-empty-function': 'off',
		'@typescript-eslint/explicit-member-accessibility': 'off',
		'@typescript-eslint/member-delimiter-style': 'off',
		'@typescript-eslint/no-use-before-define': ['error', { functions: false }],
		'no-empty-pattern': 'off',
		'comma-dangle': ['error', 'only-multiline'],
    'space-before-function-paren': 0,
    'keyword-spacing': 0
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    //parser: 'babel-eslint',
    ecmaVersion: 2020,
		allowImportExportEverywhere: true
  },
}

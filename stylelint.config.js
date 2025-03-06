module.exports = {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue', 'stylelint-config-prettier'],
  rules: {
    'no-empty-source': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
      },
    ],
  },
}

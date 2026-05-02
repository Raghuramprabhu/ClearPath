module.exports = {
  env: { browser: true, es2020: true, node: true },
  extends: [
    'airbnb',
    'airbnb/hooks',
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
};

// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }], // Essencial para Jest
    '@babel/preset-typescript',                               // Se você usa TypeScript
    ['@babel/preset-react', { runtime: 'automatic' }]      // Para transformar JSX
  ],
};
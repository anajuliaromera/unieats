// jest.config.js (ou jest.config.ts)
module.exports = {
  // ...suas outras configurações do Jest...
  testEnvironment: 'jsdom', // Comum para testes de front-end
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Se você tiver um arquivo de setup

  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['@swc/jest', {
      // Opções do SWC, se precisar customizar (geralmente os padrões são bons)
      // Documentação: https://swc.rs/docs/configuration/compilation
      jsc: {
        parser: {
          syntax: 'typescript', // Habilita parsing de TypeScript
          tsx: true,            // Habilita parsing de JSX/TSX
          decorators: true,     // Se você usa decorators
        },
        transform: {
          react: {
            runtime: 'automatic', // Para o novo JSX transform do React 17+
          },
        },
      },
    }],
  },
  // Mapear módulos CSS ou outros assets se necessário
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
     // Exemplo para caminhos alias, se você usa:
    '^@/components/(.*)$': '<rootDir>/components/$1',
  },
  // ...suas outras configurações do Jest...
};
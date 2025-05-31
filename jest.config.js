// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Forneça o caminho para o seu aplicativo Next.js para carregar next.config.js e arquivos .env no seu ambiente de teste
  dir: './',
})

// Adicione qualquer configuração personalizada a ser passada para o Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Adicione mais opções de configuração antes de cada teste ser executado
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom', // Ou 'node' dependendo dos seus testes

  // --- Adicione ou modifique estas opções de cobertura ---
  collectCoverage: true, // Habilita a coleta de cobertura
  coverageProvider: 'v8', // Recomendado para SWC, que o Next.js usa. Alternativamente, use 'babel'.
  coverageDirectory: 'coverage', // Pasta onde os relatórios de cobertura serão gerados
  collectCoverageFrom: [ // Especifique os arquivos a serem incluídos no relatório de cobertura
    'app/**/*.{ts,tsx}', // Ajuste para corresponder à estrutura do seu projeto, ex: 'src/**/*.{ts,tsx}'
    '!app/**/*.test.{ts,tsx}', // Exclua arquivos de teste
    '!app/**/layout.{ts,tsx}', // Potencialmente exclua arquivos de layout se não forem testáveis ou desejados na cobertura
    '!app/**/page.{ts,tsx}', // Potencialmente exclua arquivos de página básicos se não forem testáveis ou desejados na cobertura
    '!app/**/not-found.{ts,tsx}', // Exclua a página not-found
    '!app/api/**/*', // Exclua rotas de API se forem testadas de forma diferente ou não testadas unitariamente
    '!**/node_modules/**', // Sempre exclua node_modules
    '!<rootDir>/.next/**', // Exclua artefatos de compilação do Next.js
    '!<rootDir>/coverage/**', // Exclua o próprio diretório de cobertura
    '!<rootDir>/jest.config.js',
    '!<rootDir>/jest.setup.js',
    '!<rootDir>/next.config.mjs', // Ou .js
    '!<rootDir>/postcss.config.mjs', // Ou .js
    '!<rootDir>/tailwind.config.ts', // Ou .js
    // Adicione quaisquer outros arquivos ou diretórios que você deseja excluir
  ],
  coverageReporters: [ // Formatos dos relatórios de cobertura
    'json',
    'lcov', // Bom para integração com serviços como Coveralls ou Codecov
    'text', // Útil para visualização rápida no console
    'clover',
    'html' // Gera um relatório HTML interativo
  ],
  // Você pode adicionar limites de cobertura para garantir uma certa porcentagem de cobertura
  // coverageThreshold: {
  //   global: {
  //     branches: 80,
  //     functions: 80,
  //     lines: 80,
  //     statements: -10, // Permite 10 declarações não cobertas
  //   },
  // },
   moduleNameMapper: {
    // Lida com alias de caminhos (ajuste se o seu tsconfig.json for diferente)
    '^@/(.*)$': '<rootDir>/$1', // Se @/ aponta para a raiz do projeto
    // ou, se @/ aponta para 'app' como parece ser o caso:
    // '^@/app/(.*)$': '<rootDir>/app/$1', // Verifique sua configuração no tsconfig.json
    // Se o seu tsconfig.json tem "baseUrl": "." e "paths": { "@/*": ["./*"] }
    // ou "paths": { "@/*": ["./app/*"] } (ajuste '<rootDir>/' conforme necessário)

    // Lida com módulos CSS (se você importar CSS em componentes e testes)
    '^.+\\.(css|sass|scss)$': 'identity-obj-proxy',

    // Lida com mocks de assets estáticos (ajuste conforme necessário)
    '^.+\\.(jpg|jpeg|png|gif|webp|avif|svg)$': `<rootDir>/__mocks__/fileMock.js`,
  },
  // ...
}
// ...

// createJestConfig é exportado desta forma para garantir que next/jest possa carregar a configuração do Next.js corretamente
module.exports = createJestConfig(customJestConfig)

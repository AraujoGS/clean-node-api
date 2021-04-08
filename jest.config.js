module.exports = {
  roots: ['<rootDir>/src'], // diretorio raiz do projeto
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/**',
    '!<rootDir>/src/**/*-protocols.ts',
    '!<rootDir>/**/protocols/**',
    '!<rootDir>/**/test/**'
  ], // Quero cobertura de teste em todos os arquivos dentro de src e que sejam ts
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

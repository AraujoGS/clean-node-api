module.exports = {
  roots: ['<rootDir>/tests'], // diretorio raiz do projeto
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/main/config/**',
    '!<rootDir>/src/main/docs/**',
    '!<rootDir>/src/main/adapters/express/**',
    '!<rootDir>/src/main/server.ts',
    '!<rootDir>/src/**/*-protocols.ts',
    '!<rootDir>/**/protocols/**'
  ], // Quero cobertura de teste em todos os arquivos dentro de src e que sejam ts
  coverageDirectory: 'coverage',
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  moduleNameMapper: {
    '@/tests/(.*)': '<rootDir>/tests/$1',
    '@/(.*)': '<rootDir>/src/$1'
  },
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}

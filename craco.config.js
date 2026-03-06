const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components/'),
      '@apis': path.resolve(__dirname, 'src/apis/'),
      '@constants': path.resolve(__dirname, 'src/constants/'),
      '@hooks': path.resolve(__dirname, 'src/hooks/'),
      '@i18n': path.resolve(__dirname, 'src/i18n/'),
      '@pages': path.resolve(__dirname, 'src/pages/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@images': path.resolve(__dirname, 'src/images/'),
      '@logos': path.resolve(__dirname, 'src/logos/'),
      '@img': path.resolve(__dirname, 'logos/'),
      '@app-types': path.resolve(__dirname, 'src/types/')
    }
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@components/(.*)$': '<rootDir>/src/components/$1',
        '^@apis/(.*)$': '<rootDir>/src/apis/$1',
        '^@constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@i18n/(.*)$': '<rootDir>/src/i18n/$1',
        '^@pages/(.*)$': '<rootDir>/src/pages/$1',
        '^@utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@images/(.*)$': '<rootDir>/src/images/$1',
        '^@logos/(.*)$': '<rootDir>/src/logos/$1',
        '^@img/(.*)$': '<rootDir>/logos/$1',
        '^@app-types/(.*)$': '<rootDir>/src/types/$1'
      }
    }
  },
  eslint: {
    enable: false
  }
};

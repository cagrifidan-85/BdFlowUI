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
      '@img': path.resolve(__dirname, 'logos/')
    }
  },
  eslint: {
    enable: false
  }
};

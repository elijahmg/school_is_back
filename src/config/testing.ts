export const config = {
  expireTime: '30d',
  secrets: {
    JWC_SECRET: 'boost-test',
    JWT_SECRET: 'boost-test'
  },
  db: {
    url: 'mongodb://localhost/jams-test'
  }
};
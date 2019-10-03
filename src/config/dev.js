export const config = {
  expireTime: '30d',
  secrets: {
    JWC_SECRET: 'boost-dev',
  },
  db: {
    url: 'mongodb://localhost/jams'
  },
};
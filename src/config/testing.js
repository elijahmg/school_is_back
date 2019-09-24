export const config = {
  expireTime: '30d',
  secrets: {
    JWT_SECRET: 'boost'
  },
  db: {
    url: 'mongodb://localhost/jams-test'
  }
};
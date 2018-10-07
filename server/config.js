const dotenv = require('dotenv');

// initializing env variables
try {
  dotenv.config(); // eslint-disable-line
} catch (e) {
  console.log('Could not find .env file. Continuing..'); // eslint-disable-line
}

module.exports = {
  mongoURL: process.env.MONGO_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpires: '30d',
};

require('dotenv').config()
export default {
    origin: 'http://localhost:3001',
    accessTokenExpiresIn: 15,
    refreshTokenExpiresIn: 60,
    redisCacheExpiresIn: 60,
  };
  
  
require('dotenv').config()
import config from "config";


// const port = config.get<number>('port');
export default {
    origin: `http://44.202.32.175:8000`,
    accessTokenExpiresIn: 15,
    refreshTokenExpiresIn: 60,
    redisCacheExpiresIn: 60,
  };
  
  
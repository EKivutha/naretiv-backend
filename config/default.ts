require('dotenv').config()
import config from "config";


// const port = config.get<number>('port');
export default {
    origin: `http://localhost:8000`,
    accessTokenExpiresIn: 15,
    refreshTokenExpiresIn: 60,
    redisCacheExpiresIn: 60,
  };
  
  
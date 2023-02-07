import * as dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  dotenv.config({ path: '.env.production' });
}
// Import the dependencies
import * as dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

// Application variables
export const appPort: number =
  parseInt(process.env.APP_SENDGRID_PORT as string, 10) || 3000;
export const appDomain: string =
  process.env.APP_SENDGRID_DOMAIN || 'app.domain.com';

// Sendgrid variables
export const apiKeySendgrid: string =
  process.env.APP_SENDGRID_API_KEY || 'sendgrid_api_key';

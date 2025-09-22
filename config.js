import dotenv from 'dotenv';
dotenv.config();

export const APP_ID=process.env.APP_ID;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;
export const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
export const INSTALLATION_ID = process.env.INSTALLATION_ID;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
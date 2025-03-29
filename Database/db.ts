// lib/db.ts
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'CapitalOneTravel',
  password: process.env.DB_PASSWORD || 'secretpassword',
  port: parseInt(process.env.DB_PORT || '5431'),
});

client.connect()
  .then(() => console.log("✅ Connected to database"))
  .catch((error: any) => console.error("❌ Connection error:", error));

export default client;

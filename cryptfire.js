import crypto from 'crypto';
import 'dotenv/config';
import formData from 'form-data';
import Mailgun from 'mailgun.js';
import twilio from 'twilio';
import sdk from 'node-appwrite';
import { createClient } from 'redis';

// Redis Client
export const redis_client = await createClient()
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

// Mailgun SDK
const mailgun = new Mailgun(formData);
export const mg = mailgun.client({username: 'api', key: process.env._API_MAILGUN});

// Twilio SDK
const accountSid = process.env._API_TWILIO_SID;
const authToken = process.env._API_TWILIO_SECRET;
export const twilio_client = twilio(accountSid, authToken);

// Appwrite SDK
export const client = new sdk.Client();

client
    .setEndpoint('https://appwrite.backbones.cryptfire.io/v1') // Your API Endpoint
    .setProject('cryptfire') // Your project ID
    .setKey(process.env._API_APPWRITE) // Your secret API key
;

export const databases = new sdk.Databases(client);

// Helper Functions
export const gen_str = (length) => {
  if (!length) length = 15;
  const characterSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
  return Array.from(crypto.randomBytes(length), byte => characterSet[byte % characterSet.length]).join('');
};

export const val_email = (email) => {
  // Regular expression for basic email validation
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return regex.test(email);
};

export const val_api_key = (apikey) => {
  return /^[A-Za-z0-9_]+$/.test(apikey) && apikey.length === 64;
}


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

// Decorators
export const apikey_decorator = async (req, res, next) => {
  const api_key = req.header("x-cryptfire-api-key");
  if (!api_key || !val_api_key(api_key)) {
    res.send({'status': 'not ok'});
    return false;
  }

  const result = await redis_client.get(`cache_${api_key}`);
  if (result) {
    console.log(`api key found in cache${api_key}`);
    next();
  }

  // retarded Appwrite API
  const docs = await databases.listDocuments('cryptfire', 'api', [
    sdk.Query.equal('key', [api_key])
  ]);

  if (docs.total === 0) {
    res.send({'status': 'not ok'});
    return false;
  }

  console.log(`api key found ${api_key}`);

  next();
};

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


import crypto from 'crypto';
import 'dotenv/config';

import formData from 'form-data';
import Mailgun from 'mailgun.js';

// Mailgun SDK
const mailgun = new Mailgun(formData);
export const mg = mailgun.client({username: 'api', key: process.env._API_MAILGUN});

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


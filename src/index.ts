// Import dependencies
import http from 'http';
import express, { json, urlencoded } from 'express';
import multer from 'multer';
import cors from 'cors';
import * as mail from './controllers/mail.controller';
import { appPort } from './configs';

// Initialize express
const app = express();
// Initialize multer
const upload = multer();

// Middlewares
app.use(cors({ origin: true }));
app.use(json());
app.use(urlencoded({ extended: false }));

// Routes bases
const basePath: string = '/api';

// Route Hello
app.get(`${basePath}/hello`, (req, res) => {
  return res.json('Hello from API');
});

// Route Post parse email sent from sendgrid
app.post(`${basePath}/parseEmail`, upload.any(), mail.parse);

// Initialize app server
http.createServer(app).listen(appPort, () => {
  console.log('Server running, ready to work!!');
});

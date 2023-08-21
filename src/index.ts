// import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { authRoutes } from './app/routes/authRoutes';
import { config } from 'dotenv';
import serviceAccount from "../sa-key.json";
import travellerRoutes from './app/routes/travellerRoutes';
import adminRoutes from './app/routes/adminRoutes';

config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});


const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors({ origin: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});
authRoutes(app)
app.use('/travellers', travellerRoutes);
app.use('/admin', adminRoutes); // Adding Admin routes

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
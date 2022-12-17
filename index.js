import express, { json } from 'express';
import { connectToDB } from './src/db/mongoose.js';

import indexRoute from './src/routes/index.router.js';

const app = express(); // Create our Express Application Object

const PORT = process.env.PORT || 3000;
const BASE_URL = '/api/v1';

app.use(json());
app.use(BASE_URL, indexRoute); // render:https://weekend15-project-nodejs-bank-api-with.onrender.com/api/v1/  local: localhost:4000/api/v1

//run the function so we are connected to the database
connectToDB();
// Server Listener
app.listen(PORT, () => console.log(`Now Listening on port ${PORT}`));

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { login, refresh } from './controllers/auth.js';
import groupRoute from './routes/group.js';
import userRoute from './routes/user.js';
import contactRoute from './routes/contact.js';
import splitRoute from './routes/split.js';
import nonevmRoute from './routes/nonevm.js';

const app = express();
dotenv.config();
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(cors({ origin: '*' }));

app.post('/login', login);
app.post('/refresh', refresh);
app.use('/contact', contactRoute);
app.use('/group', groupRoute);
app.use('/split', splitRoute);
app.use('/user', userRoute);
app.use('/nonevm', nonevmRoute);

app.get('/', (req, res) => {
  return res.json({ hello: 'world' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

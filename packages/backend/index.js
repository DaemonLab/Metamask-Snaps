import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { login, refresh } from './controllers/auth.js';
import groupRoute from './routes/group.js';
import userRoute from './routes/user.js';
import { JwtGuard } from './middleware/auth.js';

const app = express();
dotenv.config({ path: '../../env' });
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(cors({ origin:'*' }))

app.post('/login', login);
app.post('/refresh', refresh);
app.use('/group', groupRoute);
app.use('/user', userRoute);

app.listen(process.env.SERVER_PORT, () => {
  console.log(
    `Server listening on http://localhost:${process.env.SERVER_PORT}!`,
  );
});

// *******************
// TODO 2: adding people in groups

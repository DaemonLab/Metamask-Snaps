import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { login, refresh } from './controllers/auth.js';
import groupRoute from './routes/group.js';
import userRoute from './routes/user.js';
import contactRoute from './routes/contact.js';
import splitRoute from "./routes/split.js";
import { JwtGuard } from './middleware/auth.js';

const app = express();
dotenv.config({ path: '../../env' });
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb', extended: true }));
app.use(cors({ origin:'*' }))

app.post('/login', login);
app.post('/refresh', refresh);
app.post('/contact', contactRoute);
app.use('/group', groupRoute);
app.use('/split', splitRoute);
app.use('/user', userRoute);

app.get('/', (req,res)=>{
  return res.json({hello : "world"})
})

const port = process.env.PORT || process.env.SERVER_PORT
console.log(process.env, port);

app.listen(port, () => {
  console.log(
    `Server listening on http://localhost:${port}`,
  );
});

// *******************
// TODO 1: delete contact, update user, split all(*), get group
// TOD0 200: remove returns from between

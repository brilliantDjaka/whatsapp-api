import * as dotenv from 'dotenv';
dotenv.config({ path: __dirname + '/../.env' });

import * as express from 'express';
import { getQr, sendMessage } from './controllers';
import { ValidationError } from 'joi';
import { validateWaSession } from './middleware/validate-wa-session';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded());

app.get('/', (req, res) => res.send('-_-'));

app.get('/get-qr', getQr);
app.post('/send-message', validateWaSession, sendMessage);

app.use(function (
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction,
) {
  if (err instanceof ValidationError) {
    return res.status(400).send(err.message);
  }
  return res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

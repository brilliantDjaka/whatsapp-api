import axios from 'axios';
import { Response } from 'express';
import { Client } from 'whatsapp-web.js';

export async function getQR(
  successWebHook: string,
  res: Response,
): Promise<void> {
  let closed = false;
  let sent = false;
  const client = new Client({
    puppeteer: {
      browserWSEndpoint: process.env.PUPPETEER_URL,
    } as unknown,
  });

  setTimeout(() => {
    if (closed) return;
    console.log('timeout');
    client.destroy();
  }, 1000 * parseInt(process.env.QR_EXTRA_TIMEOUT_SEC || '5'));

  try {
    client.on('authenticated', (session) => {
      axios
        .post(successWebHook, { session })
        .then((_) => console.log('success post qr action'))
        .catch((_) => console.log('failed post qr action'));
      client.destroy();
      closed = true;
    });
    client.on('qr', async (qr) => {
      if (sent) {
        client.destroy();
        closed = true;
        return;
      }
      res.send(qr);
      sent = true;
    });
    await client.initialize();
  } catch (error) {
    console.log('error skipped');
    closed = true;
  }
}

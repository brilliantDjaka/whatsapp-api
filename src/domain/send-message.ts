import { Client, ClientSession } from 'whatsapp-web.js';

async function initTillReady(client: Client): Promise<void> {
  return new Promise((resolve, reject) => {
    client.on('ready', () => resolve());
    client.on('auth_failure', () => reject());
    client.initialize();
  });
}

export async function sendMessage(
  session: ClientSession,
  number: string,
  text: string,
): Promise<void> {
  const client = new Client({
    session: session,
    puppeteer: {
      browserWSEndpoint: 'ws://localhost:3000',
    } as unknown,
  });

  await initTillReady(client);

  const number_details = await client.getNumberId(number);

  if (number_details) {
    await client.sendMessage(number_details._serialized, text);
  } else {
    console.log(number, 'Mobile number is not registered');
  }

  await new Promise<void>((resolve, _reject) => {
    setTimeout(() => {
      resolve();
    }, parseInt(process.env.CLIENT_EXTRA_TIMEOUT_SEC || '1') * 1000);
  });

  await client.destroy();
}

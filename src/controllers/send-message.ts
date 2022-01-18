import { Request, Response } from 'express';
import * as joi from 'joi';
import { validate } from '../helpers';
import * as sendMessageDomain from '../domain/send-message';
import { ClientSession } from 'whatsapp-web.js';

const dto = joi.object({
  phone: joi
    .string()
    .min(8)
    .pattern(/^[0-9]+$/)
    .required(),
  text: joi.string().required(),
});

interface Dto {
  phone: string;
  text: string;
}

export async function sendMessage(req: Request, res: Response) {
  const payload: Dto = validate(dto, req.body);

  try {
    await sendMessageDomain.sendMessage(
      req['waSession'] as ClientSession,
      payload.phone,
      payload.text,
    );
  } catch (error) {
    return res.sendStatus(500);
  }

  return res.send('success');
}

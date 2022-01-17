import { Request, Response } from 'express';
import * as joi from 'joi';
import { validate } from '../helpers';
import * as domain from '../domain/get-qr';

const dto = joi.object({
  webhook: joi.string().required(),
});

interface Dto {
  webhook: string;
}

export async function getQr(req: Request, res: Response) {
  const payload: Dto = validate(dto, req.query);

  return await domain.getQR(payload.webhook, res);
}

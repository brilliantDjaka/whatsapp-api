import { Request, Response, NextFunction } from 'express';
import * as joi from 'joi';
import { validate } from '../helpers';

const dto = joi
  .object({
    session: joi
      .object({
        WABrowserId: joi.string().required(),
        WASecretBundle: joi.string().required(),
        WAToken1: joi.string().required(),
        WAToken2: joi.string().required(),
      })
      .required(),
  })
  .unknown(true);

interface Dto {
  session: Session;
}

interface Session {
  WABrowserId: string;
  WASecretBundle: string;
  WAToken1: string;
  WAToken2: string;
}

export function validateWaSession(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let sessionQuery: Record<string, string> | undefined;

  if (req.query.session) {
    try {
      sessionQuery = JSON.parse(req.query.session as string);
    } catch (error) {
      return res.status(400).send('error parse session');
    }
  }

  const data: Dto = validate(dto, { session: sessionQuery, ...req.body });

  req['waSession'] = data.session;

  delete req.query.session;
  delete req.body.session;

  next();
}

import * as joi from 'joi';

export function validate(schema: joi.ObjectSchema, payload: unknown) {
  const { value, error } = schema.validate(payload);

  if (error) throw error;

  return value;
}

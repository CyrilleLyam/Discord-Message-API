import type { ErrorRequestHandler } from 'express';
import { HttpException } from './exception.ts';
import { Status } from './status.ts';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const isClientError =
    err.status >= Status.BAD_REQUEST && err.status < Status.INTERNAL_SERVER_ERROR;
  if (err instanceof HttpException || isClientError) {
    res.status(err.status).json({ error: err.message });
    return;
  }

  req.log.error(err);
  res.status(Status.INTERNAL_SERVER_ERROR).json({ error: 'internal server error' });
};

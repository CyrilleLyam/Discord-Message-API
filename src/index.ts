import express from 'express';
import { pinoHttp } from 'pino-http';
import { DISCORD_WEBHOOK_URL, PORT } from './env.ts';
import { BadGatewayException, BadRequestException } from './exception.ts';
import { logger } from './logger.ts';
import { errorHandler } from './middleware.ts';
import { Status } from './status.ts';

const DISCORD_TIMEOUT_MS = 10_000;

const app = express();
app.use(pinoHttp({ logger }));
app.use(express.json());

app.post('/messages', async (req, res) => {
  const { content, username } = req.body ?? {};
  if (typeof content !== 'string' || !content.trim() || content.length > 2000) {
    throw new BadRequestException('content must be a string of 1-2000 characters');
  }

  let discord: Response;
  try {
    discord = await fetch(`${DISCORD_WEBHOOK_URL}?wait=true`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, username, allowed_mentions: { parse: [] } }),
      signal: AbortSignal.timeout(DISCORD_TIMEOUT_MS),
    });
  } catch (error) {
    req.log.error({ err: error }, 'failed to reach Discord');
    throw new BadGatewayException('failed to reach Discord');
  }
  if (!discord.ok) {
    const body = await discord.text();
    req.log.warn({ status: discord.status, body }, 'Discord rejected the message');
    throw new BadGatewayException(body);
  }

  const { id } = (await discord.json()) as { id: string };
  res.status(Status.CREATED).json({ id });
});

app.use(errorHandler);

app.listen(PORT, () => logger.info(`Listening on http://localhost:${PORT}`));

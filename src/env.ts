function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

export const DISCORD_WEBHOOK_URL = required('DISCORD_WEBHOOK_URL');
if (!URL.canParse(DISCORD_WEBHOOK_URL)) {
  throw new Error('DISCORD_WEBHOOK_URL must be a valid URL');
}

export const PORT = Number(required('PORT'));
if (!Number.isInteger(PORT)) {
  throw new Error('PORT must be an integer');
}

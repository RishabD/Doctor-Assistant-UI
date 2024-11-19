import { z } from "zod";

const envSchema = z.object({
  SERVER_PORT: z.number().int(),
  SERVER_HOST: z.string().min(1),
});

export const ENV = envSchema.parse({
  SERVER_PORT: Number(import.meta.env.VITE_SERVER_PORT),
  SERVER_HOST: import.meta.env.VITE_SERVER_HOST,
});

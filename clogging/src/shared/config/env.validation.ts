import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
});

try {
  envSchema.parse(process.env);
} catch (error) {
  throw new Error(
    'Invalid environment variables: ' + JSON.stringify(error.issues, null, 2),
  );
}

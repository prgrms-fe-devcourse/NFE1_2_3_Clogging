const getEnvVar = (key: string) => {
  if (process.env[key] === undefined) {
    throw new Error(`Environment variable ${key} is required`);
  }
  return process.env[key] || '';
};

export const ENV = {
  API_URL: getEnvVar('NEXT_PUBLIC_API_URL'),
  // 다른 환경 변수들...
} as const;

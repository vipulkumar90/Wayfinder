export const readField = <T = unknown>(source: unknown, ...keys: string[]): T | undefined => {
  if (!source || typeof source !== 'object') return undefined;
  for (const key of keys) {
    const value = (source as Record<string, T | undefined>)[key];
    if (value !== undefined && value !== null) {
      return value;
    }
  }
  return undefined;
};


const invalidDateMessage = (value: string): string => `Invalid ISO date string: ${value}`;

export const isoToDate = (value: string): Date => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new Error(invalidDateMessage(value));
  }
  return date;
};

export const optionalIsoToDate = (
  value: string | null | undefined,
): Date | undefined => {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0) {
    return undefined;
  }
  return isoToDate(trimmed);
};

export const dateToIsoString = (value: Date | undefined | null): string | null => {
  if (!value) {
    return null;
  }
  return value.toISOString();
};

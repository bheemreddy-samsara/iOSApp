/**
 * Data transformation utilities for converting between
 * database (snake_case) and frontend (camelCase) formats
 */

type SnakeToCamelCase<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
  : S;

type CamelToSnakeCase<S extends string> = S extends `${infer T}${infer U}`
  ? T extends Capitalize<T>
    ? `_${Lowercase<T>}${CamelToSnakeCase<U>}`
    : `${T}${CamelToSnakeCase<U>}`
  : S;

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function transformKeys<T extends Record<string, unknown>>(
  obj: T,
  transformer: (key: string) => string,
): Record<string, unknown> {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'object' && item !== null
        ? transformKeys(item as Record<string, unknown>, transformer)
        : item,
    ) as unknown as Record<string, unknown>;
  }

  return Object.keys(obj).reduce(
    (acc, key) => {
      const transformedKey = transformer(key);
      const value = obj[key];
      acc[transformedKey] =
        typeof value === 'object' && value !== null
          ? transformKeys(value as Record<string, unknown>, transformer)
          : value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export function fromDatabase<T>(data: Record<string, unknown>): T {
  return transformKeys(data, snakeToCamel) as T;
}

export function toDatabase<T extends Record<string, unknown>>(
  data: T,
): Record<string, unknown> {
  return transformKeys(data, camelToSnake);
}

export function fromDatabaseArray<T>(data: Record<string, unknown>[]): T[] {
  return data.map((item) => fromDatabase<T>(item));
}

export function toDatabaseArray<T extends Record<string, unknown>>(
  data: T[],
): Record<string, unknown>[] {
  return data.map((item) => toDatabase(item));
}

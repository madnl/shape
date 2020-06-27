export function extendedTypeOf(value: unknown): string {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value === null) {
    return 'null';
  }
  return typeof value;
}

export function constant<T>(x: T): () => T {
  return () => x;
}

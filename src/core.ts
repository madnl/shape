export interface Shape<T> {
  check(value: unknown): Mismatch | T;
}

export type ValidationResult<T> =
  | { success: true; value: T }
  | { success: false; mismatch: Mismatch };

export function validate<T>(shape: Shape<T>, value: unknown): ValidationResult<T> {
  const result = shape.check(value);
  return isMismatch(result)
    ? { success: false, mismatch: result }
    : { success: true, value: value as any };
}

export function matches<T>(shape: Shape<T>, value: unknown): value is T {
  return !shape.check(value);
}

export class Mismatch {
  public readonly shape: Shape<unknown>;
  public readonly value: unknown;
  public readonly path: readonly string[];

  constructor(path: readonly string[], shape: Shape<unknown>, value: unknown) {
    this.shape = shape;
    this.value = value;
    this.path = path;
  }
}

export function mismatch({ value, shape }: { value: unknown; shape: Shape<unknown> }): Mismatch {
  return new Mismatch([], shape, value);
}

export function nestedMismatch(pathSegment: string, nested: Mismatch): Mismatch {
  return new Mismatch([pathSegment, ...nested.path], nested.shape, nested.value);
}

export function isMismatch(x: unknown): x is Mismatch {
  return x instanceof Mismatch;
}

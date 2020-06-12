import { extendedTypeOf } from './util';

export interface Shape<T> {
  verify(value: unknown): Mismatch | T;
  toJSON(): {};
  toString(): string;
}

export type Static<T extends Shape<unknown>> = T extends Shape<infer U> ? U : never;

export type ValidationResult<T> =
  | { success: true; value: T }
  | { success: false; mismatch: Mismatch };

export function validate<T>(shape: Shape<T>, value: unknown): ValidationResult<T> {
  const result = shape.verify(value);
  return isMismatch(result)
    ? { success: false, mismatch: result }
    : { success: true, value: result };
}

export function guard<T>(shape: Shape<T>, value: unknown): value is T {
  return !isMismatch(shape.verify(value));
}

export function check<T>(shape: Shape<T>, value: unknown): T {
  const result = shape.verify(value);
  if (isMismatch(result)) {
    throw new ValidationError(result);
  }
  return result;
}

export class ValidationError extends Error {
  public readonly mismatch: Mismatch;

  constructor(mismatch: Mismatch) {
    super(mismatch.message());
    this.mismatch = mismatch;
  }
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

  message(): string {
    return `Error at .${this.path.join('.')}: Expected ${this.shape} but got ${extendedTypeOf(
      this.value
    )}`;
  }
}

export function mismatch(shape: Shape<unknown>, value: unknown): Mismatch {
  return new Mismatch([], shape, value);
}

export function nestedMismatch(pathSegment: string, nested: Mismatch): Mismatch {
  return new Mismatch([pathSegment, ...nested.path], nested.shape, nested.value);
}

export function isMismatch(x: unknown): x is Mismatch {
  return x instanceof Mismatch;
}

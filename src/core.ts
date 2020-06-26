import { extendedTypeOf } from './util';

/**
 * Interface for a shape describing a type of data.
 */
export interface Shape<T> {
  /**
   * Verify if the shape matches a given value
   * @param value The value to be checked
   * @returns The same input value, if check was successful or a Mismatch object if the check failed.
   */
  verify(value: unknown): Mismatch | T;

  /**
   * All shape objects should provide a toString implementation for nice error messages.
   */
  toString(): string;
}

/**
 * Obtain a static type from a shape.
 *
 * Example:
 *
 * ```
 * const User = record({ id: number, name: string });
 *
 * type User = Static<typeof User>;
 * ```
 */
export type Static<T extends Shape<any>> = T extends Shape<infer U> ? U : never;

/**
 * The result from calling the `validate` method.
 */
export type ValidationResult<T> =
  | { success: true; value: T }
  | { success: false; mismatch: MismatchDescription };

export type MismatchDescription = {
  expectedShape: Shape<unknown>;
  givenValue: unknown;
  message: string;
  path: string;
};

/**
 * Validate that shape matches a value
 * @param shape The shape to be matched
 * @param value The value to check against the shape
 * @returns A union of a success case, providing the same input value, but typed with the type associated
 *          with the shape, or a failure case, providing a description of the mismatch.
 */
export function validate<T>(shape: Shape<T>, value: unknown): ValidationResult<T> {
  const result = shape.verify(value);
  return isMismatch(result)
    ? {
        success: false,
        mismatch: {
          expectedShape: result.shape,
          givenValue: result.value,
          message: result.message(),
          path: joinPath(result.path),
        },
      }
    : { success: true, value: result };
}

/**
 * Verify whether the shape matches a given value. This boolean function acts as
 * a type guard. In blocks of code executed conditionally when this function returns
 * true, the value will become typed with the type associated to the shape.
 *
 * @param shape The shape to be matched
 * @param value The value to check against the shape
 * @returns true if shape matches value, false otherwise
 */
export function isMatch<T>(shape: Shape<T>, value: unknown): value is T {
  return !isMismatch(shape.verify(value));
}

/**
 * Expect that the given shape matches the given value. If there's a mismatch,
 * throw an exception
 * @param shape The shape to be matched
 * @param value The value to check against the shape
 * @returns The same input value, but typed with the type associated with the shape
 * @throws ShapeMismatchError if there is a mismatch
 */
export function expectMatch<T>(shape: Shape<T>, value: unknown): T {
  const result = shape.verify(value);
  if (isMismatch(result)) {
    throw new ShapeMismatchError(result);
  }
  return result;
}

/**
 * Exception thrown on shape match.
 */
export class ShapeMismatchError extends Error {
  private readonly mismatch: Mismatch;

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
    return `Error at ${joinPath(this.path)}: Expected ${this.shape} but got ${extendedTypeOf(
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

function joinPath(path: readonly string[]): string {
  return `.${path.join('.')}`;
}

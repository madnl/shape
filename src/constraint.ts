import { Shape, Mismatch, isMismatch, mismatch } from './core';

/**
 * Describes a shape
 */
export type Description = {
  /**
   * An identifier to describe a given constraint
   */
  id: string;
};

/**
 * Create a more specific shape by adding a boolean constraint on an
 * existing shape
 * @param shape The shape to be made more specific
 * @param predicate A function taking a value matching the base shape which returns true/false
 * @param description An optional description to be associated with this new shape.
 */
export function constrained<T>(
  shape: Shape<T>,
  predicate: (value: T) => boolean,
  description: Readonly<Description>
): Shape<T> {
  return new Constraint(shape, predicate, description);
}

class Constraint<T> implements Shape<T> {
  readonly baseShape: Shape<T>;
  readonly predicate: (value: T) => boolean;
  readonly description: Readonly<Description>;

  constructor(baseShape: Shape<T>, predicate: (value: T) => boolean, description: Description) {
    this.baseShape = baseShape;
    this.predicate = predicate;
    this.description = description;
  }

  verify(value: unknown): T | Mismatch {
    const result = this.baseShape.verify(value);
    if (isMismatch(result)) {
      return result;
    }
    return this.predicate.call(undefined, result) ? result : mismatch(this, value);
  }

  toString(): string {
    return `${this.baseShape} & Constrained<${JSON.stringify(this.description.id)}>`;
  }
}

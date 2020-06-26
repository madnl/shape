import { Shape, Mismatch, isMismatch, mismatch } from './core';

const defaultIntrospect = (): Introspection => ({
  jsonDetails: '<unspecified>',
  stringDescription: '<unspecified>',
});

export function constrained<T>(
  shape: Shape<T>,
  predicate: (value: T) => boolean,
  introspect?: string | Introspection | (() => Introspection)
) {
  return new Constraint(
    shape,
    predicate,
    typeof introspect === 'string'
      ? () => ({ jsonDetails: introspect, stringDescription: introspect })
      : typeof introspect === 'object'
      ? () => introspect
      : introspect || defaultIntrospect
  );
}

type Introspection = {
  jsonDetails: unknown;
  stringDescription: string;
};

class Constraint<T> implements Shape<T> {
  readonly baseShape: Shape<T>;
  readonly predicate: (value: T) => boolean;
  readonly introspection: () => Introspection;

  constructor(
    baseShape: Shape<T>,
    predicate: (value: T) => boolean,
    introspection: () => Introspection
  ) {
    this.baseShape = baseShape;
    this.predicate = predicate;
    this.introspection = introspection;
  }

  verify(value: unknown): T | Mismatch {
    const result = this.baseShape.verify(value);
    if (isMismatch(result)) {
      return result;
    }
    return this.predicate.call(undefined, result) ? result : mismatch(this, value);
  }

  toString(): string {
    return `constrained(${this.baseShape}, ${this.introspection().stringDescription})`;
  }
}

import { Shape, mismatch, Mismatch, isMismatch, nestedMismatch } from './core';

/**
 * Shape which matches an object where all values are of the given shape. It
 * is assumed that keys are of type string.
 *
 * @param valueType The shape of the value
 * @returns a shape which matches objects where values have the specified shape.
 */
export function dictionary<V>(valueType: Shape<V>): Shape<Record<string, V>> {
  return new ObjectMapShape(valueType);
}

class ObjectMapShape<V> implements Shape<Record<string, V>> {
  public readonly valueType: Shape<V>;

  constructor(valueType: Shape<V>) {
    this.valueType = valueType;
  }

  verify(objectValue: unknown): Record<string, V> | Mismatch {
    if (typeof objectValue !== 'object' || !objectValue) {
      return mismatch(this, objectValue);
    }
    for (const key in objectValue) {
      if (objectValue.hasOwnProperty(key)) {
        const value: unknown = (objectValue as any)[key];
        const result = this.valueType.verify(value);
        if (isMismatch(result)) {
          return nestedMismatch(`[${key}]`, result);
        }
      }
    }
    return objectValue as Record<string, V>;
  }

  toString() {
    return `objectMapOf(${this.valueType})`;
  }
}

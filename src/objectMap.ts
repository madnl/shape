import { Shape, mismatch, Mismatch, isMismatch, nestedMismatch } from './core';

export function objectMap<V>(valueType: Shape<V>): Shape<Record<string, V>> {
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
          nestedMismatch(`[${key}]`, result);
        }
      }
    }
    return objectValue as Record<string, V>;
  }
}

import { Shape } from '.';
import { Mismatch, mismatch, isMismatch, nestedMismatch, Static } from './core';

type TypeFromObjectShape<ObjShapeT extends { [key: string]: Shape<unknown> }> = {
  [K in keyof ObjShapeT]: Static<ObjShapeT[K]>;
};

type FieldShapes = { [key: string]: Shape<unknown> };

export function shape<ObjShapeT extends FieldShapes>(
  fieldShapes: ObjShapeT
): Shape<TypeFromObjectShape<ObjShapeT>> {
  return new ObjectShape(fieldShapes);
}

class ObjectShape<ObjShapeT extends FieldShapes> implements Shape<TypeFromObjectShape<ObjShapeT>> {
  public readonly fieldShapes: FieldShapes;
  private readonly pairs: readonly Readonly<{ key: string; shape: Shape<unknown> }>[];

  constructor(fieldShapes: Readonly<FieldShapes>) {
    this.fieldShapes = fieldShapes;
    this.pairs = Object.keys(fieldShapes).map((key) => ({ key, shape: fieldShapes[key] }));
  }

  verify(objectValue: unknown): TypeFromObjectShape<ObjShapeT> | Mismatch {
    if (typeof objectValue !== 'object' || !objectValue) {
      return mismatch(this, objectValue);
    }
    for (let i = 0; i < this.pairs.length; i++) {
      const { key, shape } = this.pairs[i];
      const value = (objectValue as any)[key];
      const result = shape.verify(value);
      if (isMismatch(result)) {
        return nestedMismatch(key, result);
      }
    }
    return objectValue as TypeFromObjectShape<ObjShapeT>;
  }
}

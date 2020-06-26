import { Shape } from '.';
import { Mismatch, mismatch, isMismatch, nestedMismatch, Static } from './core';
import { intersection } from './intersection';

type TypeFromObjectShape<ObjShapeT extends { [key: string]: Shape<unknown> }> = {
  [K in keyof ObjShapeT]: Static<ObjShapeT[K]>;
};

type FieldShapes = { [key: string]: Shape<unknown> };

export function record<ObjShapeT extends FieldShapes>(
  fieldShapes: ObjShapeT
): Shape<TypeFromObjectShape<ObjShapeT>> {
  return new ObjectShape(fieldShapes, VerificationCriteria.Required);
}

export function partial<ObjShapeT extends FieldShapes>(
  fieldShapes: ObjShapeT
): Shape<Partial<TypeFromObjectShape<ObjShapeT>>> {
  return new ObjectShape(fieldShapes, VerificationCriteria.Optional);
}

export function struct<
  RequiredObjShapeT extends FieldShapes,
  OptionalObjShapeT extends FieldShapes
>(params: {
  required: RequiredObjShapeT;
  optional: OptionalObjShapeT;
}): Shape<
  TypeFromObjectShape<RequiredObjShapeT> & Partial<TypeFromObjectShape<OptionalObjShapeT>>
> {
  return intersection(record(params.required), partial(params.optional));
}

enum VerificationCriteria {
  Required,
  Optional,
}

class ObjectShape<ObjShapeT extends FieldShapes> implements Shape<TypeFromObjectShape<ObjShapeT>> {
  public readonly fieldShapes: FieldShapes;
  private readonly pairs: readonly Readonly<{ key: string; shape: Shape<unknown> }>[];
  private readonly verificationCritera: VerificationCriteria;

  constructor(fieldShapes: Readonly<FieldShapes>, verificationCriteria: VerificationCriteria) {
    this.fieldShapes = fieldShapes;
    this.pairs = Object.keys(fieldShapes).map((key) => ({ key, shape: fieldShapes[key] }));
    this.verificationCritera = verificationCriteria;
  }

  verify(objectValue: unknown): TypeFromObjectShape<ObjShapeT> | Mismatch {
    if (typeof objectValue !== 'object' || !objectValue) {
      return mismatch(this, objectValue);
    }
    for (let i = 0; i < this.pairs.length; i++) {
      const { key, shape } = this.pairs[i];
      if (this.verificationCritera === VerificationCriteria.Required || key in objectValue) {
        const value = (objectValue as any)[key];
        const result = shape.verify(value);
        if (isMismatch(result)) {
          return nestedMismatch(key, result);
        }
      }
    }
    return objectValue as TypeFromObjectShape<ObjShapeT>;
  }

  toString() {
    return `{ ${this.pairs.map(({ key, shape }) => `${key}: ${shape}`)} }`;
  }
}

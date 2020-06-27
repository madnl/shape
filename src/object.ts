import { Shape } from '.';
import { Mismatch, mismatch, isMismatch, nestedMismatch, Static } from './core';
import { intersection } from './intersection';

type TypeFromObjectShape<ObjShapeT extends { [key: string]: Shape<unknown> }> = {
  [K in keyof ObjShapeT]: Static<ObjShapeT[K]>;
};

type FieldShapes = { [key: string]: Shape<unknown> };

/**
 * Shape for objects that must include the provided properties.
 *
 * @param properties An object mapping property names to property shapes
 * @returns A shape matching objects with the given required fields
 */
export function record<ObjShapeT extends FieldShapes>(
  properties: ObjShapeT
): Shape<TypeFromObjectShape<ObjShapeT>> {
  return new ObjectShape(properties, VerificationCriteria.Required);
}

/**
 * Shape for objects that include the described properties, or do not
 * include the property at all.
 *
 * @param properties An object mapping property names to optional property shapes
 * @returns A shape matching objects with the given optional fields.
 */
export function partial<ObjShapeT extends FieldShapes>(
  properties: ObjShapeT
): Shape<Partial<TypeFromObjectShape<ObjShapeT>>> {
  return new ObjectShape(properties, VerificationCriteria.Optional);
}

/**
 * A shape describing an object where some of the properties are required and some
 * properties are optional.
 *
 * @param properties.required An object mapping required property names to their respective shapes
 * @param properties.optional An object mapping optional property names to their respective shapes
 * @returns An shape that matches object which include the required properties and which may include
 *          the optional properties with the associated property shapes.
 */
export function structure<
  RequiredObjShapeT extends FieldShapes,
  OptionalObjShapeT extends FieldShapes
>(properties: {
  required: RequiredObjShapeT;
  optional: OptionalObjShapeT;
}): Shape<
  TypeFromObjectShape<RequiredObjShapeT> & Partial<TypeFromObjectShape<OptionalObjShapeT>>
> {
  return intersection(record(properties.required), partial(properties.optional));
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
    const objStr = `{ ${this.pairs.map(({ key, shape }) => `${key}: ${shape}`).join(', ')} }`;
    return this.verificationCritera === VerificationCriteria.Optional
      ? `Partial<${objStr}>`
      : objStr;
  }
}

import { testAccept, testReject } from './util';
import { intersection, number, record, string, boolean } from '..';
import * as Mocks from './mocks';
import { Mismatch } from '../core';
import { unknown } from '../unknown';

describe('intersection', () => {
  const shape = intersection(
    record({ foo: record({ x: boolean }) }),
    record({ bar: number }),
    record({ foo: record({ y: string }) })
  );

  testAccept(shape, [{ foo: { x: true, y: 'str' }, bar: 10 }]);
  testReject(shape, [
    { foo: { x: true }, bar: 10 },
    { foo: { y: 'str' }, bar: 10 },
    { foo: {}, bar: 10 },
    { foo: { x: true, y: 100 }, bar: 10 },
  ]);

  test('returns a match if all components match', () => {
    const shape1 = Mocks.matchedShape();
    const shape2 = Mocks.matchedShape();
    const shape3 = Mocks.matchedShape();
    const interShape = intersection(shape1, shape2, shape3);
    const value = {};
    expect(interShape.verify(value)).toBe(value);
    expect(shape1.verify).toHaveBeenCalledWith(value);
    expect(shape2.verify).toHaveBeenCalledWith(value);
    expect(shape3.verify).toHaveBeenCalledWith(value);
  });

  test('returns first mismatch from component', () => {
    const shape1 = Mocks.matchedShape();
    const shape2 = Mocks.mismatchedShape(Mocks.mismatch());
    const shape3 = Mocks.matchedShape();
    const interShape = intersection(shape1, shape2, shape3);
    const value = {};
    expect(interShape.verify(value)).toBeInstanceOf(Mismatch);
    expect(shape1.verify).toHaveBeenCalled();
    expect(shape2.verify).toHaveBeenCalled();
    expect(shape3.verify).not.toHaveBeenCalled();
  });
});

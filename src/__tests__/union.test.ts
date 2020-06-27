import { testAccept, testReject } from './util';
import { union, number, string, record, literal } from '..';
import * as Mocks from './mocks';
import { Mismatch } from '../lib/core';

describe('union', () => {
  testAccept(union(string, number), ['abc', 123]);
  testReject(union(string, number), [true, {}, null, undefined]);

  testAccept(
    union(
      record({ type: literal('type1'), value: string }),
      record({ type: literal('type2'), value: number }),
      record({ type: literal('type3'), prop: string })
    ),
    [
      { type: 'type1', value: 'foo' },
      { type: 'type2', value: 123 },
      { type: 'type3', prop: 'foo' },
    ]
  );

  testReject(
    union(
      record({ type: literal('type1'), value: string }),
      record({ type: literal('type2'), value: number }),
      record({ type: literal('type3'), prop: string })
    ),
    [
      { type: 'type1', value: 123 },
      { type: 'type2', value: '123' },
      { type: 'type3' },
      {},
      123,
      { type: 'type4' },
    ]
  );

  test('matching stops when first shape returns a match', () => {
    const shape1 = Mocks.mismatchedShape();
    const shape2 = Mocks.mismatchedShape();
    const shape3 = Mocks.matchedShape();
    const shape4 = Mocks.mismatchedShape();
    const unionShape = union(shape1, shape2, shape3, shape4);
    const value = {};
    expect(unionShape.verify(value)).toBe(value);
    expect(shape1.verify).toHaveBeenCalledWith(value);
    expect(shape2.verify).toHaveBeenCalledWith(value);
    expect(shape3.verify).toHaveBeenCalledWith(value);
    expect(shape4.verify).not.toHaveBeenCalled();
  });

  test('if no shapes match, a mismatch is returned', () => {
    const shape1 = Mocks.mismatchedShape();
    const shape2 = Mocks.mismatchedShape();
    const shape3 = Mocks.mismatchedShape();
    const shape4 = Mocks.mismatchedShape();
    const unionShape = union(shape1, shape2, shape3, shape4);
    const value = {};
    expect(unionShape.verify(value)).toBeInstanceOf(Mismatch);
    expect(shape1.verify).toHaveBeenCalledWith(value);
    expect(shape2.verify).toHaveBeenCalledWith(value);
    expect(shape3.verify).toHaveBeenCalledWith(value);
    expect(shape4.verify).toHaveBeenCalledWith(value);
  });
});

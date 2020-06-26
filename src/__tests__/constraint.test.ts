import { testAccept, testReject } from './util';
import { number, constrained } from '..';
import { guard } from '../core';

describe('constraint', () => {
  const isPositive = (x: number) => x >= 0;
  const description = { id: 'positive' };

  testAccept(constrained(number, isPositive, description), [0, 1, 2]);

  testReject(constrained(number, isPositive, description), [-1, -Infinity]);

  test('predicate is not called if base shape is not matched', () => {
    const predicate = jest.fn(() => true);
    expect(guard(constrained(number, predicate, description), 'foo')).toBe(false);
    expect(predicate).not.toHaveBeenCalled();
  });

  test('predicate is called if base shape is matched', () => {
    const predicate = jest.fn(() => true);
    const shape = constrained(number, predicate, description);
    expect(guard(shape, 100)).toBe(true);
    expect(predicate).toHaveBeenCalledWith(100);
    predicate.mockReturnValue(false);
    expect(guard(shape, 10)).toBe(false);
    expect(predicate).toHaveBeenCalledWith(10);
  });

  test('uses string description in the toString method', () => {
    expect(constrained(number, isPositive, description).toString()).toBe(
      'number & Constrained<"positive">'
    );
  });
});

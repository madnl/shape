import { Shape, isMatch } from '..';
import { constrained } from '../constraint';
import { unknown } from '../unknown';
import { Mismatch } from '../core';

export function testAccept(shape: Shape<unknown>, values: readonly unknown[]) {
  values.forEach((value) => {
    test(`${shape} should accept ${JSON.stringify(value)}`, () => {
      expect(isMatch(shape, value)).toBe(true);
    });
  });
}

export function testReject(shape: Shape<unknown>, values: readonly unknown[]) {
  values.forEach((value) => {
    test(`${shape} should reject ${JSON.stringify(value)}`, () => {
      expect(isMatch(shape, value)).toBe(false);
    });
  });
}

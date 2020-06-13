import { Shape, guard } from '..';

export function testAccept(shape: Shape<unknown>, values: readonly unknown[]) {
  values.forEach((value) => {
    test(`${shape} should accept ${JSON.stringify(value)}`, () => {
      expect(guard(shape, value)).toBe(true);
    });
  });
}

export function testReject(shape: Shape<unknown>, values: readonly unknown[]) {
  values.forEach((value) => {
    test(`${shape} should reject ${JSON.stringify(value)}`, () => {
      expect(guard(shape, value)).toBe(false);
    });
  });
}

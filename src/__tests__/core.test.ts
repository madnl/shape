import { validate, Shape, isMatch, expectMatch, ShapeMismatchError } from '../index';
import { Mismatch } from '../core';

describe('core', () => {
  describe('validate', () => {
    test('validate returns success case if shape matches data', () => {
      const shape = { verify: jest.fn((value) => value) };
      const value = { x: 'foo' };
      const result = validate(shape, value);
      expect(result.success && result.value).toBe(value);
      expect(shape.verify).toHaveBeenCalledWith(value);
    });

    test('validate returns failure case if shape does not match data', () => {
      const shape: Shape<unknown> = {
        verify: jest.fn((value) => new Mismatch(['some', 'path'], shape, value)),
        toString() {
          return 'mock shape';
        },
      };
      const value = { x: 'foo' };
      const result = validate(shape, value);
      expect(!result.success && result.mismatch).toMatchObject({
        path: '.some.path',
        givenValue: { x: 'foo' },
        expectedShape: shape,
        message: 'Error at .some.path: Expected mock shape but got object',
      });
    });
  });

  describe('isMatch', () => {
    test('returns true if shape matches data', () => {
      const shape = { verify: jest.fn((value) => value) };
      const value = { x: 'foo' };
      expect(isMatch(shape, value)).toBe(true);
      expect(shape.verify).toHaveBeenCalledWith(value);
    });

    test('returns false if shape does not match data', () => {
      const shape: Shape<unknown> = {
        verify: jest.fn((value) => new Mismatch(['some', 'path'], shape, value)),
      };
      const value = { x: 'foo' };
      expect(isMatch(shape, value)).toBe(false);
    });
  });

  describe('expectMatch', () => {
    test('returns original value if shape matches the value', () => {
      const shape = { verify: jest.fn((value) => value) };
      const value = { x: 'foo' };
      expect(expectMatch(shape, value)).toBe(value);
      expect(shape.verify).toHaveBeenCalledWith(value);
    });

    test('throws exception if shape does not match value', () => {
      const shape: Shape<unknown> = {
        verify: jest.fn((value) => new Mismatch(['some', 'path'], shape, value)),
      };
      const value = { x: 'foo' };
      expect(() => expectMatch(shape, value)).toThrow(expect.any(ShapeMismatchError));
    });
  });
});

import { testAccept, testReject } from './util';
import { string, number } from '..';
import { boolean } from '../primitive';

describe('primitive', () => {
  describe('string', () => {
    testAccept(string, ['foo', '']);
    testReject(string, [null, undefined, 0, 1, true]);
  });

  describe('number', () => {
    testAccept(number, [0, 1, -1, 1.54, -2.3, Math.PI, NaN, Infinity]);
    testReject(number, ['0', '', null, undefined]);
  });

  describe('boolean', () => {
    testAccept(boolean, [true, false]);
    testReject(boolean, ['true', 'false', 0, undefined, null]);
  });
});

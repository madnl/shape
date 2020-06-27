import { testAccept, testReject } from './util';
import { integer, positiveNumber, positiveInteger, nonZeroPositiveInteger } from '../numeric';

describe('numeric', () => {
  testAccept(integer, [0, 1, -1, 100, -100, Number.MAX_SAFE_INTEGER, Number.MIN_SAFE_INTEGER]);
  testReject(integer, [0.1, -0.1, Math.PI, 2 / 3, Infinity, NaN]);

  testAccept(positiveNumber, [0, 0.1, 1, 100, Number.MAX_SAFE_INTEGER, Infinity]);
  testReject(positiveNumber, [-0.1, -1, -100, Number.MIN_SAFE_INTEGER, -Infinity]);

  testAccept(positiveInteger, [0, 1, 2, Number.MAX_SAFE_INTEGER]);
  testReject(positiveInteger, [-1, -2, Number.MIN_SAFE_INTEGER, Infinity, 0.1, NaN]);

  testAccept(nonZeroPositiveInteger, [1, 2, Number.MAX_SAFE_INTEGER]);
  testReject(nonZeroPositiveInteger, [0, -1, 0.1, Infinity, NaN]);
});

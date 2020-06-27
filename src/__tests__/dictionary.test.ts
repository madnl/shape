import { testAccept, testReject } from './util';
import { dictionary, number } from '..';

describe('dictionary', () => {
  testAccept(dictionary(number), [{}, { a: 1, b: 2, c: 3 }, { a: 1 }]);

  testReject(dictionary(number), [{ a: 1, b: '2' }, null, undefined, { a: { b: 1 } }]);
});

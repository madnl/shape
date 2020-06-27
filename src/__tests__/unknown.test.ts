import { testAccept, testReject } from './util';
import { unknown, something } from '../unknown';

describe('unknown', () => {
  testAccept(unknown, [0, 1, -1, 0.4, {}, [], [12], { a: 3 }, null, undefined, '', 'abc']);

  testAccept(something, [0, 1, -1, 0.4, {}, [], [12], { a: 3 }, '', 'abc']);
  testReject(something, [null, undefined]);
});

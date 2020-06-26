import { literal } from '..';
import { testAccept, testReject } from './util';

describe('literal', () => {
  testAccept(literal(3), [3]);
  testAccept(literal('foo'), ['foo']);

  testReject(literal(3), [4, 'foo', undefined, null, 4.2]);
  testReject(literal('foo'), ['', 'foo1', 'foo ', 'fo', null, undefined]);
});

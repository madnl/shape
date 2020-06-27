import { testAccept, testReject } from './util';
import { undefinedLiteral, string, nullLiteral, optional, nullable, nullish } from '..';

describe('optional', () => {
  testAccept(undefinedLiteral, [undefined, void 0]);
  testReject(undefinedLiteral, [null, '', 0, {}, []]);

  testAccept(nullLiteral, [null]);
  testReject(nullLiteral, [undefined, 0, {}]);

  testAccept(optional(string), ['', 'foo', undefined]);
  testReject(optional(string), [123, null, {}]);

  testAccept(nullable(string), ['', 'foo', null]);
  testReject(nullable(string), [123, undefined, {}]);

  testAccept(nullish(string), ['', 'foo', null, undefined]);
  testReject(nullish(string), [123, {}]);
});

import { testAccept, testReject } from './util';
import { nonEmptyString, stringMatching, numericStringId } from '../strings';

describe('string', () => {
  describe('nonEmptyString', () => {
    testAccept(nonEmptyString, ['abc', 'a', ' ']);
    testReject(nonEmptyString, ['', null, undefined, {}, { a: 'foo' }]);
  });

  describe('stringMatching', () => {
    testAccept(stringMatching(/foo[0-9]+/), ['foo123', 'foo1']);
    testReject(stringMatching(/foo[0-9]+/), ['', 'foo', 'abc', null, undefined, 123]);
  });

  describe('numericStringId', () => {
    testAccept(numericStringId, ['0', '1', '123', '123456789012345678901234567890']);
    testReject(numericStringId, ['', '-1', '123a', '1a2', 'abc123', 123]);
  });
});

import { testAccept, testReject } from './util';
import { tuple, string, number } from '..';

describe('tuple', () => {
  testAccept(tuple(string, number), [
    ['foo', 1],
    ['', 0],
  ]);

  testReject(tuple(string, number), [
    [],
    ['foo'],
    [1, 2],
    [2, 'foo'],
    ['foo', 1, 2],
    null,
    undefined,
    [undefined, undefined],
    ['foo', 1, undefined],
  ]);
});

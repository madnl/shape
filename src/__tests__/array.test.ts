import { testAccept, testReject } from './util';
import { array, number, record, string } from '..';

describe('array', () => {
  testAccept(array(number), [[], [1, 2, 3], [1]]);

  testAccept(array(record({ foo: string, bar: number })), [
    [],
    [
      { foo: '', bar: 0 },
      { foo: 'abc', bar: 100 },
    ],
  ]);

  testReject(array(number), [
    [1, '2'],
    [1, 2, '3', 4, 5],
    ['1', 2, 3, 4, 5],
  ]);

  testReject(array(string), [
    { 0: 'a', 1: 'b', 2: 'c', length: 3 },
    {},
    null,
    undefined,
    0,
    { length: 0 },
  ]);
});

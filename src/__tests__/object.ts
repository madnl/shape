import { testAccept } from './util';
import { string, number } from '../primitive';
import { record } from '..';

describe('object shapes', () => {
  describe('record', () => {
    testAccept(record({ a: string, b: number }), [
      { a: 'abc', b: 123 },
      { a: 'abc', b: 123, c: true },
    ]);
  });
});

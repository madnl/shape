import { testAccept, testReject } from './util';
import { record, string, number, partial, boolean, structure } from '..';

describe('object shapes', () => {
  describe('record', () => {
    testAccept(record({ a: string, b: number }), [
      { a: 'abc', b: 123 },
      { a: 'abc', b: 123, c: true },
    ]);

    testReject(record({ a: string, b: number }), [
      { a: 'abc' },
      { b: 100 },
      {},
      { a: 'abc', b: '123' },
      { a: 123, b: 123 },
      null,
      undefined,
    ]);
  });

  describe('partial', () => {
    testAccept(partial({ a: string, b: number }), [
      {},
      { a: 'abc', b: 123 },
      { a: 'abc' },
      { b: 123 },
      { a: 'abc', c: true },
      { b: 123, c: true },
      { a: 'abc', b: 123, c: true },
      { c: true },
    ]);

    testReject(partial({ a: string, b: number }), [
      { a: 'abc', b: '123' },
      { a: 123, b: 123 },
      { a: 123 },
      { b: '123' },
      null,
      undefined,
    ]);
  });

  describe('struct', () => {
    testAccept(
      structure({ required: { a: string, b: boolean }, optional: { c: number, d: string } }),
      [
        { a: 'abc', b: true, c: 123, d: 'def' },
        { a: 'abc', b: true },
        { a: 'abc', b: true, c: 123 },
        { a: 'abc', b: true, d: 'def' },
      ]
    );

    testReject(
      structure({ required: { a: string, b: boolean }, optional: { c: number, d: string } }),
      [
        { a: 'abc', c: 123, d: 'def' },
        { b: true, c: 123, d: 'def' },
        { a: 'abc', b: true, c: '123' },
        { a: 'abc', b: true, d: 123 },
        { c: 123, d: 'def' },
        {},
        null,
        undefined,
        JSON.stringify({ a: 'abc', b: true, c: 123, d: 'def' }),
      ]
    );
  });
});

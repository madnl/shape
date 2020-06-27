import { constrained } from './constraint';
import { string } from './primitive';
import { Shape } from './core';

export const nonEmptyString = constrained(string, (s) => s.length > 0, { tag: 'nonEmptyString' });

export function stringMatching(regExp: RegExp): Shape<string> {
  return constrained(string, (s) => regExp.test(s), { tag: regExp.toString() });
}

const NUMERIC_ID = /[0-9]+/;

export const numericStringId = constrained(string, (value) => NUMERIC_ID.test(value), {
  tag: 'numericStringId',
});

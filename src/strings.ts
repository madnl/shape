import { constrained } from './constraint';
import { string } from './primitive';
import { Shape } from './core';

/**
 * Strings which have at least one character.
 */
export const nonEmptyString = constrained(string, (s) => s.length > 0, { tag: 'nonEmptyString' });

/**
 * Strings which match the given regular expression, according to RegExp.test()
 * @param regExp The regular expression to be tested
 * @returns A string shape which matches the given regular expression
 */
export function stringMatching(regExp: RegExp): Shape<string> {
  return constrained(string, (s) => regExp.test(s), { tag: regExp.toString() });
}

const NUMERIC_ID = /^[0-9]+$/;

/**
 * Matches non-empty strings which are entirely made of digits.
 */
export const numericStringId = constrained(string, (value) => NUMERIC_ID.test(value), {
  tag: 'numericStringId',
});

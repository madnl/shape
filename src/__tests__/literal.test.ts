import { guard } from '..';
import { literal } from '..';

describe('literal', () => {
  test('matches exact literal value', () => {
    expect(guard(literal(3), 3)).toBe(true);
    expect(guard(literal('foo'), 'foo')).toBe(true);
  });

  test('does not match values unequal to the given value', () => {
    expect(guard(literal(3), 4)).toBe(false);
    expect(guard(literal(3), 'foo')).toBe(false);
    expect(guard(literal(''), 'foo')).toBe(false);
  });
});

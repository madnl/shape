import { shape } from './shape';
import { string, number } from './primitive';
import { objectMap } from './objectMap';
import { union } from './union';
import { literal } from './literal';
import { check } from './core';
import { tuple, optional } from './index';
import { nonZeroPositiveInteger } from './numeric';

const Field = union(
  shape({ fieldType: literal('stringField'), value: string }),
  shape({ fieldType: literal('numberField'), value: number })
);

const Moneyball = shape({
  flow: string,
  mode: string,
  fields: objectMap(Field),
});

const payload = {
  flow: 'simplicity',
  mode: 'login',
  fields: {
    foo: { fieldType: 'stringField', value: 'foo' },
    bar: { fieldType: 'numberField', value: 100 },
  },
};

check(Moneyball, payload);

// console.log(obj);

const Coordinate = tuple(nonZeroPositiveInteger, shape({ field: optional(string) }));

check(Coordinate, [10, { field: 2 }]);

import { shape } from './shape';
import { string, number } from './primitive';
import { objectMap } from './objectMap';
import { union } from './union';
import { literal } from './literal';
import { check } from './core';

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

const obj: {
  flow: string;
  mode: string;
  fields: Record<
    string,
    { fieldType: 'stringField'; value: string } | { fieldType: 'numberField'; value: number }
  >;
} = check(Moneyball, payload);

console.log(obj);

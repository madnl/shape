import { record } from './index';
import { string, number } from './index';
import { objectMap } from './index';
import { union } from './index';
import { literal } from './index';
import { expectMatch } from './core';

const StringField = record({ fieldType: literal('stringField'), value: string });
const NumberField = record({ fieldType: literal('numberField'), value: number });

const PrimitiveField = union(StringField, NumberField);
const CreditCardField = record({ fieldType: literal('creditCardField'), ccNumber: PrimitiveField });

const Field = union(StringField, NumberField, CreditCardField);

const Moneyball = record({
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
    cc: { fieldType: 'creditCardField', ccNumber: { fieldType: 'stringField', value: '123' } },
  },
};

expectMatch(Moneyball, payload);

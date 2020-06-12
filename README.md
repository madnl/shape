# Shape.js

Shape.js is a library which helps with validating and associating static types to untyped data.
Typescript helps defining the shapes of the data your code is working with, but when that data
is obtained from the IO world (HTTP APIs, IndexedDB, cookies, etc.) or from code that is yet to
be typed, the shape of the data is unknown to typescript. Casting it could be an option,
but it is an unsafe way of solving this problem, as there's no guarantee that the data matches the type
you expect.

This is where shapes.js comes in, by providing a way to validate at runtime that the data you're working
on does in fact match the types you are expecting.

Imagine you are working on a client-side TODO app which works with an API that allows querying the list
of TODO items. The API might return data in the following format:

```json
{
  "todos": [
    { "task": "Buy milk", "due": 1591987244774, "status": "notDone" },
    { "task": "Send letter", "due": 1591988054003, "status": "notDone" },
    { "task": "Cleaning", "due": 1591985033124, "status": "done" }
  ]
}
```

In order to work with this data, you would want to define this TypeScript type for it:

```ts
type TODOList = {
  todos: Array<{ task: string; due: number; status: 'done' | 'notDone' }>;
};
```

Unfortunately, when making HTTP requests for this data, it's not easy to validate that
the response you are getting does indeed have this type.

```ts
function fetchTodoList(): Promise<unknown>;

// Will issue a type mismatch compiler error
const response: TODOList = await fetchTodoList();
```

This is where shape.js comes in. You can define a shape that describes your data and then verify
that the response does indeed match that shape:

```ts
import { array, record, number, string, literal, union, check } from 'shape';

const TodoList = record({
  todos: array(
    record({
      task: string,
      due: number,
      status: union(literal('done'), literal('notDone')),
    })
  ),
});

const response: TODOList = check(TodoList, await fetchTodoList());
```

If the response matches your expectations, the `check` function will return the unchanged response that
you are passing to it, but with an associated type that matches the shape. If the response does not
match your expectations, an exceptions will be thrown that tells you where the mismatch occurred. Thus,
you can transition from untyped data to typed data in a safe way.

There are other variations to the `check` function. If you do not wish to throw an exception, you can
use the `validate` function which returns an object with a `success: true | false` field and `value` field
with the right type if the validation passed or an `mismatch` field indicating where the error occurred.

```ts
const validation = check(TodoList, await fetchTodoList());

if (validation.success) {
  const response: TodoList = validation.value;
  console.log(response);
} else {
  console.log(
    `Response is in the wrong shape at ${validation.mismatch.path}: ${validation.mismatch.message}`
  );
}
```

You can also use the `guard` function which makes use of Typescript type guards and returns true/false
depending on whether the data matches or not. If there is a match, the data adopts the type associated
with the shape

```ts
import { guard } from 'shape';

const response = await fetchTodoList();
if (guard(TodoList, response)) {
  // response now has type { todos: Array<...> }
  console.log(response.todos);
}
```

It seems redundant to define both the Typescript type you want for the data and the shape that goes
with that type. Fortuntely, you don't need to define the type yourself, you can derive it using
the `Static` utility.

```ts
import { Static } from 'shape';

type TodoList = Static<typeof TodoList>;
```

## Defining shapes

The API allows you to define shapes that span the range Typescript's type system and beyond.

### Primitives

```ts
import { string, number, boolean } from 'shape';

check(string, 'foo');
check(number, 100);
check(boolean, false);
```

### Fixed values

```ts
import { literal } from 'shape';

guard(literal('foo'), 'foo'); // true
guard(literal('foo'), 'bar'); // false
guard(literal(100), 100);
guard(literal(true), true);
```

### Object shapes

The `record` shape allows you to define shapes which required fields

```ts
import { record } from 'shape';

const Shape = record({
  foo: number,
  bar: string,
});

check(Shape, { foo: 100, bar: 'abc' });
```

If the fields in your object are all partial, you can use the `partial` combinator.

```ts
import { partial } from 'shape';

const PartialShape = partial({
  foo: number,
  bar: string,
});

check(Shape, { foo: 100, bar: 'abc' });
check(Shape, { foo: 100 });
check(Shape, { bar: 'abc' });
check(Shape, {});
```

If some of the fields are required and some are optional, you can do the intersection between the
part with required fields and the one with optional fields:

```ts
import { record, partial, intersection } from 'shape';

const Shape = intersection(
  record({
    requiredField1: string,
    requiredField2: number,
  }),
  partial({
    optionalField1: string,
    optionalField2: boolean,
  })
);
```

This case comes up often enough that there is a shorthand function that achives the same purpose:

```ts
import { struct } from 'shape';

const Shape = struct({
  required: {
    requiredField1: string,
    requiredField2: number,
  },
  optional: {
    optionalField1: string,
    optionalField2: boolean,
  },
});
```

### Arrays

```ts
import { array } from 'shape';

check(array(number), [1, 2, 3]);
```

### Tuples

```ts
import { tuple } from 'shape';

const Point3D = tuple(number, number, number);
guard(Point3D, [1, 2, 3]) === true;
guard(Point3D, [1, 2]) === false;
```

### Unions

```ts
import { union, string, number } from 'shape';
check(union(string, number), 'foo');
check(union(string, number), 100);
```

By using a combination of union, record and literal, you can define discriminated unions

```ts
import { union, literal } from 'shape';

const Inquiry = union(
  record({ status: literal('unanswered'), askedAt: Timestamp, reporter: Person }),
  record({ status: literal('answered'), answeredAt: Timestamp, responder: Person })
);

// The shape is equivalent to this type
type Inquiry =
  | { status: 'unanswered'; askedAt: number; reporter: Person }
  | { status: 'answered'; answeredAt: number; responder: Person };
```

### Intersection

```ts
import { intersection } from 'shape';

const Shape1 = record({ foo: string });
const Shape2 = record({ bar: number });

check(intersection(Shape1, Shape2), { foo: 'abc', bar: 123 });
```

### Constraints

You can attach constraints on top of a base type. Say for example, that you would like to have a type
for integer numbers, then you could define the following shape:

```ts
import { constrained, number } from 'shape';

const Integer = constrainted(number, (value) => Number.isInteger(value));
guard(Integer, 100) === true;
guard(Integer, -1) === false;
```

Note that the inferred Typescript type would still be `number` in this case.

There are some constrained numeric types predefined already:

```ts
import { positiveNumber, positiveInteger, nonZeroPositiveInteger } from 'shape/numeric';

check(positiveNumber, 0);
check(positiveNumber, 1.5);

check(positiveInteger, 0);
check(positiveInteger, 1);

check(nonZeroPositiveInteger, 1);
```

### Special types

There are special types to match `null` and `undefined`

```ts
import { nullValue, undefinedValue } from 'shape';

check(nullValue, null);
check(undefinedValue, null);
```

However, you probably want to use the `optional`, `nullable` and `nullish` variants which represent
unions of a shape with `null` or `undefined` or both.

```ts
import { optional, nullable, nullish } from 'shape';

check(optional(string), 'foo');
check(optional(string), undefined);

check(nullable(string), 'foo');
check(nullable(string), null);

check(nullish(string), 'foo');
check(nullish(string), undefined);
check(nullish(string), null);
```

The `unknown` shape will always match everything and will be associated with the `unknown` Typescript type.
If you want to match with anything as long as it's not `null` or `undefined` use `something`.

```ts
import { unknown, something } from 'shape';

check(unknown, 'foo');
check(unknown, 123);
check(unknown, { foo: [1, 2, 3] });
check(unknown, undefined);
check(unknown, null);

check(something, 'foo');
check(something, 123);
check(something, {});
guard(something, null) === false;
guard(something, undefined) === false;
```

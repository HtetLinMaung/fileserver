# Starless Async

Simple asynchronous loops.

## Installation

If this is a brand new project, make sure to create a package.json first with the `npm init` command.

Installation is done using the npm install command:

```
npm install starless-async
```

## Async Each

To loop an array asynchronously

```js
const { asyncEach, timeout } = require("starless-async");

asyncEach(["a", "b", "c", "d"], async (value, index) => {
  await timeout(Math.random() % 10); // do some long tasks
  console.log(`${index}: ${value}`);
});
```

To loop an object asynchronously

```js
const { asyncEach, timeout } = require("starless-async");

asyncEach({ name: "Mg Mg", age: 16 }, async (value, key) => {
  await timeout(Math.random() % 10); // do some long tasks
  console.log(`${key}: ${value}`);
});
```

To map an array asynchronously

```js
const { asyncEach } = require("starless-async");

async function main() {
  const chars = await asyncEach(["a", "b", "c", "d"], async (value, index) => {
    return { [index]: value };
  });
  // chars => [{0: a}, {1: b}, {2: c}, {3: d}]
}

main();
```

## Worker Each

To loop an array with worker threads

```js
const { workerEach } = require("starless-async");

workerEach(
  ["a", "b", "c", "d"],
  async (value, index, args) => {
    const { timeout } = require("starless-async");
    await timeout(Math.random() % 10); // do some long tasks
    console.log(args.message); // pass arguments from here
    console.log(`${index}: ${value}`);
  },
  {
    message: "pass arguments from here",
  }
);
```

To loop an object with worker threads

```js
const { workerEach } = require("starless-async");

workerEach(
  { name: "Mg Mg", age: 16 },
  async (value, key, args) => {
    const { timeout } = require("starless-async");
    await timeout(Math.random() % 10); // do some long tasks
    console.log(args.message); // pass arguments from here
    console.log(`${key}: ${value}`);
  },
  {
    message: "pass arguments from here",
  }
);
```

To map an array with worker threads

```js
const { workerEach } = require("starless-async");

async function main() {
  const chars = await workerEach(
    ["a", "b", "c", "d"],
    async (value, index, args) => {
      console.log(args.message); // pass arguments from here
      return { [index]: value };
    },
    {
      message: "pass arguments from here",
    }
  );
  // chars => [{0: a}, {1: b}, {2: c}, {3: d}]
}

main();
```

const { workerEach, timeout } = require("./index");

const main = async () => {
  const chars = await workerEach(
    { name: "hlm", age: 26 },
    async (value, index, args) => {
      await timeout(Math.random() % 3);
      console.log(`${index}: ${value}`);
      console.log(args);
      return value;
    },
    {
      message: "hello",
    }
  );
  console.log(chars);
};

main();

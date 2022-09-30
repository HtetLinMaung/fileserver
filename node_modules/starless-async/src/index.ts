import { isAsyncFunction } from "util/types";
import { isMainThread, parentPort, Worker, workerData } from "worker_threads";

export interface DynamicObject {
  [key: string]: any;
}

export const timeout = async (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration * 1000));

export const asyncEach = async (
  values: any[] | DynamicObject,
  cb: (value: any, key: number | string) => any
) => {
  const promises: any[] = [];
  if (Array.isArray(values)) {
    let i = 0;
    for (const value of values) {
      promises.push(cb(value, i));
      i++;
    }
  } else {
    for (const [key, value] of Object.entries(values)) {
      promises.push(cb(value, key));
    }
  }

  if (isAsyncFunction(cb)) {
    return await Promise.all(promises);
  }
  return promises;
};

export const workerEach = async (
  values: any[] | DynamicObject,
  cb: (value: any, key: number | string) => any,
  args: any = null
) => {
  const promises: any[] = [];
  if (Array.isArray(values)) {
    let i = 0;
    for (const value of values) {
      promises.push(workerThread(value, i, cb, args));
      i++;
    }
  } else {
    for (const [key, value] of Object.entries(values)) {
      promises.push(workerThread(value, key, cb, args));
    }
  }
  if (isAsyncFunction(cb)) {
    return await Promise.all(promises);
  }
  return promises;
};

async function workerThread(
  value: any,
  indexOrKey: number | string,
  cb: (value: any, key: number | string, args: any) => any,
  args: any = null
) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(__filename, {
      workerData: {
        args,
        value,
        key: indexOrKey,
        cb: cb.toString(),
      },
    });
    worker.on("message", resolve);
    worker.on("error", reject);
  });
}

async function workerJob() {
  const { value, key, cb, args } = workerData;
  let data = null;
  if (isAsyncFunction(eval(cb))) {
    data = await eval(cb)(value, key, args);
  } else {
    data = eval(cb)(value, key, args);
  }
  parentPort.postMessage(data);
}

if (!isMainThread) {
  workerJob();
}

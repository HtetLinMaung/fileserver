"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerEach = exports.asyncEach = exports.timeout = void 0;
const types_1 = require("util/types");
const worker_threads_1 = require("worker_threads");
const timeout = (duration) => __awaiter(void 0, void 0, void 0, function* () { return new Promise((resolve) => setTimeout(resolve, duration * 1000)); });
exports.timeout = timeout;
const asyncEach = (values, cb) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [];
    if (Array.isArray(values)) {
        let i = 0;
        for (const value of values) {
            promises.push(cb(value, i));
            i++;
        }
    }
    else {
        for (const [key, value] of Object.entries(values)) {
            promises.push(cb(value, key));
        }
    }
    if ((0, types_1.isAsyncFunction)(cb)) {
        return yield Promise.all(promises);
    }
    return promises;
});
exports.asyncEach = asyncEach;
const workerEach = (values, cb, args = null) => __awaiter(void 0, void 0, void 0, function* () {
    const promises = [];
    if (Array.isArray(values)) {
        let i = 0;
        for (const value of values) {
            promises.push(workerThread(value, i, cb, args));
            i++;
        }
    }
    else {
        for (const [key, value] of Object.entries(values)) {
            promises.push(workerThread(value, key, cb, args));
        }
    }
    if ((0, types_1.isAsyncFunction)(cb)) {
        return yield Promise.all(promises);
    }
    return promises;
});
exports.workerEach = workerEach;
function workerThread(value, indexOrKey, cb, args = null) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const worker = new worker_threads_1.Worker(__filename, {
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
    });
}
function workerJob() {
    return __awaiter(this, void 0, void 0, function* () {
        const { value, key, cb, args } = worker_threads_1.workerData;
        let data = null;
        if ((0, types_1.isAsyncFunction)(eval(cb))) {
            data = yield eval(cb)(value, key, args);
        }
        else {
            data = eval(cb)(value, key, args);
        }
        worker_threads_1.parentPort.postMessage(data);
    });
}
if (!worker_threads_1.isMainThread) {
    workerJob();
}

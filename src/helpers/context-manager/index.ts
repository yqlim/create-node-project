import { AsyncLocalStorage } from 'node:async_hooks';

export class ContextManager<T extends object> {
  readonly #context: AsyncLocalStorage<T>;
  readonly #store: Readonly<T>;

  constructor(store: T) {
    this.#context = new AsyncLocalStorage<T>();
    this.#store = Object.freeze(structuredClone(store));
  }

  get store(): T {
    const store = this.#context.getStore();

    if (!store) {
      throw new Error('No store is not available in the current context.');
    }

    return store;
  }

  has(key: string | number | symbol): key is keyof T {
    return Object.hasOwn(this.store, key);
  }

  get<K extends keyof T>(key: K): T[K] {
    return this.store[key];
  }

  set<K extends keyof T>(key: K, value: T[K]): this {
    this.store[key] = value;
    return this;
  }

  provide<R, A extends unknown[]>(fn: (...args: A) => R, ...args: A): R {
    return this.#context.run(structuredClone(this.#store), fn, ...args);
  }
}

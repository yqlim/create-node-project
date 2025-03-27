import fs from 'node:fs';
import path from 'node:path';

import { ContextManager } from '../helpers/context-manager/index.js';
// import { CNPError } from '../utils/index.js';
import AnswerContext from './answers.js';

import type { JsonObject, PackageJson, SetRequired } from 'type-fest';
import type { PackageManager } from '../helpers/package-manager/_base.js';

// import type { AnswerStore } from './answers.js';

export type PackageStore = SetRequired<
  PackageJson,
  | 'name'
  // | 'version'
  | 'description'
  // | 'type'
  // | 'license'
>;

export class PackageContext extends ContextManager<PackageStore> {
  static #instance: PackageContext | undefined = undefined;
  static #manager: PackageManager | undefined = undefined;

  // eslint-disable-next-line @typescript-eslint/require-await
  static async #getInstance(): Promise<PackageContext> {
    if (!PackageContext.#instance) {
      const answers = AnswerContext.consume();
      // const inferLicense = (
      //   visibility: AnswerStore['publish'],
      //   licenses: AnswerStore['license'],
      // ): string => {
      //   switch (licenses.length) {
      //     case 0:
      //       return visibility === 'private' ? 'UNLICENSED' : 'MIT';
      //     case 1:
      //       return licenses[0] ?? 'MIT';
      //     default:
      //       /**
      //        * SPDX License Expression Syntax
      //        *
      //        * @see https://spdx.dev/use/specifications/
      //        */
      //       return `(${licenses.join(' OR ')})`;
      //   }
      // };

      const store: PackageStore = {
        name: answers.get('name'),
        // version: answers.get('version'),
        description: answers.get('description'),
        // type: answers.get('type'),
        // license: inferLicense(answers.get('publish'), answers.get('license')),
      };

      // if (answers.get('publish') === 'private') {
      //   store.private = true;
      // }

      PackageContext.#instance = new PackageContext(store);
      // PackageContext.#manager = await PackageContext.#loadPackageManager();
    }
    return PackageContext.#instance;
  }

  // /**
  //  * Dynamically load the package manager module based on the user's choice.
  //  */
  // static async #loadPackageManager(): Promise<PackageManager> {
  //   const manager = AnswerContext.consume().get('manager');
  //   const { default: Manager } = await (() => {
  //     switch (manager) {
  //       case 'npm':
  //         return import('../helpers/package-manager/npm.js');
  //       case 'pnpm':
  //         return import('../helpers/package-manager/pnpm.js');
  //       default:
  //         throw new CNPError(`Unsupported package manager: ${manager}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  //     }
  //   })();

  //   return new Proxy(new Manager(AnswerContext.consume().get('directory')), {
  //     get(target, prop, receiver) {
  //       const value: unknown = Reflect.get(target, prop, receiver);

  //       if (
  //         (prop === 'add' || prop === 'remove') &&
  //         typeof value === 'function'
  //       ) {
  //         return async (...args: unknown[]): Promise<unknown> => {
  //           const ret: unknown = await value.apply(target, args);

  //           PackageContext.consume().load();

  //           return ret;
  //         };
  //       }

  //       return value;
  //     },
  //   });
  // }

  static consume(): PackageContext {
    if (!this.#instance) {
      throw new Error('No instance is available in the current context.');
    }
    return this.#instance;
  }

  static provide<R, A extends unknown[]>(
    fn: (...args: A) => R,
    ...args: A
  ): Promise<R> {
    return this.#getInstance().then(
      (instance) => instance.provide(fn, ...args),
      (error: unknown) => {
        throw error;
      },
    );
  }

  /**
   * An easy way to customise the "scripts" property in the `package.json` file.
   */
  public readonly scripts = new Map<string, string>();

  public get manager(): PackageManager {
    if (!PackageContext.#manager) {
      throw new Error(
        'No package manager is available in the current context.',
      );
    }
    return PackageContext.#manager;
  }

  public get pathname(): string {
    return path.join(AnswerContext.consume().get('directory'), 'package.json');
  }

  /**
   * Update the existing store with the latest values from `package.json`.
   *
   * It is not async to prevent any potential race conditions.
   */
  load(): void {
    const json = fs.readFileSync(this.pathname, 'utf-8');
    Object.assign(this.store, JSON.parse(json) as PackageStore);
  }

  /**
   * Write the store to the `package.json` file.
   *
   * It is not async to prevent any potential race conditions.
   */
  persist(): void {
    fs.writeFileSync(this.pathname, this.toString());
  }

  /**
   * Stringify the store in the specified order, with non-specified keys after
   * all specified keys.
   *
   * All nested objects are stringified with a 2-space indentation with
   * alphabetically ordered properties.
   */
  override toString(): string {
    const order = Object.freeze([
      'name',
      'version',
      'description',
      'private',
      'license',
      'type',
      'main',
      'bin',
      'files',
      'exports',
      'scripts',
      'dependencies',
      'devDependencies',
      'peerDependencies',
      'optionalDependencies',
      'packageManager',
      'author',
      'repository',
      'bugs',
      'homepage',
      'keywords',
    ]);

    type ObjectSorter = (a: [string, unknown], b: [string, unknown]) => number;

    const sortObject = (obj: JsonObject, fn: ObjectSorter): JsonObject =>
      Object.fromEntries(Object.entries(obj).sort(fn));

    const alphabetically: ObjectSorter = ([a], [b]) => a.localeCompare(b);
    const byPredefinedOrder: ObjectSorter = ([a], [b]) =>
      order.indexOf(a) - order.indexOf(b);

    const ordered = sortObject(this.store, byPredefinedOrder);

    for (const key of Object.keys(ordered)) {
      if (
        ordered[key] &&
        typeof ordered[key] === 'object' &&
        !Array.isArray(ordered[key])
      ) {
        ordered[key] = sortObject(ordered[key] as JsonObject, alphabetically);
      }
    }

    return JSON.stringify(ordered, null, 2);
  }
}

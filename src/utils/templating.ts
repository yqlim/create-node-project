import fs from 'node:fs';
import path from 'node:path';

import { getProjectRoot } from './index.js';

import type { Trim } from 'type-fest';

type Template<
  Input extends string,
  Output extends {
    templateStringsArray: readonly string[];
    keys: string[];
  } = { templateStringsArray: []; keys: [] },
> = Input extends `${infer Head extends string}{{${infer Key extends string}}}${infer Tail extends string}`
  ? Template<
      Tail,
      {
        templateStringsArray: [...Output['templateStringsArray'], Head];
        keys: [...Output['keys'], Trim<Key>];
      }
    >
  : {
      templateStringsArray: [...Output['templateStringsArray'], Input];
      keys: Output['keys'];
    };

type Substitution<
  TemplateStringsArray extends string[],
  Keys extends string[],
  Dictionary extends Record<Keys[number], string> = {
    [key in Keys[number]]: string;
  },
  Output extends string = '',
> = TemplateStringsArray extends [
  infer CurrentString extends string,
  ...infer RestString extends string[],
]
  ? Keys extends [
      infer CurrentKey extends string,
      ...infer RestKey extends string[],
    ]
    ? Substitution<
        RestString,
        RestKey,
        Dictionary,
        `${Output}${CurrentString}${Dictionary[CurrentKey]}`
      >
    : `${Output}${CurrentString}`
  : Output;

const TEMPLATE_LIST_MEMO: string[] = [];
const TEMPLATE_DIR = path.resolve(
  getProjectRoot(import.meta.dirname),
  'templates',
);

export function createTemplate<const T extends string>(
  template: T,
): <const U extends { [key in Template<T>['keys'][number]]: string }>(
  dictionary: U,
) => Substitution<Template<T>['templateStringsArray'], Template<T>['keys'], U> {
  return (dictionary) => {
    const isDictionaryKey = (key: unknown): key is keyof typeof dictionary =>
      !!key && typeof key === 'string' && Object.hasOwn(dictionary, key);

    const bracketed = /~~\s*(?<term>[^}\s]+)\s*~~/g;
    const withInputValues: Extract<
      Parameters<typeof String.prototype.replace>[1],
      CallableFunction
    > = (match, ...rest: (string | number | Record<string, string>)[]) => {
      const groups = rest[rest.length - 1];

      if (groups && typeof groups === 'object') {
        const { term } = groups;
        if (isDictionaryKey(term)) {
          return dictionary[term];
        }
      }

      return match;
    };

    return template.replace(bracketed, withInputValues) as Substitution<
      Template<T>['templateStringsArray'],
      Template<T>['keys'],
      typeof dictionary
    >;
  };
}

export function loadTemplateStructure(template: string): fs.Dirent[] {
  const rootDir = getProjectRoot(import.meta.dirname);
  const templateDir = path.resolve(rootDir, 'templates', template);
  return fs.readdirSync(templateDir, { withFileTypes: true });
}

export function getTemplateList(): readonly string[] {
  if (Object.isExtensible(TEMPLATE_LIST_MEMO)) {
    const templates = fs
      .readdirSync(TEMPLATE_DIR, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    TEMPLATE_LIST_MEMO.push(...templates);
    Object.freeze(TEMPLATE_LIST_MEMO);
  }
  return TEMPLATE_LIST_MEMO;
}

export function getTemplatePath(template: string): string {
  if (!isValidTemplate(template)) {
    throw new Error('The provided template is not found.');
  }
  return path.join(TEMPLATE_DIR, template);
}

export function isValidTemplate(name: string): boolean {
  return getTemplateList().includes(name);
}

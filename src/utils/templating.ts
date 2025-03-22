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

export function createTemplate<const T extends string>(
  template: T,
): <const U extends { [key in Template<T>['keys'][number]]: string }>(
  dictionary: U,
) => Substitution<Template<T>['templateStringsArray'], Template<T>['keys'], U> {
  return (dictionary) => {
    const isDictionaryKey = (key: unknown): key is keyof typeof dictionary =>
      !!key && typeof key === 'string' && Object.hasOwn(dictionary, key);

    return template.replace(
      /{{\s*(?<term>[^}\s]+)\s*}}/g,
      (match, ...rest: (string | number | Record<string, string>)[]) => {
        const groups = rest[rest.length - 1];

        if (groups && typeof groups === 'object') {
          const { term } = groups;
          if (isDictionaryKey(term)) {
            return dictionary[term];
          }
        }

        return match;
      },
    ) as Substitution<
      Template<T>['templateStringsArray'],
      Template<T>['keys'],
      typeof dictionary
    >;
  };
}

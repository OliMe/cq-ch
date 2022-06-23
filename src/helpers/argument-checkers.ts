import { Message } from '../types';

export const checkChannelCreator = (name: string, ...args: unknown[]) => {
  if (args.length !== 2) {
    throw new TypeError(
      `Failed to execute '${name}': 2 arguments required, but ${args.length} present.`,
    );
  }
  const [types, context] = args;
  if (!(Array.isArray(types) && types.length)) {
    throw new TypeError(
      `Failed to execute '${name}': first argument must be an Array with at least one element.`,
    );
  }
  if (!(typeof context === 'string')) {
    throw new TypeError(`Failed to execute '${name}': second argument must be a string.`);
  }
};

const isMessage = (value: any): value is Message<unknown> =>
  typeof value === 'object' && value?.type && typeof value?.type === 'string';

export const checkCommandChannel = (name: string, ...args: unknown[]) => {
  if (args.length !== 1) {
    throw new TypeError(
      `Failed to execute '${name}': 1 arguments required, but ${args.length} present.`,
    );
  }
  const [command] = args;
  if (!isMessage(command)) {
    throw new TypeError(
      `Failed to execute '${name}': first argument must be an Object with defined property type.`,
    );
  }
};

export const checkRequestChannel = (name: string, ...args: unknown[]) => {
  if (args.length !== 2) {
    throw new TypeError(
      `Failed to execute '${name}': 2 arguments required, but ${args.length} present.`,
    );
  }
  const [query, timeout] = args;
  if (!isMessage(query)) {
    throw new TypeError(
      `Failed to execute '${name}': first argument must be an Object with defined property type.`,
    );
  }
  if (!(typeof timeout === 'number' && timeout > 0)) {
    throw new TypeError(`Failed to execute '${name}': second argument must be a positive number`);
  }
};

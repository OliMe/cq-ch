import { Message } from '../types';

/**
 * Check arguments of channel creator for raw JS usage.
 * @param name Name of called function.
 * @param args Arguments of called function.
 */
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

/**
 * Checks if a value is a message.
 * @param value Value.
 * @return true or false - message or not.
 */
const isMessage = (value: any): value is Message<unknown> =>
  typeof value === 'object' && value?.type && typeof value?.type === 'string';

/**
 * Check arguments of command channel.
 * @param name Name of called function.
 * @param args Arguments of called function.
 */
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
/**
 * Check arguments of request channel.
 * @param name
 * @param args
 */
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

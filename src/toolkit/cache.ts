import { Context, Types } from '../types';
import {
  CommandChannel,
  ExecuteChannel,
  RequestChannel,
  RespondChannel,
  TakeChannel,
} from './types';

export type Initiator = 'command' | 'request' | 'execute' | 'respond' | 'take';

export type CacheValue<
  TInitiator extends Initiator,
  TPayload = any,
  TResponse = any,
> = TInitiator extends 'command'
  ? CommandChannel<TPayload, TResponse>
  : TInitiator extends 'request'
  ? RequestChannel<TPayload, TResponse>
  : TInitiator extends 'execute'
  ? ExecuteChannel<TPayload, TResponse>
  : TInitiator extends 'respond'
  ? RespondChannel<TPayload, TResponse>
  : TInitiator extends 'take'
  ? TakeChannel<TPayload, TResponse>
  : never;

export type Creator<TInitiator extends Initiator> = (
  types: Types,
  context: Context,
) => CacheValue<TInitiator>;

/**
 * In memory cache for message channels.
 */
export class Cache {
  private store: {
    [initiator in Initiator]: { [key: string]: CacheValue<initiator> };
  } = {
    command: {},
    request: {},
    execute: {},
    respond: {},
    take: {},
  };

  /**
   * Creates key.
   * @param types Types of messages.
   * @param context Context.
   * @private
   */
  private createKey(types: Types, context: Context) {
    return [...types.sort(), context].join('_');
  }

  /**
   * Gets value from storage.
   * @param types Types of messages.
   * @param context Context.
   * @param initiator Type of function.
   * @return Value.
   */
  get<TInitiator extends Initiator, TPayload, TResponse = undefined>(
    types: Types,
    context: Context,
    initiator: TInitiator,
  ): CacheValue<TInitiator, TPayload, TResponse> {
    return this.store[initiator][this.createKey(types, context)] as CacheValue<
      TInitiator,
      TPayload,
      TResponse
    >;
  }

  /**
   * Sets value to storage.
   * @param types Types of messages.
   * @param context Context.
   * @param initiator Type of function.
   * @param value Value.
   */
  set<TInitiator extends Initiator>(
    types: Types,
    context: Context,
    initiator: Initiator,
    value: CacheValue<TInitiator>,
  ) {
    this.store[initiator][this.createKey(types, context)] = value;
  }
}

const instance = new Cache();

/**
 * Creates channel creator with channel instance cache.
 * @param create Base creator.
 * @param name Creator name.
 * @return Channel instance.
 */
export const useCache =
  <TInitiator extends Initiator>(create: Creator<TInitiator>, name: TInitiator) =>
  <TPayload, TResponse>(types: Types, context: Context) => {
    let result = instance.get<TInitiator, TPayload, TResponse>(types, context, name);
    if (!result) {
      result = create(types, context);
      instance.set(types, context, name, result);
    }
    return result;
  };

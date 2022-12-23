import getTransport from '../event-transport/get-transport';
import EventTargetTransport from '../event-transport/event-target-transport';
import Channel from '../channel/channel';
import isTypesInTypes from './is-types-in-types';
import { Take, OutputMessage, Type, Types } from '../types';

type MessageGenerator<TOutput> = Generator<Promise<TOutput>, void, boolean>;

type MessageChannel<TOutput extends OutputMessage> = (
  type: Type | Types,
  transport: EventTargetTransport<OutputMessage>,
  notificator: EventTargetTransport,
) => MessageGenerator<TOutput>;

/**
 * Creates emitter for start channel.
 * @param iterator Event channel.
 * @return Async function for channel initializing.
 */
function channelEmitterCreator<TOutput extends OutputMessage>(iterator: MessageGenerator<TOutput>) {
  /**
   * Function for receiving events from channel.
   * @return Function for take event from channel or event.
   */
  const emitter: Take<unknown, TOutput> = async function () {
    return iterator.next().value;
  };

  return emitter;
}

/**
 * Creates partially applied function for handling event in channel.
 * @param channel Channel with filtered events.
 * @param context Identifier of place where event was emitted.
 * @return Handler function.
 */
export const createChannelEventHandler =
  <TOutput extends OutputMessage>(channel: Channel<TOutput>, context: string) =>
  ({ detail: action }: CustomEvent<TOutput>) => {
    if (action.context && action.context !== context) {
      channel.put(action);
    }
  };

/**
 * Cast event type to Array.
 * @param inputType Input type of event.
 * @param types List of filtered event types.
 * @return Type in Array format.
 */
export const castType = (inputType: Type | Types, types: Types) => {
  let resultType = Array.isArray(inputType) ? inputType : [inputType];
  if (inputType === '*') {
    resultType = types;
  }
  return resultType;
};

/**
 * Creates partially applied generator function for picking events from main stream through channel.
 * @param types List of filtered event types.
 * @param context Identifier of place where event was emitted.
 * @return Generator function for picking filtered events.
 */
export function channelCreator<TOutput extends OutputMessage>(
  types: Types,
  context: string,
): MessageChannel<TOutput> {
  return function* (
    type: Type | Types,
    transport: EventTargetTransport<TOutput>,
    notificator: EventTargetTransport,
  ): MessageGenerator<TOutput> {
    const queue = new Channel<TOutput>(notificator);
    const handledType = castType(type, types);
    if (isTypesInTypes(handledType, types)) {
      const channelEventHandler = createChannelEventHandler(queue, context);
      // todo remove 'as' when issue with CustomEvent and addEventListener will be resolved in TypeScript,
      // see https://github.com/microsoft/TypeScript/issues/28357
      transport.on(handledType, channelEventHandler as EventListener);
    }
    while (true) {
      yield queue.take();
    }
  };
}

/**
 * Creates picking function for receiving events from channel.
 * @param key Event types.
 * @param channel Events generator for picking events from queue.
 * @return Function for picking events from channel.
 */
export function takeChannelCreator<TOutput extends OutputMessage>(
  key: string,
  channel: MessageChannel<TOutput>,
) {
  return (type = '*') => {
    const notificator = new EventTargetTransport();
    const iterator = channel(type, getTransport(key), notificator);
    return channelEmitterCreator<TOutput>(iterator);
  };
}

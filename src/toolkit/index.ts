import { Message, OutputQuery } from '../types';
import { command, request, take } from '../';
import {
  ChannelSegregation,
  MessageCreatorWithoutPayload,
  MessageCreatorWithPayload,
  PrepareMessageWithoutPayload,
  PrepareMessageWithPayload,
  ExtendedMessage,
  MessageCreator,
  Channel,
} from './types';
import { useCache } from './cache';

const CHANNEL_SEGREGATION = {
  QUERY: 'query',
  COMMAND: 'command',
} as const;

const cachedTake = useCache(take, 'take');
const cachedRequest = useCache(request, 'request');
const cachedCommand = useCache(command, 'command');

/**
 * Creates a channel object for sending and processing messages.
 * @param serviceName The name of the service to which the channel will be assigned.
 * @return The channel instance for sending and receiving messages.
 */
export const createChannel = (serviceName: string): Channel => ({
  /**
   * Gets the next message in the queue of the passed types.
   * @param creators Type functions.
   * @return The next input message.
   */
  async take(
    ...creators: (MessageCreatorWithPayload<any, any> | MessageCreatorWithoutPayload<any>)[]
  ) {
    const types = creators.map(creator => creator.type);
    return cachedTake(types, serviceName)();
  },
  /**
   * Sends message.
   * @param message Message.
   * @param timeout Wait for response timeout of requests.
   * @return Response on request message or nothing.
   */
  async send<TPayload, TResponse>(
    message: ExtendedMessage<TPayload, TResponse | void>,
    timeout?: number,
  ) {
    if (message.channelType === CHANNEL_SEGREGATION.QUERY) {
      return cachedRequest<TPayload, TResponse>([message.type], serviceName)(message, timeout);
    }
    return cachedCommand<TPayload, void>([message.type], serviceName)(message);
  },
  /**
   * Responds on request message.
   * @param query Query message.
   * @param result Response data.
   */
  respond<TResponse>(query: OutputQuery<TResponse>, result: TResponse) {
    query.resolve(result);
  },
});

/**
 * Creates creator function for query message.
 * @param type Message type.
 * @param prepareMessage Function for transform message and add additional data before sending.
 * @return Query message creator.
 */
export function createQuery<TResponse>(
  type: string,
  prepareMessage?: PrepareMessageWithoutPayload,
): MessageCreatorWithoutPayload<TResponse>;
export function createQuery<TPayload, TResponse>(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<TPayload>,
): MessageCreatorWithPayload<TPayload, TResponse>;
export function createQuery(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<unknown> | PrepareMessageWithoutPayload,
) {
  return createMessage(type, CHANNEL_SEGREGATION.QUERY, prepareMessage);
}

/**
 * Creates creator function for command message.
 * @param type Message type.
 * @param prepareMessage Function for transform message and add additional data before sending.
 * @return Command message creator.
 */
export function createCommand(
  type: string,
  prepareMessage?: PrepareMessageWithoutPayload,
): MessageCreatorWithoutPayload<void>;
export function createCommand<TPayload>(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<TPayload>,
): MessageCreatorWithPayload<TPayload, void>;
export function createCommand(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<unknown> | PrepareMessageWithoutPayload,
): MessageCreator<unknown, void> {
  return createMessage(type, CHANNEL_SEGREGATION.COMMAND, prepareMessage);
}

/**
 * Creates creators for command and query messages depending on type.
 * @param messageType Message type.
 * @param channelType Type of channel (command or query).
 * @param prepareMessage Function for transform message and add additional data before sending.
 * @return Creator function.
 */
function createMessage<TResponse>(
  messageType: string,
  channelType: ChannelSegregation,
  prepareMessage?: PrepareMessageWithoutPayload,
): MessageCreatorWithoutPayload<TResponse>;
function createMessage<TPayload, TResponse>(
  messageType: string,
  channelType: ChannelSegregation,
  prepareMessage?: PrepareMessageWithPayload<TPayload>,
): MessageCreatorWithPayload<TPayload, TResponse>;
function createMessage(
  messageType: string,
  channelType: ChannelSegregation,
  prepareMessage?: PrepareMessageWithPayload<unknown> | PrepareMessageWithoutPayload,
): MessageCreator<unknown, unknown> {
  const creator = function (payload?: unknown, ...other: unknown[]) {
    let initialData = {};
    if (prepareMessage) {
      initialData = prepareMessage(payload, ...other);
    }
    return {
      ...initialData,
      type: messageType,
      payload,
      channelType,
    };
  };
  creator.type = messageType;
  creator.channelType = channelType;
  creator.toString = () => messageType;
  creator.match = (message: Message): message is ExtendedMessage<unknown, unknown> =>
    message.type === messageType;

  return creator;
}

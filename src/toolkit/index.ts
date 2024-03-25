import { Message } from '../types';
import { command, request, take } from '../';
import {
  ChannelSegregation,
  MessageCreatorWithoutPayload,
  MessageCreatorWithPayload,
  PrepareMessageWithoutPayload,
  PrepareMessageWithPayload,
  ExtendedMessage,
  PrepareMessage,
  MessageCreator,
  CreatorReturnType,
  ExtendedMessageWithoutPayload,
  ExtendedMessageWithPayload,
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
export const createChannel = (serviceName: string) => new Channel(serviceName);

/**
 * Channel for sending and receiving messages.
 */
export class Channel {
  protected context: string;
  constructor(context: string) {
    this.context = context;
  }

  /**
   * Gets the next message in the queue of the passed types.
   * @param creators Type functions.
   * @return The next input message.
   */
  async take(
    ...creators: (
      | MessageCreatorWithPayload<any, any, any>
      | MessageCreatorWithoutPayload<any, any>
    )[]
  ) {
    const types = creators.map(creator => creator.type);
    return cachedTake(types, this.context)();
  }

  /**
   * Sends message.
   * @param message Message.
   * @param timeout Wait for response timeout of requests.
   * @return Response on request message or nothing.
   */
  async send<TPayload, TResponse>(message: ExtendedMessage<TPayload, TResponse>, timeout?: number) {
    if (message.channelType === CHANNEL_SEGREGATION.QUERY) {
      return cachedRequest<TPayload, TResponse>([message.type], this.context)(message, timeout);
    }
    return cachedCommand<TPayload, TResponse>([message.type], this.context)(message);
  }

  /**
   * Responds on request message.
   * @param query Query message.
   * @param result Response data.
   */
  respond<TResponse>(query: Message<TResponse>, result: TResponse) {
    query.resolve?.(result);
  }
}

/**
 * Creates creator function for query message.
 * @param type Message type.
 * @return Query message creator.
 */
export function createQuery<TResponse>(type: string): MessageCreatorWithoutPayload<TResponse>;
export function createQuery<TPayload, TResponse>(
  type: string,
): MessageCreatorWithPayload<TPayload, TResponse>;
/**
 * Creates creator function for query message.
 * @param type Message type.
 * @param prepareMessage Function for transform message and add additional data before sending.
 * @return Query message creator.
 */
export function createQuery<
  TResponse,
  TAdditionalProps extends { [key: string]: any },
  TPrepare = PrepareMessageWithoutPayload<TAdditionalProps>,
>(
  type: string,
  prepareMessage: TPrepare,
): MessageCreatorWithoutPayload<TResponse, TAdditionalProps>;
export function createQuery<
  TPayload,
  TResponse,
  TAdditionalProps extends { [key: string]: any },
  TPrepare = PrepareMessageWithPayload<TPayload, TAdditionalProps>,
>(
  type: string,
  prepareMessage: TPrepare,
): MessageCreatorWithPayload<TPayload, TResponse, TAdditionalProps>;
export function createQuery(
  type: string,
  prepareMessage?:
    | PrepareMessageWithPayload<unknown, { [key: string]: any }>
    | PrepareMessageWithoutPayload<{ [key: string]: any }>,
) {
  return createMessage<unknown, unknown, { [key: string]: any } | undefined, typeof prepareMessage>(
    type,
    CHANNEL_SEGREGATION.QUERY,
    prepareMessage,
  );
}

/**
 * Creates creator function for command message.
 * @param type Message type.
 * @return Command message creator.
 */
export function createCommand(type: string): MessageCreatorWithoutPayload<void>;
export function createCommand<TPayload>(type: string): MessageCreatorWithPayload<TPayload, void>;

/**
 * Creates creator function for command message.
 * @param type Message type.
 * @param prepareMessage Function for transform message and add additional data before sending.
 * @return Command message creator.
 */
export function createCommand<
  TAdditionalProps extends { [key: string]: any },
  TPrepare = PrepareMessageWithoutPayload<TAdditionalProps>,
>(type: string, prepareMessage: TPrepare): MessageCreatorWithoutPayload<void, TAdditionalProps>;
export function createCommand<
  TPayload,
  TAdditionalProps extends { [key: string]: any },
  TPrepare = PrepareMessageWithPayload<TPayload, TAdditionalProps>,
>(
  type: string,
  prepareMessage: TPrepare,
): MessageCreatorWithPayload<TPayload, void, TAdditionalProps>;
export function createCommand(
  type: string,
  prepareMessage?:
    | PrepareMessageWithPayload<unknown, { [key: string]: any }>
    | PrepareMessageWithoutPayload<{ [key: string]: any }>,
) {
  return createMessage<unknown, void, { [key: string]: any } | undefined, typeof prepareMessage>(
    type,
    CHANNEL_SEGREGATION.COMMAND,
    prepareMessage,
  );
}

/**
 * Creates creators for command and query messages depending on type.
 * @param messageType Message type.
 * @param channelType Type of channel (command or query).
 * @param prepareMessage Function for transform message and add additional data before sending.
 * @return Creator function.
 */
function createMessage<
  TPayload,
  TResponse,
  TAdditionalProps extends { [key: string]: any } | undefined,
  TPrepare extends PrepareMessage<TAdditionalProps> | undefined = undefined,
>(
  messageType: string,
  channelType: ChannelSegregation,
  prepareMessage?: TPrepare,
): MessageCreator<TPayload, TResponse, TAdditionalProps> {
  const creator = function (payload?: TPayload, ...other: unknown[]) {
    return {
      ...prepareMessage?.(payload, ...other),
      type: messageType,
      payload,
      channelType,
    } as CreatorReturnType<
      TAdditionalProps,
      TPayload extends undefined
        ? ExtendedMessageWithoutPayload<TResponse>
        : ExtendedMessageWithPayload<TPayload, TResponse>
    >;
  };
  creator.type = messageType;
  creator.channelType = channelType;
  creator.toString = () => messageType;
  creator.match = (
    message: Message,
  ): message is CreatorReturnType<TAdditionalProps, ExtendedMessage<TPayload, TResponse>> =>
    message.type === messageType;

  return creator;
}

import { OutputQuery } from '../types';
import { command, execute, request, respond } from '../';
import {
  ChannelSegregation,
  MessageCreatorWithoutPayload,
  MessageCreatorWithPayload,
  PrepareMessageWithoutPayload,
  PrepareMessageWithPayload,
  InputCommand,
  InputQuery,
  SegregatedMessage,
  OutputPayloadQuery,
  OutputPayloadMessage,
} from './types';
import { useCache } from './cache';

const CHANNEL_SEGREGATION = {
  QUERY: 'query',
  COMMAND: 'command',
} as const;

const cachedRespond = useCache(respond, 'respond');
const cachedRequest = useCache(request, 'request');
const cachedExecute = useCache(execute, 'execute');
const cachedCommand = useCache(command, 'command');

/**
 * Creates a channel object for sending and processing messages.
 * @param serviceName The name of the service to which the channel will be assigned.
 * @return The channel instance for sending and receiving messages.
 */
export const createChannel = (serviceName: string) => new Channel(serviceName);

/**
 * A channel for sending and processing messages.
 */
export class Channel {
  private readonly serviceName: string;

  /**
   * Channel instance constructor.
   * @param serviceName Service name.
   */
  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Gets the next message in the queue of the passed type.
   * @param creator Type function.
   * @return The next input message.
   */
  async take<TPayload, TResponse>(
    creator: MessageCreatorWithPayload<'query', TPayload, TResponse>,
  ): Promise<OutputPayloadQuery<TPayload, TResponse>>;
  async take<TPayload>(
    creator: MessageCreatorWithPayload<'command', TPayload, undefined>,
  ): Promise<OutputPayloadMessage<TPayload>>;
  async take<TChannel extends ChannelSegregation, TPayload, TResponse>({
    channelType,
    type,
  }: MessageCreatorWithPayload<TChannel, TPayload, TResponse>) {
    if (channelType === CHANNEL_SEGREGATION.QUERY) {
      return cachedRespond<TPayload, TResponse>([type], this.serviceName)();
    }
    return cachedExecute<TPayload>([type], this.serviceName)();
  }

  /**
   * Sends message.
   * @param message Message.
   * @return Response on request message or nothing.
   */
  async send<TPayload, TResponse>(
    message: InputCommand<TPayload> | InputQuery<TPayload, TResponse>,
  ) {
    if (message.channelType === CHANNEL_SEGREGATION.QUERY) {
      return cachedRequest<TPayload, TResponse>([message.type], this.serviceName)(message);
    }
    return cachedCommand<TPayload, TResponse>([message.type], this.serviceName)(message);
  }

  /**
   * Responds on request message.
   * @param query Query message.
   * @param result Response data.
   */
  respond<TResponse>(query: OutputQuery<TResponse>, result: TResponse) {
    query.resolve(result);
  }
}

/**
 * Creates creator function for query message.
 * @param type Message type.
 * @param prepareMessage Function for transform message and add additional data before sending.
 * @return Query message creator.
 */
export function createQuery<TResponse>(
  type: string,
  prepareMessage?: PrepareMessageWithoutPayload,
): MessageCreatorWithoutPayload<'query', TResponse>;
export function createQuery<TPayload, TResponse>(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<TPayload>,
): MessageCreatorWithPayload<'query', TPayload, TResponse>;
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
): MessageCreatorWithoutPayload<'command', undefined>;
export function createCommand<TPayload>(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<TPayload>,
): MessageCreatorWithPayload<'command', TPayload, undefined>;
export function createCommand(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<unknown> | PrepareMessageWithoutPayload,
):
  | MessageCreatorWithPayload<'command', unknown, undefined>
  | MessageCreatorWithoutPayload<'command', undefined> {
  return createMessage(type, CHANNEL_SEGREGATION.COMMAND, prepareMessage);
}

/**
 * Creates creators for command and query messages depending on type.
 * @param messageType Message type.
 * @param channelType Type of channel (command or query).
 * @param prepareMessage Function for transform message and add additional data before sending.
 * @return Creator function.
 */
function createMessage<TChannel extends ChannelSegregation, TPayload, TResponse>(
  messageType: string,
  channelType: TChannel,
  prepareMessage?: PrepareMessageWithPayload<TPayload> | PrepareMessageWithoutPayload,
):
  | MessageCreatorWithPayload<TChannel, TPayload, TResponse>
  | MessageCreatorWithoutPayload<TChannel, TResponse> {
  const creator = function (payload?: TPayload, ...other: unknown[]) {
    let initialData = {};
    if (prepareMessage) {
      initialData = prepareMessage(payload, ...other);
    }
    return {
      ...initialData,
      type: messageType,
      payload,
      channelType,
    } as SegregatedMessage<TChannel, TPayload, TResponse>;
  };
  creator.type = messageType;
  creator.channelType = channelType;
  creator.toString = () => messageType;

  return creator;
}

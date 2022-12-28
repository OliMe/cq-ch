import { Take, Message } from '../types';

/**
 * The type of the channel function with which the message should be sent/received.
 */
export type ChannelSegregation = 'query' | 'command';

/**
 * Interface of channel object for sending and processing messages.
 */
export interface Channel {
  /**
   * Gets the next message in the queue of the passed types.
   * @param creators Type functions.
   * @return The next input message.
   */
  take(
    ...creators: (MessageCreatorWithPayload<any, any> | MessageCreatorWithoutPayload<any>)[]
  ): ReturnType<TakeChannel<any, any>>;
  /**
   * Sends message.
   * @param message Message.
   * @param timeout Wait for response timeout of requests.
   * @return Response on request message or nothing.
   */
  send<TPayload, TResponse>(
    message: ExtendedMessage<TPayload, TResponse>,
    timeout?: number,
  ): Promise<TResponse | void>;
  /**
   * Responds on request message.
   * @param query Query message.
   * @param result Response data.
   */
  respond<TResponse>(query: Message<TResponse>, result: TResponse): void;
}

/**
 * Extended message interface with additional data about the type of channel through which it can be sent.
 */
export interface ExtendedMessage<TPayload, TResponse> extends Message<TResponse> {
  payload?: TPayload;
  channelType?: ChannelSegregation;
}

/**
 * Extended message interface with payload.
 */
export interface ExtendedMessageWithPayload<TPayload, TResponse>
  extends ExtendedMessage<TPayload, TResponse> {
  payload: TPayload;
}

/**
 * Extended message interface without payload.
 */
export interface ExtendedMessageWithoutPayload<TResponse>
  extends ExtendedMessage<undefined, TResponse> {
  payload: undefined;
}

/**
 * Function interface for creating a message.
 */
export interface MessageCreator<TPayload, TResponse> {
  (payload: TPayload): ExtendedMessage<TPayload, TResponse>;
  type: string;
  channelType: ChannelSegregation;
  toString: () => string;
  match: (message: Message) => message is ExtendedMessage<TPayload, TResponse>;
}

/**
 * Function interface for creating a message with the ability to pass payload when creating.
 */
export interface MessageCreatorWithPayload<TPayload, TResponse>
  extends MessageCreator<TPayload, TResponse> {
  (payload: TPayload): ExtendedMessageWithPayload<TPayload, TResponse>;
  match: (message: Message) => message is ExtendedMessageWithPayload<TPayload, TResponse>;
}

/**
 * Function interface for creating a message without the ability to pass payload when creating.
 */
export interface MessageCreatorWithoutPayload<TResponse>
  extends MessageCreator<undefined, TResponse> {
  (): ExtendedMessageWithoutPayload<TResponse>;
  match: (message: Message) => message is ExtendedMessageWithoutPayload<TResponse>;
}

/**
 * Function interface for adding payload beyond the main message interface.
 * Accepts payload with a defined type.
 */
export type PrepareMessageWithPayload<TPayload> = (
  payload?: TPayload,
  ...other: unknown[]
) => { [key: string]: unknown };

/**
 * Function interface for adding additional data beyond the main message interface.
 * Does not accept payload,
 * but accepts any arguments passed to the creator function.
 */
export type PrepareMessageWithoutPayload = (...args: unknown[]) => { [key: string]: unknown };

/**
 * Request channel.
 */
export type RequestChannel<TPayload, TResponse> = (
  query: ExtendedMessage<TPayload, TResponse>,
  time?: number,
) => Promise<TResponse>;

/**
 * Command channel.
 */
export type CommandChannel<TPayload> = (command: ExtendedMessage<TPayload, void>) => Promise<void>;

/**
 * Respond channel.
 */
export type RespondChannel<TPayload, TResponse> = Take<
  TResponse,
  ExtendedMessage<TPayload, TResponse>
>;

/**
 * Execute channel.
 */
export type ExecuteChannel<TPayload> = Take<void, ExtendedMessage<TPayload, void>>;

/**
 * Take channel.
 */
export type TakeChannel<TPayload, TResponse> = Take<
  TResponse,
  ExtendedMessage<TPayload, TResponse>
>;

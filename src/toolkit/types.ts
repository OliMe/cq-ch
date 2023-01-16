import { Take, Message } from '../types';

/**
 * The type of the channel function with which the message should be sent/received.
 */
export type ChannelSegregation = 'query' | 'command';

/**
 * Type for define message interface by base message interface and additional properties interface.
 */
export type CreatorReturnType<
  TPrepared extends { [key: string]: any } | undefined,
  TMessage extends Message,
> = TPrepared extends undefined ? TMessage : TMessage & TPrepared;

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
export interface MessageCreator<
  TPayload,
  TResponse,
  TAdditionalProps extends { [key: string]: any } | undefined,
> {
  (payload: TPayload): CreatorReturnType<TAdditionalProps, ExtendedMessage<TPayload, TResponse>>;
  type: string;
  channelType: ChannelSegregation;
  toString: () => string;
  match: (
    message: Message,
  ) => message is CreatorReturnType<TAdditionalProps, ExtendedMessage<TPayload, TResponse>>;
}

/**
 * Function interface for creating a message with the ability to pass payload when creating.
 */
export interface MessageCreatorWithPayload<
  TPayload,
  TResponse,
  TAdditionalProps extends { [key: string]: any } | undefined = undefined,
> extends MessageCreator<TPayload, TResponse, TAdditionalProps> {
  (payload: TPayload): CreatorReturnType<
    TAdditionalProps,
    ExtendedMessageWithPayload<TPayload, TResponse>
  >;
  match: (
    message: Message,
  ) => message is CreatorReturnType<
    TAdditionalProps,
    ExtendedMessageWithPayload<TPayload, TResponse>
  >;
}

/**
 * Function interface for creating a message without the ability to pass payload when creating.
 */
export interface MessageCreatorWithoutPayload<
  TResponse,
  TAdditionalProps extends { [key: string]: any } | undefined = undefined,
> extends MessageCreator<undefined, TResponse, TAdditionalProps> {
  (): CreatorReturnType<TAdditionalProps, ExtendedMessageWithoutPayload<TResponse>>;
  match: (
    message: Message,
  ) => message is CreatorReturnType<TAdditionalProps, ExtendedMessageWithoutPayload<TResponse>>;
}

/**
 * Common function interface for adding properties beyond the main message interface.
 * Accepts payload with a defined type.
 */
export interface PrepareMessage<TResult> {
  (...other: any[]): TResult;
}

/**
 * Function interface for adding properties beyond the main message interface.
 * Accepts payload with a defined type.
 */
export interface PrepareMessageWithPayload<TPayload, TResult> extends PrepareMessage<TResult> {
  (payload: TPayload, ...other: any[]): TResult;
}

/**
 * Function interface for adding additional properties beyond the main message interface.
 * Does not accept payload,
 * but accepts any arguments passed to the creator function.
 */
export interface PrepareMessageWithoutPayload<TResult> extends PrepareMessage<TResult> {
  (...args: any[]): TResult;
}

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
export type CommandChannel<TPayload, TResponse> = (
  command: ExtendedMessage<TPayload, TResponse>,
) => Promise<TResponse>;

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
export type ExecuteChannel<TPayload, TResponse> = Take<
  TResponse,
  ExtendedMessage<TPayload, TResponse>
>;

/**
 * Take channel.
 */
export type TakeChannel<TPayload, TResponse> = Take<
  TResponse,
  ExtendedMessage<TPayload, TResponse>
>;

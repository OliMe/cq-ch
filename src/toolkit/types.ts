import { Emitter, Message, OutputMessage, OutputQuery } from '../types';

/**
 * The type of the channel function with which the message should be sent/received.
 */
export type ChannelSegregation = 'query' | 'command';

/**
 * Output message with payload.
 */
export interface OutputPayloadMessage<TPayload> extends OutputMessage<undefined> {
  payload?: TPayload;
}

/**
 * A request message with a specific expected response type.
 */
export interface OutputPayloadQuery<TPayload, TResponse> extends OutputQuery<TResponse> {
  payload?: TPayload;
}

/**
 * Extended input message interface with additional data about the type of channel through which it can be sent.
 */
export interface ExtendedInputMessage<TPayload, TResponse> extends Message<TResponse> {
  payload?: TPayload;
  channelType: ChannelSegregation;
}

/**
 * Extended input command message interface.
 */
export interface InputCommand<TPayload> extends ExtendedInputMessage<TPayload, undefined> {
  channelType: 'command';
}

/**
 * Extended input request message interface.
 */
export interface InputQuery<TPayload, TResponse> extends ExtendedInputMessage<TPayload, TResponse> {
  channelType: 'query';
}

/**
 * A message with a restriction on the type of send channel.
 */
export type SegregatedMessage<
  TChannel extends ChannelSegregation,
  TPayload,
  TResponse,
> = TChannel extends 'query' ? InputQuery<TPayload, TResponse> : InputCommand<TPayload>;

/**
 * Function interface for creating a message with the ability to pass payload when creating.
 */
export interface MessageCreatorWithPayload<
  TChannel extends ChannelSegregation,
  TPayload,
  TResponse,
> {
  (payload: TPayload): SegregatedMessage<TChannel, TPayload, TResponse>;
  type: string;
  channelType: TChannel;
  toString: () => string;
}

/**
 * Function interface for creating a message without the ability to pass payload when creating.
 */
export interface MessageCreatorWithoutPayload<TChannel extends ChannelSegregation, TResponse>
  extends MessageCreatorWithPayload<TChannel, undefined, TResponse> {
  (): SegregatedMessage<TChannel, undefined, TResponse>;
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
  query: InputQuery<TPayload, TResponse>,
  time?: number,
) => Promise<TResponse>;

/**
 * Command channel.
 */
export type CommandChannel<TPayload> = (command: InputCommand<TPayload>) => Promise<void>;

/**
 * Respond channel.
 */
export type RespondChannel<TPayload, TResponse> = Emitter<
  TResponse,
  OutputPayloadQuery<TPayload, TResponse>
>;

/**
 * Execute channel.
 */
export type ExecuteChannel<TPayload> = Emitter<undefined, OutputPayloadMessage<TPayload>>;

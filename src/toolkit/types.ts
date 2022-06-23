import { Message, OutputMessage, OutputQuery } from '../types';

/**
 * Тип функции-канала с помощью которого должно быть отправлено / получено сообщение.
 */
export type ChannelSegregation = 'query' | 'command';

/**
 * Сообщение с дополнительными данными.
 */
export interface OutputPayloadMessage<TPayload> extends OutputMessage<undefined> {
  payload?: TPayload;
}

/**
 * Сообщение-запрос с определённым типом ответа на запрос.
 */
export interface OutputPayloadQuery<TPayload, TResponse> extends OutputQuery<TResponse> {
  payload?: TPayload;
}

/**
 * Сообщение с дополнительными данными о типе канала через который его можно отправлять.
 */
export interface ExtendedMessage<TPayload, TResponse> extends Message<TResponse> {
  payload?: TPayload;
  channelType: ChannelSegregation;
}

/**
 * Интерфейс функции для создания сообщения с возможностью передавать дополнительные данные при создании.
 */
export interface MessageCreatorWithPayload<
  TChannel extends ChannelSegregation,
  TPayload,
  TResponse,
> {
  (payload: TPayload): ExtendedMessage<TPayload, TResponse>;
  type: string;
  channelType: TChannel;
}

/**
 * Интерфейс функции для создания сообщения без возможности передавать дополнительные данные при создании.
 */
export interface MessageCreatorWithoutPayload<TChannel extends ChannelSegregation, TResponse>
  extends MessageCreatorWithPayload<TChannel, undefined, TResponse> {
  (): ExtendedMessage<undefined, TResponse>;
}

/**
 * Интерфейс функции для добавления дополнительных данных помимо основного интерфейса сообщения.
 * Принимает дополнительные данные (payload) с определённым типом.
 */
export type PrepareMessageWithPayload<TPayload> = (
  payload?: TPayload,
  ...other: unknown[]
) => { [key: string]: unknown };

/**
 * Интерфейс функции для добавления дополнительных данных помимо основного интерфейса сообщения.
 * Не принимает дополнительные данные (payload) с определённым типом, но принимает любые аргументы переданные
 * в функцию-создатель.
 */
export type PrepareMessageWithoutPayload = (...args: unknown[]) => { [key: string]: unknown };

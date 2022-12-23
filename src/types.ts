/** Message context (identifier of module or application). */
export type Context = string;

/** Message type. */
export type Type = string;

/** List of message types. */
export type Types = Type[];

/** Common message interface. */
export interface Message<TResponse = any> {
  type: Type;
  context?: Context;
  resolve?: (value: TResponse) => void;
  [key: string]: unknown;
}

/** Output message interface (used as output command interface). */
export interface OutputMessage<TResponse = any> extends Message<TResponse> {
  context: Context;
}

/** Output query interface. */
export interface OutputQuery<TResponse = any> extends OutputMessage<TResponse> {
  resolve: (value: TResponse) => void;
}

/** Common interface of function for receive messages. */
export type Take<
  TResponse = any,
  TOutput extends OutputMessage<TResponse> = OutputMessage<TResponse>,
> = () => Promise<TOutput | void>;

/** Common interface of function for send messages. */
export type Send<TResponse = any, TMessage extends Message<TResponse> = Message<TResponse>> = (
  message: TMessage,
  timeout?: number,
) => Promise<TResponse | void>;

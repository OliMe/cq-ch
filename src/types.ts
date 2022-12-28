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

export interface OutputQuery<TResponse> extends Message<TResponse> {
  resolve: (value: TResponse) => void;
}

/** Common interface of function for receive messages. */
export type Take<TResponse, TOutput extends Message<TResponse>> = () => Promise<TOutput | void>;

/** Common interface of function for send messages. */
export type Send<TResponse, TMessage extends Message<TResponse>> = (
  message: TMessage,
  timeout?: number,
) => Promise<TResponse | void>;

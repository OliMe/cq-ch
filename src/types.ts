export type Context = string;

export type Type = string;

export type Types = Type[];

export interface Message<TResponse = any> {
  type: Type;
  context?: Context;
  resolve?: (value: TResponse) => void;
  [key: string]: unknown;
}

export interface OutputMessage<TResponse = any> extends Message<TResponse> {
  context: Context;
}

export interface OutputQuery<TResponse = any> extends OutputMessage<TResponse> {
  resolve: (value: TResponse) => void;
}

export type Emitter<
  TResponse,
  TOutput extends OutputMessage<TResponse>,
> = () => Promise<TOutput | void>;

export type RequestChannel<TResponse> = (
  query: Message<TResponse>,
  time: number,
) => Promise<TResponse>;

export type CommandChannel = (command: Message<undefined>) => Promise<void>;

export type RespondChannel<TResponse> = Emitter<TResponse, OutputQuery<TResponse>>;

export type ExecuteChannel = Emitter<undefined, OutputMessage<undefined>>;

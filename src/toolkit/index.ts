import { Message, OutputQuery } from '../types';
import { command, execute, request, respond } from '../';
import {
  ChannelSegregation,
  ExtendedMessage,
  OutputPayloadQuery,
  MessageCreatorWithoutPayload,
  MessageCreatorWithPayload,
  OutputPayloadMessage,
  PrepareMessageWithoutPayload,
  PrepareMessageWithPayload,
} from './types';

type Output<TPayload, TResponse> = TResponse extends undefined
  ? OutputPayloadMessage<TPayload>
  : OutputPayloadQuery<TPayload, TResponse>;

type CQCInput<TPayload = any, TResponse = any> = () => Output<TPayload, TResponse>;

type CQCOutput<TResponse = any> = (message: Message<TResponse>) => Promise<TResponse>;

type Direction = 'input' | 'output';

/**
 * Тип транспорта (способ отправки или получения) сообщений.
 */
type Transport<TDirection, TPayload, TResponse> = TDirection extends 'input'
  ? CQCInput<TPayload, TResponse>
  : CQCOutput<TResponse>;

const DIRECTION = {
  INPUT: 'input',
  OUTPUT: 'output',
} as const;

export const CHANNEL_SEGREGATION = {
  QUERY: 'query',
  COMMAND: 'command',
} as const;

const IO_CREATORS = {
  [CHANNEL_SEGREGATION.QUERY]: {
    input: respond,
    output: request,
  },
  [CHANNEL_SEGREGATION.COMMAND]: {
    input: execute,
    output: command,
  },
} as const;

/**
 * Создаёт объект канала для отправки и обработки сообщений.
 * @param serviceName Название сервиса к которому будет привязан канал.
 * @return Объект канала для отправки и приёма сообщений.
 */
export const createChannel = (serviceName: string) => new Channel(serviceName);

/**
 * Канал для отправки и обработки сообщений.
 */
class Channel {
  private readonly serviceName: string;

  private transport: {
    [channelType in ChannelSegregation]: {
      [DIRECTION.INPUT]: {
        [messageType: string]: CQCInput;
      };
      [DIRECTION.OUTPUT]: {
        [messageType: string]: CQCOutput;
      };
    };
  } = {
    [CHANNEL_SEGREGATION.QUERY]: {
      [DIRECTION.INPUT]: {},
      [DIRECTION.OUTPUT]: {},
    },
    [CHANNEL_SEGREGATION.COMMAND]: {
      [DIRECTION.INPUT]: {},
      [DIRECTION.OUTPUT]: {},
    },
  };

  /**
   * Конструктор объекта канала.
   * @param serviceName Название сервиса.
   */
  constructor(serviceName: string) {
    this.serviceName = serviceName;
  }

  /**
   * Метод для получения следующего в очереди сообщения переданного типа.
   * @param messageType Тип сообщения.
   * @return Следующее сообщение из канала.
   */
  async take<TChannel extends ChannelSegregation, TPayload, TResponse>({
    channelType,
    type,
  }: MessageCreatorWithPayload<TChannel, TPayload, TResponse>) {
    const take = this.getTransport<'input', TPayload, TResponse>(
      DIRECTION.INPUT,
      channelType,
      type,
    );
    return take();
  }

  /**
   * Метод для отправки сообщения.
   * @param message Сообщение.
   * @return Возвращает ответ на сообщение в случае если было отправлено сообщение-запрос.
   */
  async send<TPayload, TResponse>(message: ExtendedMessage<TPayload, TResponse>) {
    const send = this.getTransport<'output', TPayload, TResponse>(
      DIRECTION.OUTPUT,
      message.channelType,
      message.type,
    );
    return send(message);
  }

  /**
   * Метод для ответа на сообщение-запрос.
   * @param query Сообщение-запрос.
   * @param result Данные ответа.
   */
  respond<TResponse>(query: OutputQuery<TResponse>, result: TResponse) {
    query.resolve(result);
  }

  /**
   * Метод для получения функции-канала отправки или получения сообщений.
   * @param direction Направление канала (ввод или вывод).
   * @param channelType Тип канала (команда или запрос).
   * @param messageType Тип сообщения.
   * @return Возвращает функцию для отправки и получения сообщений.
   * @private
   */
  private getTransport<TDirection extends Direction, TPayload, TResponse>(
    direction: TDirection,
    channelType: ChannelSegregation,
    messageType: string,
  ) {
    if (!this.transport[channelType][direction][messageType]) {
      const creator = IO_CREATORS[channelType][direction];
      this.transport[channelType][direction][messageType] = creator<TResponse>(
        [messageType],
        this.serviceName,
      );
    }
    return this.transport[channelType][direction][messageType] as Transport<
      TDirection,
      TPayload,
      TResponse
    >;
  }
}

/**
 * Создаёт функцию-создатель сообщения-запроса.
 * @param type Идентификатор типа сообщения.
 * @param prepareMessage Функция для добавления в сообщение данных которые выходят за рамки интерфейса.
 * @return Возвращает функцию для создания сообщения-запроса.
 */
export function createQuery<TResponse>(
  type: string,
  prepareMessage?: PrepareMessageWithoutPayload,
): MessageCreatorWithoutPayload<'query', TResponse>;

/**
 * Создаёт функцию-создатель сообщения-запроса.
 * @param type Идентификатор типа сообщения.
 * @param prepareMessage Функция для добавления данных которые выходят за рамки интерфейса в сообщение.
 * @return Возвращает функцию для создания сообщения-запроса.
 */
export function createQuery<TPayload, TResponse>(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<TPayload>,
): MessageCreatorWithPayload<'query', TPayload, TResponse>;

/**
 * Создаёт функцию-создатель сообщения-запроса.
 * @param type Идентификатор типа сообщения.
 * @param prepareMessage Функция для добавления данных которые выходят за рамки интерфейса в сообщение.
 * @return Возвращает функцию для создания сообщения-запроса.
 */
export function createQuery(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<unknown> | PrepareMessageWithoutPayload,
) {
  return createMessage(type, CHANNEL_SEGREGATION.QUERY, prepareMessage);
}

/**
 * Создаёт функцию-создатель сообщения-команды.
 * @param type Идентификатор типа сообщения.
 * @param prepareMessage Функция для добавления данных которые выходят за рамки интерфейса в сообщение.
 * @return Возвращает функцию для создания сообщения-команды.
 */
export function createCommand(
  type: string,
  prepareMessage?: PrepareMessageWithoutPayload,
): MessageCreatorWithoutPayload<'command', undefined>;

/**
 * Создаёт функцию-создатель сообщения-команды.
 * @param type Идентификатор типа сообщения.
 * @param prepareMessage Функция для добавления данных которые выходят за рамки интерфейса в сообщение.
 * @return Возвращает функцию для создания сообщения-команды.
 */
export function createCommand<TPayload>(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<TPayload>,
): MessageCreatorWithPayload<'command', TPayload, undefined>;

/**
 * Создаёт функцию-создатель сообщения-команды.
 * @param type Идентификатор типа сообщения.
 * @param prepareMessage Функция для добавления данных которые выходят за рамки интерфейса в сообщение.
 * @return Возвращает функцию для создания сообщения-команды.
 */
export function createCommand(
  type: string,
  prepareMessage?: PrepareMessageWithPayload<unknown> | PrepareMessageWithoutPayload,
):
  | MessageCreatorWithPayload<'command', unknown, undefined>
  | MessageCreatorWithoutPayload<'command', undefined> {
  return createMessage(type, CHANNEL_SEGREGATION.COMMAND, prepareMessage);
}

/**
 * Создаёт функции для создания сообщений-команд или сообщений-запросов в зависимости от переданного типа канала.
 * @param messageType Тип сообщения.
 * @param channelType Тип канала (команда или запрос).
 * @param prepareMessage Функция для добавления данных которые выходят за рамки интерфейса в сообщение.
 * @return Возвращает функцию для создания сообщения.
 */
function createMessage<TChannel extends ChannelSegregation, TPayload, TResponse>(
  messageType: string,
  channelType: TChannel,
  prepareMessage?: PrepareMessageWithPayload<TPayload> | PrepareMessageWithoutPayload,
):
  | MessageCreatorWithPayload<TChannel, TPayload, TResponse>
  | MessageCreatorWithoutPayload<TChannel, TResponse> {
  /**
   * Функция для создания сообщения.
   * @param payload Дополнительные данные для отправки в сообщении.
   * @param other Остальные аргументы.
   * @return Возвращает сообщение.
   */
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
    };
  };
  creator.type = messageType;
  creator.channelType = channelType;

  return creator;
}

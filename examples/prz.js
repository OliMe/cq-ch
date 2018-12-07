// Где-то в es6 приложении
import { request, respond, command, execute } from 'cqrs-bus'

// Объявляем внешний интерфейс
const requestPut = request(['ACTION_TYPE_1', 'ACTION_TYPE_2'], 'react-app')
const respondTakeInterface = respond(['ACTION_TYPE_1', 'ACTION_TYPE_2'], 'react-app')
const commandPut = command(['ACTION_TYPE_4', 'ACTION_TYPE_5'], 'react-app')
const executeTakeInterface = command(['ACTION_TYPE_4', 'ACTION_TYPE_5'], 'react-app')

// Отправляем запросы и получаем результат в сагах
const resultOne = yield call(requestPut, {
    type: 'ACTION_TYPE_1',
    // Какие-то данные или параметры запроса
}, 1000)
const resultTwo = yield call(requestPut, {
    type: 'ACTION_TYPE_2'
    // Какие-то ещё данные или параметры запроса
}, 2000)

// Отправляем команды в сагах
yield call(commandPut, { type: 'ACTION_TYPE_4' })
yield call(commandPut, { type: 'ACTION_TYPE_5' })

// Обрабатываем запросы или команды в сагах
export function* watchOnQueries() {
    const take = respondTakeInterface(['ACTION_TYPE_1', 'ACTION_TYPE_2'])
    while (true) {
        yield put(yield call(take))
    }
}

// Непосредственно в саге, обрабатывающей конкретный запрос
export function* respondOnQuery({ resolve }) {
    // Получаем данные из state-а приложения
    let actionTypeOneData = yield select(someDataSelectorFromStore)
    if (!actionTypeOneData) {
        // Если их там ещё нет, делаем запрос в API
        yield put({ type: 'REQUEST_ACTION_TYPE_1_DATA_FROM_API' })
        // Получаем результат из API
        { actionTypeOneData } = (yield take({ type: 'SUCCESS_REQUEST_ACTION_TYPE_1_DATA_FROM_API' }))
    }
    // Данные есть, отправляем их по назначению (резолвим запрос)
    actionTypeOneData && typeof resolve === 'function' && resolve(actionTypeOneData)
}

// Где-то в Backbone приложении
// Объявляем внешний интерфейс
var requestPut = CQRSBus.request(['ACTION_TYPE_1'], 'backbone-app');
var respondTakeInterface = CQRSBus.respond(['ACTION_TYPE_2'], 'backbone-app');
var commandPut = CQRSBus.command(['ACTION_TYPE_5'], 'backbone-app');
var executeTakeInterface = CQRSBus.command(['ACTION_TYPE_4'], 'backbone-app');

// Отправляем запросы и получаем результат, в той части приложения, где это уместно
requestPut({
    type: 'ACTION_TYPE_1'
    // Какие-то данные необходимые для выполнения запроса 
}).then(function (result) {
    // Делаем с результатом, что необходимо
}, function (error) {
    // По какой-то причине запрос не был обработан,
    // используем свою логику для получения необходимых данных,
    // либо ещё как-то обрабатываем ошибку
});

// Отправляем команды
commandPut({
    type: 'ACTION_TYPE_5'
    // Дополнительные данные, необходимые для обработки команды
})

// Обрабатываем команды
var takeCommand = executeTakeInterface(['ACTION_TYPE_4']);
var commandHandler = function () {
    takeCommand().then(function (action) {
        // Здесь реализуем логику обработки команды
    })
    setInterval(takeCommand, 0);
};
// Запускаем обработчик команд
commandHandler();

// Обрабатываем запросы
var takeQuery = respondTakeInterface(['ACTION_TYPE_2'])
var queryHandler = function () {
    takeQuery().then(function (query) {
        // Здесь реализуем логику обработки запроса, делаем запросы в API, берём из модели и т.д.
        var result = someFunctionToGetResult(query);
        // И отправляем результат как ответ на запрос.
        query.resolve(result);
    })
    setInterval(takeCommand, 0);
};
// Запускаем обработчик запросов
queryHandler();

// В сагах отвечающих за работу с населёнными пунктами
import { Types, Creators as Action } from '../redux/settlement'
import { command, execute } from '../../../../es/cqrs-bus'
import watchGeneratorCreator from '../helpers/watch-generator-creator'

// Декларируем интерфейс
const executeChannelFactory = execute([Types.SET_CURRENT], 'react-app/settlement')
const putCommand = command([Types.SET_CURRENT], 'react-app/settlement')

// Здесь всякие разные саги

// Сага для обработки входящих команд
export const watchOnCommands = watchGeneratorCreator(executeChannelFactory)
// Отправка команды на изменение города в других приложениях
export function* declareSettlement(action) {
    yield call(putCommand, action)
}

// Конструктор саг для получение входящих запросов и команд
export default function watchGeneratorCreator (takeFactory, type) {
    return function* () {
        const take = takeFactory(type)
        while (true) {
            yield put(yield call(take))
        }
    }
}

// В index.js Backbone-приложения
var formModel = new app.FormModel({ isField: false, current: null, name: '' }),
    ipModel = new app.Ip(),
    interfaceConfig = {
        command: {
            types: ['settlement/SET_CURRENT'],
            handlers: [
                {
                    type: 'settlement/SET_CURRENT',
                    creator: formModel.createHandler.bind(formModel)
                }
            ]
        },
        execute: {
            types: ['settlement/SET_CURRENT'],
            handlers: [
                {
                    type: 'settlement/SET_CURRENT',
                    creator: formModel.createHandler.bind(formModel)
                }
            ]
        },
    },
    interface = new ExternalInterface({}, {
        config: interfaceConfig,
        context: 'backbone-app/settlement',
        bus: CQRSBus
    });

app.FormModel = app.Model.extend({
    handlers: {
        command: {
            'settlement/SET_CURRENT': function (putCommand) {
                // Случаем изменение города
                this.listenTo(this, 'change:current', function () {
                    // Отправляем команду в канал
                    putCommand({
                        type: SET_CURRENT,
                        current: this.get('current').toJSON(),
                    });
                });
            }
        },
        execute: {
            'settlement/SET_CURRENT': function (takeCommand) {
                // Получаем команду из канала
                var promise = takeCommand();
                if (promise && promise instanceof Promise) {
                    promise.then(this.setCurrentListener.bind(this));
                }
            }
        }
    },
    // Устанавливаем город, полученный вместе с командой
    setCurrentListener: function (command) {
        if (
            command.current
            && command.current.id
            && (
                !this.get('current')
                || this.get('current').get('id') !== command.current.id
            )
        ) {
            this.set({ current: new app.Settlement(command.current) });
        }
    },
});
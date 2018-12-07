// Где-то в es6 приложении
import { request, respond, command, execute} from 'cqrs-bus'

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
yield call(commandPut, {type: 'ACTION_TYPE_4'})
yield call(commandPut, {type: 'ACTION_TYPE_5'})

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
        yield put({ type: 'REQUEST_ACTION_TYPE_1_DATA_FROM_API'})
        // Получаем результат из API
        { actionTypeOneData } = (yield take({ type: 'SUCCESS_REQUEST_ACTION_TYPE_1_DATA_FROM_API'}))
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

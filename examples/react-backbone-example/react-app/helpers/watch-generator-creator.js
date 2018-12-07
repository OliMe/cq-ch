import { call, put } from 'redux-saga/effects'

export default function watchGeneratorCreator (takeFactory, type) {
    return function* () {
        const take = takeFactory(type)
        while (true) {
            yield put(yield call(take))
        }
    }
}
import { createActions, createReducer } from 'reduxsauce'

export const { Types, Creators } = createActions({
    mounted: null,
}, { prefix: 'app/' })

export const mounted = state => {
    return { ...state }
}

export const reducer = createReducer({}, {
    [Types.MOUNTED]: mounted,
})
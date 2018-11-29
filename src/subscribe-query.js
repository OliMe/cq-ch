// @flow
import getChannel from './event-transport/get-channel'
import { TYPE_QUERY } from './constants'
import { checkArguments, getCfgCreator } from './helpers/argument-checker'
import { subscribeCfg } from './arguments.cfg'
/**
 * @param {string} type
 * @param {Function} listener
 */
export default function subscribeQuery (type: string, listener: Function) {
    checkArguments(arguments, getCfgCreator(subscribeQuery.name, subscribeCfg)(arguments))
    getChannel(TYPE_QUERY).on(type, (event: CustomEvent) => {
        listener(event.detail)
    })
}
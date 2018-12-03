// @flow
import getTransport from './event-transport/get-transport'
import { TYPE_COMMAND } from './constants'
import { checkArguments, getCfgCreator } from './helpers/argument-checker'
import { subscribeCfg } from './arguments.cfg'
/**
 * @param {string} type
 * @param {Function} listener
 */
export default function subscribeCommand (type: string, listener: Function) {
    checkArguments(arguments, getCfgCreator(subscribeCommand.name, subscribeCfg)(arguments))
    getTransport(TYPE_COMMAND).on(type, (event: CustomEvent) => {
        listener(event.detail)
    })
}
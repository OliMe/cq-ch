// @flow
import getTransport from './event-transport/get-transport'
import { TYPE_COMMAND } from './constants'

type Command = {
    type: string,
}
/**
 *
 * @param {*} types
 * @param {*} context
 * @returns {Function}
 */
export default function command(types: Array<string>, context: string): Function {
    return (command: Command) => {
        command = { ...command, context }
        getTransport(TYPE_COMMAND).trigger(command.type, command)
    }
}

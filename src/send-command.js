// @flow
import getChannel from './event-transport/get-channel'
import { TYPE_COMMAND } from './constants'

type Command = {
    type: string,
    payload?: Object,
}

/**
 * @param {Command} command
 */
export default function sendCommand(command: Command): void {
    const { type, payload } = command
    let clonedCommand: Command = { type: type }
    if (typeof payload === 'object' && payload.constructor === Object) {
        clonedCommand.payload = payload
    }
    getChannel(TYPE_COMMAND).trigger(type, clonedCommand)
}
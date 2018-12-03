// @flow
import getTransport from './event-transport/get-transport'
import { TYPE_COMMAND } from './constants'

type Command = {
    type: string,
}

/**
 * @param {Command} command
 */
export default function sendCommand(command: Command): void {
    const { type } = command
    let clonedCommand: Command = { ...command }
    getTransport(TYPE_COMMAND).trigger(type, clonedCommand)
}
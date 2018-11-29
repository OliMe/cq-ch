// @flow
import getChannel from './event-transport/get-channel'
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
    getChannel(TYPE_COMMAND).trigger(type, clonedCommand)
}
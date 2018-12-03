import EventTargetChannel from "./channel/event-target-channel";

// @flow
/**
 * 
 * @param {Function} type
 * @returns {EventTargetChannel}
 */
export default function getChannel(type: string): EventTargetChannel {
    if (typeof window.Bus === 'undefined') {
        window.Bus = {}
    }
    if (typeof window.Bus[type] === 'undefined') {
        window.Bus[type] = new EventTargetChannel
    }

    return window.Bus[type]
}
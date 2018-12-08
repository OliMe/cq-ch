import EventTargetTransport from "./event-target-transport";

// @flow
/**
 * 
 * @param {Function} type
 * @returns {EventTargetTransport}
 */
export default function getTransport(type: string): EventTargetTransport {
    if (typeof window.CQRSBusChannels === 'undefined') {
        window.CQChannels = {}
    }
    if (typeof window.CQRSBusChannels[type] === 'undefined') {
        window.CQChannels[type] = new EventTargetTransport
    }

    return window.CQChannels[type]
}
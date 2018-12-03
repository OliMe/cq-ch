import EventTargetTransport from "./event-target-transport";

// @flow
/**
 * 
 * @param {Function} type
 * @returns {EventTargetTransport}
 */
export default function getTransport(type: string): EventTargetTransport {
    if (typeof window.CQRSBusChannels === 'undefined') {
        window.CQRSBusChannels = {}
    }
    if (typeof window.CQRSBusChannels[type] === 'undefined') {
        window.CQRSBusChannels[type] = new EventTargetTransport
    }

    return window.CQRSBusChannels[type]
}
import EventTargetChannel from "./channel/event-target-channel";

// @flow
/**
 * 
 * @param {Function} type
 * @returns {EventTargetChannel}
 */
export default function getChannel(type: string): EventTargetChannel {
    if (typeof window.CQRSBus === 'undefined') {
        window.CQRSBus = {}
    }
    if (typeof window.CQRSBus[type] === 'undefined') {
        window.CQRSBus[type] = new EventTargetChannel
    }

    return window.CQRSBus[type]
}
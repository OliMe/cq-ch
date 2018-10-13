import ChannelAdapter from "./channel/channel-adapter";

// @flow
/**
 * 
 * @param {Function} type
 * @returns {EventTarget}
 */
export default function getChannel(type: string): ChannelAdapter {
    const globalScope = typeof window !== 'undefined' ? window : global
    if (typeof globalScope.CQRSBus === 'undefined') {
        globalScope.CQRSBus = {}
    }
    if (typeof globalScope.CQRSBus[type] === 'undefined') {
        globalScope.CQRSBus[type] = new ChannelAdapter
    }

    return globalScope.CQRSBus[type]
}
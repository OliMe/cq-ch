// @flow
import BrowserChannel from './browser-channel'
import NodeChannel from './node-channel'
import isNode from 'detect-node'
import { Channel } from '../../types';

export default class ChannelAdapter {
    channel: Channel
    /**
     * 
     */
    constructor () {
        this.channel = isNode() ? new NodeChannel : new BrowserChannel
    }
    /**
     * 
     * @param {*} type 
     * @param {*} payload 
     */
    send (type: string, payload: Object) {
        this.channel.trigger(type, payload)
    }
    /**
     * 
     * @param {*} type 
     * @param {*} callback 
     */
    subscribe (type: string, callback: Function) {
        this.channel.on(type, callback)
    }
}

// @flow
import TargetWrapper from './target-wrapper'
import EventEmitter from 'events';
import { Channel } from '../../types';

export default class NodeChannel extends TargetWrapper implements Channel {
    target: EventEmitter
    /**
     * @returns {EventEmitter}
     */
    createTarget(): EventEmitter {
        return new EventEmitter
    }
    /**
     * 
     * @param {string} type 
     * @param {Object} payload 
     */
    trigger (type: string, payload: Object) {
        this.target.emit(type, {
            detail: payload,
        })
    }
    /**
     * 
     * @param {string} type 
     * @param {Function} callback 
     */
    on (type: string, callback: Function) {
        this.target.on(type, callback)
    }
}
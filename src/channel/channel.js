// @flow
import Queue from './queue'
import EventTargetTransport from '../event-transport/event-target-transport';

export default class Channel {
    puts: Queue
    takes: Queue
    notificator: EventTargetTransport | null
    /**
     * Create instance of Channel
     */
    constructor (notificator: EventTargetTransport | null = null) {
        if (notificator && notificator instanceof EventTargetTransport) {
            this.notificator = notificator
        }
        this.puts = new Queue(this._putListener.bind(this))
        this.takes = new Queue()
    }
    /**
     * Send value to channel
     * @param {*} value 
     */
    put (value: any) {
        if (value !== undefined) {
            this.puts.put(value)
        }
    }
    /**
     * Take data from channel
     */
    async take (): Promise<any> {
        return new Promise(resolve => {
            this.takes.put(resolve)
        })
    }
    /**
     * Bind puts to takes
     */
    _putListener () {
        if (this.takes.length) {
            if (this.puts.length) {
                const take = this.takes.take()
                const put = this.puts.take()
                take(put)
                if (this.notificator) {
                    this.notificator.trigger('change')
                }
            }
        }
    }
}
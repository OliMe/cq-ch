// @flow
import Queue from './queue'

export default class Channel {
    puts: Queue
    takes: Queue
    /**
     * Create instance of Channel
     */
    constructor () {
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
            }
        }
    }
}
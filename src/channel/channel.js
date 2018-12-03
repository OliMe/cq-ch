// @flow
export default class Channel {
    puts: Array<any>
    takes: Array<Function>
    /**
     * Create instance of Channel
     */
    constructor () {
        this.puts = []
        this.takes = []
        this._schedule()
    }
    /**
     * Send value to channel
     * @param {*} value 
     */
    put (value: any) {
        if (value !== undefined) {
            this.puts.push(value)
        }
    }
    /**
     * Take data from channel
     */
    async take (): Promise<any> {
        return new Promise(resolve => {
            this.takes.push(resolve)
        })
    }
    /**
     * Bind puts to takes
     */
    _schedule () {
        setTimeout(this._schedule.bind(this), 0)
        if (this.takes.length) {
            if (this.puts.length) {
                const take = this.takes.shift()
                const put = this.puts.shift()
                take(put)
            }
        }
    }
}
import Queue from './queue';
import EventTargetTransport from '../event-transport/event-target-transport';

export default class Channel {
  puts;
  takes;
  notificator;

  /**
   * Create instance of Channel.
   */
  constructor (notificator = null) {
    if (notificator && notificator instanceof EventTargetTransport) {
      this.notificator = notificator;
    }
    this.puts = new Queue(this._listener.bind(this));
    this.takes = new Queue(this._listener.bind(this));
  }

  /**
   * Send value to channel.
   * @param {*} value
   */
  put (value) {
    if (value !== undefined) {
      this.puts.put(value);
    }
  }

  /**
   * Take data from channel.
   */
  async take () {
    return new Promise(resolve => {
      this.takes.put(resolve);
    });
  }

  /**
   * Bind puts to takes.
   */
  _listener () {
    if (this.takes.length && this.puts.length) {
      const take = this.takes.take();
      const put = this.puts.take();
      take(put);
      if (this.notificator) {
        this.notificator.trigger('change');
      }
    }
  }
}
